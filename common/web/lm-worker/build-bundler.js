/*
 * Note:  while this file is not meant to exist long-term, it provides a nice
 * low-level proof-of-concept for esbuild bundling of the various Web submodules.
 *
 * Add some extra code at the end of src/index.ts and run it to verify successful bundling!
 */

import esbuild from 'esbuild';
import { spawn } from 'child_process';

await esbuild.build({
  bundle: true,
  sourcemap: true,
  format: "esm",
  nodePaths: ['..', '../../models'],
  entryPoints: {
    'index': 'build/obj/index.js',
    'worker-main': 'build/obj/worker-main.js'
  },
  outdir: 'build/lib',
  outExtension: { '.js': '.mjs' },
  tsconfig: 'tsconfig.json',
  target: "es5"
});


// Bundled CommonJS (classic Node) module version
esbuild.buildSync({
  bundle: true,
  sourcemap: true,
  format: "cjs",
  nodePaths: ['..'],
  entryPoints: {
    'index': 'build/obj/index.js',
    'worker-main': 'build/obj/worker-main.js'
  },
  outdir: 'build/lib',
  outExtension: { '.js': '.cjs' },
  tsconfig: 'tsconfig.json',
  target: "es5"
});

const dtsBundleCommand1 = spawn('npx dts-bundle-generator --project tsconfig.json -o build/lib/index.d.ts src/index.ts', {
  shell: true
});

dtsBundleCommand1.stdout.on('data', data =>   console.log(data.toString()));
dtsBundleCommand1.stderr.on('data', data => console.error(data.toString()));

// Forces synchronicity; done mostly so that the logs don't get jumbled up.
await new Promise((resolve, reject) => {
  dtsBundleCommand1.on('exit', () => {
    if(dtsBundleCommand1.exitCode != 0) {
      reject();
      process.exit(dtsBundleCommand1.exitCode);
    }
    resolve();
  });
});

const dtsBundleCommand2 = spawn('npx dts-bundle-generator --project tsconfig.json -o build/lib/worker-main.d.ts src/worker-main.ts', {
  shell: true
});

dtsBundleCommand2.stdout.on('data', data =>   console.log(data.toString()));
dtsBundleCommand2.stderr.on('data', data => console.error(data.toString()));

// Forces synchronicity; done mostly so that the logs don't get jumbled up.
await new Promise((resolve, reject) => {
  dtsBundleCommand2.on('exit', () => {
    if(dtsBundleCommand2.exitCode != 0) {
      reject();
      process.exit(dtsBundleCommand2.exitCode);
    }
    resolve();
  });
});

