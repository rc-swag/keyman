import { deepCopy } from '@keymanapp/web-utils';

import {
  gestures,
  GestureModelDefs,
  InputSample
} from '@keymanapp/gesture-recognizer';

import { BannerSuggestion } from './banner.js';
import { simpleTapModelWithReset } from "../input/gestures/specsForLayout.js";

export const BannerSimpleTap: gestures.specs.GestureModel<BannerSuggestion> = {
  ...deepCopy(simpleTapModelWithReset()),
  resolutionAction: {
    type: 'complete',
    item: 'current'
  }
};

export const BANNER_GESTURE_SET: GestureModelDefs<BannerSuggestion> = {
  gestures: [
    BannerSimpleTap
  ],
  sets: {
    default: [BannerSimpleTap.id]
  }
}