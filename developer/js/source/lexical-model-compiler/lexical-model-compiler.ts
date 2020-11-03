/*
  lexical-model-compiler.ts: base file for lexical model compiler.
*/

/// <reference path="./lexical-model.ts" />
/// <reference path="./model-info-file.ts" />

import * as ts from "typescript";
import * as fs from "fs";
import * as path from "path";
import { createTrieDataStructure } from "./build-trie";
import { defaultSearchTermToKey, 
         defaultCasedSearchTermToKey,
         defaultApplyCasing } from "./lexical-mapping-defaults";
import {decorateWithJoin} from "./join-word-breaker-decorator";
import {decorateWithScriptOverrides} from "./script-overrides-decorator";

export default class LexicalModelCompiler {

  /**
   * Returns the generated code for the model that will ultimately be loaded by
   * the LMLayer worker. This code contains all model parameters, and specifies
   * word breakers and auxilary functions that may be required.
   *
   * @param model_id      The model ID. TODO: not sure if this is actually required!
   * @param modelSource   A specification of the model to compile
   * @param sourcePath    Where to find auxilary sources files
   */
  generateLexicalModelCode(model_id: string, modelSource: LexicalModelSource, sourcePath: string) {
    // TODO: add metadata in comment
    const filePrefix: string = `(function() {\n'use strict';\n`;
    const fileSuffix: string = `})();`;
    let func = filePrefix;

    //
    // Emit the model as code and data
    //

    switch(modelSource.format) {
      case "custom-1.0":
        let sources: string[] = modelSource.sources.map(function(source) {
          return fs.readFileSync(path.join(sourcePath, source), 'utf8');
        });
        func += this.transpileSources(sources).join('\n');
        func += `LMLayerWorker.loadModel(new ${modelSource.rootClass}());\n`;
        break;
      case "fst-foma-1.0":
        throw new ModelSourceError(`Unimplemented model format: ${modelSource.format}`);
      case "trie-1.0":
        // Convert all relative path names to paths relative to the enclosing
        // directory. This way, we'll read the files relative to the model.ts
        // file, rather than the current working directory.
        let filenames = modelSource.sources.map(filename => path.join(sourcePath, filename));

        // Determine the model's `applyCasing` function / implementation.
        // Conceptually correct... but closures make actual compilation far trickier.
        // casingClosure.toString() will not yield a proper compilation.
        let applyCasing: CasingFunction = defaultApplyCasing;
        if(modelSource.languageUsesCasing) {
          applyCasing = modelSource.applyCasing || defaultApplyCasing;

          // Since the defined casing function may expect to take our default implementation
          // as a parameter, we can define the full implementation via closure capture.
          let casingClosure: CasingFunction = function(casing: CasingEnum, text: string) {
            return applyCasing(casing, text, defaultApplyCasing);
          }
          // Kept as a separate line for easier comparison / debugging.
          applyCasing = casingClosure;
        }

        // Use the default search term to key function, if left unspecified.
        let searchTermToKey: WordformToKeySpec = modelSource.searchTermToKey 
        if(!searchTermToKey) {
          if(modelSource.languageUsesCasing) {
            // applyCasing is defined here.
            // Unfortunately, this only works conceptually.  .toString on a closure
            // does not result in proper compilation.
            searchTermToKey = function(text: string) {
              return defaultCasedSearchTermToKey(text, applyCasing);
            }
          } else if(modelSource.languageUsesCasing == false) {
            searchTermToKey = defaultSearchTermToKey;
          } else {
            // If languageUsesCasing is not defined, then we use pre-14.0 behavior, 
            // which expects a lowercased default.
            // Unfortunately, this only works conceptually.  .toString on a closure
            // does not result in proper compilation.
            searchTermToKey = function(text: string) {
              return defaultCasedSearchTermToKey(text, defaultApplyCasing);
            }
          }
        }

        // Needs the actual searchTermToKey closure...
        // Which needs the actual applyCasing closure as well.
        func += `LMLayerWorker.loadModel(new models.TrieModel(${
          createTrieDataStructure(filenames, searchTermToKey)
        }, {\n`;

        let wordBreakerSourceCode = compileWordBreaker(normalizeWordBreakerSpec(modelSource.wordBreaker));
        func += `  wordBreaker: ${wordBreakerSourceCode},\n`;

        func += `  searchTermToKey: ${searchTermToKey.toString()},\n`;

        if(modelSource.languageUsesCasing != null) {
          func += `  languageUsesCasing: ${modelSource.languageUsesCasing},\n`;
        } else {
          func += `  languageUsesCasing: false, \n`;
        }

        if(modelSource.languageUsesCasing) {
          func += `  applyCasing: ${compileApplyCasing(applyCasing)},\n`;
        }

        if (modelSource.punctuation) {
          func += `  punctuation: ${JSON.stringify(modelSource.punctuation)},\n`;
        }
        func += `}));\n`;
        break;
      default:
        throw new ModelSourceError(`Unknown model format: ${modelSource.format}`);
    }

    func += fileSuffix;

    return func;
  }

