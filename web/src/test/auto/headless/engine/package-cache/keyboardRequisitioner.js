import { assert } from 'chai';
import sinon from 'sinon';
import fs from 'fs';

import { KeyboardHarness, ManagedPromise, MinimalKeymanGlobal } from '@keymanapp/keyboard-processor';
import { NodeKeyboardLoader } from '@keymanapp/keyboard-processor/node-keyboard-loader';
import {
  KeyboardRequisitioner,
  toPrefixedKeyboardId as prefixed
} from 'keyman/engine/package-cache';
import { PathConfiguration } from 'keyman/engine/paths';
import NodeCloudRequester from 'keyman/engine/package-cache/node-requester';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

let commonResourcesPackage = '@keymanapp/common-test-resources';
let commonStubsSubpath = 'json/keyboards';
let rootCommonStubPath = `${commonResourcesPackage}/${commonStubsSubpath}`;

const resolvedResourcePackageAnchor = require.resolve(`${commonResourcesPackage}/index.mjs`);
const resolvedResourcePackage = path.dirname(resolvedResourcePackageAnchor);

const pathConfig = new PathConfiguration({
  root: '',
  resources: '',
  // Keyboard paths in fixtures are relative to the repository root.
  keyboards: `file:///${resolvedResourcePackage}/../../..`, // the one part NEEDED for unit tests below.
  fonts: '',
}, `file:///${path.dirname(require.resolve('keyman/engine/package-cache'))}`);

/**
 * Performs mocking setup to facilitate unit testing for the `CloudQueryEngine` class.
 *
 * @param {*} queryResultsFile An absolute local filepath to a file containing the mocked results to generate.
 * @returns A fully-mocked `CloudQueryEngine` whose `.fetchCloudStubs()` call will yield a Promise for the
 *          expected mocked results.
 */
function mockedSetup(queryResultsFile) {
  const mockedRequester = new NodeCloudRequester();      // Would attempt to https-request.
  const mockingRequester = new NodeCloudRequester(true); // Used to replace that with a local request.

  // Constructs the query engine to be used, based on our provided requester.
  const loader = new NodeKeyboardLoader(new KeyboardHarness({}, MinimalKeymanGlobal));
  const keyboardRequisitioner = new KeyboardRequisitioner(loader, mockedRequester, pathConfig);
  // Promises are tracked via their queryId, which is generated by the requester.
  // We need to apply it before allowing the actual registration method to execute.
  const idInjector = {
    registerFromCloud: (x) => {
      x.timerid = idInjector.injectionId;

      /*
       * NOTE:  the filepath held by the stubs used for tests herein will be relative to a 'server root' due to
       * the usefulness of that pattern for testing in the DOM.
       *
       * So... we need to 'fix up' the path a little bit first by prefixing the missing parts of the needed
       * absolute path.  (We cannot hardcode it completely into a fixture anyway as we can't assume a fixed
       * location for the repo root.)
       *
       * Resolution:
       *  <repo root>/common/test/resources/../resources/keyboards/khmer_angkor.js
       * - the latter part is from values within khmer_angkor.hand-edited.js.fixture.
       */
      x.options.keyboardBaseUri = `file:///${resolvedResourcePackage}/../../../${x.options.keyboardBaseUri}`;

      keyboardRequisitioner.cloudQueryEngine.registerFromCloud(x);
    }
  }

  /*
    * Serves two purposes:
    *
    * 1. Captures the queryID generated by the https-based requester (being mocked) for application
    *    as seen above.
    * 2. Forwards the local-request (mocked) query's Promise as if it were produced by the https-based requester.
    */
  mockedRequester.request = sinon.fake(() => {
    let retObj = mockingRequester.request(queryResultsFile);

    // We need to capture + inject that timerId into the returned results!
    idInjector.injectionId = retObj.queryId;
    return retObj;
  });

  // Make sure the actual (local-request) requester 'registers' the query result correctly - including the
  // ability to apply the queryId expected by the registration method.
  mockingRequester.link(idInjector);

  return keyboardRequisitioner;
}

function dummyResolvedPromise() {
  // The language-list promise getter expects an actual Promise to be returned.
  const promise = new ManagedPromise();
  promise.resolve()
  return {
    promise: promise
  };
}

