import {
  gestures,
  GestureModelDefs,
  InputSample,
  CumulativePathStats
} from '@keymanapp/gesture-recognizer';

import {
  TouchLayout
} from '@keymanapp/common-types';
import ButtonClasses = TouchLayout.TouchLayoutKeySp;

import {
  deepCopy
} from '@keymanapp/keyboard-processor';
import OSKLayerGroup from '../../keyboard-layout/oskLayerGroup.js';

import { type KeyElement } from '../../keyElement.js';

import { calcLockedDistance, lockedAngleForDir, MAX_TOLERANCE_ANGLE_SKEW, type OrderedFlickDirections } from './browser/flick.js';

import specs = gestures.specs;

export interface GestureParams<Item = any> {
  longpress: {
    /**
     * Allows enabling or disabling the longpress up-flick shortcut for keyboards that do not
     * include any defined flick gestures.
     *
     * Will be ignored (in favor of `false`) for keyboards that do have defined flicks.
     */
    permitsFlick: (item?: Item) => boolean,

    /**
     * The minimum _net_ distance traveled before a longpress flick-shortcut will trigger.
     */
    flickDist: number,

    /**
     * The maximum amount of raw-distance movement allowed for a longpress before it is
     * aborted in favor of roaming touch and/or a timer reset.  Only applied when
     * roaming touch behaviors are permitted / when flicks are disabled.
     *
     * This threshold is not applied if the movement meets all criteria to trigger a
     * flick-shortcut but the distance traveled.
     */
    noiseTolerance: number,

    /**
     * The duration (in ms) that the base key must be held before the subkey menu will be
     * displayed should the up-flick shortcut not be utilized.
     */
    waitLength: number
  },
  multitap: {
    /**
     * The duration (in ms) permitted between taps.  Taps with a greater time interval
     * between them will be considered separate.
     */
    waitLength: number;

    /**
     * The duration (in ms) permitted for a tap to be held before it will no longer
     * be considered part of a multitap.
     */
    holdLength: number;
  },
  flick: {
    /**
     * The minimum _net_ touch-path distance that must be traversed to "lock in" on
     * a flick gesture.  When keys support both longpresses and flicks, this distance
     * must be traversed before the longpress timer elapses.
     *
     * This distance does _not_ trigger an actual flick keystroke; it is intended to
     * ensure that paths meeting this criteria have the chance to meet the full
     * distance criteria for a flick even if longpresses are also supported on a key.
     */
    startDist: number,

    /**
     * The minimum _net_ touch-path distance that must be traversed for flicks
     * to be triggered.
     */
    triggerDist: number,

    /**
     * The minimum _net_ touch-path distance after which the direction will be locked.
     */
    dirLockDist: number
  }
}

export const DEFAULT_GESTURE_PARAMS: GestureParams = {
  longpress: {
    permitsFlick: () => true,
    flickDist: 5,
    waitLength: 500,
    noiseTolerance: 10
  },
  multitap: {
    waitLength: 500,
    holdLength: 500
  },
  flick: {
    startDist: 10,
    dirLockDist: 20,
    triggerDist: 40 // should probably be based on row-height?
  }
}

export function keySupportsModipress(key: KeyElement) {
  const keySpec = key.key.spec;
  const modifierKeyIds = ['K_SHIFT', 'K_ALT', 'K_CTRL', 'K_NUMERALS', 'K_SYMBOLS', 'K_CURRENCIES'];
  for(const modKeyId of modifierKeyIds) {
    if(keySpec.id == modKeyId) {
      return true;
    }
  }

  // Allows special-formatted keys with a next-layer property to be modipressable.
  if(!keySpec.nextlayer) {
    return false;
  } else {
    switch(keySpec.sp) {
      case ButtonClasses.special:
      case ButtonClasses.specialActive:
      case ButtonClasses.customSpecial:
      case ButtonClasses.customSpecialActive:
        return true;
      default: // .normal, .spacer, .blank, .deadkey
        return false;
    }
  }
}

/**
 * Defines the set of gestures appropriate for use with the specified Keyman keyboard.
 * @param layerGroup  The active keyboard's layer group
 * @param params      A set of tweakable gesture parameters.  It will be closure-captured
 *                    and referred to by reference; changes to its values will take
 *                    immediate effect during gesture processing.
 * @returns
 */
