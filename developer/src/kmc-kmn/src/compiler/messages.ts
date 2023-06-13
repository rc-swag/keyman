import { CompilerErrorNamespace, CompilerErrorSeverity, CompilerEvent, CompilerMessageSpec as m, compilerExceptionToString as exc } from "@keymanapp/common-types";

const Namespace = CompilerErrorNamespace.KmnCompiler;
const SevInfo = CompilerErrorSeverity.Info | Namespace;
const SevHint = CompilerErrorSeverity.Hint | Namespace;
const SevWarn = CompilerErrorSeverity.Warn | Namespace;
const SevError = CompilerErrorSeverity.Error | Namespace;
const SevFatal = CompilerErrorSeverity.Fatal | Namespace;

/**
 * LogLevel comes from kmn_compiler_errors.h, for legacy compiler error messages
 */
const enum LogLevel {
  LEVEL_MASK = 0xF000,
  CODE_MASK = 0x0FFF,
  CERR_FATAL = 0x8000,
  CERR_ERROR = 0x4000,
  CERR_WARNING = 0x2000,
  CERR_HINT = 0x1000,
  CERR_INFO = 0
};

/**
 * Translate the legacy compiler error messages to Severity codes
 */
const LogLevelToSeverity: Record<number,number> = {
  [LogLevel.CERR_FATAL]:   SevFatal,
  [LogLevel.CERR_ERROR]:   SevError,
  [LogLevel.CERR_WARNING]: SevWarn,
  [LogLevel.CERR_HINT]:    SevHint,
  [LogLevel.CERR_INFO]:    SevInfo
}

export const enum KmnCompilerMessageRanges {
  RANGE_KMN_COMPILER_MIN    = 0x0001, // from kmn_compiler_errors.h
  RANGE_KMN_COMPILER_MAX    = 0x07FF, // from kmn_compiler_errors.h
  RANGE_LEXICAL_MODEL_MIN   = 0x0800, // from kmn_compiler_errors.h, deprecated -- this range will not be used in future versions
  RANGE_LEXICAL_MODEL_MAX   = 0x08FF, // from kmn_compiler_errors.h, deprecated -- this range will not be used in future versions
  RANGE_CompilerMessage_Min = 0x1000, // All compiler messages listed here must be >= this value
}

/*
  The messages in this class share the namespace with messages from
  kmn_compiler_errors.h, which are generated by kmcmplib, so values below 0x1000
  are reserved for kmcmplib messages.
*/
export class CompilerMessages {
  static Fatal_UnexpectedException = (o:{e: any}) => m(this.FATAL_UnexpectedException, `Unexpected exception: ${exc(o.e)}`);
  static FATAL_UnexpectedException = SevFatal | 0x1000;

  static Fatal_MissingWasmModule = (o:{e?: any}) => m(this.FATAL_MissingWasmModule, `Could not instantiate WASM compiler module or initialization failed: ${exc(o.e)}`);
  static FATAL_MissingWasmModule = SevFatal | 0x1001;

  static Fatal_UnableToSetCompilerOptions = () => m(this.FATAL_UnableToSetCompilerOptions, `Unable to set compiler options`);
  static FATAL_UnableToSetCompilerOptions = SevFatal | 0x1002;

  static Fatal_CallbacksNotSet = () => m(this.FATAL_CallbacksNotSet, `Callbacks were not set with init`);
  static FATAL_CallbacksNotSet = SevFatal | 0x1003;

  static Fatal_UnicodeSetOutOfRange = () => m(this.FATAL_UnicodeSetOutOfRange, `UnicodeSet buffer was too small`);
  static FATAL_UnicodeSetOutOfRange = SevFatal | 0x1004;

  static Error_UnicodeSetHasStrings = () => m(this.ERROR_UnicodeSetHasStrings, `UnicodeSet contains strings, not allowed`);
  static ERROR_UnicodeSetHasStrings = SevError | 0x1005;

