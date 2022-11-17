import { constants } from '@keymanapp/ldml-keyboard-constants';
import * as r from 'restructure';
import { ElementString } from './element-string.js';
import { StringList } from './string-list.js';

import { KMXFile } from './kmx.js';

// Implementation of file structures from /core/src/ldml/C7043_ldml.md
// Writer in kmx-builder.ts
// Reader in kmx-loader.ts

export class Section {
}

export class GlobalSections {
  // These sections are used by other sections during compilation
  strs: Strs;
  elem: Elem;
  list: List;
}

// 'sect'

export class Sect extends Section {};

// 'bksp' -- see 'tran'

// 'elem'

export class Elem extends Section {
  strings: ElementString[] = [];
  constructor(strs: Strs) {
    super();
    this.strings.push(new ElementString(strs, '')); // C7043: null element string
  }
  allocElementString(strs: Strs, source: string, order?: string, tertiary?: string, tertiary_base?: string, prebase?: string): ElementString {
    let s = new ElementString(strs, source, order, tertiary, tertiary_base, prebase);
    let result = this.strings.find(item => item.isEqual(s));
    if(result === undefined) {
      result = s;
      this.strings.push(result);
    }
    return result;
  }
};

// 'finl' -- see 'tran'

// 'keys'

export enum KeyFlags {
  none = 0,
  extend = constants.keys_flags_extend,  // note, this should be used only when streaming, ignored in-memory
  // additional flags reserved for future use
};

export class KeysItem {
  vkey: number;
  mod: number;
  to: StrsItem;
  flags: KeyFlags;
};

export class Keys extends Section {
  keys: KeysItem[] = [];
};

// 'loca'

export class Loca extends Section {
  locales: StrsItem[] = [];
};

// 'meta'

export enum KeyboardSettings {
  none = 0,
  fallback = constants.meta_settings_fallback_omit,
  transformFailure = constants.meta_settings_transformFailure_omit,
  transformPartial = constants.meta_settings_transformPartial_hide,
};

export enum Meta_NormalizationForm { NFC='NFC', NFD='NFD', other='other' };

export class Meta extends Section {
  author: StrsItem;
  conform: StrsItem;
  layout: StrsItem;
  normalization: StrsItem;
  indicator: StrsItem;
  version: StrsItem; // semver version string, defaults to "0"
  settings: KeyboardSettings;
};

// 'name'

export class Name extends Section {
  names: StrsItem[] = [];
};

// 'ordr'

export class OrdrItem {
  elements: ElementString;
  before: ElementString;
};

export class Ordr extends Section {
  items: OrdrItem[] = [];
};

// 'strs'

export class StrsItem {
  readonly value: string;
  constructor(value: string) {
    this.value = value;
  }
};

export class Strs extends Section {
  strings: StrsItem[] = [ new StrsItem('') ]; // C7043: The null string is always requierd

  allocString(s?: string): StrsItem {
    if(s === undefined || s === null) {
      // undefined or null are always equivalent to empty string, see C7043
      s = '';
    }

    if(typeof s !== 'string') {
      throw new Error('alloc_string: s must be a string, undefined, or null.');
    }

    let result = this.strings.find(item => item.value === s);
    if(result === undefined) {
      result = new StrsItem(s);
      this.strings.push(result);
    }
    return result;
  }
};

// 'tran'

export enum TranItemFlags {
  none = 0,
  error = constants.tran_flags_error,
};

export class TranItem extends Section {
  from: ElementString;
  to: StrsItem;
  before: ElementString;
  flags: TranItemFlags;
};

export class Tran extends Section {
  items: TranItem[] = [];
  get id() {
    return constants.section.tran;
  }
};

// alias types for 'bksp', 'finl'

export class Bksp extends Tran {
  override get id() {
    return constants.section.bksp;
  }
};
export class BkspItem extends TranItem {};
export type BkspItemFlags = TranItemFlags;
export const BkspItemFlags = TranItemFlags;

