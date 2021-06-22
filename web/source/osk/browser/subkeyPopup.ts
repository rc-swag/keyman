/// <reference path="oskSubKey.ts" />

namespace com.keyman.osk.browser {
  export class SubkeyPopup {
    public readonly element: HTMLDivElement;
    public readonly shim: HTMLDivElement;
    
    private baseKey: KeyElement;
    private callout: HTMLDivElement;

    constructor(vkbd: VisualKeyboard, e: KeyElement) {
      let keyman = com.keyman.singleton;
      
      // A tag we directly set on a key element during its construction.
      let subKeySpec: OSKKeySpec[] = e['subKeys'];

      // The holder is position:fixed, but the keys do not need to be, as no scrolling
      // is possible while the array is visible.  So it is simplest to let the keys have
      // position:static and display:inline-block
      var subKeys = this.element = document.createElement('div');
      this.baseKey = e;
      var i;
      subKeys.id='kmw-popup-keys';

      // #3718: No longer prepend base key to popup array

      // Must set position dynamically, not in CSS
      var ss=subKeys.style;
      ss.bottom=(parseInt(e.style.bottom,10)+parseInt(e.style.height,10)+4)+'px';

      // Set key font according to layout, or defaulting to OSK font
      // (copied, not inherited, since OSK is not a parent of popup keys)
      ss.fontFamily=vkbd.fontFamily;

      // Copy the font size from the parent key, allowing for style inheritance
      ss.fontSize=keyman.util.getStyleValue(e,'font-size');
      ss.visibility='hidden';

      var nKeys=subKeySpec.length,nRow,nRows,nCols;
      nRows=Math.min(Math.ceil(nKeys/9),2);
      nCols=Math.ceil(nKeys/nRows);
      if(nRows > 1) {
        ss.width=(nCols*e.offsetWidth+nCols*5)+'px';
      }

      // Add nested button elements for each sub-key
      for(i=0; i<nKeys; i++) {
        var needsTopMargin = false;
        let nRow=Math.floor(i/nCols);
        if(nRows > 1 && nRow > 0) {
          needsTopMargin = true;
        }

        let layer = e['key'].layer;
        if(typeof(layer) != 'string' || layer == '') {
          // Use the currently-active layer.
          layer = vkbd.layerId;
        }
        let keyGenerator = new OSKSubKey(subKeySpec[i], layer);
        let kDiv = keyGenerator.construct(vkbd, <KeyElement> e, needsTopMargin);

        subKeys.appendChild(kDiv);
      }

      // And add a filter to fade main keyboard
      this.shim = document.createElement('div');
      this.shim.id = 'kmw-popup-shim';

      // Highlight the duplicated base key or ideal subkey (if a phone)
      if(vkbd.device.formFactor == 'phone') {
        this.selectDefaultSubkey(vkbd, e, subKeys /* == this.element */);
      }
    }

    reposition(vkbd: VisualKeyboard) {
      let keyman = com.keyman.singleton;

      let subKeys = this.element;
      let e = this.baseKey;

      // And correct its position with respect to that element
      let ss=subKeys.style;
      var x = dom.Utils.getAbsoluteX(e)+0.5*(e.offsetWidth-subKeys.offsetWidth);
      var xMax = keyman.osk.getWidth() - subKeys.offsetWidth;

      if(x > xMax) {
        x=xMax;
      }
      if(x < 0) {
        x=0;
      }
      ss.left=x+'px';

      // Make the popup keys visible
      ss.visibility='visible';

      // For now, should only be true (in production) when keyman.isEmbedded == true.
      let constrainPopup = keyman.isEmbedded;

      let cs = getComputedStyle(subKeys);
      let oskHeight = keyman.osk.getHeight();
      let bottomY = parseInt(cs.bottom, 10);
      let popupHeight = parseInt(cs.height, 10);

      let delta = 0;
      if(popupHeight + bottomY > oskHeight && constrainPopup) {
        delta = popupHeight + bottomY - oskHeight;
        ss.bottom = (bottomY - delta) + 'px';
      }

      // Add the callout
      if(vkbd.device.formFactor != 'phone' || vkbd.device.OS != 'iOS') {
        this.callout = this.addCallout(e, delta);
      }
    }

    /**
     * Add a callout for popup keys (if KeymanWeb on a phone device)
     *
     * @param   {Object}  key   HTML key element
     * @return  {Object}        callout object
     */
    addCallout(key: KeyElement, delta?: number): HTMLDivElement {
      let keyman = com.keyman.singleton;

      delta = delta || 0;

      let calloutHeight = key.offsetHeight - delta;

      if(calloutHeight > 0) {
        var cc = document.createElement('div'), ccs = cc.style;
        cc.id = 'kmw-popup-callout';
        keyman.osk._Box.appendChild(cc);

        // Create the callout
        var xLeft = key.offsetLeft,
            xTop = key.offsetTop + delta,
            xWidth = key.offsetWidth,
            xHeight = calloutHeight;

        // Set position and style
        ccs.top = (xTop-6)+'px'; ccs.left = xLeft+'px';
        ccs.width = xWidth+'px'; ccs.height = (xHeight+6)+'px';

        // Return callout element, to allow removal later
        return cc;
      } else {
        return null;
      }
    }

    selectDefaultSubkey(vkbd: VisualKeyboard, baseKey: KeyElement, popupBase: HTMLElement) {
      var bk: KeyElement;
      let subkeys = baseKey['subKeys'];
      for(let i=0; i < subkeys.length; i++) {
        let skSpec = subkeys[i];
        let skElement = <KeyElement> popupBase.childNodes[i].firstChild;

        // Preference order:
        // #1:  if a default subkey has been specified, select it.  (pending, for 15.0+)
        // #2:  if no default subkey is specified, default to a subkey with the same 
        //      key ID and layer / modifier spec.
        //if(skSpec.isDefault) { TODO for 15.0
        //  bk = skElement;
        //  break;
        //} else
        if(!baseKey.key || !baseKey.key.spec) {
          continue;
        }

        if(skSpec.elementID == baseKey.key.spec.elementID) {
          bk = skElement;
          break; // Best possible match has been found.  (Disable 'break' once above block is implemented.)
        }
      }

      if(bk) {
        vkbd.keyPending = bk;
        // Subkeys never get key previews, so we can directly highlight the subkey.
        bk.key.highlight(true);
      }
    }

    clear() {
      // Remove the displayed subkey array, if any
      if(this.element.parentNode) {
        this.element.parentNode.removeChild(this.element);
      }

      if(this.shim.parentNode) {
        this.shim.parentNode.removeChild(this.shim);
      }

      if(this.callout && this.callout.parentNode) {
        this.callout.parentNode.removeChild(this.callout);
      }
    }
  }
}