export function gestureSetForLayout(layerGroup: OSKLayerGroup, params: GestureParams): GestureModelDefs<KeyElement, string> {
  const layout = layerGroup.spec;

  // To be used among the `allowsInitialState` contact-model specifications as needed.
  const gestureKeyFilter = (key: KeyElement, gestureId: string) => {
    if(!key) {
      return false;
    }

    const keySpec = key.key.spec;
    switch(gestureId) {
      case 'modipress-start':
        return keySupportsModipress(key);
      case 'special-key-start':
        return ['K_LOPT', 'K_ROPT', 'K_BKSP'].indexOf(keySpec.baseKeyID) != -1;
      case 'longpress':
        return !!keySpec.sk;
      case 'multitap-start':
      case 'modipress-multitap-start':
        if(layout.hasMultitaps) {
          return !!keySpec.multitap;
        } else {
          return false;
        }
      case 'flick-start':
        // This is a gesture-start check; there won't yet be any directional info available.
        return !!keySpec.flick;
      default:
        return true;
    }
  };

  const _initialTapModel: GestureModel<KeyElement> = deepCopy(layout.hasFlicks ? initialTapModel(params) : initialTapModelWithReset(params));
  const simpleTapModel: GestureModel<KeyElement> = deepCopy(layout.hasFlicks ? SimpleTapModel : SimpleTapModelWithReset);
  const longpressModel: GestureModel<KeyElement> = deepCopy(longpressModelWithShortcut(params, true, !layout.hasFlicks));

  // #region Functions for implementing and/or extending path initial-state checks
  function withKeySpecFiltering(model: GestureModel<KeyElement>, contactIndices: number | number[]) {
    // Creates deep copies of the model specifications that are safe to customize to the
    // keyboard layout.
    model = deepCopy(model);
    const modelId = model.id;

    if(typeof contactIndices == 'number') {
      contactIndices = [contactIndices];
    }

    model.contacts.forEach((contact, index) => {
      if((contactIndices as number[]).indexOf(index) != -1) {
        const baseInitialStateCheck = contact.model.allowsInitialState ?? (() => true);

        contact.model = {
          ...contact.model,
          allowsInitialState: (sample, ancestorSample, key) => {
            return gestureKeyFilter(key, modelId) && baseInitialStateCheck(sample, ancestorSample, key);
          }
        };
      }
    });

    return model;
  }
  // #endregion

  const gestureModels = [
    withKeySpecFiltering(longpressModel, 0),
    withKeySpecFiltering(multitapStartModel(params), 0),
    multitapEndModel(params),
    _initialTapModel,
    simpleTapModel,
    withKeySpecFiltering(SpecialKeyStartModel, 0),
    SpecialKeyEndModel,
    SubkeySelectModel,
    withKeySpecFiltering(ModipressStartModel, 0),
    modipressHoldModel(params),
    ModipressEndModel,
    ModipressMultitapTransitionModel,
    withKeySpecFiltering(modipressMultitapStartModel(params), 0),
    modipressMultitapEndModel(params),
    modipressMultitapLockModel()
  ];

  const defaultSet = [
    longpressModel.id, _initialTapModel.id, ModipressStartModel.id, SpecialKeyStartModel.id
  ];

  if(layout.hasFlicks) {
    gestureModels.push(withKeySpecFiltering(flickStartModel(params), 0));
    gestureModels.push(flickMidModel(params));
    gestureModels.push(flickResetModel(params));
    gestureModels.push(FlickResetEndModel);
    gestureModels.push(flickEndModel(params));

    defaultSet.push('flick-start');
  } else {
    // A post-roam version of longpress with the up-flick shortcut disabled but roaming still on.
    gestureModels.push(withKeySpecFiltering(longpressModelAfterRoaming(params), 0));
  }

  return {
    gestures: gestureModels,
    sets: {
      default: defaultSet,
      modipress: defaultSet.filter((entry) => entry != ModipressStartModel.id), // no nested modipressing
      none: []
    }
  }
}

// #region Definition of models for paths comprising gesture-stage models

// Note:  as specified below, none of the raw specs actually need access to KeyElement typing.

type ContactModel = specs.ContactModel<any>;

export const InstantContactRejectionModel: ContactModel = {
  itemPriority: 0,
  pathResolutionAction: 'reject',
  pathModel: {
    evaluate: (path) => 'resolve'
  }
}

