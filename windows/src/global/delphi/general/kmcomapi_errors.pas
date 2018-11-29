﻿{This file has been autogenerated by C:\Projects\keyman\open\windows\bin\buildtools\stockeditor.exe - COMMessages at 31/10/2018 08:35:15}
unit kmcomapi_errors;

interface

type
  TKeymanErrorInfo = record
    Message: string;
    Source: string;
    HelpContext: Integer;
    Args: string;
  end;

const
  KMN_E_BASE = $A0000200;
  KMN_W_BASE = $20000200;

const
{ Start Message Identifiers }
  KMN_E_Install_InvalidFile = KMN_E_BASE + $0;
  KMN_E_Install_AlreadyInstalled = KMN_E_BASE + $1;
  KMN_E_Install_FailureToCreateDirectories = KMN_E_BASE + $2;
  KMN_E_Uninstall_InvalidKeyboard = KMN_E_BASE + $3;
  KMN_E_Uninstall_KeyboardPartOfPackage = KMN_E_BASE + $4;
  KMN_E_Uninstall_AdminKeyboardInstalled = KMN_E_BASE + $5;
  KMN_W_UninstallFileNotFound = KMN_W_BASE + $6;
  KMN_W_UninstallFileInUse = KMN_W_BASE + $7;
  KMN_W_UninstallError_UnableToDeleteKeyboardRegistrySetting = KMN_W_BASE + $8;
  KMN_W_UninstallError_UnableToRemoveDirectory = KMN_W_BASE + $9;
  KMN_E_PackageInstall_UnableToGetTempPath = KMN_E_BASE + $A;
  KMN_E_PackageInstall_UnableToGetTempFileName = KMN_E_BASE + $B;
  KMN_E_PackageInstall_UnableToCreateTemporaryDirectory = KMN_E_BASE + $C;
  KMN_E_PackageInstall_UnableToFindInfFile = KMN_E_BASE + $D;
  KMN_E_PackageInstall_PackageAlreadyInstalled = KMN_E_BASE + $E;
  KMN_E_PackageInstall_UnableToCopyFile = KMN_E_BASE + $F;
  KMN_W_InstallPackage_UnableToFindProgramsFolder = KMN_W_BASE + $10;
  KMN_W_InstallPackage_UnableToCreateStartMenuEntry = KMN_W_BASE + $11;
  KMN_W_InstallPackage_CannotRunExternalProgram = KMN_W_BASE + $12;
  KMN_W_InstallFont_CannotInstallFont = KMN_W_BASE + $13;
  KMN_W_InstallFont_CannotInstallFontAdmin = KMN_W_BASE + $14;
  KMN_E_Collection_InvalidIndex = KMN_E_BASE + $15;
  KMN_E_PackageUninstall_NotFound = KMN_E_BASE + $16;
  KMN_E_PackageUninstall_AdminRequired = KMN_E_BASE + $17;
  KMN_W_PackageUninstall_FileInUse = KMN_W_BASE + $18;
  KMN_W_UninstallFont_FontInUse = KMN_W_BASE + $19;
  KMN_E_VisualKeyboard_Install_AlreadyInstalled = KMN_E_BASE + $1A;
  KMN_E_VisualKeyboard_Install_CouldNotInstall = KMN_E_BASE + $1B;
  KMN_E_VisualKeyboard_Install_KeyboardNotInstalled = KMN_E_BASE + $1C;
  KMN_E_KeymanControl_CannotLoadKeyman32 = KMN_E_BASE + $1D;
  KMN_E_KeymanControl_CannotStartProduct = KMN_E_BASE + $1E;
  KMN_E_KeymanControl_CannotRegisterControllerWindow = KMN_E_BASE + $1F;
  KMN_E_KeymanControl_CannotUnregisterControllerWindow = KMN_E_BASE + $20;
  KMN_E_KeyboardInstall_UnableToCopyFile = KMN_E_BASE + $21;
  KMN_E_Install_KeyboardMustBeInstalledByAdmin = KMN_E_BASE + $22;
  KMN_W_KeyboardUninstall_ProfileNotFound = KMN_W_BASE + $23;
  KMN_E_ProfileInstall_MustBeAllUsers = KMN_E_BASE + $24;
  KMN_E_ProfileUninstall_MustBeAllUsers = KMN_E_BASE + $25;
  KMN_E_ProfileInstall_KeyboardNotFound = KMN_E_BASE + $26;
  KMN_E_RecompileMnemonicLayout_mcompileFailed = KMN_E_BASE + $27;
  KMN_E_RecompileMnemonicLayout_mcompileError = KMN_E_BASE + $28;
  KMN_E_RecompileMnemonicLayout_mcompileUnexpected = KMN_E_BASE + $29;
  KMN_W_KeyboardInstall_InvalidIcon = KMN_W_BASE + $2A;
  KMN_W_TSF_COMError = KMN_W_BASE + $2B;
  KMN_W_InstallPackage_KVK_Error = KMN_W_BASE + $2C;
  KMN_W_ProfileInstall_Win10_1803_MitigationApplied = KMN_W_BASE + $2D;
{ End Message Identifiers }

  KMN_E_LAST = $A000022D;
  KMN_W_LAST = $2000022D;

implementation

end.
