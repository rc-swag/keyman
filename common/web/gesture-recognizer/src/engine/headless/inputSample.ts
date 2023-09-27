/**
 * We want these to be readily and safely converted to and from
 * JSON (for unit test use and development)
 */
export interface InputSample<Type, StateToken = any> {
  /**
   * Represents the x-coordinate of the input sample
   * in 'client' / viewport coordinates.
   */
  clientX?: number;

  /**
   * Represents the x-coordinate of the input sample in
   * coordinates relative to the recognizer's `targetRoot`.
   */
  targetX: number;

  /**
   * Represents the y-coordinate of the input sample
   * in 'client' / viewport coordinates.
   */
  clientY?: number;

  /**
   * Represents the y-coordinate of the input sample in
   * coordinates relative to the recognizer's `targetRoot`.
   */
  targetY: number;

  /**
   * Represents the timestamp at which the input was observed
   * (in ms)
   */
  t: number;

  /**
   * The UI/UX 'item' underneath the touchpoint for this sample.
   */
  item?: Type;

  /**
   * A token identifying the state of the consuming system associated
   * with this sample's `GestureSource`, if any such association exists.
   */
  stateToken?: StateToken
}

export type InputSampleSequence<Type, StateToken> = InputSample<Type, StateToken>[];

export function isAnInputSample<Type, StateToken>(obj: any): obj is InputSample<Type, StateToken> {
  return 'targetX' in obj && 'targetY' in obj && 't' in obj;
}