export const InstantContactResolutionModel: ContactModel = {
  itemPriority: 0,
  pathResolutionAction: 'resolve',
  pathModel: {
    evaluate: (path) => 'resolve',
  }
}

export function flickStartContactModel(params: GestureParams): ContactModel {
  return {
    itemPriority: 1,
    pathModel: {
      evaluate: (path) => path.stats.netDistance > params.flick.startDist ? 'resolve' : null
    },
    pathResolutionAction: 'resolve',
    pathInheritance: 'chop'
  }
}

/*
 * Determines the best direction to use for flick-locking and the total net distance
 * traveled in that direction.
 */
function determineLockFromStats(pathStats: CumulativePathStats<KeyElement>) {
  const flickSpec = pathStats.initialSample.item.key.spec.flick;

  const supportedDirs = Object.keys(flickSpec) as (typeof OrderedFlickDirections[number])[];
  let bestDir: typeof supportedDirs[number];
  let bestLockedDist = 0;

  for(let i = 0; i < supportedDirs.length; i++) {
    const dir = supportedDirs[i];
    const lockedDist = calcLockedDistance(pathStats, dir);
    if(lockedDist > bestLockedDist) {
      bestLockedDist = lockedDist;
      bestDir = dir;
    }
  }

  return {
    dir: bestDir,
    dist: bestLockedDist
  }
}

export function flickMidContactModel(params: GestureParams): gestures.specs.ContactModel<KeyElement, any> {
  return {
    itemPriority: 1,
    pathModel: {
      evaluate: (path) => {
        /*
         * Check whether or not there is a valid flick for which the path crosses the flick-dist
         * threshold while at a supported angle for flick-locking by the flick handler.
         */
        const { dir, dist } = determineLockFromStats(path.stats);

        // If the best supported flick direction meets the 'direction lock' threshold criteria,
        // only then do we allow transitioning to the 'locked flick' state.
        if(dist > params.flick.dirLockDist) {
          const trueAngle = path.stats.angle;
          const lockAngle = lockedAngleForDir(dir);
          const dist1 = Math.abs(trueAngle - lockAngle);
          const dist2 = Math.abs(2 * Math.PI + lockAngle - trueAngle); // because of angle wrap-around.

          if(dist1 <= MAX_TOLERANCE_ANGLE_SKEW || dist2 <= MAX_TOLERANCE_ANGLE_SKEW) {
            return 'resolve';
          }
        } else if(path.isComplete) {
          return 'reject';
        }
      }
    },
    pathResolutionAction: 'resolve',
    pathInheritance: 'full'
  }
}


export function flickEndContactModel(params: GestureParams): ContactModel {
  return {
    itemPriority: 1,
    pathModel: {
      evaluate: (path, baseStats) => {
        if(path.isComplete) {
          // The Flick handler class will sort out the mess once the path is complete.
          // Note:  if we wanted auto-triggering once the threshold distance were met,
          // we'd need to move its related logic into this method.
          return 'resolve';
        } else {
          const { dir } = determineLockFromStats(baseStats);
          if(calcLockedDistance(path.stats, dir) < params.flick.dirLockDist) {
            return 'reject';
          }
        }
      }
    },
    pathResolutionAction: 'resolve',
    pathInheritance: 'full'
  }
}

export function LongpressContactModelWithShortcut(params: GestureParams, enabledFlicks: boolean, resetForRoaming: boolean): ContactModel {
  const spec = params.longpress;

  return {
    itemPriority: 0,
    pathResolutionAction: 'resolve',
    timer: {
      duration: spec.waitLength,
      expectedResult: true
    },
    pathModel: {
      evaluate: (path) => {
        const stats = path.stats;

        /* The flick-dist threshold may be higher than the noise tolerance,
         * so we don't check the latter if we're in the right direction for
         * the flick shortcut to trigger.
         *
         * The 'indexOf' allows 'n', 'nw', and 'ne' - approx 67.5 degrees on
         * each side of due N in total.
         */
        if((enabledFlicks && spec.permitsFlick(stats.lastSample.item)) && (stats.cardinalDirection?.indexOf('n') != -1 ?? false)) {
          if(stats.netDistance > spec.flickDist) {
            return 'resolve';
          }
        } else if(resetForRoaming) {
          // If roaming, reject if the path has moved significantly (so that we restart)
          if(stats.rawDistance > spec.noiseTolerance || stats.lastSample.item != stats.initialSample.item) {
            return 'reject';
          }
        } else {
          // If not roaming, reject when the base key changes.
          if(stats.lastSample.item != stats.initialSample.item) {
            return 'reject';
          }
        }

        if(path.isComplete) {
          return 'reject';
        }

        return null;
      }
    }
  }
}

