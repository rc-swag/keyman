import { constants } from '@keymanapp/ldml-keyboard-constants';
import { DependencySections, StrsItem, UsetItem } from './kmx-plus.js';
import { ElementParser, ElementSegment, ElementType } from '../ldml-keyboard/pattern-parser.js';
import { MATCH_HEX_ESCAPE, unescapeOneQuadString } from '../util/util.js';

export enum ElemElementFlags {
  none = 0,
  type = constants.elem_flags_type,
  tertiary_base = constants.elem_flags_tertiary_base,
  prebase = constants.elem_flags_prebase
}
;

export class ElemElement {
  value?: StrsItem; // UnicodeSet or UCS32LE character
  uset?: UsetItem;
  order: number; // -128 to +127; used only by reorder element values
  tertiary: number; // -128 to +127; used only by reorder element values
  flags: ElemElementFlags;
  isEqual(a: ElemElement) {
    return a.value === this.value &&
      a.order === this.order &&
      a.tertiary === this.tertiary &&
      a.flags === this.flags;
  }
}
;

export class ElementString extends Array<ElemElement> {
  /**
   * @param source if a string array, does not get reinterpreted as UnicodeSet. This is used with vars, etc. Or pass `["str"]` for an explicit 1-element elem.
   * If it is a string, will be interpreted per reorder element ruls.
   */
  constructor(sections: DependencySections, source: string | string[], order?: string, tertiary?: string, tertiary_base?: string, prebase?: string) {
    super();
    //TODO-LDML: full UnicodeSet and parsing
    if(!source) {
      return;
    }

    const sourceIsArray = Array.isArray(source);
    let items : ElementSegment[];
    if (sourceIsArray) {
      items = source.map(segment => new ElementSegment(segment, ElementType.string));
    } else {
      // use segmenter to analyze each part
      items = ElementParser.segment(source);
    }

    let orders: Array<string> = order ? order.split(" ") : [];
    if(orders.length == 1) {
      orders = Array<string>(items.length).fill(orders[0]);
    }

    let tertiaries: Array<string> = tertiary ? tertiary.split(" ") : [];
    if(tertiaries.length == 1) {
      tertiaries = Array<string>(items.length).fill(tertiaries[0]);
    }

    let tertiary_bases: Array<string> = tertiary_base ? tertiary_base.split(" ") : [];
    if(tertiary_bases.length == 1) {
      tertiary_bases = Array<string>(items.length).fill(tertiary_bases[0]);
    }

    let prebases: Array<string> = prebase ? prebase.split(" ") : [];
    if(prebases.length == 1) {
      prebases = Array<string>(items.length).fill(prebases[0]);
    }

    for(let i = 0; i < items.length; i++) {
      let elem = new ElemElement();
      const item = items[i];
      let typeFlag = 0;
      if (item.type === ElementType.uset) {
        typeFlag |= constants.elem_flags_type_uset;
        const uset = sections.usetparser.parseUnicodeSet(item.segment, 100);
        if (!uset) {
          // TODO-LDML - error callback
          throw Error(`Could not parse uset ${item.segment}`);
        }
        elem.uset = sections.uset.allocUset(uset, sections);
        elem.value = sections.strs.allocString('', true); // no string
      } else if (item.type === ElementType.codepoint || item.type === ElementType.escaped || item.type === ElementType.string) {
        // some kind of a string
        let str = item.segment;
        if (item.type === ElementType.escaped && !MATCH_HEX_ESCAPE.test(str)) {
          str = unescapeOneQuadString(str);
          // TODO-LDML: any other escape forms here?
          elem.value = sections.strs.allocString(str, true);
        } else {
          elem.value = sections.strs.allocAndUnescapeString(str, true);
        }
        // Now did we end up with one char or no?
        if (elem.value.isOneChar) {
          typeFlag |= constants.elem_flags_type_char;
        } else {
          typeFlag |= constants.elem_flags_type_str;
        }
      }
      elem.order = orders.length ? parseInt(orders[i], 10) : 0;
      elem.tertiary = tertiaries.length ? parseInt(tertiaries[i], 10) : 0;
      elem.flags = ElemElementFlags.none |
        (ElemElementFlags.type & typeFlag) |
        (tertiary_bases?.[i] == '1' /* TODO-LDML: or 'true'? */ ? ElemElementFlags.tertiary_base : 0) |
        (prebases?.[i] == '1' /* TODO-LDML: or 'true'? */ ? ElemElementFlags.prebase : 0);
      this.push(elem);
    };
  }
  isEqual(a: ElementString): boolean {
    if (a.length != this.length) {
      return false;
    }
    for (let i = 0; i < a.length; i++) {
      if (!this[i].isEqual(a[i])) {
        return false;
      }
    }
    return true;
  }
}
;
