/// <reference path="recognitionZoneSource.ts" />
/// <reference path="viewportZoneSource.ts" />

namespace com.keyman.osk {
  type Nonoptional<Type> = {
    [Property in keyof Type]-?: Type[Property];
  };

  export interface GestureRecognizerConfiguration {
    /**
     * Specifies the element that mouse input listeners should be attached to.  If
     * not specified, `eventRoot` will be set equal to `targetRoot`.
     */
    readonly mouseEventRoot?: HTMLElement;

    /**
     * Specifies the element that touch input listeners should be attached to.  If
     * not specified, `eventRoot` will be set equal to `targetRoot`.
     */
    readonly touchEventRoot?: HTMLElement;

    /**
     * Specifies the most specific common ancestor element of any event target
     * that the `InputEventEngine` should consider.
     */
    readonly targetRoot: HTMLElement;

    /**
     * A boundary constraining the legal coordinates for supported touchstart and mousedown
     * events.  If not specified, this will be set to `targetRoot`.
     */
    readonly inputStartBounds?: RecognitionZoneSource;

    /**
     * A boundary constraining the maximum range that an ongoing input may travel before it
     * is forceably canceled.  If not specified, this will be set to `targetRoot`.
     */
    readonly maxRoamingBounds?: RecognitionZoneSource;

    /**
     * A boundary constraining the "safe range" for ongoing touch events.  Events that leave a
     * safe boundary that did not start outside its respective "padded" bound will be canceled.
     *
     * If not specified, this will be based on the active viewport, padded internally by 2px on
     * all sides.
     */
    readonly safeBounds?: RecognitionZoneSource;

    /**
     * Used to define a "boundary" slightly more constrained than `safeBounds`.  Events that
     * start within this pixel range from a safe bound will disable that bound for the duration
     * of its corresponding input sequence.  May be a number or an array of 1, 2, or 4 numbers,
     * as with CSS styling.
     *
     * If not specified, this will default to a padding of 3px inside the standard safeBounds.
     */
    readonly safeBoundPadding?: number | number[];

    // TBD:  rip this out.  It should be replaced with an implementation based on the previous
    // four properties WITHIN THIS PR.
    readonly coordConstrainedWithinInteractiveBounds: (coord: InputEventCoordinate) => boolean;
  }

  export interface FinalizedGestureRecognizerConfiguration extends Nonoptional<GestureRecognizerConfiguration> {
    /**
     * A slightly-padded `safeBounds` used to detect proximity of each input-sequence's first
     * coordinate to the `safeBounds`.
     */
    readonly paddedSafeBounds: RecognitionZoneSource;
  }
}