  static Error_UnicodeSetHasProperties = () => m(this.ERROR_UnicodeSetHasProperties, `UnicodeSet contains properties, not allowed`);
  static ERROR_UnicodeSetHasProperties = SevError | 0x1006;

  static Error_UnicodeSetSyntaxError = () => m(this.ERROR_UnicodeSetSyntaxError, `UnicodeSet had a Syntax Error while parsing`);
  static ERROR_UnicodeSetSyntaxError = SevError | 0x1007;

  static Error_InvalidKvksFile = (o:{filename: string, e: any}) => m(this.ERROR_InvalidKvksFile,
    `Error encountered parsing ${o.filename}: ${o.e}`);
  static ERROR_InvalidKvksFile = SevError | 0x1008;

  static Warn_InvalidVkeyInKvksFile = (o:{filename: string, invalidVkey: string}) => m(this.WARN_InvalidVkeyInKvksFile,
    `Invalid virtual key ${o.invalidVkey} found in ${o.filename}`);
  static WARN_InvalidVkeyInKvksFile = SevWarn | 0x1009;
};

/**
 * This class defines messages from kmcmplib. They should correspond to codes in
 * kmn_compiler_errors.h, exclusive severity bits. For example:
 *
 * ```
 *   kmcmplib.CERR_BadCallParams = CERR_FATAL | 0x002 = 0x8002
 *   ERROR_BadCallParams = SevError | 0x0002 = 0x300000 | 0x2000 | 0x002 = 0x302002
 * ```
 *
 * CERR_ messages that are actually fatals have been renamed to FATAL_.
 *
 * Message text is defined by kmcmplib and passed through a callback.
 */
export class KmnCompilerMessages {
  static INFO_None                                            = SevInfo | 0x0000;
  static INFO_EndOfFile                                       = SevInfo | 0x0001;

  static FATAL_BadCallParams                                  = SevFatal | 0x0002;
  static FATAL_CannotAllocateMemory                           = SevFatal | 0x0004;
  static FATAL_InfileNotExist                                 = SevFatal | 0x0005;
  static FATAL_CannotCreateOutfile                            = SevFatal | 0x0006;
  static FATAL_UnableToWriteFully                             = SevFatal | 0x0007;
  static FATAL_CannotReadInfile                               = SevFatal | 0x0008;
  static FATAL_SomewhereIGotItWrong                           = SevFatal | 0x0009;

