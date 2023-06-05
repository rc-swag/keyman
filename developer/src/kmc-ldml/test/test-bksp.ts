import 'mocha';
import { assert } from 'chai';
import { BkspCompiler } from '../src/compiler/tran.js';
import { compilerTestCallbacks, loadSectionFixture } from './helpers/index.js';
import { KMXPlus } from '@keymanapp/common-types';

import Bksp = KMXPlus.Bksp;
import { BASIC_DEPENDENCIES } from '../src/compiler/empty-compiler.js';
import { VarsCompiler } from '../src/compiler/vars.js';
const tranDependencies = [ ...BASIC_DEPENDENCIES, VarsCompiler ];

describe('bksp', function () {
  this.slow(500); // 0.5 sec -- json schema validation takes a while

  it('should compile minimal bksp data', async function() {
    let bksp = await loadSectionFixture(BkspCompiler, 'sections/bksp/minimal.xml', compilerTestCallbacks, tranDependencies) as Bksp;
    assert.lengthOf(compilerTestCallbacks.messages, 0);

    it.skip('TODO-LDML rewriting this #7377', () => {
      assert.ok(bksp);
      // assert.lengthOf(bksp.items, 1);
      // assert.lengthOf(bksp.items[0].from, 2);
      // assert.strictEqual(bksp.items[0].from[0].value.value, "្");
      // assert.strictEqual(bksp.items[0].from[1].value.value, "ម");
      // assert.strictEqual(bksp.items[0].flags, BkspItemFlags.none);
      // assert.isEmpty(bksp.items[0].before);
      // assert.strictEqual(bksp.items[0].to.value, "");
    });
  });
});