export class Finl extends Tran {
  override get id() {
    return constants.section.finl;
  }
};
export class FinlItem extends TranItem {};
export type FinlItemFlags = TranItemFlags;
export const FinlItemFlags = TranItemFlags;

// 'vkey'

export class VkeyItem {
  vkey: number;
  target: number;
}

export class Vkey extends Section {
  vkeys: VkeyItem[] = [];
};

// 'disp'
export class DispItem {
  to: StrsItem;
  display: StrsItem;
};

export class Disp extends Section {
  baseCharacter: StrsItem;
  disps: DispItem[] = [];
};

// 'layr'

/**
 * In-memory `<layers>`
 */
export class LayrList {
  flags: number;
  hardware: StrsItem;
  /**
   * Index into Layr.layers
   */
  layerIndex: number;
  count: number;
};

/**
 * In-memory `<layer>`
 */
 export class LayrEntry {
  id: StrsItem;
  modifier: StrsItem;
  /**
   * index into Layr.rows
   */
  rowIndex: number;
  count: number;
};

/**
 * In-memory `<row>`
 */
 export class LayrRow {
  /**
   * index into Layr.vkeys
   */
  keyIndex: number;
  count: number;
};

export class Layr extends Section {
  lists: LayrList[] = [];
  layers: LayrEntry[] = [];
  rows: LayrRow[] = [];
  /**
   * each item is a vkey id
   */
  vkeys: number[] = [];
};

export class Key2Keys {
  vkey: number;
  to: StrsItem;
  flags: number;
  id: StrsItem;
  switch: StrsItem;
  width: number;
  longPress: StringList;
  longPressDefault: StrsItem;
  multiTap: StringList;
  flicks: number;
};

export class Key2Flicks {
  count: number;
  flick: number;
  id: StrsItem;
};

export class Key2Flick {
  directions: StringList;
  flags: number;
  to: StrsItem;
};

export class Key2 extends Section {
  keyCount: number;
  flicksCount: number;
  flickCount: number;
  keys: Key2Keys[] = [];
  flicks: Key2Flicks[] = [];
  flick: Key2Flick[] = [];
};

export class List extends Section {
  // TODO-LDML
};

export class ListItem {
  readonly value: string[];
  constructor(value: string[]) {
    this.value = value;
  }
};


export interface KMXPlusData {
    sect?: Strs; // sect is ignored in-memory
    bksp?: Bksp;
    disp?: Disp;
    elem?: Elem; // elem is ignored in-mxemory
    finl?: Finl;
    key2?: Key2;
    keys?: Keys;
    layr?: Layr;
    list?: List;
    loca?: Loca;
    meta?: Meta;
    name?: Name;
    ordr?: Ordr;
    strs?: Strs; // strs is ignored in-memory
    tran?: Tran;
    vkey?: Vkey;
};

export class KMXPlusFile extends KMXFile {

  /* KMXPlus file structures */

  public readonly COMP_PLUS_SECT_ITEM: any;
  public readonly COMP_PLUS_SECT: any;

  // COMP_PLUS_BKSP == COMP_PLUS_TRAN
  public readonly COMP_PLUS_BKSP_ITEM: any;
  public readonly COMP_PLUS_BKSP: any;

  public readonly COMP_PLUS_DISP_ITEM: any;
  public readonly COMP_PLUS_DISP: any;

  public readonly COMP_PLUS_ELEM_ELEMENT: any;
  public readonly COMP_PLUS_ELEM_STRING: any;
  public readonly COMP_PLUS_ELEM: any;

  // COMP_PLUS_FINL == COMP_PLUS_TRAN
  public readonly COMP_PLUS_FINL_ITEM: any;
  public readonly COMP_PLUS_FINL: any;

  public readonly COMP_PLUS_KEYS_ITEM: any;
  public readonly COMP_PLUS_KEYS: any;