  static ERROR_InvalidToken                                   = SevError | 0x000A;
  static ERROR_InvalidBegin                                   = SevError | 0x000B;
  static ERROR_InvalidName                                    = SevError | 0x000C;
  static ERROR_InvalidVersion                                 = SevError | 0x000D;
  static ERROR_InvalidLanguageLine                            = SevError | 0x000E;
  static ERROR_LayoutButNoLanguage                            = SevError | 0x000F;
  static ERROR_InvalidLayoutLine                              = SevError | 0x0010;
  static ERROR_NoVersionLine                                  = SevError | 0x0011;
  static ERROR_InvalidGroupLine                               = SevError | 0x0012;
  static ERROR_InvalidStoreLine                               = SevError | 0x0013;
  static ERROR_InvalidCodeInKeyPartOfRule                     = SevError | 0x0014;
  static ERROR_InvalidDeadkey                                 = SevError | 0x0015;
  static ERROR_InvalidValue                                   = SevError | 0x0016;
  static ERROR_ZeroLengthString                               = SevError | 0x0017;
  static ERROR_TooManyIndexToKeyRefs                          = SevError | 0x0018;
  static ERROR_UnterminatedString                             = SevError | 0x0019;
  static ERROR_StringInVirtualKeySection                      = SevError | 0x001A;
  static ERROR_AnyInVirtualKeySection                         = SevError | 0x001B;
  static ERROR_InvalidAny                                     = SevError | 0x001C;
  static ERROR_StoreDoesNotExist                              = SevError | 0x001D;
  static ERROR_BeepInVirtualKeySection                        = SevError | 0x001E;
  static ERROR_IndexInVirtualKeySection                       = SevError | 0x001F;
  static ERROR_InvalidIndex                                   = SevError | 0x0020;
  static ERROR_OutsInVirtualKeySection                        = SevError | 0x0021;
  static ERROR_InvalidOuts                                    = SevError | 0x0022;
  static ERROR_ContextInVirtualKeySection                     = SevError | 0x0024;
  static ERROR_InvalidUse                                     = SevError | 0x0025;
  static ERROR_GroupDoesNotExist                              = SevError | 0x0026;
  static ERROR_VirtualKeyNotAllowedHere                       = SevError | 0x0027;
  static ERROR_InvalidSwitch                                  = SevError | 0x0028;
  static ERROR_NoTokensFound                                  = SevError | 0x0029;
  static ERROR_InvalidLineContinuation                        = SevError | 0x002A;
  static ERROR_LineTooLong                                    = SevError | 0x002B;
  static ERROR_InvalidCopyright                               = SevError | 0x002C;
  static ERROR_CodeInvalidInThisSection                       = SevError | 0x002D;
  static ERROR_InvalidMessage                                 = SevError | 0x002E;
  static ERROR_InvalidLanguageName                            = SevError | 0x002F;
  static ERROR_InvalidBitmapLine                              = SevError | 0x0030;
  static ERROR_CannotReadBitmapFile                           = SevError | 0x0031;
  static ERROR_IndexDoesNotPointToAny                         = SevError | 0x0032;
  static ERROR_ReservedCharacter                              = SevError | 0x0033;
  static ERROR_InvalidCharacter                               = SevError | 0x0034;
  static ERROR_InvalidCall                                    = SevError | 0x0035;
  static ERROR_CallInVirtualKeySection                        = SevError | 0x0036;
  static ERROR_CodeInvalidInKeyStore                          = SevError | 0x0037;
  static ERROR_CannotLoadIncludeFile                          = SevError | 0x0038;

  static ERROR_60FeatureOnly_EthnologueCode                   = SevError | 0x0039;
  static ERROR_60FeatureOnly_MnemonicLayout                   = SevError | 0x003A;
  static ERROR_60FeatureOnly_OldCharPosMatching               = SevError | 0x003B;
  static ERROR_60FeatureOnly_NamedCodes                       = SevError | 0x003C;
  static ERROR_60FeatureOnly_Contextn                         = SevError | 0x003D;
  static ERROR_501FeatureOnly_Call                            = SevError | 0x003E;

  static ERROR_InvalidNamedCode                               = SevError | 0x003F;
  static ERROR_InvalidSystemStore                             = SevError | 0x0040;

  static ERROR_60FeatureOnly_VirtualCharKey                   = SevError | 0x0044;

  static ERROR_VersionAlreadyIncluded                         = SevError | 0x0045;

  static ERROR_70FeatureOnly                                  = SevError | 0x0046;

  static ERROR_80FeatureOnly                                  = SevError | 0x0047;
  static ERROR_InvalidInVirtualKeySection                     = SevError | 0x0048;
  static ERROR_InvalidIf                                      = SevError | 0x0049;
  static ERROR_InvalidReset                                   = SevError | 0x004A;
  static ERROR_InvalidSet                                     = SevError | 0x004B;
  static ERROR_InvalidSave                                    = SevError | 0x004C;

  static ERROR_InvalidEthnologueCode                          = SevError | 0x004D;

  static FATAL_CannotCreateTempfile                           = SevFatal | 0x004E;

  static ERROR_90FeatureOnly_IfSystemStores                   = SevError | 0x004F;
  static ERROR_IfSystemStore_NotFound                         = SevError | 0x0050;
  static ERROR_90FeatureOnly_SetSystemStores                  = SevError | 0x0051;
  static ERROR_SetSystemStore_NotFound                        = SevError | 0x0052;
  static ERROR_90FeatureOnlyVirtualKeyDictionary              = SevError | 0x0053;