export const ModipressContactStartModel: ContactModel = {
  itemPriority: -1,
  pathResolutionAction: 'resolve',
  pathModel: {
    // Consideration of whether the underlying item supports the corresponding
    // gesture will be handled elsewhere.
    evaluate: (path) => 'resolve'
  }
}

export const ModipressContactHoldModel: ContactModel = {
  itemPriority: -1,
  itemChangeAction: 'resolve',
  pathResolutionAction: 'resolve',
  pathModel: {
    evaluate: (path) => {
      if(path.isComplete) {
        return 'reject';
      }
    }
  }
}

export const ModipressContactEndModel: ContactModel = {
  itemPriority: -1,
  itemChangeAction: 'resolve',
  pathResolutionAction: 'resolve',
  pathModel: {
    evaluate: (path) => {
      if(path.isComplete) {
        return 'resolve';
      }
    }
  }
}

export const SimpleTapContactModel: ContactModel = {
  itemPriority: 0,
  itemChangeAction: 'reject',
  pathResolutionAction: 'resolve',
  pathModel: {
    evaluate: (path) => {
      if(path.isComplete && !path.wasCancelled) {
        return 'resolve';
      }
    }
  }
}

export const SubkeySelectContactModel: ContactModel = {
  itemPriority: 0,
  pathResolutionAction: 'resolve',
  pathModel: {
    evaluate: (path) => {
      if(path.isComplete && !path.wasCancelled) {
        return 'resolve';
      }
    }
  }
}
// #endregion

// #region Gesture-stage model definitions

// Note:  as specified below, most of the raw specs actually need access to KeyElement typing.
// That only becomes relevant with some of the modifier functions in the `gestureSetForLayout`
// func at the top.
type GestureModel<Type> = specs.GestureModel<Type>;

export const SpecialKeyStartModel: GestureModel<KeyElement> = {
  id: 'special-key-start',
  resolutionPriority: 0,
  contacts : [
    {
      model: {
        ...InstantContactResolutionModel,
        allowsInitialState: (incoming, dummy, baseItem) => {
          // TODO:  needs better abstraction, probably.

          // But, to get started... we can just use a simple hardcoded approach.
          const modifierKeyIds = ['K_LOPT', 'K_ROPT', 'K_BKSP'];
          for(const modKeyId of modifierKeyIds) {
            if(baseItem?.key.spec.id == modKeyId) {
              return true;
            }
          }

          return false;
        }
      },
      endOnResolve: false  // keyboard-selection longpress - would be nice to not need to lift the finger
                           // in app/browser form.
    }
  ],
  resolutionAction: {
    type: 'chain',
    next: 'special-key-end',
    item: 'current'
  }
}

export const SpecialKeyEndModel: GestureModel<any> = {
  id: 'special-key-end',
  resolutionPriority: 0,
  contacts : [
    {
      model: {
        ...SimpleTapContactModel,
        itemChangeAction: 'resolve'
      },
      endOnResolve: true,
    }
  ],
  resolutionAction: {
    type: 'complete',
    item: 'none'
  }
}

/**
 * The base model for longpresses, with considerable configurability.
 *
 * @param params         The common gesture configuration object for the gesture set under construction.
 * @param allowShortcut  If `true` and certain conditions are also met, enables an 'up-flick shortcut' to
 *                       bypass the longpress timer.
 *
 *                       Conditions:
 *                       - the key has no northish flicks (nw, n, ne)
 *                       - the common gesture configuration permits the shortcut where supported
 * @param allowRoaming   Indicates whether "roaming touch" mode should be supported.
 */
