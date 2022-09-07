/*
  Copyright:        Copyright (C) 2022 SIL International.
  Authors:          srl295, mcdurdin
  This file provides constants for the KMX Plus (LDML support) binary format,
  to be shared between TypeScript and C++ via the generator (below)
*/


// NOTICE!
//
// If you update this file, you *must* be sure to re-run
//
//  core/tools/ldml-const-builder/build.sh clean build run
//
// To update keyboardprocessor_ldml.h, and commit the result.
//
// It is not updated automatically.


/**
 * Defines the section identifiers and ensures that we include each and every
 * one of them in the `sections` block and gives us a type which we can iterate
 * through.
 */
export type SectionIdent =
  'sect' |
  'bksp' |
  'elem' |
  'finl' |
  'keys' |
  'loca' |
  'meta' |
  'name' |
  'ordr' |
  'strs' |
  'tran' |
  'vkey';


type SectionMap = {
  [id in SectionIdent]: SectionIdent;
}

interface Constants_Section {
  // For now, only defining one property as other types can be inferred
  section: SectionMap;
}

type Constants = Constants_Section & {[id:string]:any};


// TODO-LDML: namespace com.keyman.core.ldml {
/**
 * Constants for the KMXPlus data format
 * These are shared between the data access layer and the compiler.
 * Note that the section IDs (section_keys etc.) are 32 bit hex
 * values that are designed to appear as text when written in little endian
 * format, so 0x7379656b = 'keys'
 */