  static ERROR_NotSupportedInKeymanWebContext                 = SevError | 0x0054;
  static ERROR_NotSupportedInKeymanWebOutput                  = SevError | 0x0055;
  static ERROR_NotSupportedInKeymanWebStore                   = SevError | 0x0056;
  static ERROR_VirtualCharacterKeysNotSupportedInKeymanWeb    = SevError | 0x0057;
  static ERROR_VirtualKeysNotValidForMnemonicLayouts          = SevError | 0x0058;
  static ERROR_InvalidTouchLayoutFile                         = SevError | 0x0059;
  static ERROR_TouchLayoutInvalidIdentifier                   = SevError | 0x005A;
  static ERROR_InvalidKeyCode                                 = SevError | 0x005B;
  static ERROR_90FeatureOnlyLayoutFile                        = SevError | 0x005C;
  static ERROR_90FeatureOnlyKeyboardVersion                   = SevError | 0x005D;
  static ERROR_KeyboardVersionFormatInvalid                   = SevError | 0x005E;
  static ERROR_ContextExHasInvalidOffset                      = SevError | 0x005F;
  static ERROR_90FeatureOnlyEmbedCSS                          = SevError | 0x0060;
  static ERROR_90FeatureOnlyTargets                           = SevError | 0x0061;
  static ERROR_ContextAndIndexInvalidInMatchNomatch           = SevError | 0x0062;
  static ERROR_140FeatureOnlyContextAndNotAnyWeb              = SevError | 0x0063;

  static ERROR_ExpansionMustFollowCharacterOrVKey             = SevError | 0x0064;
  static ERROR_VKeyExpansionMustBeFollowedByVKey              = SevError | 0x0065;
  static ERROR_CharacterExpansionMustBeFollowedByCharacter    = SevError | 0x0066;
  static ERROR_VKeyExpansionMustUseConsistentShift            = SevError | 0x0067;
  static ERROR_ExpansionMustBePositive                        = SevError | 0x0068;

  static ERROR_CasedKeysMustContainOnlyVirtualKeys            = SevError | 0x0069;
  static ERROR_CasedKeysMustNotIncludeShiftStates             = SevError | 0x006A;
  static ERROR_CasedKeysNotSupportedWithMnemonicLayout        = SevError | 0x006B;

  static ERROR_CannotUseReadWriteGroupFromReadonlyGroup       = SevError | 0x006C;
  static ERROR_StatementNotPermittedInReadonlyGroup           = SevError | 0x006D;
  static ERROR_OutputInReadonlyGroup                          = SevError | 0x006E;
  static ERROR_NewContextGroupMustBeReadonly                  = SevError | 0x006F;
  static ERROR_PostKeystrokeGroupMustBeReadonly               = SevError | 0x0070;

  static ERROR_DuplicateGroup                                 = SevError | 0x0071;
  static ERROR_DuplicateStore                                 = SevError | 0x0072;

  static ERROR_RepeatedBegin                                  = SevError | 0x0073;

  static WARN_TooManyWarnings                                 = SevWarn | 0x0080;
  static WARN_OldVersion                                      = SevWarn | 0x0081;
  static WARN_BitmapNotUsed                                   = SevWarn | 0x0082;
  static WARN_CustomLanguagesNotSupported                     = SevWarn | 0x0083;
  static WARN_KeyBadLength                                    = SevWarn | 0x0084;
  static WARN_IndexStoreShort                                 = SevWarn | 0x0085;
  static WARN_UnicodeInANSIGroup                              = SevWarn | 0x0086;
  static WARN_ANSIInUnicodeGroup                              = SevWarn | 0x0087;
  static WARN_UnicodeSurrogateUsed                            = SevWarn | 0x0088;
  static WARN_ReservedCharacter                               = SevWarn | 0x0089;
  static WARN_Info                                            = SevWarn | 0x008A;
  static WARN_VirtualKeyWithMnemonicLayout                    = SevWarn | 0x008B;
  static WARN_VirtualCharKeyWithPositionalLayout              = SevWarn | 0x008C;
  static WARN_StoreAlreadyUsedAsOptionOrCall                  = SevWarn | 0x008D;
  static WARN_StoreAlreadyUsedAsStoreOrCall                   = SevWarn | 0x008E;
  static WARN_StoreAlreadyUsedAsStoreOrOption                 = SevWarn | 0x008F;

