import { type KeyElement, OSKView, VisualKeyboard } from "keyman/engine/osk";
import { getAbsoluteX, getAbsoluteY } from "keyman/engine/dom-utils";
import { DeviceSpec } from "@keymanapp/keyboard-processor";
import ContextManager from "./contextManager.js";
import { KeymanEngine } from "./keymanEngine.js";

export function setupOskListeners(engine: KeymanEngine, osk: OSKView, contextManager: ContextManager) {
  const focusAssistant = contextManager.focusAssistant;

  osk.on('globeKey', (key, on) => {
    if(on) {
      if(osk.hostDevice.touchable) {
        this.lgMenu = new LanguageMenu(com.keyman.singleton);
        this.lgMenu.show();
      }
    }

    if(osk.vkbd) {
      osk.vkbd.highlightKey(key, false); // never leave the globe key highlighted
    }
  });

  osk.on('hideRequested', (key) => {
    if(osk) {
      contextManager.focusAssistant.setMaintainingFocus(false);
      osk.startHide(true);
      keyman.domManager.lastActiveElement = null;
    }
  });

  osk.on('onhide', (hiddenByUser) => {
    // If hidden by the UI, be sure to restore the focus
    if(hiddenByUser) {
      contextManager.activeTarget?.focus();
    }
  });

  osk.on('showBuild', () => {
    internalAlert('KeymanWeb Version '+keymanweb['version']+'.'+keymanweb['build']+'<br /><br />'
        +'<span style="font-size:0.8em">Copyright &copy; 2021 SIL International</span>');
  });

  osk.on('dragMove', async (promise) => {
    focusAssistant.restoringFocus = true;

    await promise;

    keymanweb.domManager.focusLastActiveElement();

    focusAssistant.restoringFocus = false;
    focusAssistant.setMaintainingFocus(false);
  });

  osk.on('resizeMove', async (promise) => {
    focusAssistant.restoringFocus = true;

    await promise;
    keymanweb.domManager.focusLastActiveElement();

    focusAssistant.restoringFocus = false;
    focusAssistant.setMaintainingFocus(false);
  });

  osk.on('pointerInteraction', async (promise) => {
   // On event start
   focusAssistant.setMaintainingFocus(true);

   // The original did nothing when the pointer left the OSK's bounds.  Possible bug?
   // await promise;  // should we wish to change that.
  });
}