export function longpressModelWithShortcut(params: GestureParams, allowShortcut: boolean, allowRoaming: boolean): GestureModel<any> {
  const base: GestureModel<any> = {
    id: 'longpress',
    resolutionPriority: 0,
    contacts: [
      {
        model: {
          ...LongpressContactModelWithShortcut(params, allowShortcut, allowRoaming),
          itemPriority: 1,
          pathInheritance: 'chop'
        },
        endOnResolve: false
      }, {
        model: InstantContactRejectionModel
      }
    ],
    resolutionAction: {
      type: 'chain',
      next: 'subkey-select',
      selectionMode: 'none',
      item: 'none'
    },
  }

  if(allowRoaming) {
    return {
      ...base,
      rejectionActions: {
        path: {
          type: 'replace',
          replace: 'longpress-roam'
        }
      }
    }
  } else {
    return base;
  }
}

/**
 * For use for transitioning out of roaming-touch.
 */
export function longpressModelAfterRoaming(params: GestureParams): GestureModel<any> {
  // The longpress-shortcut is always disabled for keys reached by roaming (param 2)
  // Only used when roaming is permitted; continued roaming should be allowed. (param 3)
  const base = longpressModelWithShortcut(params, false, true);

  return {
    ...base,
    id: 'longpress-roam'
  }
}

export function flickStartModel(params: GestureParams): GestureModel<any> {
  return {
    id: 'flick-start',
    resolutionPriority: 3,
    contacts: [
      {
        model: flickStartContactModel(params)
      }
    ],
    resolutionAction: {
      type: 'chain',
      item: 'none',
      next: 'flick-mid',
    },
  }
}

export function flickMidModel(params: GestureParams): GestureModel<any> {
  return {
    id: 'flick-mid',
    resolutionPriority: 0,
    contacts: [
      {
        model: flickMidContactModel(params),
        endOnReject: true,
      }, {
        model: InstantContactRejectionModel,
        resetOnResolve: true,
      }
    ],
    rejectionActions: {
      // Only 'rejects' in this form if the path is completed before direction-locking state.
      path: {
        type: 'replace',
        replace: 'flick-reset-end'
      }
    },
    resolutionAction: {
      type: 'chain',
      item: 'none',
      next: 'flick-end'
    },
    sustainWhenNested: true
  }
}

// exists to trigger a reset
export function flickResetModel(params: GestureParams): GestureModel<any> {
  return {
    id: 'flick-reset',
    resolutionPriority: 1,
    contacts: [
      {
        model: {
          ...InstantContactResolutionModel,
          pathInheritance: 'full'
        },
      }
    ],
    resolutionAction: {
      type: 'chain',
      next: 'flick-mid'
    }
  };
}

export const FlickResetEndModel: GestureModel<any> = {
  id: 'flick-reset-end',
  resolutionPriority: 1,
  contacts: [],
  sustainTimer: {
    duration: 0,
    expectedResult: true
  },
  resolutionAction: {
    type: 'complete',
    item: 'base'
  },
  sustainWhenNested: true
};

export function flickEndModel(params: GestureParams): GestureModel<any> {
  return {
    id: 'flick-end',
    resolutionPriority: 0,
    contacts: [
      {
        model: flickEndContactModel(params)
      },
      {
        model: InstantContactResolutionModel,
        resetOnResolve: true
      }
    ],
    rejectionActions: {
      path: {
        type: 'replace',
        replace: 'flick-reset'
      }
    },
    resolutionAction: {
      type: 'complete',
      item: 'current'
    },
    sustainWhenNested: true
  }
}

export function multitapStartModel(params: GestureParams): GestureModel<any> {
  return {
    id: 'multitap-start',
    resolutionPriority: 2,
    contacts: [
      {
        model: {
          ...InstantContactResolutionModel,
          itemPriority: 1,
          pathInheritance: 'reject',
          allowsInitialState(incomingSample, comparisonSample, baseItem) {
            return incomingSample.item == baseItem;
          },
        },
      }
    ],
    sustainTimer: {
      duration: params.multitap.waitLength,
      expectedResult: false,
      baseItem: 'base'
    },
    resolutionAction: {
      type: 'chain',
      next: 'multitap-end',
      item: 'current'
    }
  }
}

