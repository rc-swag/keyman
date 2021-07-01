/// <reference path="resizeBar.ts" />
/// <reference path="titleBar.ts" />
/// <reference path="mouseStartSnapshot.ts" />

namespace com.keyman.osk.layouts {
  export class TargetedFloatLayout {
    titleBar: layouts.TitleBar;
    resizeBar: layouts.ResizeBar;

    private oskView: OSKManager;

    // OSK resizing-event state fields
    private _VMoveX: number;
    private _VMoveY: number;
    private _ResizeMouseX: number;
    private _ResizeMouseY: number;
    private _VOriginalWidth: number;
    private _VOriginalHeight: number;

    // Resize-event temporary storage
    private _mouseStartSnapshot: MouseStartSnapshot;

    public constructor() {
      this.titleBar = new layouts.TitleBar();
      this.resizeBar = new layouts.ResizeBar();

      // Attach handlers to the title bar and resize bar as appropriate.
      this.titleBar.element.onmousedown = this._VMoveMouseDown.bind(this);
      this.resizeBar.handle.onmousedown = this._VResizeMouseDown.bind(this);
      this.resizeBar.handle.onmouseover = this._VResizeMouseOut.bind(this);
      this.resizeBar.handle.onmouseout  = this._VResizeMouseOut.bind(this);
    }

    public get isMovingOrResizing(): boolean {
      return !!this._mouseStartSnapshot;
    }

    attachToView(view: OSKManager) {
      if(this.oskView) {
        throw new Error("This layout is already attached to an OSK.");
      }

      this.oskView = view;
    }

    /**
     * Function     _VResizeMouseOver, _VResizeMouseOut
     * Scope        Private
     * @param       {Object}      e      event
     * Description  Process end of resizing of KMW UI
     */
    private _VResizeMouseOut(e: Event) {
      if(!e) {
        return false;
      }

      var r=this.oskView.getRect();
      this.oskView.setSize(r.width, r.height, true);

      e.preventDefault();
      e.cancelBubble = true;
      return false;
    }

    private _VResizeMouseOver(e: Event) {
      this._VResizeMouseOut(e);
    }

    /**
     * Function     _VResizeMouseDown
     * Scope        Private
     * @param       {Object}      e      event
     * Description  Process resizing of KMW UI
     */
    private _VResizeMouseDown(e: MouseEvent) {
      let keymanweb = com.keyman.singleton;

      keymanweb.uiManager.justActivated = true;
      if(!e) {
        return true;
      }

      var Lposx, Lposy;
      if (e.pageX) {
        Lposx = e.pageX;
        Lposy = e.pageY;
      } else if(e.clientX) {
        Lposx = e.clientX + document.body.scrollLeft;
        Lposy = e.clientY + document.body.scrollTop;
      }

      this._ResizeMouseX = Lposx;
      this._ResizeMouseY = Lposy;

      if(!this._mouseStartSnapshot) { // I1472 - Dragging off edge of browser window causes muckup
        this._mouseStartSnapshot = new MouseStartSnapshot(e);
      }

      this._VOriginalWidth = this.oskView.vkbd.kbdDiv.offsetWidth;
      this._VOriginalHeight = this.oskView.vkbd.kbdDiv.offsetHeight;

      document.onmousemove = this._VResizeMouseMove.bind(this);
      document.onmouseup = this._VResizeMoveMouseUp.bind(this);

      if(document.body.style.cursor) {
        document.body.style.cursor = 'se-resize';
      }

      e.preventDefault();
      e.cancelBubble = true;
      return false;
    }

    /**
     * Function     _VResizeMouseMove
     * Scope        Private
     * @param       {Object}      e      event
     * Description  Process mouse movement during resizing of OSK
     */
    private _VResizeMouseMove(e: MouseEvent) {
      if(!e) {
        return true;
      }

      if(!this._mouseStartSnapshot.matchesCausingClick(e)) { // I1472 - Dragging off edge of browser window causes muckup
        return this._VResizeMoveMouseUp(e);
      } else {
        var Lposx, Lposy;

        if (e.pageX) {
          Lposx = e.pageX;
          Lposy=e.pageY;
        } else if (e.clientX) {
          Lposx = e.clientX + document.body.scrollLeft;
          Lposy = e.clientY + document.body.scrollTop;
        }

        var newWidth=(this._VOriginalWidth + Lposx - this._ResizeMouseX),
            newHeight=(this._VOriginalHeight + Lposy - this._ResizeMouseY);

        // Set the smallest and largest OSK size
        if(newWidth < 0.2*screen.width) {
          newWidth = 0.2*screen.width;
        }
        if(newHeight < 0.1*screen.height) {
          newHeight = 0.1*screen.height;
        }
        if(newWidth > 0.9*screen.width) {
          newWidth=0.9*screen.width;
        }
        if(newHeight > 0.5*screen.height) {
          newWidth=0.5*screen.height;
        }

        // Explicitly set OSK width, height,  and font size - cannot safely rely on scaling from font
        this.oskView.setSize(newWidth, newHeight);

        e.preventDefault();
        e.cancelBubble = true;
        return false;
      }
    }

