#include <CompMsg.h>

struct CompilerError {
  KMX_DWORD ErrorCode;
  const  KMX_CHAR* Text;
  };

const struct CompilerError CompilerErrors[] = {
    { CERR_InvalidLayoutLine  , "Invalid 'layout' command"},
    { CERR_NoVersionLine      , "No version line found for file"},
    { CERR_InvalidGroupLine   , "Invalid 'group' command"},
    { CERR_InvalidStoreLine   , "Invalid 'store' command"},
    { CERR_InvalidCodeInKeyPartOfRule , "Invalid command or code found in key part of rule"},
    { CERR_InvalidDeadkey     , "Invalid 'deadkey' or 'dk' command"},
    { CERR_InvalidValue       , "Invalid value in exteded string"},
    { CERR_ZeroLengthString   , "A string of zero characters was found"},
    { CERR_TooManyIndexToKeyRefs  , "Too many index commands refering to key string"},
    { CERR_UnterminatedString , "Unterminated string in line"},
    { CERR_StringInVirtualKeySection  , "exted string illegal in virtual key section"},
    { CERR_AnyInVirtualKeySection  , "'any' command is illegal in virtual key section"},
    { CERR_InvalidAny         , "Invalid 'any' command"},
    { CERR_StoreDoesNotExist  , "Store referenced does not exist"},
    { CERR_BeepInVirtualKeySection  , "'beep' command is illegal in virtual key section"},
    { CERR_IndexInVirtualKeySection  ,  "'index' command is illegal in virtual key section"},
    { CERR_BadCallParams      , "CompileKeyboardFile was called with bad parameters"},
    { CERR_InfileNotExist     , "Cannot find the input file"},
    { CERR_CannotCreateOutfile, "Cannot open output file for writing"},
    { CERR_UnableToWriteFully , "Unable to write the file completely"},
    { CERR_CannotReadInfile   , "Cannot read the input file"},
    { CERR_SomewhereIGotItWrong , "Internal error: contact Keyman"},
    { CERR_BufferOverflow     , "The compiler memory buffer overflowed"},
    { CERR_Break              , "Compiler interrupted by user"},
    { CERR_CannotAllocateMemory , "Out of memory"},
    { CERR_InvalidBitmapLine  , "Invalid 'bitmaps' command"},
    { CERR_CannotReadBitmapFile , "Cannot open the bitmap or icon file for reading"},
    { CERR_IndexDoesNotPointToAny  , "An index() in the output does not have a corresponding any() statement"},
    { CERR_ReservedCharacter  , "A reserved character was found"},
    { CERR_InvalidCharacter   , "A character was found that is outside the valid Unicode range (U+0000 - U+10FFFF)"},
    { CERR_InvalidCall        , "The 'call' command is invalid"},
    { CERR_CallInVirtualKeySection  , "'call' command is illegal in virtual key section"},
    { CERR_CodeInvalidInKeyStore  , "The command is invalid inside a store that is used in a key part of the rule"},
    { CERR_CannotLoadIncludeFile  , "Cannot load the included file: it is either invalid or does not exist"},
    { CERR_60FeatureOnly_EthnologueCode  , "EthnologueCode system store requires VERSION 6.0"},
    { CERR_60FeatureOnly_MnemonicLayout  , "MnemonicLayout functionality requires VERSION 6.0"},
    { CERR_60FeatureOnly_OldCharPosMatching  , "OldCharPosMatching system store requires VERSION 6.0"},
    { CERR_60FeatureOnly_NamedCodes  , "Named character constants requires VERSION 6.0"},
    { CERR_60FeatureOnly_Contextn , "Context(n) requires VERSION 6.0"},
    { CERR_501FeatureOnly_Call , "Call() requires VERSION 5.01"},
    { CERR_InvalidNamedCode   , "Invalid named code constant"},
    { CERR_InvalidSystemStore , "Invalid system store name found"},
    { CERR_CallIsProfessionalFeature  , "Call() is only available in Keyman Developer Professional"},
    { CERR_IncludeCodesIsProfessionalFeature  , "IncludeCodes is only available in Keyman Developer Professional"},
    { CERR_MnemonicLayoutIsProfessionalFeature  , "MnemonicLayout is only available in Keyman Developer Professional"},
    { CERR_60FeatureOnly_VirtualCharKey  , "Virtual character keys require VERSION 6.0"},
    { CERR_VersionAlreadyIncluded  , "Only one VERSION or store(version) line allowed in a source file."},
    { CERR_70FeatureOnly      , "This feature requires store(version) '7.0'"},
    { CERR_80FeatureOnly      , "This feature requires store(version) '8.0'"},
    { CERR_InvalidInVirtualKeySection  , "This statement is not valid in a virtual key section"},
    { CERR_InvalidIf          , "The if() statement is not valid"},
    { CERR_InvalidReset       , "The reset() statement is not valid"},
    { CERR_InvalidSet         , "The set() statement is not valid"},
    { CERR_InvalidSave        , "The save() statement is not valid"},
    { CERR_InvalidEthnologueCode , "Invalid ethnologuecode format"},
    { CERR_90FeatureOnly_IfSystemStores  , "if(store) requires store(version) '9.0'"},
    { CERR_IfSystemStore_NotFound , "System store in if() not found"},
    { CERR_90FeatureOnly_SetSystemStores , "set(store) requires store(version) '9.0'"},
    { CERR_SetSystemStore_NotFound , "System store in set() not found"},
    { CERR_90FeatureOnlyVirtualKeyDictionary , "Custom virtual key names require store(version) '9.0'"},
    { CERR_InvalidIndex       , "Invalid 'index' command"},
    { CERR_OutsInVirtualKeySection  , "'outs' command is illegal in virtual key section"},
    { CERR_InvalidOuts        , "Invalid 'outs' command"},
    { CERR_ContextInVirtualKeySection  , "'context' command is illegal in virtual key section"},
    { CERR_InvalidUse         , "Invalid 'use' command"},
    { CERR_GroupDoesNotExist  , "Group does not exist"},
    { CERR_VirtualKeyNotAllowedHere , "Virtual key is not allowed here"},
    { CERR_InvalidSwitch      , "Invalid 'switch' command"},
    { CERR_NoTokensFound      , "No tokens found in line"},
    { CERR_InvalidLineContinuation , "Invalid line continuation"},
    { CERR_LineTooLong        , "Line too long"},
    { CERR_InvalidCopyright   , "Invalid 'copyright' command"},
    { CERR_CodeInvalidInThisSection  , "This line is invalid in this section of the file"},
    { CERR_InvalidMessage     , "Invalid 'message' command"},
    { CERR_InvalidLanguageName , "Invalid 'languagename' command"},
    { CERR_None               , "(no error)"},
    { CERR_EndOfFile          , "(no error - reserved code)"},
    { CERR_InvalidToken       , "Invalid token found"},
    { CERR_InvalidBegin       , "Invalid 'begin' command"},
    { CERR_InvalidName        , "Invalid 'name' command"},
    { CERR_InvalidVersion     , "Invalid 'version' command"},
    { CERR_InvalidLanguageLine , "Invalid 'language' command"},
    { CERR_LayoutButNoLanguage , "Layout command found but no language command"},
    { CERR_CannotCreateTempfile , "Cannot create temp file"},
    { CERR_90FeatureOnlyLayoutFile        , "Touch layout file reference requires store(version) '9.0'"},
    { CERR_90FeatureOnlyKeyboardVersion    , "KeyboardVersion system store requires store(version) '9.0'"},
    { CERR_KeyboardVersionFormatInvalid    , "KeyboardVersion format is invalid, expecting dot-separated integers"},
    { CERR_ContextExHasInvalidOffset       , "context() statement has offset out of range"},
    { CERR_90FeatureOnlyEmbedCSS           , "Embedding CSS requires store(version) '9.0'"},
    { CERR_90FeatureOnlyTargets            , "TARGETS system store requires store(version) '9.0'"},
    { CERR_ContextAndIndexInvalidInMatchNomatch , "context and index statements cannot be used in a match or nomatch statement"},
    { CERR_140FeatureOnlyContextAndNotAnyWeb  , "For web and touch platforms, context() statement referring to notany() requires store(version) '14.0'"},
    { CERR_ExpansionMustFollowCharacterOrVKey            , "An expansion must follow a character or a virtual key"},
    { CERR_VKeyExpansionMustBeFollowedByVKey             , "A virtual key expansion must be terminated by a virtual key"},
    { CERR_CharacterExpansionMustBeFollowedByCharacter   , "A character expansion must be terminated by a character key"},
    { CERR_VKeyExpansionMustUseConsistentShift           , "A virtual key expansion must use the same shift state for both terminators"},
    { CERR_ExpansionMustBePositive                       , "An expansion must have positive difference (i.e. A-Z, not Z-A)"},
    { CERR_CasedKeysMustContainOnlyVirtualKeys           , "The CasedKeys system store must contain only virtual keys or characters found on a US English keyboard"},
    { CERR_CasedKeysMustNotIncludeShiftStates            , "The CasedKeys system store must not include shift states"},
    { CERR_CasedKeysNotSupportedWithMnemonicLayout       , "The CasedKeys system store is not supported with mnemonic layouts"},
    { CERR_CannotUseReadWriteGroupFromReadonlyGroup      , "Group used from a readonly group must also be readonly"},
    { CERR_StatementNotPermittedInReadonlyGroup          , "Statement is not permitted in output of readonly group"},
    { CERR_OutputInReadonlyGroup                         , "Output is not permitted in a readonly group"},
    { CERR_NewContextGroupMustBeReadonly                 , "Group used in begin newContext must be readonly"},
    { CERR_PostKeystrokeGroupMustBeReadonly              , "Group used in begin postKeystroke must be readonly"},
    { CERR_DuplicateGroup                                , "A group with this name has already been defined."},
    { CERR_DuplicateStore                                , "A store with this name has already been defined."},
    { 0, nullptr }
  };

KMX_CHAR *GetCompilerErrorString(KMX_DWORD code)
{
  for(int i = 0; CompilerErrors[i].ErrorCode; i++) {
    if(CompilerErrors[i].ErrorCode == code) {
      return ( KMX_CHAR*) CompilerErrors[i].Text;
    }
  }
  return nullptr;
}