export const constants: Constants = {
    /**
     * The version of the LDML processor
     */
    version: '1.0',
    /**
     * Length of a raw section header, in bytes
     */
    length_header: 8,

    /* ------------------------------------------------------------------
     * sect section
       ------------------------------------------------------------------ */

    /**
     * Minimum length of the 'sect' section, not including entries
     */
    length_sect: 16,
    /**
     *  Length of each item in the 'sect' section variable part
     */
    length_sect_item: 8,

    /* ------------------------------------------------------------------
     * bksp section
       ------------------------------------------------------------------ */

    /**
     * Minimum length of the 'bksp' section, not including entries
     */
    length_bksp: 16,
    /**
     *  Length of each item in the 'bksp' section variable part
     */
    length_bksp_item: 16,

    /* ------------------------------------------------------------------
     * elem section
       ------------------------------------------------------------------ */

    /**
     * Minimum length of the 'elem' section, not including entries
     */
    length_elem: 16,
    /**
     *  Length of each elem string in the 'elem' section variable part
     */
    length_elem_item: 8,
    /**
     * Length of each element in an elem string
     */
    length_elem_item_element: 8,

    /**
     * bitwise or value for unicode_set in elem[elemstr][element].flags.
     * If bit is 1, then 'element' is a UnicodeSet string.
     * If bit is 0, then 'element' is a UTF-32LE codepoint
     *
     * `unicode_set = flags & elem_flags_unicode_set`
     */
    elem_flags_unicode_set:   0x00000001,

    /**
     * bitwise or value for tertiary_base in elem[elemstr][element].flags.
     * If bit is 1, then tertiary_base is true.
     * If bit is 0, then tertiary_base is false.
     *
     * Used only for `ordr`-type element strings.
     *
     * `tertiary_base = flags & elem_flags_tertiary_base`
     */
    elem_flags_tertiary_base: 0x00000002,

    /**
     * bitwise or value for tertiary_base in elem[elemstr][element].flags.
     * If bit is 1, then prebase is true.
     * If bit is 0, then prebase is false.
     *
     * Used only for `ordr`-type element strings.
     *
     * `prebase = flags & elem_flags_prebase`
     */
    elem_flags_prebase:       0x00000004,

    /**
     * bitwise mask for order in elem[elemstr][element].flags.
     *
     * Used only for `ordr`-type element strings. 1 byte signed integer.
     *
     * `order = (flags & elem_flags_order_mask) >> elem_flags_order_bitshift`
     */
    elem_flags_order_mask:    0x00FF0000,

    /**
     * bit shift for order in elem[elemstr][element].flags.
     *
     * Used only for `ordr`-type element strings.
     *
     * `order = (flags & elem_flags_order_mask) >> elem_flags_order_bitshift`
     */
    elem_flags_order_bitshift: 16,

    /**
     * bitwise mask for tertiary sort in elem[elemstr][element].flags.
     *
     * Used only for `ordr`-type element strings. 1 byte signed integer.
     *
     * `tertiary = (flags & elem_flags_tertiary_mask) >> elem_flags_tertiary_bitshift`
     */
    elem_flags_tertiary_mask: 0xFF000000,

    /**
     * bit shift for tertiary sort in elem[elemstr][element].flags.
     *
     * Used only for `ordr`-type element strings. 1 byte signed integer.
     *
     * `order = (flags & elem_flags_tertiary_mask) >> elem_flags_tertiary_bitshift`
     */
    elem_flags_tertiary_bitshift: 24,

    /* ------------------------------------------------------------------
     * finl section
       ------------------------------------------------------------------ */

    /**
     * Minimum length of the 'finl' section, not including entries
     */
    length_finl: 16,
    /**
     *  Length of each item in the 'finl' section variable part
     */
    length_finl_item: 16,

    /* ------------------------------------------------------------------
     * keys section
       ------------------------------------------------------------------ */

    /**
     * Minimum length of the 'keys' section not including variable parts
     */
    length_keys: 16,
    /**
     *  Length of each item in the 'keys' section variable part
     */
    length_keys_item: 16,
    /**
     * bitwise or value for extend in keys[key].flags.
     * If bit is 1, then 'to' is a string.
     * If bit is 0, then 'to' is a UTF-32LE codepoint
     *
     * `extend = flags & keys_flags_extend`
     */
    keys_flags_extend: 1,

    /* ------------------------------------------------------------------
     * loca section
       ------------------------------------------------------------------ */

    /**
     * Minimum length of the 'loca' section not including variable parts
     */
    length_loca: 16,
    /**
     *  Length of each item in the 'loca' section variable part
     */
    length_loca_item: 4,

    /* ------------------------------------------------------------------
     * meta section
       ------------------------------------------------------------------ */

    /**
     * length of the 'meta' section
     */
    length_meta: 40,
    /**
     * bitwise or value for fallback=omit in meta.settings
     */
    meta_settings_fallback_omit: 1,
    /**
     * bitwise or value for transformFailure=omit in meta.settings
     */
    meta_settings_transformFailure_omit: 2,
    /**
     * bitwise or value for transformPartial=hide in meta.settings
     */
    meta_settings_transformPartial_hide: 4,

    /* ------------------------------------------------------------------
     * name section
       ------------------------------------------------------------------ */

    /**
     * Minimum length of the 'name' section not including variable parts
     */
    length_name: 16,
    /**
     *  Length of each item in the 'name' section variable part
     */
    length_name_item: 4,

    /* ------------------------------------------------------------------
     * ordr section
       ------------------------------------------------------------------ */

    /**
     * Minimum length of the 'ordr' section, not including entries
     */
    length_ordr: 16,
    /**
     *  Length of each item in the 'ordr' section variable part
     */
    length_ordr_item: 8,

    /* ------------------------------------------------------------------
     * strs section
       ------------------------------------------------------------------ */

    /**
     * Minimum length of the 'strs' section not including variable parts
     */
    length_strs: 16,
    /**
     * Length of each item in the 'strs' section variable part
     */
    length_strs_item: 8,

    /* ------------------------------------------------------------------
     * tran section
       ------------------------------------------------------------------ */

    /**
     * Minimum length of the 'tran' section, not including entries
     */
    length_tran: 16,
    /**
     *  Length of each item in the 'tran' section variable part
     */
    length_tran_item: 16,

    /* ------------------------------------------------------------------
     * vkey section
       ------------------------------------------------------------------ */

    /**
     * Minimum length of the 'vkey' section not including variable parts
     */
    length_vkey: 16,
    /**
     *  Length of each item in the 'vkey' section variable part
     */
    length_vkey_item: 8,

    /**
     * All section IDs.
     */
    section: {
        sect: 'sect',
        bksp: 'bksp',
        elem: 'elem',
        finl: 'finl',
        keys: 'keys',
        loca: 'loca',
        meta: 'meta',
        name: 'name',
        ordr: 'ordr',
        strs: 'strs',
        tran: 'tran',
        vkey: 'vkey',
    },

    /**
     * Use to convert 4-char string into hex
     * @param id section id such as 'sect'
     * @returns hex ID such as 0x74636573
     */
    hex_section_id: function(id:string) {
        if(!id || typeof id !== 'string' || !id.match(/[a-z][a-z][a-z][a-z]/)) {
            throw Error(`hex_section_id(${id}) - need a 4-character string`);
        }
        let r = 0;
        for (let i = 3; i>=0; i--) {
            r = (r << 8 | id.charCodeAt(i));
        }
        return r;
    },

};
// }