  public readonly COMP_PLUS_LAYR_ENTRY: any;
  public readonly COMP_PLUS_LAYR_KEY: any;
  public readonly COMP_PLUS_LAYR_LIST: any;
  public readonly COMP_PLUS_LAYR_ROW: any;
  public readonly COMP_PLUS_LAYR: any;

  public readonly COMP_PLUS_KEY2_FLICK: any;
  public readonly COMP_PLUS_KEY2_FLICKS: any;
  public readonly COMP_PLUS_KEY2_KEY: any;
  public readonly COMP_PLUS_KEY2: any;

  public readonly COMP_PLUS_LIST_LIST: any;
  public readonly COMP_PLUS_LIST_INDEX: any;
  public readonly COMP_PLUS_LIST: any;

  public readonly COMP_PLUS_LOCA_ITEM: any;
  public readonly COMP_PLUS_LOCA: any;

  public readonly COMP_PLUS_META: any;

  public readonly COMP_PLUS_NAME_ITEM: any;
  public readonly COMP_PLUS_NAME: any;

  public readonly COMP_PLUS_ORDR_ITEM: any;
  public readonly COMP_PLUS_ORDR: any;

  public readonly COMP_PLUS_STRS_ITEM: any;
  public readonly COMP_PLUS_STRS: any;

  public readonly COMP_PLUS_TRAN_ITEM: any;
  public readonly COMP_PLUS_TRAN: any;

  public readonly COMP_PLUS_VKEY_ITEM: any;
  public readonly COMP_PLUS_VKEY: any;

  /* File in-memory data */

  public kmxplus: KMXPlusData = { };