  static WARN_PunctuationInEthnologueCode                     = SevWarn | 0x0090;

  static WARN_TouchLayoutMissingLayer                         = SevWarn | 0x0091;
  static WARN_TouchLayoutCustomKeyNotDefined                  = SevWarn | 0x0092;
  static WARN_TouchLayoutMissingRequiredKeys                  = SevWarn | 0x0093;
  static WARN_HelpFileMissing                                 = SevWarn | 0x0094;
  static WARN_EmbedJsFileMissing                              = SevWarn | 0x0095;
  static WARN_TouchLayoutFileMissing                          = SevWarn | 0x0096;
  static WARN_VisualKeyboardFileMissing                       = SevWarn | 0x0097;
  static WARN_ExtendedShiftFlagsNotSupportedInKeymanWeb       = SevWarn | 0x0098;
  static WARN_TouchLayoutUnidentifiedKey                      = SevWarn | 0x0099;
  static HINT_UnreachableKeyCode                              = SevHint | 0x009A;

  static WARN_CouldNotCopyJsonFile                            = SevWarn | 0x009B;
  static WARN_PlatformNotInTargets                            = SevWarn | 0x009C;

  static WARN_HeaderStatementIsDeprecated                     = SevWarn | 0x009D;
  static WARN_UseNotLastStatementInRule                       = SevWarn | 0x009E;

  static WARN_TouchLayoutFontShouldBeSameForAllPlatforms      = SevWarn | 0x009F;
  static WARN_InvalidJSONMetadataFile                         = SevWarn | 0x00A0;
  static WARN_JSONMetadataOSKFontShouldMatchTouchFont         = SevWarn | 0x00A1;
  static WARN_KVKFileIsInSourceFormat                         = SevWarn | 0x00A2;

  static WARN_DontMixChiralAndNonChiralModifiers              = SevWarn | 0x00A3;
  static WARN_MixingLeftAndRightModifiers                     = SevWarn | 0x00A4;

  static WARN_LanguageHeadersDeprecatedInKeyman10             = SevWarn | 0x00A5;

  static HINT_NonUnicodeFile                                  = SevHint | 0x00A6;

  static WARN_TooManyErrorsOrWarnings                         = SevWarn | 0x00A7;

  static WARN_HotkeyHasInvalidModifier                        = SevWarn | 0x00A8;

  static WARN_TouchLayoutSpecialLabelOnNormalKey              = SevWarn | 0x00A9;

  static WARN_OptionStoreNameInvalid                          = SevWarn | 0x00AA;

  static WARN_NulNotFirstStatementInContext                   = SevWarn | 0x00AB;
  static WARN_IfShouldBeAtStartOfContext                      = SevWarn | 0x00AC;

  static WARN_KeyShouldIncludeNCaps                           = SevWarn | 0x00AD;

  static HINT_UnreachableRule                                 = SevHint | 0x00AE;

  static FATAL_BufferOverflow                                 = SevFatal | 0x00C0;
  static FATAL_Break                                          = SevFatal | 0x00C1;
};

export function mapErrorFromKmcmplib(line: number, code: number, msg: string): CompilerEvent {
  const severity = LogLevelToSeverity[code & LogLevel.LEVEL_MASK];
  const baseCode = code & LogLevel.CODE_MASK;
  const event: CompilerEvent = {
    line: line,
    code: severity | CompilerErrorNamespace.KmnCompiler | baseCode,
    message: msg
  };
  return event;
};