export function multitapEndModel(params: GestureParams): GestureModel<any> {
  return {
    id: 'multitap-end',
    resolutionPriority: 2,
    contacts: [
      {
        model: {
          ...SimpleTapContactModel,
          itemPriority: 1,
          timer: {
            duration: params.multitap.holdLength,
            expectedResult: false
          }
        },
        endOnResolve: true
      }, {
        model: InstantContactResolutionModel,
        resetOnResolve: true
      }
    ],
    rejectionActions: {
      timer: {
        type: 'replace',
        replace: 'simple-tap'
      }
    },
    resolutionAction: {
      type: 'chain',
      next: 'multitap-start',
      item: 'none'
    }
  }
}

export function initialTapModel(params: GestureParams): GestureModel<any> {
  return {
    id: 'initial-tap',
    resolutionPriority: 1,
    contacts: [
      {
        model: {
          ...SimpleTapContactModel,
          pathInheritance: 'chop',
          itemPriority: 1,
          timer: {
            duration: params.multitap.holdLength,
            expectedResult: false
          },
        },
        endOnResolve: true
      }, {
        model: InstantContactResolutionModel,
        resetOnResolve: true
      }
    ],
    sustainWhenNested: true,
    rejectionActions: {
      timer: {
        type: 'replace',
        replace: 'simple-tap'
      }
    },
    resolutionAction: {
      type: 'chain',
      next: 'multitap-start',
      item: 'current'
    }
  }
}

export const SimpleTapModel: GestureModel<any> = {
  id: 'simple-tap',
  resolutionPriority: 1,
  contacts: [
    {
      model: {
        ...SimpleTapContactModel,
        pathInheritance: 'chop',
        itemPriority: 1
      },
      endOnResolve: true
    }, {
      model: InstantContactResolutionModel,
      resetOnResolve: true
    }
  ],
  sustainWhenNested: true,
  resolutionAction: {
    type: 'complete',
    item: 'current'
  }
}

export function initialTapModelWithReset(params: GestureParams): GestureModel<any> {
  const base = initialTapModel(params);
  return {
    ...base,
    rejectionActions: {
      ...base.rejectionActions,
      item: {
        type: 'replace',
        replace: 'initial-tap'
      }
    }
  }
}

export const SimpleTapModelWithReset: GestureModel<any> = {
  ...SimpleTapModel,
  rejectionActions: {
    ...SimpleTapModel.rejectionActions,
    item: {
      type: 'replace',
      replace: 'simple-tap'
    }
  }
}

export const SubkeySelectModel: GestureModel<any> = {
  id: 'subkey-select',
  resolutionPriority: 0,
  contacts: [
    {
      model: {
        ...SubkeySelectContactModel,
        pathInheritance: 'full',
        itemPriority: 1
      },
      endOnResolve: true,
      endOnReject: true
    }
  ],
  resolutionAction: {
    type: 'complete',
    item: 'current'
  },
  sustainWhenNested: true
}

export const ModipressStartModel: GestureModel<KeyElement> = {
  id: 'modipress-start',
  resolutionPriority: 5,
  contacts: [
    {
      model: {
        ...ModipressContactStartModel,
        allowsInitialState(incomingSample, comparisonSample, baseItem) {
          return keySupportsModipress(baseItem);
        },
        itemChangeAction: 'reject',
        itemPriority: 1
      }
    }
  ],
  resolutionAction: {
    type: 'chain',
    next: 'modipress-hold',
    selectionMode: 'modipress',
    item: 'current' // return the modifier key ID so that we know to shift to it!
  }
}

export function modipressHoldModel(params: GestureParams): GestureModel<any> {
  return {
    id: 'modipress-hold',
    resolutionPriority: 5,
    contacts: [
      {
        model: {
          ...ModipressContactHoldModel,
          itemChangeAction: 'reject',
          pathInheritance: 'full',
          timer: {
            duration: params.multitap.holdLength,
            expectedResult: true,
            // If entered due to 'reject' on 'modipress-multitap-end',
            // we want to immediately resolve.
            inheritElapsed: true
          }
        }
      }, {
        // If a new touchpoint comes in while in this state, lock in the modipress
        // and prevent multitapping on it, as a different key has been tapped before
        // the multitap base key since the latter's release.
        model: {
          ...InstantContactResolutionModel,
        },
        // The incoming tap belongs to a different gesture; we just care to know that it
        // happened.
        resetOnResolve: true
      }
    ],
    // To be clear:  any time modipress-hold is triggered and the timer duration elapses,
    // we disable any potential to multitap on the modipress key.
    resolutionAction: {
      type: 'chain',
      next: 'modipress-end',
      selectionMode: 'modipress',
      // Key was already emitted from the 'modipress-start' stage.
      item: 'none'
    },
    rejectionActions: {
      path: {
        type: 'replace',
        // Because SHIFT -> CAPS multitap is a thing.  Shift gets handled as a modipress first.
        // Modipresses resolve before multitaps... unless there's a model designed to handle & disambiguate both.
        replace: 'modipress-end-multitap-transition'
      }
    }
  }
}

