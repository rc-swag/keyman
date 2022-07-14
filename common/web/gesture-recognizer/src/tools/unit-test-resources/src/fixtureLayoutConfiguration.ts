namespace Testing {
  /*
   * Cross-reference all enum definitions in this class with those of host-fixture/gestureHost.css.
   */

  export enum DeviceLayoutClass {
    MOBILE_PHONE_PAGE = "screen2",
    EMBEDDED_APP_PAGE = "screen4",
    DESKTOP_MID_PAGE = "screen3",
    DESKTOP_BOTTOM_RIGHT = "screen1"
  }

  export enum RoamingLayoutClass {
    TOP_OVERFLOW = "bounds1",
    LOOSE_OMNI_OVERFLOW = "bounds2",
    EXTENDED_POPUP = "bounds3",
    NONE = "bounds4"
  }

  export enum ReceiverLayoutClass {
    KEYBOARD_STYLE = "full",
    SUBKEY_MENU_STYLE = "popup"
  }

  export enum SafeLayoutClass {
    DEFAULT = "safe-default",
    LOOSE = "safe-loose",
    GENEROUS = "safe-generous"
  }

  export class FixtureLayoutConfig {
    public deviceStyle:   DeviceLayoutClass;
    public roamingStyle:  RoamingLayoutClass;
    public receiverStyle: ReceiverLayoutClass;
    public safeZoneStyle: SafeLayoutClass;

    constructor()
    constructor(deviceStyle?: DeviceLayoutClass,
                roamingStyle?: RoamingLayoutClass,
                receiverStyle?: ReceiverLayoutClass,
                safeZoneStyle?: SafeLayoutClass);
    constructor(deviceStyle?: DeviceLayoutClass,
                roamingStyle?: RoamingLayoutClass,
                receiverStyle?: ReceiverLayoutClass,
                safeZoneStyle?: SafeLayoutClass) {
      this.deviceStyle   = deviceStyle   ?? DeviceLayoutClass.MOBILE_PHONE_PAGE;
      this.roamingStyle  = roamingStyle  ?? RoamingLayoutClass.TOP_OVERFLOW;
      this.receiverStyle = receiverStyle ?? ReceiverLayoutClass.KEYBOARD_STYLE;
      // This should match the -recording page- default, which may not be the true module-default.
      this.safeZoneStyle = safeZoneStyle ?? SafeLayoutClass.GENEROUS;
    }

    public asClassList(): string {
      return `${this.deviceStyle} ${this.roamingStyle} ${this.receiverStyle} ${this.safeZoneStyle}`;
    }
  }
}