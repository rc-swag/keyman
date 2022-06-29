namespace com.keyman.osk {

  export class PaddedZoneSource implements RecognitionZoneSource {
    private readonly root: RecognitionZoneSource;

    /**
     * [0]: y (top)
     * [1]: x (left)
     * [2]: height (top+bottom)
     * [3]: width (left+right)
     */
    private edgePadding: number[];

    // Positive values 'shrink' the new zone compared to the old zone, while negative ones
    // 'expand' it instead.
    constructor(rootZoneSource: RecognitionZoneSource, ...edgePadding: number[]) {
      this.root = rootZoneSource;
      // In case it isn't yet defined.
      edgePadding = edgePadding || [0, 0, 0, 0];

      if(typeof edgePadding == 'number') {
        this.edgePadding = [edgePadding, edgePadding, 2 * edgePadding, 2 * edgePadding];
        return;
      } else {
        // Modeled after CSS styling definitions... just with preprocessed numbers, not strings.
        switch(edgePadding.length) {
          case 1:
            // all sides equal
            const val = edgePadding[0];
            this.edgePadding = [val, val, 2 * val, 2 * val];
            break;
          case 2:
            // top & bottom, left & right
            const yVal = edgePadding[0];
            const xVal = edgePadding[1];
            this.edgePadding = [yVal, xVal, 2 * yVal, 2 * xVal];
            break;
          case 3:
            // top, left & right, bottom
            this.edgePadding = [edgePadding[0],
                                edgePadding[1],
                                edgePadding[0] + edgePadding[2],
                                2*edgePadding[1]];
          case 4:
            // top, right, bottom, left
            this.edgePadding = [edgePadding[0],
                                edgePadding[3], // we want the `left` entry internally, not the `right`.
                                edgePadding[0] + edgePadding[2],
                                edgePadding[1] + edgePadding[3]];
            break;
          default:
            throw new Error("Invalid parameter - must be an array of type `number` with length from 1 to 4.");
        }
      }
    }

    getBoundingClientRect(): DOMRect {
      const rootZone = this.root.getBoundingClientRect();

      return DOMRect.fromRect({
        y: rootZone.y + this.edgePadding[0],
        x: rootZone.x + this.edgePadding[1],
        height: rootZone.height - this.edgePadding[2],
        width: rootZone.width   - this.edgePadding[3]
      });
    }
  }
}