  transpileSources(sources: Array<string>): Array<string> {
    return sources.map((source) => ts.transpileModule(source, {
        compilerOptions: { module: ts.ModuleKind.None }
      }).outputText
    );
  };

  logError(s: string) {
    console.error(require('chalk').red(s));
  };
};

export class ModelSourceError extends Error {
}

/**
 * Returns a JavaScript expression (as a string) that can serve as a word
 * breaking function.
 */
function compileWordBreaker(spec: WordBreakerSpec): string {
  let wordBreakerCode = compileInnerWordBreaker(spec.use);

  if (spec.joinWordsAt) {
    wordBreakerCode = compileJoinDecorator(spec, wordBreakerCode);
  }

  if (spec.overrideScriptDefaults) {
    wordBreakerCode = compileScriptOverrides(spec, wordBreakerCode);
  }

  return wordBreakerCode;
}

function compileJoinDecorator(spec: WordBreakerSpec, existingWordBreakerCode: string) {
  // Bundle the source of the join decorator, as an IIFE,
  // like this: (function join(breaker, joiners) {/*...*/}(breaker, joiners))
  // The decorator will run IMMEDIATELY when the model is loaded,
  // by the LMLayer returning the decorated word breaker to the
  // LMLayer model.
  let joinerExpr: string = JSON.stringify(spec.joinWordsAt)
  return `(${decorateWithJoin.toString()}(${existingWordBreakerCode}, ${joinerExpr}))`;
}

function compileScriptOverrides(spec: WordBreakerSpec, existingWordBreakerCode: string) {
  return `(${decorateWithScriptOverrides.toString()}(${existingWordBreakerCode}, '${spec.overrideScriptDefaults}'))`;
}

/**
 * Compiles the base word breaker, that may be decorated later.
 * Returns the source code of a JavaScript expression.
 */
function compileInnerWordBreaker(spec: SimpleWordBreakerSpec): string {
  if (typeof spec === "string") {
    // It must be a builtin word breaker, so just instantiate it.
    return `wordBreakers['${spec}']`;
  } else {
    // It must be a function:
    return spec.toString()
      // Note: the .toString() might just be the property name, but we want a
      // plain function:
      .replace(/^wordBreak(ing|er)\b/, 'function');
  }
}

/**
 * Compiles the `applyCasing` function, returning the source code of the
 * full closure's JavaScript representation.
 */
function compileApplyCasing(closure: CasingFunction) {
  return closure.toString().replace(/^applyCasing\b/, 'function');
}

/**
 * Given a word breaker specification in any of the messy ways,
 * normalizes it to a common form that the compiler can deal with.
 */
function normalizeWordBreakerSpec(wordBreakerSpec: LexicalModelSource["wordBreaker"]): WordBreakerSpec {
  if (wordBreakerSpec == undefined) {
    // Use the default word breaker when it's unspecified
    return { use: 'default' };
  } else if (isSimpleWordBreaker(wordBreakerSpec)) {
    // The word breaker was passed as a literal function; use its source code.
    return { use: wordBreakerSpec };
  } else if (wordBreakerSpec.use) {
    return wordBreakerSpec;
  } else {
    throw new Error(`Unknown word breaker: ${wordBreakerSpec}`);
  }
}

function isSimpleWordBreaker(spec: WordBreakerSpec | SimpleWordBreakerSpec): spec is SimpleWordBreakerSpec  {
  return typeof spec === "function" || spec === "default" || spec === "ascii";
}
