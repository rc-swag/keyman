import { KmnCompilerMessages } from "../compiler/kmn-compiler-messages.js";
import { CompilerErrorNamespace, CompilerErrorSeverity, CompilerEvent, CompilerMessageSpec } from "@keymanapp/common-types";
import { kmnfile } from "./compiler-globals.js";

const Namespace = CompilerErrorNamespace.KmwCompiler;
// const SevInfo = CompilerErrorSeverity.Info | Namespace;
const SevHint = CompilerErrorSeverity.Hint | Namespace;
// const SevWarn = CompilerErrorSeverity.Warn | Namespace;
const SevError = CompilerErrorSeverity.Error | Namespace;
// const SevFatal = CompilerErrorSeverity.Fatal | Namespace;

const m = (code: number, message: string, o?: {filename?: string, line?: number}) : CompilerEvent => ({
  ...CompilerMessageSpec(code, message),
  filename: o?.filename ?? kmnfile,
  line: o?.line,
});

/**
 * @public
 * Error messages reported by the KeymanWeb .kmn compiler.
 */
export class KmwCompilerMessages extends KmnCompilerMessages {
  // Note: for legacy reasons, KMWCompilerMessages extends from
  // KMNCompilerMessages as they share the same error codes. This can be a
  // little confusing because kmcmplib still builds its own error message
  // strings, not kmc-kmn, whereas the kmw messages are defined here. However,
  // as the kmw module may be going away at some point, it's probably not worth
  // the splitting of all KMW-specific error messages out of the
  // KmnCompilerMessages space.

  // Following messages are kmw-compiler only, so use KmwCompiler error namespace

  /** @internal */
  static Error_NotAnyRequiresVersion14 = (o:{line: number}) => m(this.ERROR_NotAnyRequiresVersion14,
    `Statement notany in context() match requires version 14.0+ of KeymanWeb`, o);
  static ERROR_NotAnyRequiresVersion14 = SevError | 0x0001;

  /** @internal */
  static Error_TouchLayoutIdentifierRequires15 = (o:{keyId:string, platformName:string, layerId:string}) => m(this.ERROR_TouchLayoutIdentifierRequires15,
    `Key "${o.keyId}" on "${o.platformName}", layer "${o.layerId}" has a multi-part identifier which requires version 15.0 or newer.`);
  static ERROR_TouchLayoutIdentifierRequires15 = SevError | 0x0002;

  /** @internal */
  static Error_InvalidTouchLayoutFileFormat = (o:{msg: string}) => m(this.ERROR_InvalidTouchLayoutFileFormat,
    `Invalid touch layout file: ${o.msg}`);
  static ERROR_InvalidTouchLayoutFileFormat = SevError | 0x0003;

  /** @internal */
  static Error_TouchLayoutFileDoesNotExist = (o:{filename:string}) => m(this.ERROR_TouchLayoutFileDoesNotExist,
    `Touch layout file ${o.filename} does not exist`);
  static ERROR_TouchLayoutFileDoesNotExist = SevError | 0x0004;

  /** @internal */
  static Hint_TouchLayoutUsesUnsupportedGesturesDownlevel = (o:{keyId:string}) => m(this.HINT_TouchLayoutUsesUnsupportedGesturesDownlevel,
    `The touch layout uses a flick or multi-tap gesture on key ${o.keyId}, which is only available on version 17.0+ of Keyman`);
  static HINT_TouchLayoutUsesUnsupportedGesturesDownlevel = SevHint | 0x0005;
};