describe("KeyboardRequisitioner", () => {
  describe("addKeyboardsArray", () => {
    describe("Query construction", () => {
      it('sil_euro_latin@no,sv', () => {
        const requester = new NodeCloudRequester();
        const mockedMethod = requester.request = sinon.fake(() => { return {promise: Promise.resolve()} });

        const keyboardRequisitioner = new KeyboardRequisitioner(new NodeKeyboardLoader(), requester, pathConfig);
        keyboardRequisitioner.addKeyboardArray(['sil_euro_latin@no,sv']);

        assert.isTrue(mockedMethod.called);
        const queryURI = mockedMethod.firstCall.args[0];
        assert.isTrue(queryURI.includes('&keyboardid=sil_euro_latin@no,sil_euro_latin@sv'));
        assert.isFalse(queryURI.includes('&keyboardid=sil_euro_latin@no,sil_euro_latin@sv,'));
      });

      it('sil_cameroon_azerty', () => {
        const requester = new NodeCloudRequester();
        const mockedMethod = requester.request = sinon.fake(() => { return {promise: Promise.resolve()} });

        const keyboardRequisitioner = new KeyboardRequisitioner(new NodeKeyboardLoader(), requester, pathConfig);
        keyboardRequisitioner.addKeyboardArray(['sil_cameroon_azerty']);

        assert.isTrue(mockedMethod.called);
        const queryURI = mockedMethod.firstCall.args[0];
        assert.isTrue(queryURI.includes('&keyboardid=sil_cameroon_azerty'));
        assert.isFalse(queryURI.includes('&keyboardid=sil_cameroon_azerty@'));
      });

      it('@dz', () => {
        const requester = new NodeCloudRequester();
        const mockedMethod = requester.request = sinon.fake(() => { return {promise: Promise.resolve()} });

        const keyboardRequisitioner = new KeyboardRequisitioner(new NodeKeyboardLoader(), requester, pathConfig);
        keyboardRequisitioner.addKeyboardArray(['@dz']);

        assert.isTrue(mockedMethod.called);
        const queryURI = mockedMethod.firstCall.args[0];
        assert.isTrue(queryURI.includes('&keyboardid=@dz'));
        assert.isFalse(queryURI.includes('&keyboardid=@dz,'));
      });

      it('sil_euro_latin@no,sv + @dz', () => {
        const requester = new NodeCloudRequester();
        const mockedMethod = requester.request = sinon.fake(() => { return {promise: Promise.resolve()} });

        const keyboardRequisitioner = new KeyboardRequisitioner(new NodeKeyboardLoader(), requester, pathConfig);
        keyboardRequisitioner.addKeyboardArray(['sil_euro_latin@no,sv', '@dz']);

        assert.isTrue(mockedMethod.called);
        const queryURI = mockedMethod.firstCall.args[0];
        assert.isTrue(queryURI.includes('&keyboardid=sil_euro_latin@no,sil_euro_latin@sv,@dz'));
        assert.isFalse(queryURI.includes('&keyboardid=sil_euro_latin@no,sil_euro_latin@sv,@dz,'));
      });

      it('drops requests for already fetched stubs', async () => {
        let setupDB = mockedSetup(`${__dirname}/../../../resources/query-mock-results/sil_euro_latin@no_sv.js.fixture`);
        let promise = setupDB.addKeyboardArray(['sil_euro_latin@no,sv']);

        const setupStubs = await promise;

        const requester = new NodeCloudRequester();
        const mockedMethod = requester.request = sinon.fake(() => { return {promise: Promise.resolve()} });

        const keyboardRequisitioner = new KeyboardRequisitioner(new NodeKeyboardLoader(), requester, pathConfig);
        // Pre-load our 'setup' stubs into the query manager class before running the query.
        for(let stub of setupStubs) {
          keyboardRequisitioner.cache.addStub(stub);
        }

        // `sil_euro_latin@no` is already in the `cache`.
        keyboardRequisitioner.addKeyboardArray(['sil_euro_latin@no', '@dz']);

        assert.isTrue(mockedMethod.called);
        const queryURI = mockedMethod.firstCall.args[0];
        // We should still be querying for stubs we haven't already acquired...
        assert.isTrue(queryURI.includes('@dz'));
        assert.isTrue(queryURI.includes('&keyboardid=@dz'));
        // ... while ensuring that we do not re-request already-acquired stubs.
        assert.isFalse(queryURI.includes('&keyboardid=sil_euro_latin@no'));
        assert.isFalse(queryURI.includes('sil_euro_latin'));
      });
    });

    describe('Stub fetching', () => {
      it('sil_euro_latin@no,sv', async () => {
        const keyboardRequisitioner = mockedSetup(`${__dirname}/../../../resources/query-mock-results/sil_euro_latin@no_sv.js.fixture`);
        const promise = keyboardRequisitioner.addKeyboardArray(['sil_euro_latin@no,sv']);

        const stubs = await promise;

        assert.equal(stubs.length, 2);
        for(let stub of stubs) {
          assert.equal(stub.KI, prefixed('sil_euro_latin'));
          assert.equal(stub.KN, "EuroLatin (SIL)");
        }

        assert.sameOrderedMembers(stubs.map((stub) => stub.KLC), ['no', 'sv']);
        assert.sameOrderedMembers(stubs.map((stub) => stub.KL),  ['Norwegian', 'Swedish']);

        assert.strictEqual(keyboardRequisitioner.cache.getStub('sil_euro_latin', 'no'), stubs[0]);
        assert.strictEqual(keyboardRequisitioner.cache.getStub('sil_euro_latin', 'sv'), stubs[1]);
      });

      it('sil_cameroon_azerty', async () => {
        const keyboardRequisitioner = mockedSetup(`${__dirname}/../../../resources/query-mock-results/sil_cameroon_azerty.js.fixture`);
        const promise = keyboardRequisitioner.addKeyboardArray(['sil_cameroon_azerty']);

        const stubs = await promise;

        assert.equal(stubs.length, 278);
        for(let stub of stubs) {
          assert.equal(stub.KI, prefixed('sil_cameroon_azerty'));
          assert.equal(stub.KN, "Cameroon AZERTY");
        }

        const stub_pny = stubs.find((stub) => stub.KLC == 'pny');
        assert.equal(stub_pny.KL, 'Pinyin');

        assert.strictEqual(keyboardRequisitioner.cache.getStub('sil_cameroon_azerty', 'pny'), stub_pny);
      });

      it('@dz', async () => {
        const keyboardRequisitioner = mockedSetup(`${__dirname}/../../../resources/query-mock-results/@dz.js.fixture`);
        const promise = keyboardRequisitioner.addKeyboardArray(['@dz']);

        const stubs = await promise;

        // `CloudQueryEngine` returns only a single stub.
        //
        // Within `CloudQueryEngine.registerLanguagesForKeyboard`:
        // > Register the default keyboard for the language code
        assert.equal(stubs.length, 1);
        // When available, a perfect match between keyboard and language name = "the default keyboard".
        assert.equal(stubs[0].KN, "Dzongkha");

        assert.strictEqual(keyboardRequisitioner.cache.getStub('dzongkha', 'dz'), stubs[0]);
      });

      it('drops requests for already fetched stubs', async () => {
        let setupDB = mockedSetup(`${__dirname}/../../../resources/query-mock-results/sil_euro_latin@no_sv.js.fixture`);
        let promise = setupDB.addKeyboardArray(['sil_euro_latin@no,sv']);

        const setupStubs = await promise;

        const precachedRequisitioner = mockedSetup(`${__dirname}/../../../resources/query-mock-results/@dz.js.fixture`);
        // Pre-load our 'setup' stubs into the query manager class before running the query.
        for(let stub of setupStubs) {
          precachedRequisitioner.cache.addStub(stub);
        }

        // Now for the real test.  The first requested keyboard is already cached, but not the second.
        promise = precachedRequisitioner.addKeyboardArray(['sil_euro_latin@no', '@dz']);

        const stubs = await promise;

        // Only the second request should have been fetched.  Any precached keyboard stubs are
        // currently NOT returned from `addKeyboardArray` - only those that are newly fetched.
        assert.isNotEmpty(stubs);
        assert.equal(stubs.length, 1);
        assert.equal(stubs[0].KLC, 'dz');
      });
    });
  });

  describe('addLanguageKeyboards', function() {
    it('awaits the language list fetch + constructs a query for the requested language', async () => {
      const keyboardRequisitioner = mockedSetup(`${__dirname}/../../../resources/query-mock-results/languages.js.fixture`);
      const mockedRequester = keyboardRequisitioner.cloudQueryEngine.requestEngine;
      const originalRequest = mockedRequester.request;
      let swapFake = sinon.fake((query) => {
        if(swapFake.calledOnce) {
          return originalRequest.call(mockedRequester, query);
        } else {
          return dummyResolvedPromise();
        }
      });
      mockedRequester.request = swapFake;
      const promise = keyboardRequisitioner.addLanguageKeyboards(['Khmer', 'Dzongkha']);

      try {
        await promise;
      } catch (e) {
        // We didn't mock the actual query based on the language codes, but just knowing
        // that a query was made, with the right parameters, is enough for us here.
      }

      assert.equal(swapFake.callCount, 2);

      const kbdQueryURI = swapFake.secondCall.args[0];
      assert.isString(kbdQueryURI);

      assert.isTrue(kbdQueryURI.includes('keyboards?'));
      assert.isFalse(kbdQueryURI.includes('languages?'));
      assert.isTrue(kbdQueryURI.includes('&keyboardid=@km,@dz'));
    });
  });

  it('queries for remote stubs and loads their keyboards', async () => {
    // Note:  the query fixture is hand-edited from the original version obtained at
    // https://api.keyman.com/cloud/4.0/keyboards?jsonp=keyman.register&languageidtype=bcp47&version=17.0&keyboardid=khmer_angkor&timerid=49.
    //
    // The edits are minimal and notated within the fixture file.
    const keyboardRequisitioner = mockedSetup(`${__dirname}/../../../resources/query-mock-results/khmer_angkor.hand-edited.js.fixture`);

    const cache = keyboardRequisitioner.cache;
    const [stub] = await keyboardRequisitioner.addKeyboardArray(['khmer_angkor']);
    assert.strictEqual(cache.getStub(stub.KI, stub.KLC), stub);

    const kbd_promise = cache.fetchKeyboard('khmer_angkor');
    const khmer_angkor = await kbd_promise;

    // Step 3: verify successful load & caching.
    assert.strictEqual(cache.getKeyboardForStub(stub), khmer_angkor);
    assert.isOk(khmer_angkor);
  });

  it('loads keyboards for page-local, API-added stubs', async () => {
    const keyboardLoader = new NodeKeyboardLoader(new KeyboardHarness({}, MinimalKeymanGlobal));
    const keyboardRequisitioner = new KeyboardRequisitioner(keyboardLoader, null, pathConfig);
    const cache = keyboardRequisitioner.cache;

    const stubJSON = JSON.parse(fs.readFileSync(require.resolve(`${rootCommonStubPath}/khmer_angkor.json`)));
    // Tests in other engines do a bit of aliasing here for easier reading.
    // We have to introduce it manually for this test, though.
    stubJSON.filename = "common/test/" + stubJSON.filename;
    // The `pathConfig` setup + internal logic should ensure that the filepath points to the correct location
    // with no additional effort required here.
    const [stub] = await keyboardRequisitioner.addKeyboardArray([stubJSON]);
    assert.strictEqual(cache.getStub(stub.KI, stub.KLC), stub);

    const kbd_promise = cache.fetchKeyboard('khmer_angkor');
    const khmer_angkor = await kbd_promise;

    // Step 3: verify successful load & caching.
    assert.strictEqual(cache.getKeyboardForStub(stub), khmer_angkor);
    assert.isOk(khmer_angkor);
  });

  // TODO: unit tests for these.
  describe.skip('fetchCloudStubs', () => {
    it('fetches stubs for all supported cloud keyboards', () => {});

    it('caches all fetched cloud stubs upon completion', () => {});

    it('returns an error stub if unable to access the Cloud API', () => {});
  });
});