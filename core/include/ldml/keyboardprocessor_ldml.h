
/*
  Copyright:        Copyright (C) 2022 SIL International.
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
#define LDML_ELEM_FLAGS_ORDER_BITSHIFT 0x10
#define LDML_ELEM_FLAGS_ORDER_MASK 0xFF0000
#define LDML_ELEM_FLAGS_PREBASE 0x4
#define LDML_ELEM_FLAGS_TERTIARY_BASE 0x2
#define LDML_ELEM_FLAGS_TERTIARY_BITSHIFT 0x18
#define LDML_ELEM_FLAGS_TERTIARY_MASK 0xFF000000
#define LDML_ELEM_FLAGS_UNICODE_SET 0x1
#define LDML_FINL_FLAGS_ERROR 0x1
#define LDML_KEYS_FLAGS_EXTEND 0x1
#define LDML_LENGTH_BKSP 0x10
#define LDML_LENGTH_BKSP_ITEM 0x10
#define LDML_LENGTH_ELEM 0x10
#define LDML_LENGTH_ELEM_ITEM 0x8
#define LDML_LENGTH_ELEM_ITEM_ELEMENT 0x8
#define LDML_LENGTH_FINL 0x10
#define LDML_LENGTH_FINL_ITEM 0x10
#define LDML_LENGTH_HEADER 0x8
#define LDML_LENGTH_KEYS 0x10
#define LDML_LENGTH_KEYS_ITEM 0x10
#define LDML_LENGTH_LOCA 0x10
#define LDML_LENGTH_LOCA_ITEM 0x4
#define LDML_LENGTH_META 0x28
#define LDML_LENGTH_NAME 0x10
#define LDML_LENGTH_NAME_ITEM 0x4
#define LDML_LENGTH_ORDR 0x10
#define LDML_LENGTH_ORDR_ITEM 0x8
#define LDML_LENGTH_SECT 0x10
#define LDML_LENGTH_SECT_ITEM 0x8
#define LDML_LENGTH_STRS 0x10
#define LDML_LENGTH_STRS_ITEM 0x8
#define LDML_LENGTH_TRAN 0x10
#define LDML_LENGTH_TRAN_ITEM 0x10
#define LDML_LENGTH_VKEY 0x10
#define LDML_LENGTH_VKEY_ITEM 0x8
#define LDML_META_SETTINGS_FALLBACK_OMIT 0x1
#define LDML_META_SETTINGS_TRANSFORMFAILURE_OMIT 0x2
#define LDML_META_SETTINGS_TRANSFORMPARTIAL_HIDE 0x4
#define LDML_SECTIONID_BKSP 0x70736B62 /* "bksp" */
#define LDML_SECTIONNAME_BKSP             "bksp"
#define LDML_SECTIONID_ELEM 0x6D656C65 /* "elem" */
#define LDML_SECTIONNAME_ELEM             "elem"
#define LDML_SECTIONID_FINL 0x6C6E6966 /* "finl" */
#define LDML_SECTIONNAME_FINL             "finl"
#define LDML_SECTIONID_KEYS 0x7379656B /* "keys" */
#define LDML_SECTIONNAME_KEYS             "keys"
#define LDML_SECTIONID_LOCA 0x61636F6C /* "loca" */
#define LDML_SECTIONNAME_LOCA             "loca"
#define LDML_SECTIONID_META 0x6174656D /* "meta" */
#define LDML_SECTIONNAME_META             "meta"
#define LDML_SECTIONID_NAME 0x656D616E /* "name" */
#define LDML_SECTIONNAME_NAME             "name"
#define LDML_SECTIONID_ORDR 0x7264726F /* "ordr" */
#define LDML_SECTIONNAME_ORDR             "ordr"
#define LDML_SECTIONID_SECT 0x74636573 /* "sect" */
#define LDML_SECTIONNAME_SECT             "sect"
#define LDML_SECTIONID_STRS 0x73727473 /* "strs" */
#define LDML_SECTIONNAME_STRS             "strs"
#define LDML_SECTIONID_TRAN 0x6E617274 /* "tran" */
#define LDML_SECTIONNAME_TRAN             "tran"
#define LDML_SECTIONID_VKEY 0x79656B76 /* "vkey" */
#define LDML_SECTIONNAME_VKEY             "vkey"
#define LDML_TRAN_FLAGS_ERROR 0x1
#define LDML_VERSION "1.0"