    /**
     * Function     _VMoveMouseDown
     * Scope        Private
     * @param       {Object}      e      event
     * Description  Process mouse down on OSK
     */
    private _VMoveMouseDown(e: MouseEvent) {
      let keymanweb = com.keyman.singleton;

      keymanweb.uiManager.justActivated = true;
      if(!e) {
        return true;
      }

      var Lposx, Lposy;
      if (e.pageX) {
        Lposx = e.pageX;
        Lposy = e.pageY;
      } else if (e.clientX) {
        Lposx = e.clientX + document.body.scrollLeft;
        Lposy = e.clientY + document.body.scrollTop;
      }

      if(!this._mouseStartSnapshot) { // I1472 - Dragging off edge of browser window causes muckup
        this._mouseStartSnapshot = new MouseStartSnapshot(e);
      }

      this._VMoveX = Lposx - this.oskView._Box.offsetLeft;
      this._VMoveY = Lposy - this.oskView._Box.offsetTop;

      if(keymanweb.isCJK()) {
        this.titleBar.setPinCJKOffset();
      }

      document.onmousemove = this._VMoveMouseMove.bind(this);
      document.onmouseup = this._VResizeMoveMouseUp.bind(this);
      if(document.body.style.cursor) {
        document.body.style.cursor = 'move';
      }

      e.preventDefault();
      e.cancelBubble = true;
      return false;
    }

    /**
     * Process mouse drag on OSK
     *
     * @param       {Object}      e      event
     */
    private _VMoveMouseMove(e: MouseEvent) {
      if(!e) {
        return true;
      }

      if(this.oskView.noDrag) {
        return true;
      }

      this.oskView.userPositioned = true;
      this.titleBar.showPin(true);

      if(!this._mouseStartSnapshot.matchesCausingClick(e)) { // I1472 - Dragging off edge of browser window causes muckup
        return this._VResizeMoveMouseUp(e);
      } else {
        var Lposx, Lposy;

        if (e.pageX) {
          Lposx = e.pageX;
          Lposy = e.pageY;
        } else if (e.clientX) {
          Lposx = e.clientX + document.body.scrollLeft;
          Lposy = e.clientY + document.body.scrollTop;
        }

        this.oskView._Box.style.left = (Lposx-this._VMoveX)+'px';
        this.oskView._Box.style.top = (Lposy-this._VMoveY)+'px';

        var r=this.oskView.getRect();
        this.oskView.setSize(r.width, r.height, true);
        this.oskView.x = r.left;
        this.oskView.y = r.top;

        e.preventDefault();
        e.cancelBubble = true;
        return false;
      }
    }

    /**
     * Function     _VResizeMoveMouseUp
     * Scope        Private
     * @param       {Object}      e      event
     * Description  Process mouse up during resizing of KMW UI
     */
    private _VResizeMoveMouseUp(e: MouseEvent) {
      let keymanweb = com.keyman.singleton;

      if(!e) {
        return true;
      }

      if(this.oskView.vkbd) {
        this.oskView.vkbd.currentKey=null;
      }

      this._mouseStartSnapshot.restore();
      this._mouseStartSnapshot = null;

      keymanweb.domManager.focusLastActiveElement();

      keymanweb.uiManager.justActivated = false;
      keymanweb.uiManager.setActivatingUI(false);

      if(this.oskView.vkbd) {
        this._VOriginalWidth = this.oskView.vkbd.kbdDiv.offsetWidth;
        this._VOriginalHeight = this.oskView.vkbd.kbdDiv.offsetHeight;
      }

      this.oskView.doResizeMove();
      this.oskView.saveCookie();

      e.preventDefault();
      e.cancelBubble = true;
      return false;
    }
  }
}