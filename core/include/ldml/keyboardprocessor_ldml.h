
/*
  Copyright:        Copyright (C) 2022-2023 SIL International.
  Authors:          srl295
  This file provides constants for the KMX Plus (LDML support) binary format,
  to be shared between TypeScript and C++ via the generator (below)
*/

//
// Generated File - do not edit
//
// This file is generated by core/tools/ldml-const-builder/build.sh
// based on core/include/ldml/keyboardprocessor_ldml.ts
//

#pragma once

#define LDML_BKSP_FLAGS_ERROR 0x1
#define LDML_CLDR_IMPLIED_KEYS_IMPORT "techpreview/keys-Latn-implied.xml"
#define LDML_CLDR_IMPORT_BASE "cldr"
#define LDML_CLDR_VERSION_LATEST "techpreview"
#define LDML_CLDR_VERSION_TECHPREVIEW "techpreview"
#define LDML_ELEM_FLAGS_ORDER_BITSHIFT 0x10
#define LDML_ELEM_FLAGS_ORDER_MASK 0xFF0000
#define LDML_ELEM_FLAGS_PREBASE 0x8
#define LDML_ELEM_FLAGS_TERTIARY_BASE 0x4
#define LDML_ELEM_FLAGS_TERTIARY_BITSHIFT 0x18
#define LDML_ELEM_FLAGS_TERTIARY_MASK 0xFF000000
#define LDML_ELEM_FLAGS_TYPE 0x3
#define LDML_ELEM_FLAGS_TYPE_CHAR 0x0
#define LDML_ELEM_FLAGS_TYPE_STR 0x1
#define LDML_ELEM_FLAGS_TYPE_USET 0x2
#define LDML_FINL_FLAGS_ERROR 0x1
#define LDML_KEYS_FLICK_FLAGS_EXTEND 0x1
#define LDML_KEYS_KEY_FLAGS_EXTEND 0x1
#define LDML_KEYS_KEY_FLAGS_GAP 0x2
#define LDML_KEYS_KEY_FLAGS_NOTRANSFORM 0x4
#define LDML_KEYS_MOD_ALL 0x17F
#define LDML_KEYS_MOD_ALT 0x40
#define LDML_KEYS_MOD_ALTL 0x4
#define LDML_KEYS_MOD_ALTR 0x8
#define LDML_KEYS_MOD_CAPS 0x100
#define LDML_KEYS_MOD_CTRL 0x20
#define LDML_KEYS_MOD_CTRLL 0x1
#define LDML_KEYS_MOD_CTRLR 0x2
#define LDML_KEYS_MOD_NONE 0x0
#define LDML_KEYS_MOD_SHIFT 0x10
#define LDML_LAYR_LIST_HARDWARE_ABNT2 0x1
#define LDML_LAYR_LIST_HARDWARE_ISO 0x2
#define LDML_LAYR_LIST_HARDWARE_JIS 0x3
#define LDML_LAYR_LIST_HARDWARE_TOUCH 0x0
#define LDML_LAYR_LIST_HARDWARE_US 0x4
#define LDML_LENGTH_BKSP 0xC
#define LDML_LENGTH_BKSP_ITEM 0x10
#define LDML_LENGTH_DISP 0x10
#define LDML_LENGTH_DISP_ITEM 0x8
#define LDML_LENGTH_ELEM 0xC
#define LDML_LENGTH_ELEM_ITEM 0x8
#define LDML_LENGTH_ELEM_ITEM_ELEMENT 0x8
#define LDML_LENGTH_FINL 0x8
#define LDML_LENGTH_FINL_ITEM 0x10
#define LDML_LENGTH_HEADER 0x8
#define LDML_LENGTH_KEYS 0x18
#define LDML_LENGTH_KEYS_FLICK_ELEMENT 0xC
#define LDML_LENGTH_KEYS_FLICK_LIST 0xC
#define LDML_LENGTH_KEYS_KEY 0x24
#define LDML_LENGTH_KEYS_KMAP 0xC
#define LDML_LENGTH_LAYR 0x18
#define LDML_LENGTH_LAYR_ENTRY 0x10
#define LDML_LENGTH_LAYR_KEY 0x4
#define LDML_LENGTH_LAYR_LIST 0x10
#define LDML_LENGTH_LAYR_ROW 0x8
#define LDML_LENGTH_LIST 0x10
#define LDML_LENGTH_LIST_INDEX 0x4
#define LDML_LENGTH_LIST_ITEM 0x8
#define LDML_LENGTH_LOCA 0xC
#define LDML_LENGTH_LOCA_ITEM 0x4
#define LDML_LENGTH_META 0x24
#define LDML_LENGTH_NAME 0xC
#define LDML_LENGTH_NAME_ITEM 0x4
#define LDML_LENGTH_SECT 0x10
#define LDML_LENGTH_SECT_ITEM 0x8
#define LDML_LENGTH_STRS 0xC
#define LDML_LENGTH_STRS_ITEM 0x8
#define LDML_LENGTH_TRAN 0x14
#define LDML_LENGTH_TRAN_GROUP 0xC
#define LDML_LENGTH_TRAN_REORDER 0x8
#define LDML_LENGTH_TRAN_TRANSFORM 0x10
#define LDML_LENGTH_USET 0x10
#define LDML_LENGTH_USET_RANGE 0x8
#define LDML_LENGTH_USET_USET 0xC
#define LDML_LENGTH_VARS 0x10
#define LDML_LENGTH_VARS_ITEM 0x10
#define LDML_LENGTH_VKEY 0xC
#define LDML_LENGTH_VKEY_ITEM 0x8
#define LDML_MARKER_ANY_INDEX 0xD7FF
#define LDML_MARKER_CODE 0x8
#define LDML_MARKER_MAX_COUNT 0xD7FE
#define LDML_MARKER_MAX_INDEX 0xD7FE
#define LDML_MARKER_MIN_INDEX 0x1
#define LDML_META_SETTINGS_FALLBACK_OMIT 0x1
#define LDML_META_SETTINGS_TRANSFORMFAILURE_OMIT 0x2
#define LDML_META_SETTINGS_TRANSFORMPARTIAL_HIDE 0x4
#define LDML_SECTIONID_BKSP 0x70736B62 /* "bksp" */
#define LDML_SECTIONNAME_BKSP             "bksp"
#define LDML_SECTIONID_DISP 0x70736964 /* "disp" */
#define LDML_SECTIONNAME_DISP             "disp"
#define LDML_SECTIONID_ELEM 0x6D656C65 /* "elem" */
#define LDML_SECTIONNAME_ELEM             "elem"
#define LDML_SECTIONID_KEYS 0x7379656B /* "keys" */
#define LDML_SECTIONNAME_KEYS             "keys"
#define LDML_SECTIONID_LAYR 0x7279616C /* "layr" */
#define LDML_SECTIONNAME_LAYR             "layr"
#define LDML_SECTIONID_LIST 0x7473696C /* "list" */
#define LDML_SECTIONNAME_LIST             "list"
#define LDML_SECTIONID_LOCA 0x61636F6C /* "loca" */
#define LDML_SECTIONNAME_LOCA             "loca"
#define LDML_SECTIONID_META 0x6174656D /* "meta" */
#define LDML_SECTIONNAME_META             "meta"
#define LDML_SECTIONID_NAME 0x656D616E /* "name" */
#define LDML_SECTIONNAME_NAME             "name"
#define LDML_SECTIONID_SECT 0x74636573 /* "sect" */
#define LDML_SECTIONNAME_SECT             "sect"
#define LDML_SECTIONID_STRS 0x73727473 /* "strs" */
#define LDML_SECTIONNAME_STRS             "strs"
#define LDML_SECTIONID_TRAN 0x6E617274 /* "tran" */
#define LDML_SECTIONNAME_TRAN             "tran"
#define LDML_SECTIONID_USET 0x74657375 /* "uset" */
#define LDML_SECTIONNAME_USET             "uset"
#define LDML_SECTIONID_VARS 0x73726176 /* "vars" */
#define LDML_SECTIONNAME_VARS             "vars"
#define LDML_SECTIONID_VKEY 0x79656B76 /* "vkey" */
#define LDML_SECTIONNAME_VKEY             "vkey"
#define LDML_TRAN_FLAGS_ERROR 0x1
#define LDML_TRAN_GROUP_TYPE_REORDER 0x1
#define LDML_TRAN_GROUP_TYPE_TRANSFORM 0x0
#define LDML_UC_SENTINEL 0xFFFF
#define LDML_VARS_ENTRY_TYPE_SET 0x1
#define LDML_VARS_ENTRY_TYPE_STRING 0x0
#define LDML_VARS_ENTRY_TYPE_UNICODESET 0x2
#define LDML_VERSION "1.0"
