import { playwrightLauncher } from '@web/test-runner-playwright';

// @ts-check
/** @type {import('@web/test-runner').TestRunnerConfig} */
export default {
  // debug: true,
  browsers: [
    playwrightLauncher({ product: 'chromium' }),
    playwrightLauncher({ product: 'firefox' }),
    playwrightLauncher({ product: 'webkit' })
  ],
  concurrency: 10,
  nodeResolve: true,
  files: [
    '**/*.spec.mjs'
  ],
  // open: true,
  // manual: true,
  rootDir: KEYMAN_ROOT // b/c that's where node_modules is,
}