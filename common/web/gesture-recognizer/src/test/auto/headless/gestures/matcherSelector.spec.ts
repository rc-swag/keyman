import { assert } from 'chai'
import sinon from 'sinon';

import * as PromiseStatusModule from 'promise-status-async';
const PromiseStatuses     = PromiseStatusModule.PromiseStatuses;
import { assertingPromiseStatus as promiseStatus } from '../../../resources/assertingPromiseStatus.js';

import { simulateMultiSourceMatcherInput, simulateSelectorInput } from "../../../resources/simulateMultiSourceInput.js";

import { GestureSource, gestures } from '@keymanapp/gesture-recognizer';

import { TouchpathTurtle } from '#tools';

type MatcherSelection<Type> = gestures.matchers.MatcherSelection<Type>;
type MatcherSelector<Type> = gestures.matchers.MatcherSelector<Type>;
type GestureModel<Type> = gestures.specs.GestureModel<Type>;

import {
  LongpressModel,
  MultitapModel,
  SimpleTapModel,
  SubkeySelectModel
} from './isolatedGestureSpecs.js';

import {
  LongpressDistanceThreshold,
  MainLongpressSourceModel
} from './isolatedPathSpecs.js';

describe("MatcherSelector", function () {
  beforeEach(function() {
    this.fakeClock = sinon.useFakeTimers();
  });

  afterEach(function() {
    this.fakeClock.restore();
  });

  describe("Single-source", function() {
    describe("First stage", function() {
      it("Longpress (in isolation)", async function() {
        const turtle = new TouchpathTurtle({
          targetX: 1,
          targetY: 1,
          t: 100,
          item: 'a'
        });
        turtle.wait(1000, 50);
        turtle.commitPending();

        const {
          sources,
          selectionPromises,
          selectorPromise,
          executor
        } = simulateSelectorInput({
          pathSpecs: { type: 'sequence', samples: turtle.path, terminate: false },
          specSet: [LongpressModel]
        }, this.fakeClock);

        let completion = executor();
        const selector = await selectorPromise;
        await Promise.race([completion, selectionPromises[0]]);

        assert.equal(await promiseStatus(selectionPromises[0]), PromiseStatuses.PROMISE_RESOLVED);
        assert.equal(await promiseStatus(completion), PromiseStatusModule.PROMISE_PENDING);

        const selection = await selectionPromises[0];

        assert.deepEqual(selection.result, {matched: true, action: { type: 'chain', item: null, next: 'subkeyselect'}});
        assert.deepEqual(selection.matcher.model, LongpressModel);
        assert.isFalse(sources[0].path.isComplete);

        // Allow the rest of the simulation to play out; it's easy cleanup that way.
        await completion;
      });

      it("Longpress (with other possibilities)", async function() {
        const turtle = new TouchpathTurtle({
          targetX: 1,
          targetY: 1,
          t: 100,
          item: 'a'
        });
        turtle.wait(1000, 50);
        turtle.commitPending();

        const {
          sources,
          selectionPromises,
          selectorPromise,
          executor
        } = simulateSelectorInput({
          pathSpecs: { type: 'sequence', samples: turtle.path, terminate: false },
          specSet: [LongpressModel, MultitapModel, SimpleTapModel]
        }, this.fakeClock);

        let completion = executor();
        const selector = await selectorPromise;
        await Promise.race([completion, selectionPromises[0]]);

        assert.equal(await promiseStatus(selectionPromises[0]), PromiseStatuses.PROMISE_RESOLVED);
        assert.equal(await promiseStatus(completion), PromiseStatusModule.PROMISE_PENDING);

        const selection = await selectionPromises[0];

        assert.deepEqual(selection.result, {matched: true, action: { type: 'chain', item: null, next: 'subkeyselect'}});
        assert.deepEqual(selection.matcher.model, LongpressModel);
        assert.isFalse(sources[0].path.isComplete);

        // Allow the rest of the simulation to play out; it's easy cleanup that way.
        await completion;
      });

      it("Longpress reject (due to path) -> reset request (in isolation)", async function() {
        const turtle = new TouchpathTurtle({
          targetX: 1,
          targetY: 1,
          t: 100,
          item: 'a'
        });
        turtle.move(90, LongpressDistanceThreshold + 2, LongpressModel.contacts[0].model.timer.duration, 20);
        turtle.wait(1000, 50);
        turtle.commitPending();

        const {
          sources,
          selectionPromises,
          selectorPromise,
          executor
        } = simulateSelectorInput({
          pathSpecs: { type: 'sequence', samples: turtle.path, terminate: false },
          specSet: [LongpressModel]
        }, this.fakeClock);


        let completion = executor();
        const selector = await selectorPromise;
        const rejectionStub = sinon.fake();
        selector.on('rejectionwithaction', rejectionStub);

        await Promise.race([completion, selectionPromises[0]]);

        assert.equal(await promiseStatus(selectionPromises[0]), PromiseStatuses.PROMISE_PENDING);
        // It finished simulating without a match.  (Note:  we don't terminate the simulated
        // touchpath - `terminate: false`.)
        assert.equal(await promiseStatus(completion), PromiseStatusModule.PROMISE_RESOLVED);
        assert.isTrue(rejectionStub.calledOnce);

        const rejectionData = rejectionStub.firstCall.args as [ MatcherSelection<string>, (model: GestureModel<string>) => void ];
        assert.equal(rejectionData[0].matcher.model.id, 'longpress');
        assert.equal(rejectionData[0].result.matched, false);
        assert.deepEqual(rejectionData[0].result.action, { type: 'optional-chain', allowNext: 'longpress', item: null});

        // ... we technically already have it, but this _is_ a convenient pattern to maintain for
        // consistency among all this suite's tests.
        await completion;
      });

      it("Longpress rejection replacement (in isolation)", async function() {
        const turtle = new TouchpathTurtle({
          targetX: 1,
          targetY: 1,
          t: 100,
          item: 'a'
        });
        turtle.move(90, LongpressDistanceThreshold + 2, LongpressModel.contacts[0].model.timer.duration - 2, 20);
        turtle.hoveredItem = 'b';
        turtle.wait(1000, 50);
        turtle.commitPending();

        const {
          sources,
          selectionPromises,
          selectorPromise,
          executor
        } = simulateSelectorInput({
          pathSpecs: { type: 'sequence', samples: turtle.path, terminate: false },
          specSet: [LongpressModel]
        }, this.fakeClock);


        let completion = executor();
        const selector = await selectorPromise;
        let rejectionCounter = 0;
        selector.on('rejectionwithaction', (selection, replaceModelWith) => {
          assert.equal(selection.matcher.model.id, 'longpress');

          rejectionCounter++;
          // Just... restart the model.
          replaceModelWith(LongpressModel);
        });

        await Promise.race([completion, selectionPromises[0]]);

        assert.equal(await promiseStatus(selectionPromises[0]), PromiseStatuses.PROMISE_RESOLVED);
        // It finished simulating without a match.  (Note:  we don't terminate the simulated
        // touchpath - `terminate: false`.)
        assert.equal(await promiseStatus(completion), PromiseStatusModule.PROMISE_PENDING);

        const selection = await selectionPromises[0];
        assert.deepEqual(selection.result, {matched: true, action: { type: 'chain', item: null, next: 'subkeyselect'}});
        assert.deepEqual(selection.matcher.model, LongpressModel);

        // Original base item was 'a'; 'b' proves that a reset occurred by the point of the 'item' change.
        assert.equal(selection.matcher.baseItem, 'b');
        assert.isFalse(sources[0].path.isComplete);

        // One for path distance before the longpress timer completed, then one for change of current path 'item'.
        // (from 'a' to 'b')
        assert.equal(rejectionCounter, 2);

        await completion;
      });

      it("Longpress rejection replacement (with other possibilities)", async function() {
        const turtle = new TouchpathTurtle({
          targetX: 1,
          targetY: 1,
          t: 100,
          item: 'a'
        });
        turtle.move(90, LongpressDistanceThreshold + 2, LongpressModel.contacts[0].model.timer.duration - 2, 20);
        turtle.hoveredItem = 'b';
        turtle.wait(1000, 50);
        turtle.commitPending();

        const {
          sources,
          selectionPromises,
          selectorPromise,
          executor
        } = simulateSelectorInput({
          pathSpecs: { type: 'sequence', samples: turtle.path, terminate: false },
          // Current problem:  adding the extra models leads to rejection of all?
          specSet: [LongpressModel, MultitapModel, SimpleTapModel]
        }, this.fakeClock);


        let completion = executor();
        const selector = await selectorPromise;
        selector.on('rejectionwithaction', (selection, replaceModelWith) => {
          if(selection.matcher.model.id == 'longpress') {
            replaceModelWith(LongpressModel);
          } else if(selection.matcher.model.id == 'simple-tap') {
            replaceModelWith(SimpleTapModel);
          } else {
            assert.fail();
          }
        });

        await Promise.race([completion, selectionPromises[0]]);

        assert.equal(await promiseStatus(selectionPromises[0]), PromiseStatuses.PROMISE_RESOLVED);
        // It finished simulating without a match.  (Note:  we don't terminate the simulated
        // touchpath - `terminate: false`.)
        assert.equal(await promiseStatus(completion), PromiseStatusModule.PROMISE_PENDING);

        const selection = await selectionPromises[0];
        assert.deepEqual(selection.result, {matched: true, action: { type: 'chain', item: null, next: 'subkeyselect'}});
        assert.deepEqual(selection.matcher.model, LongpressModel);

        // Original base item was 'a'; 'b' proves that a reset occurred by the point of the 'item' change.
        assert.equal(selection.matcher.baseItem, 'b');
        assert.isFalse(sources[0].path.isComplete);

        await completion;
      });

      // roaming touch:  relatively long + slow move; expect longpress reset w/ matched: false
      // (not in isolation)

      it("Simple Tap (single source)", async function() {
        const turtle = new TouchpathTurtle({
          targetX: 1,
          targetY: 1,
          t: 100,
          item: 'a'
        });
        turtle.wait(100, 5);
        turtle.commitPending();

        const {
          sources,
          selectionPromises,
          selectorPromise,
          executor
        } = simulateSelectorInput({
          pathSpecs: { type: 'sequence', samples: turtle.path, terminate: true },
          specSet: [LongpressModel, MultitapModel, SimpleTapModel]
        }, this.fakeClock);

        let completion = executor();
        const selector = await selectorPromise;
        await Promise.race([completion, selectionPromises[0]]);

        // So, the terminate signal didn't complete the selection?
        assert.equal(await promiseStatus(selectionPromises[0]), PromiseStatuses.PROMISE_RESOLVED);
        assert.equal(await promiseStatus(completion), PromiseStatusModule.PROMISE_PENDING);

        const selection = await selectionPromises[0];

        assert.deepEqual(selection.result, {matched: true, action: { type: 'optional-chain', item: 'a', allowNext: 'multitap' }});
        assert.deepEqual(selection.matcher.model, SimpleTapModel);
        assert.isTrue(sources[0].path.isComplete);

        // Allow the rest of the simulation to play out; it's easy cleanup that way.
        await completion;
      });

      it("Simple Tap (single source) with reset", async function() {
        const turtle = new TouchpathTurtle({
          targetX: 1,
          targetY: 1,
          t: 100,
          item: 'a'
        });
        turtle.wait(40, 5);
        turtle.move(90, 2, 20, 1);
        turtle.hoveredItem = 'b';
        turtle.wait(40, 5);

        turtle.commitPending();

        const {
          sources,
          selectionPromises,
          selectorPromise,
          executor
        } = simulateSelectorInput({
          pathSpecs: { type: 'sequence', samples: turtle.path, terminate: true },
          specSet: [LongpressModel, MultitapModel, SimpleTapModel]
        }, this.fakeClock);

        let completion = executor();
        let resets = 0;
        const selector = await selectorPromise;
        selector.on('rejectionwithaction', (selection, replaceModelWith) => {
          if(selection.matcher.model.id == 'longpress') {
            replaceModelWith(LongpressModel);
          } else if(selection.matcher.model.id == 'simple-tap') {
            resets++;
            replaceModelWith(SimpleTapModel);
          } else {
            assert.fail();
          }
        });

        await Promise.race([completion, selectionPromises[0]]);

        // So, the terminate signal didn't complete the selection?
        assert.equal(await promiseStatus(selectionPromises[0]), PromiseStatuses.PROMISE_RESOLVED);
        assert.equal(await promiseStatus(completion), PromiseStatusModule.PROMISE_PENDING);

        const selection = await selectionPromises[0];

        assert.deepEqual(selection.result, {matched: true, action: { type: 'optional-chain', item: 'b', allowNext: 'multitap' }});
        assert.deepEqual(selection.matcher.model, SimpleTapModel);
        assert.isTrue(sources[0].path.isComplete);
        assert.isAtLeast(resets, 1);

        // Allow the rest of the simulation to play out; it's easy cleanup that way.
        await completion;
      });
    });

    describe("Later stages", function() {
      it("Subkey selection", async function() {
        const turtle = new TouchpathTurtle({
          targetX: 1,
          targetY: 1,
          t: 100,
          item: 'a'
        });
        turtle.wait(520, 26);
        turtle.commitPending();

        // Set up the prior stage's match
        const {
          executor: predExecutor,
          modelMatcherPromise
        } = simulateMultiSourceMatcherInput([
          { type: 'sequence', samples: turtle.path, terminate: false }
        ], this.fakeClock, LongpressModel);

       await predExecutor();
       const predecessorMatcher = await modelMatcherPromise;
       assert.equal(await promiseStatus(modelMatcherPromise), PromiseStatuses.PROMISE_RESOLVED);

        // Now, forward it (in some manner) to the simulation engine as part of its setup.

        // Also, construct the remainder of the path.
        const parentLength = turtle.path.length;

        turtle.move(45, 5, 60, 3);
        turtle.hoveredItem = 'b';
        turtle.move(90, 5, 60, 3);
        turtle.hoveredItem = 'c';
        turtle.commitPending();

        // Get the new part of the turtle's path, which has not yet been simulated.
        const remainingPath = [].concat(turtle.path).splice(parentLength, turtle.path.length - parentLength);

        const {
          sources,
          selectionPromises,
          selectorPromise,
          executor
        } = simulateSelectorInput(
          {
            pathSpecs: {
              type: 'prior-matcher',
              matcher: predecessorMatcher,
              continuation: [{ type: 'sequence', samples: remainingPath, terminate: true }]
            },
            specSet: [SubkeySelectModel]
          }
        , this.fakeClock);

        let completion = executor();
        const selector = await selectorPromise;
        await Promise.race([completion, selectionPromises[0]]);

        assert.equal(await promiseStatus(selectionPromises[0]), PromiseStatuses.PROMISE_RESOLVED);
        assert.equal(await promiseStatus(completion), PromiseStatusModule.PROMISE_PENDING);

        const selection = await selectionPromises[0];

        assert.deepEqual(selection.result, {matched: true, action: { type: 'complete', item: 'c' }});
        assert.deepEqual(selection.matcher.model, SubkeySelectModel);
        assert.isTrue(sources[0].path.isComplete);

        // Allow the rest of the simulation to play out; it's easy cleanup that way.
        await completion;
      });
    });
  });
});