  constructor() {
    super();


    // Binary-correct structures matching kmx_plus.h

    // 'sect'

    this.COMP_PLUS_SECT_ITEM = new r.Struct({
      sect: r.uint32le,
      offset: r.uint32le //? new r.VoidPointer(r.uint32le, {type: 'global'})
    });

    this.COMP_PLUS_SECT = new r.Struct({
      ident: r.uint32le,
      size: r.uint32le,
      total: r.uint32le,
      count: r.uint32le,
      items: new r.Array(this.COMP_PLUS_SECT_ITEM, 'count')
    });

    // 'bksp' - see 'tran'

    // 'disp'
    this.COMP_PLUS_DISP_ITEM = new r.Struct({
      to: r.uint32le,
      display: r.uint32le,
    });

    this.COMP_PLUS_DISP = new r.Struct({
      ident: r.uint32le,
      size: r.uint32le,
      count: r.uint32le,
      baseCharacter: r.uint32le,
      reserved0: new r.Reserved(r.uint32le), // padding
      reserved1: new r.Reserved(r.uint32le), // padding
      reserved2: new r.Reserved(r.uint32le), // padding
      reserved3: new r.Reserved(r.uint32le), // padding
      items: new r.Array(this.COMP_PLUS_DISP_ITEM, 'count'),
    });

    // 'elem'

    this.COMP_PLUS_ELEM_ELEMENT = new r.Struct({
      element: r.uint32le,
      flags: r.uint32le
    });

    this.COMP_PLUS_ELEM_STRING = new r.Struct({
      offset: r.uint32le,
      length: r.uint32le
    });

    this.COMP_PLUS_ELEM = new r.Struct({
      ident: r.uint32le,
      size: r.uint32le,
      count: r.uint32le,
      reserved: new r.Reserved(r.uint32le), // padding
      strings: new r.Array(this.COMP_PLUS_ELEM_STRING, 'count')
    });

    // 'finl' - see 'tran'

    // 'keys'

    this.COMP_PLUS_KEYS_ITEM = new r.Struct({
      vkey: r.uint32le,
      mod: r.uint32le,
      to: r.uint32le, //str or UTF-32 char depending on value of 'extend'
      flags: r.uint32le, //new r.Bitfield(r.uint32le, ['extend'])
    });

    this.COMP_PLUS_KEYS = new r.Struct({
      ident: r.uint32le,
      size: r.uint32le,
      count: r.uint32le,
      reserved: new r.Reserved(r.uint32le), // padding
      items: new r.Array(this.COMP_PLUS_KEYS_ITEM, 'count')
    });

    // 'layr'

    this.COMP_PLUS_LAYR_ENTRY = new r.Struct({
      id: r.uint32le, // str
      modifier: r.uint32le, // str
      row: r.uint32le, // index into rows
      count: r.uint32le,
    });

    this.COMP_PLUS_LAYR_KEY = new r.Struct({
      key: r.uint32le, // index into key2
    });

    this.COMP_PLUS_LAYR_LIST = new r.Struct({
      flags: r.uint32le,
      hardware: r.uint32le, //str
      layer: r.uint32le, // index into layers
      count: r.uint32le,
    });

    this.COMP_PLUS_LAYR_ROW = new r.Struct({
      key: r.uint32le,
      count: r.uint32le,
    });

    this.COMP_PLUS_LAYR = new r.Struct({
      ident: r.uint32le,
      size: r.uint32le,
      listCount: r.uint32le,
      layerCount: r.uint32le,
      rowCount: r.uint32le,
      keyCount: r.uint32le,
      reserved0: new r.Reserved(r.uint32le),
      reserved1: new r.Reserved(r.uint32le),
      lists: new r.Array(this.COMP_PLUS_LAYR_LIST, 'listCount'),
      layers: new r.Array(this.COMP_PLUS_LAYR_ENTRY, 'layerCount'),
      rows: new r.Array(this.COMP_PLUS_LAYR_ROW, 'rowCount'),
      keys: new r.Array(this.COMP_PLUS_LAYR_KEY, 'keyCount'),
    });

    this.COMP_PLUS_KEY2_FLICK = new r.Struct({
      directions: r.uint32le, // list
      flags: r.uint32le,
      to: r.uint32le, // str | codepoint
    });

    this.COMP_PLUS_KEY2_FLICKS = new r.Struct({
      count: r.uint32le,
      flick: r.uint32le,
      id: r.uint32le, // str
    });

    this.COMP_PLUS_KEY2_KEY = new r.Struct({
      vkey: r.uint32le,
      to: r.uint32le, // str | codepoint
      flags: r.uint32le,
      id: r.uint32le, // str
      switch: r.uint32le, // str
      width: r.uint32le, // width*10  ( 1 = 0.1 keys)
      longPress: r.uint32le, // list index
      longPressDefault: r.uint32le, // str
      multiTap: r.uint32le, // list index
      flicks: r.uint32le, // index into flicks table
    });

    this.COMP_PLUS_KEY2 = new r.Struct({
      ident: r.uint32le,
      size: r.uint32le,
      keyCount: r.uint32le,
      flicksCount: r.uint32le,
      flickCount: r.uint32le,
      reserved0: new r.Reserved(r.uint32le),
      reserved1: new r.Reserved(r.uint32le),
      reserved2: new r.Reserved(r.uint32le),
      keys: new r.Array(this.COMP_PLUS_KEY2_KEY, 'keyCount'),
      flicks: new r.Array(this.COMP_PLUS_KEY2_FLICKS, 'flicksCount'),
      flick: new r.Array(this.COMP_PLUS_KEY2_FLICK, 'flickCount'),
    });

    // 'list'

    this.COMP_PLUS_LIST_LIST = new r.Struct({
      index: r.uint32le,
      count: r.uint32le,
    });

    this.COMP_PLUS_LIST_INDEX = new r.Struct({
      str: r.uint32le, // str
    });

    this.COMP_PLUS_LIST = new r.Struct({
      ident: r.uint32le,
      size: r.uint32le,
      listCount: r.uint32le,
      indexCount: r.uint32le,
      lists: new r.Array(this.COMP_PLUS_LIST_LIST, 'listCount'),
      indices: new r.Array(this.COMP_PLUS_LIST_INDEX, 'indexCount'),
    });


    // 'loca'

    this.COMP_PLUS_LOCA_ITEM = r.uint32le; //str

    this.COMP_PLUS_LOCA = new r.Struct({
      ident: r.uint32le,
      size: r.uint32le,
      count: r.uint32le,
      reserved: new r.Reserved(r.uint32le), // padding
      items: new r.Array(this.COMP_PLUS_LOCA_ITEM, 'count')
    });

    // 'meta'

    this.COMP_PLUS_META = new r.Struct({
      ident: r.uint32le,
      size: r.uint32le,
      author: r.uint32le, //str
      conform: r.uint32le, //str
      layout: r.uint32le, //str
      normalization: r.uint32le, //str
      indicator: r.uint32le, //str
      version: r.uint32le, //str
      settings: r.uint32le, //new r.Bitfield(r.uint32le, ['fallback', 'transformFailure', 'transformPartial'])
    });

    // 'name'

    this.COMP_PLUS_NAME_ITEM = r.uint32le; //str

    this.COMP_PLUS_NAME = new r.Struct({
      ident: r.uint32le,
      size: r.uint32le,
      count: r.uint32le,
      reserved: new r.Reserved(r.uint32le), // padding
      items: new r.Array(this.COMP_PLUS_NAME_ITEM, 'count')
    });

    // 'ordr'

    this.COMP_PLUS_ORDR_ITEM = new r.Struct({
      elements: r.uint32le, //elem
      before: r.uint32le //elem
    });

    this.COMP_PLUS_ORDR = new r.Struct({
      ident: r.uint32le,
      size: r.uint32le,
      count: r.uint32le,
      reserved: new r.Reserved(r.uint32le), // padding
      items: new r.Array(this.COMP_PLUS_ORDR_ITEM, 'count')
    });

    // 'strs'

    this.COMP_PLUS_STRS_ITEM = new r.Struct({
      // While we use length which is number of utf-16 code units excluding null terminator,
      // we always write a null terminator, so we can get restructure to do that for us here
      offset: r.uint32le, //? new r.Pointer(r.uint32le, new r.String(null, 'utf16le')),
      length: r.uint32le
    });

    this.COMP_PLUS_STRS = new r.Struct({
      ident: r.uint32le,
      size: r.uint32le,
      count: r.uint32le,
      reserved: new r.Reserved(r.uint32le), // padding
      items: new r.Array(this.COMP_PLUS_STRS_ITEM, 'count')
    });

    // 'tran'

    this.COMP_PLUS_TRAN_ITEM = new r.Struct({
      from: r.uint32le, //elem
      to: r.uint32le, //str
      before: r.uint32le, //elem
      flags: r.uint32le //bitfield
    });

    this.COMP_PLUS_TRAN = new r.Struct({
      ident: r.uint32le,
      size: r.uint32le,
      count: r.uint32le,
      reserved: new r.Reserved(r.uint32le), // padding
      items: new r.Array(this.COMP_PLUS_TRAN_ITEM, 'count')
    });

    // 'vkey'

    this.COMP_PLUS_VKEY_ITEM = new r.Struct({
      vkey: r.uint32le,
      target: r.uint32le
    });

    this.COMP_PLUS_VKEY = new r.Struct({
      ident: r.uint32le,
      size: r.uint32le,
      count: r.uint32le,
      reserved: new r.Reserved(r.uint32le), // padding
      items: new r.Array(this.COMP_PLUS_VKEY_ITEM, 'count')
    });

    // Aliases

    this.COMP_PLUS_BKSP_ITEM = this.COMP_PLUS_TRAN_ITEM;
    this.COMP_PLUS_FINL_ITEM = this.COMP_PLUS_TRAN_ITEM;
    this.COMP_PLUS_BKSP = this.COMP_PLUS_TRAN;
    this.COMP_PLUS_FINL = this.COMP_PLUS_TRAN;
  }
}