export const ModipressMultitapTransitionModel: GestureModel<any> = {
  id: 'modipress-end-multitap-transition',
  resolutionPriority: 5,
  contacts: [
    // None.  This exists as an intermediate state to transition from
    // a basic modipress into a combined multitap + modipress.
  ],
  sustainTimer: {
    duration: 0,
    expectedResult: true
  },
  resolutionAction: {
    type: 'chain',
    next: 'modipress-multitap-start',
    item: 'none'
  }
}

export const ModipressEndModel: GestureModel<any> = {
  id: 'modipress-end',
  resolutionPriority: 5,
  contacts: [
    {
      model: {
        ...ModipressContactEndModel,
        itemChangeAction: 'reject',
        pathInheritance: 'full'
      }
    }
  ],
  resolutionAction: {
    type: 'complete',
    // Key was already emitted from the 'modipress-start' stage.
    item: 'none',
    awaitNested: true
  }
}

export function modipressMultitapStartModel(params: GestureParams): GestureModel<KeyElement> {
  return {
    id: 'modipress-multitap-start',
    resolutionPriority: 6,
    contacts: [
      {
        model: {
          ...ModipressContactStartModel,
          pathInheritance: 'reject',
          allowsInitialState(incomingSample, comparisonSample, baseItem) {
            if(incomingSample.item != baseItem) {
              return false;
            }

            return keySupportsModipress(baseItem);
          },
          itemChangeAction: 'reject',
          itemPriority: 1
        }
      }
    ],
    sustainTimer: {
      duration: params.multitap.waitLength,
      expectedResult: false,
      baseItem: 'base'
    },
    resolutionAction: {
      type: 'chain',
      next: 'modipress-multitap-end',
      selectionMode: 'modipress',
      item: 'current' // return the modifier key ID so that we know to shift to it!
    }
  }
}

export function modipressMultitapEndModel(params: GestureParams): GestureModel<any> {
  return {
    id: 'modipress-multitap-end',
    resolutionPriority: 5,
    contacts: [
      {
        model: {
          ...ModipressContactEndModel,
          itemChangeAction: 'reject',
          pathInheritance: 'full',
          timer: {
            duration: params.multitap.holdLength,
            expectedResult: false
          }
        }
      }, {
        model: {
          // If a new touchpoint comes in while in this state, lock in the modipress
          // and prevent multitapping on it, as a different key has been tapped before
          // the multitap base key since the latter's release.
          ...InstantContactRejectionModel
        },
        // The incoming tap belongs to a different gesture; we just care to know that it
        // happened.
        resetOnResolve: true
      }
    ],
    resolutionAction: {
      type: 'chain',
      // Because SHIFT -> CAPS multitap is a thing.  Shift gets handled as a modipress first.
      next: 'modipress-multitap-start',
      // Key was already emitted from the 'modipress-start' stage.
      item: 'none'
    },
    rejectionActions: {
      timer: {
        type: 'replace',
        replace: 'modipress-multitap-lock-transition'
      },
      path: {
        type: 'replace',
        replace: 'modipress-multitap-lock-transition'
      }
    }
  }
}

export function modipressMultitapLockModel(): GestureModel<any> {
  return {
    id: 'modipress-multitap-lock-transition',
    resolutionPriority: 5,
    contacts: [
      // This exists as an intermediate state to transition from
      // a modipress-multitap into a plain modipress without further
      // multitap rota behavior.
      {
        model: {
          ...InstantContactResolutionModel,
          pathResolutionAction: 'resolve' // doesn't end the path; just lets it continue.
        },
      }
    ],
    resolutionAction: {
      type: 'chain',
      next: 'modipress-end',
      selectionMode: 'modipress',
      item: 'none'
    }
  };
}
// #endregion