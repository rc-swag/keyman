program Tike;

uses
  Vcl.Forms,
  Vcl.Dialogs,
  Winapi.Windows,
  System.Win.ComObj,
  Winapi.ActiveX,
  System.SysUtils,
  kmxfile in '..\..\..\common\windows\delphi\keyboards\kmxfile.pas',
  UfrmMDIChild in 'child\UfrmMDIChild.pas' {frmTikeChild},
  UfrmNew in 'dialogs\UfrmNew.pas' {frmNew},
  UfrmAboutTike in 'dialogs\UfrmAboutTike.pas' {frmAboutTike},
  RegistryKeys in '..\..\..\common\windows\delphi\general\RegistryKeys.pas',
  VersionInfo in '..\..\..\common\windows\delphi\general\VersionInfo.pas',
  compile in '..\common\delphi\compiler\compile.pas',
  KeymanDeveloperOptions in 'main\KeymanDeveloperOptions.pas',
  UfrmKeyTest in 'debug\UfrmKeyTest.pas' {frmKeyTest},
  CompilePackage in '..\common\delphi\compiler\CompilePackage.pas',
  KeymanDeveloperUtils in 'main\KeymanDeveloperUtils.pas',
  CRC32 in '..\..\..\common\windows\delphi\general\CRC32.pas',
  UfrmEditor in 'child\UfrmEditor.pas' {frmEditor},
  MenuImgList in '..\common\delphi\components\MenuImgList.pas',
  UfrmSelectKey in 'dialogs\UfrmSelectKey.pas' {frmSelectKey},
  keybtn in '..\..\..\common\windows\delphi\components\keybtn.pas',
  ttinfo in '..\..\..\common\windows\delphi\general\ttinfo.pas',
  KeyNames in '..\..\..\common\windows\delphi\general\KeyNames.pas',
  PaintPanel in '..\..\..\common\windows\delphi\components\PaintPanel.pas',
  UfrmMDIEditor in 'child\UfrmMDIEditor.pas' {frmTikeEditor},
  Keyman.Developer.UI.Project.UfrmProject in 'project\Keyman.Developer.UI.Project.UfrmProject.pas' {frmProject},
  Keyman.Developer.System.Project.ProjectFile in 'project\Keyman.Developer.System.Project.ProjectFile.pas',
  Keyman.Developer.System.Project.ProjectFileType in 'project\Keyman.Developer.System.Project.ProjectFileType.pas',
  Keyman.Developer.System.Project.ProjectFiles in 'project\Keyman.Developer.System.Project.ProjectFiles.pas',
  Keyman.Developer.System.Project.kpsProjectFile in 'project\Keyman.Developer.System.Project.kpsProjectFile.pas',
  Keyman.Developer.System.Project.kmxProjectFile in 'project\Keyman.Developer.System.Project.kmxProjectFile.pas',
  Keyman.Developer.System.Project.modelTsProjectFile in 'project\Keyman.Developer.System.Project.modelTsProjectFile.pas',
  Keyman.Developer.UI.Project.UfrmProjectSettings in 'project\Keyman.Developer.UI.Project.UfrmProjectSettings.pas' {frmProjectSettings},
  Keyman.Developer.UI.Project.ProjectFileUI in 'project\Keyman.Developer.UI.Project.ProjectFileUI.pas',
  Keyman.Developer.UI.Project.ProjectUI in 'project\Keyman.Developer.UI.Project.ProjectUI.pas',
  Keyman.Developer.UI.Project.ProjectUIFileType in 'project\Keyman.Developer.UI.Project.ProjectUIFileType.pas',
  Keyman.Developer.UI.Project.kmnProjectFileUI in 'project\Keyman.Developer.UI.Project.kmnProjectFileUI.pas',
  Keyman.Developer.UI.Project.kpsProjectFileUI in 'project\Keyman.Developer.UI.Project.kpsProjectFileUI.pas',
  Keyman.Developer.UI.Project.kmxProjectFileUI in 'project\Keyman.Developer.UI.Project.kmxProjectFileUI.pas',
  Keyman.Developer.UI.Project.kvkProjectFileUI in 'project\Keyman.Developer.UI.Project.kvkProjectFileUI.pas',
  Keyman.Developer.UI.Project.ProjectFilesUI in 'project\Keyman.Developer.UI.Project.ProjectFilesUI.pas',
  Keyman.Developer.System.Project.ProjectLog in 'project\Keyman.Developer.System.Project.ProjectLog.pas',
  Keyman.Developer.System.Project.Project in 'project\Keyman.Developer.System.Project.Project.pas',
  Keyman.Developer.System.Project.kvkProjectFile in 'project\Keyman.Developer.System.Project.kvkProjectFile.pas',
  Keyman.Developer.System.Project.ProjectLoader in 'project\Keyman.Developer.System.Project.ProjectLoader.pas',
  Keyman.Developer.System.Project.ProjectSaver in 'project\Keyman.Developer.System.Project.ProjectSaver.pas',
  VKeys in '..\..\..\common\windows\delphi\general\VKeys.pas',
  Unicode in '..\..\..\common\windows\delphi\general\Unicode.pas',
  Keyman.System.Debug.DebugUIStatus in 'main\Keyman.System.Debug.DebugUIStatus.pas',
  keymanstrings in 'rel\keymanstrings.pas',
  kwhelp in 'help\kwhelp.pas',
  UKeyBitmap in 'main\UKeyBitmap.pas',
  UfrmSelectSystemKeyboard in 'debug\UfrmSelectSystemKeyboard.pas' {frmSelectSystemKeyboard},
  RegressionTest in 'debug\RegressionTest.pas',
  DebugListView in '..\common\delphi\components\DebugListView.pas',
  DebugBitBtn in '..\common\delphi\components\DebugBitBtn.pas',
  DebugListBox in '..\common\delphi\components\DebugListBox.pas',
  GetOsVersion in '..\..\..\common\windows\delphi\general\GetOsVersion.pas',
  PackageFileFormats in '..\..\..\common\windows\delphi\packages\PackageFileFormats.pas',
  PackageInfo in '..\..\..\common\windows\delphi\packages\PackageInfo.pas',
  kmpinffile in '..\..\..\common\windows\delphi\packages\kmpinffile.pas',
  RedistFiles in 'main\RedistFiles.pas',
  UfrmBitmapEditor in 'child\UfrmBitmapEditor.pas' {frmBitmapEditor},
  VisualKeyboard in '..\..\..\common\windows\delphi\visualkeyboard\VisualKeyboard.pas',
  VisualKeyboardExportHTML in '..\..\..\common\windows\delphi\visualkeyboard\VisualKeyboardExportHTML.pas',
  VisualKeyboardParameters in '..\..\..\common\windows\delphi\visualkeyboard\VisualKeyboardParameters.pas',
  VisualKeyboardSaverXML in '..\..\..\common\windows\delphi\visualkeyboard\VisualKeyboardSaverXML.pas',
  VisualKeyboardImportXML in '..\..\..\common\windows\delphi\visualkeyboard\VisualKeyboardImportXML.pas',
  UfrmVisualKeyboardImportKMX in 'dialogs\UfrmVisualKeyboardImportKMX.pas' {frmVisualKeyboardImportKMX},
  ScanCodeMap in '..\..\..\common\windows\delphi\general\ScanCodeMap.pas',
  UfrmRegressionTestFailure in 'dialogs\UfrmRegressionTestFailure.pas' {frmRegressionTestFailure},
  XString in 'debug\XString.pas',
  debugkeyboard in 'debug\debugkeyboard.pas',
  Keyman.Developer.UI.UfrmMessageDlgWithSave in 'dialogs\Keyman.Developer.UI.UfrmMessageDlgWithSave.pas' {frmMessageDlgWithSave},
  debugdeadkeys in 'debug\debugdeadkeys.pas',
  MessageIdentifiers in 'main\MessageIdentifiers.pas',
  kpsfile in '..\common\delphi\packages\kpsfile.pas',
  Keyman.UI.UframeCEFHost in '..\..\..\common\windows\delphi\chromium\Keyman.UI.UframeCEFHost.pas' {frameCEFHost},
  klog in '..\..\..\common\windows\delphi\general\klog.pas',
  BitmapEditor in '..\common\delphi\components\BitmapEditor.pas',
  StringGridEditControlled in '..\common\delphi\components\StringGridEditControlled.pas',
  KMDevResourceStrings in 'main\KMDevResourceStrings.pas',
  httpuploader in '..\..\..\common\windows\delphi\general\httpuploader.pas',
  httpuploader_messageprocessor_forms in '..\..\..\common\windows\delphi\general\httpuploader_messageprocessor_forms.pas',
  utilsystem in '..\..\..\common\windows\delphi\general\utilsystem.pas',
  utilfiletypes in '..\..\..\common\windows\delphi\general\utilfiletypes.pas',
  UfrmNewFileDetails in 'dialogs\UfrmNewFileDetails.pas' {frmNewFileDetails},
  StockFileNames in '..\..\..\common\windows\delphi\general\StockFileNames.pas',
  CompileKeymanWeb in 'compile\CompileKeymanWeb.pas',
  KeymanWebKeyCodes in 'compile\KeymanWebKeyCodes.pas',
  utildir in '..\..\..\common\windows\delphi\general\utildir.pas',
  ADOX_TLB in '..\..\..\common\windows\delphi\tlb\ADOX_TLB.pas',
  ADODB_TLB in '..\..\..\common\windows\delphi\tlb\ADODB_TLB.pas',
  utilhttp in '..\..\..\common\windows\delphi\general\utilhttp.pas',
  mrulist in 'main\mrulist.pas',
  Upload_Settings in '..\..\..\common\windows\delphi\general\Upload_Settings.pas',
  FixedTrackbar in '..\..\..\common\windows\delphi\components\FixedTrackbar.pas',
  utilstr in '..\..\..\common\windows\delphi\general\utilstr.pas',
  utilkeyboard in '..\..\..\common\windows\delphi\keyboards\utilkeyboard.pas',
  KeyboardParser in 'main\KeyboardParser.pas',
  TextFileFormat in '..\common\delphi\general\TextFileFormat.pas',
  KMDActions in '..\common\delphi\components\KMDActions.pas',
  KMDActionInterfaces in '..\common\delphi\components\KMDActionInterfaces.pas',
  UfrmHelp in 'main\UfrmHelp.pas' {frmHelp},
  OnScreenKeyboard in '..\..\..\common\windows\delphi\components\OnScreenKeyboard.pas',
  ExtShiftState in '..\..\..\common\windows\delphi\visualkeyboard\ExtShiftState.pas',
  CleartypeDrawCharacter in '..\..\..\common\windows\delphi\general\CleartypeDrawCharacter.pas',
  CharMapDropTool in 'main\CharMapDropTool.pas',
  UfrmBitmapEditorText in 'dialogs\UfrmBitmapEditorText.pas' {frmBitmapEditorText},
  UFixFontDialogBold in 'main\UFixFontDialogBold.pas',
  UnicodeData in '..\..\..\common\windows\delphi\charmap\UnicodeData.pas',
  CharacterDragObject in '..\..\..\common\windows\delphi\charmap\CharacterDragObject.pas',
  CharacterMapSettings in '..\..\..\common\windows\delphi\charmap\CharacterMapSettings.pas',
  CharacterRanges in '..\..\..\common\windows\delphi\charmap\CharacterRanges.pas',
  CharMapInsertMode in '..\..\..\common\windows\delphi\charmap\CharMapInsertMode.pas',
  UfrmCharacterMapFilter in '..\..\..\common\windows\delphi\charmap\UfrmCharacterMapFilter.pas' {frmCharacterMapFilter},
  UfrmUnicodeDataStatus in '..\..\..\common\windows\delphi\charmap\UfrmUnicodeDataStatus.pas' {frmUnicodeDataStatus},
  UfrmDebugStatus_RegTest in 'debug\UfrmDebugStatus_RegTest.pas' {frmDebugStatus_RegTest},
  UfrmDebugStatus_Events in 'debug\UfrmDebugStatus_Events.pas' {frmDebugStatus_Events},
  UfrmDebugStatus_Deadkeys in 'debug\UfrmDebugStatus_Deadkeys.pas' {frmDebugStatus_DeadKeys},
  UfrmDebugStatus_Elements in 'debug\UfrmDebugStatus_Elements.pas' {frmDebugStatus_Elements},
  UfrmDebugStatus in 'child\UfrmDebugStatus.pas' {frmDebugStatus},
  UfrmDebugStatus_Key in 'debug\UfrmDebugStatus_Key.pas' {frmDebugStatus_Key},
  UfrmDebugStatus_Child in 'debug\UfrmDebugStatus_Child.pas' {frmDebugStatus_Child},
  Keyman.Developer.UI.TikeOnlineUpdateCheck in 'update\Keyman.Developer.UI.TikeOnlineUpdateCheck.pas',
  Keyman.Developer.UI.UfrmTikeOnlineUpdateNewVersion in 'update\Keyman.Developer.UI.UfrmTikeOnlineUpdateNewVersion.pas' {frmTikeOnlineUpdateNewVersion},
  DebugPaths in '..\..\..\common\windows\delphi\general\DebugPaths.pas',
  UfrmDownloadProgress in 'main\UfrmDownloadProgress.pas' {frmDownloadProgress},
  UframeOnScreenKeyboardEditor in 'main\UframeOnScreenKeyboardEditor.pas' {frameOnScreenKeyboardEditor},
  UfrmOSKEditor in 'child\UfrmOSKEditor.pas' {frmOSKEditor},
  utilxml in '..\..\..\common\windows\delphi\general\utilxml.pas',
  UfrmTike in 'main\UfrmTike.pas' {TikeForm},
  Keyman.Developer.UI.UfrmTikeOnlineUpdateSetup in 'update\Keyman.Developer.UI.UfrmTikeOnlineUpdateSetup.pas' {frmTikeOnlineUpdateSetup},
  Keyman.Developer.System.TikeOnlineUpdateCheckMessages in 'update\Keyman.Developer.System.TikeOnlineUpdateCheckMessages.pas',
  VisualKeyboardExportBMP in '..\..\..\common\windows\delphi\visualkeyboard\VisualKeyboardExportBMP.pas',
  VisualKeyboardExportPNG in '..\..\..\common\windows\delphi\visualkeyboard\VisualKeyboardExportPNG.pas',
  MSXML2_TLB in '..\..\..\common\windows\delphi\tlb\MSXML2_TLB.pas',
  CharacterInfo in 'main\CharacterInfo.pas',
  CompilePackageInstaller in '..\common\delphi\compiler\CompilePackageInstaller.pas',
  UTikeDebugMode in 'main\UTikeDebugMode.pas',
  kmxfileconsts in '..\..\..\common\windows\delphi\keyboards\kmxfileconsts.pas',
  kmxfileutils in '..\..\..\common\windows\delphi\keyboards\kmxfileutils.pas',
  UfrmSelectWindowsLanguages in 'dialogs\languages\UfrmSelectWindowsLanguages.pas' {frmSelectWindowsLanguages: TTntForm},
  Keyman.Developer.UI.UfrmSelectBCP47Language in 'dialogs\languages\Keyman.Developer.UI.UfrmSelectBCP47Language.pas' {frmSelectBCP47Language: TTntForm},
  WindowsLanguages in '..\common\delphi\general\WindowsLanguages.pas',
  wininet5 in '..\..\..\common\windows\delphi\general\wininet5.pas',
  TextFileTemplates in 'main\TextFileTemplates.pas',
  GlobalProxySettings in '..\..\..\common\windows\delphi\general\GlobalProxySettings.pas',
  UfrmFontHelper in 'dialogs\UfrmFontHelper.pas' {Form1},
  VKeyChars in '..\..\..\common\windows\delphi\general\VKeyChars.pas',
  usp10 in '..\..\..\common\windows\delphi\general\usp10.pas',
  UserMessages in '..\..\..\common\windows\delphi\general\UserMessages.pas',
  ErrorControlledRegistry in '..\..\..\common\windows\delphi\vcl\ErrorControlledRegistry.pas',
  UframeBitmapEditor in 'main\UframeBitmapEditor.pas' {frameBitmapEditor: TFrame},
  UfrmMessages in 'main\UfrmMessages.pas' {frmMessages},
  dmActionsKeyboardEditor in 'actions\dmActionsKeyboardEditor.pas' {modActionsKeyboardEditor: TDataModule},
  dmActionsMain in 'actions\dmActionsMain.pas' {modActionsMain: TDataModule},
  dmActionsTextEditor in 'actions\dmActionsTextEditor.pas' {modActionsTextEditor: TDataModule},
  UfrmCharacterMapNew in '..\..\..\common\windows\delphi\charmap\UfrmCharacterMapNew.pas' {frmCharacterMapNew},
  UframeTextEditor in 'main\UframeTextEditor.pas' {frameTextEditor},
  UfrmVisualKeyboardExportBMPParams in '..\..\..\common\windows\delphi\visualkeyboard\UfrmVisualKeyboardExportBMPParams.pas' {frmVisualKeyboardExportBMPParams},
  UfrmVisualKeyboardExportHTMLParams in '..\..\..\common\windows\delphi\visualkeyboard\UfrmVisualKeyboardExportHTMLParams.pas' {frmVisualKeyboardExportHTMLParams},
  UfrmVisualKeyboardKeyBitmap in '..\..\..\common\windows\delphi\visualkeyboard\UfrmVisualKeyboardKeyBitmap.pas' {frmVisualKeyboardKeyBitmap},
  UfrmOptions in 'dialogs\UfrmOptions.pas' {frmOptions},
  UfrmDebug in 'child\UfrmDebug.pas' {frmDebug},
  UfrmPackageEditor in 'child\UfrmPackageEditor.pas' {frmPackageEditor},
  utilexecute in '..\..\..\common\windows\delphi\general\utilexecute.pas',
  KeymanVersion in '..\..\..\common\windows\delphi\general\KeymanVersion.pas',
  CaptionPanel in '..\common\\delphi\components\CaptionPanel.pas',
  Glossary in '..\..\..\common\windows\delphi\general\Glossary.pas',
  UframeTouchLayoutBuilder in 'oskbuilder\UframeTouchLayoutBuilder.pas' {frameTouchLayoutBuilder},
  TouchLayoutUtils in 'oskbuilder\TouchLayoutUtils.pas',
  UfrmSelectTouchLayoutTemplate in 'oskbuilder\UfrmSelectTouchLayoutTemplate.pas' {frmSelectTouchLayoutTemplate},
  OnScreenKeyboardData in '..\..\..\common\windows\delphi\visualkeyboard\OnScreenKeyboardData.pas',
  TouchLayout in 'oskbuilder\TouchLayout.pas',
  TouchLayoutDefinitions in 'oskbuilder\TouchLayoutDefinitions.pas',
  CharMapDropTool_TntCustomEdit in 'main\CharMapDropTool_TntCustomEdit.pas',
  Winapi.UxTheme,
  CheckboxGridHelper in 'main\CheckboxGridHelper.pas',
  UfrmAddKeyboardFeature in 'dialogs\UfrmAddKeyboardFeature.pas' {frmAddKeyboardFeature},
  LeftTabbedPageControl in '..\common\delphi\components\LeftTabbedPageControl.pas',
  UmodWebHttpServer in 'web\UmodWebHttpServer.pas' {modWebHttpServer: TDataModule},
  TempFileManager in '..\..\..\common\windows\delphi\general\TempFileManager.pas',
  UfrmKeymanWizard in 'child\UfrmKeymanWizard.pas' {frmKeymanWizard},
  UfrmKeyboardFonts in 'dialogs\UfrmKeyboardFonts.pas' {frmKeyboardFonts},
  CompileErrorCodes in '..\common\delphi\compiler\CompileErrorCodes.pas',
  KeyboardFonts in '..\common\delphi\general\KeyboardFonts.pas',
  JsonUtil in '..\..\..\common\windows\delphi\general\JsonUtil.pas',
  TikeUnicodeData in 'main\TikeUnicodeData.pas',
  UKeymanTargets in '..\common\delphi\general\UKeymanTargets.pas',
  UfrmSMTPSetup in 'dialogs\UfrmSMTPSetup.pas' {frmSMTPSetup},
  UfrmSendURLsToEmail in 'dialogs\UfrmSendURLsToEmail.pas' {frmSendURLsToEmail},
  MSXMLDomCreate in '..\..\..\common\windows\delphi\general\MSXMLDomCreate.pas',
  webhelp in 'help\webhelp.pas',
  Vcl.Themes,
  Vcl.Styles,
  UfrmMain in 'main\UfrmMain.pas' {frmKeymanDeveloper},
  UfrmCharacterIdentifier in 'main\UfrmCharacterIdentifier.pas' {frmCharacterIdentifier},
  utilcheckfontchars in '..\..\..\common\windows\delphi\charmap\utilcheckfontchars.pas',
  findfonts in '..\..\..\common\windows\delphi\general\findfonts.pas',
  KeymanPaths in '..\..\..\common\windows\delphi\general\KeymanPaths.pas',
  VisualKeyboardLoaderXML in '..\..\..\common\windows\delphi\visualkeyboard\VisualKeyboardLoaderXML.pas',
  VisualKeyboardExportXML in '..\..\..\common\windows\delphi\visualkeyboard\VisualKeyboardExportXML.pas',
  VisualKeyboardLoaderBinary in '..\..\..\common\windows\delphi\visualkeyboard\VisualKeyboardLoaderBinary.pas',
  VisualKeyboardSaverBinary in '..\..\..\common\windows\delphi\visualkeyboard\VisualKeyboardSaverBinary.pas',
  DropTarget in 'main\DropTarget.pas',
  CloseButtonPageControl in '..\common\delphi\components\CloseButtonPageControl.pas',
  UfrmTIKEDock in 'dockforms\UfrmTIKEDock.pas' {TIKEDockForm},
  KeymanDeveloperDebuggerMemo in '..\common\delphi\components\KeymanDeveloperDebuggerMemo.pas',
  UfrmCharacterMapDock in 'dockforms\UfrmCharacterMapDock.pas' {frmCharacterMapDock},
  Keyman.System.PackageInfoRefreshKeyboards in '..\common\delphi\packages\Keyman.System.PackageInfoRefreshKeyboards.pas',
  Keyman.System.Standards.ISO6393ToBCP47Registry in '..\..\..\common\windows\delphi\standards\Keyman.System.Standards.ISO6393ToBCP47Registry.pas',
  Keyman.System.Standards.LCIDToBCP47Registry in '..\..\..\common\windows\delphi\standards\Keyman.System.Standards.LCIDToBCP47Registry.pas',
  Keyman.System.KeyboardJSInfo in '..\common\delphi\keyboards\Keyman.System.KeyboardJSInfo.pas',
  Keyman.System.KeyboardUtils in '..\common\delphi\keyboards\Keyman.System.KeyboardUtils.pas',
  BCP47Tag in '..\..\..\common\windows\delphi\general\BCP47Tag.pas',
  Keyman.System.KMXFileLanguages in '..\common\delphi\keyboards\Keyman.System.KMXFileLanguages.pas',
  Keyman.System.LanguageCodeUtils in '..\..\..\common\windows\delphi\general\Keyman.System.LanguageCodeUtils.pas',
  Keyman.System.RegExGroupHelperRSP19902 in '..\..\..\common\windows\delphi\vcl\Keyman.System.RegExGroupHelperRSP19902.pas',
  Keyman.System.UpdateCheckResponse in '..\..\..\common\windows\delphi\general\Keyman.System.UpdateCheckResponse.pas',
  Keyman.Developer.System.HelpTopics in 'help\Keyman.Developer.System.HelpTopics.pas',
  Keyman.System.Standards.BCP47SubtagRegistry in '..\..\..\common\windows\delphi\standards\Keyman.System.Standards.BCP47SubtagRegistry.pas',
  Keyman.System.Standards.BCP47SuppressScriptRegistry in '..\..\..\common\windows\delphi\standards\Keyman.System.Standards.BCP47SuppressScriptRegistry.pas',
  Keyman.System.CanonicalLanguageCodeUtils in '..\..\..\common\windows\delphi\general\Keyman.System.CanonicalLanguageCodeUtils.pas',
  Keyman.System.CEFManager in '..\..\..\common\windows\delphi\chromium\Keyman.System.CEFManager.pas',
  Keyman.Developer.System.HttpServer.App in 'http\Keyman.Developer.System.HttpServer.App.pas',
  Keyman.System.HttpServer.Base in '..\..\..\common\windows\delphi\web\Keyman.System.HttpServer.Base.pas',
  Keyman.Developer.System.HttpServer.AppSource in 'http\Keyman.Developer.System.HttpServer.AppSource.pas',
  Keyman.UI.FontUtils in 'main\Keyman.UI.FontUtils.pas',
  Keyman.Developer.System.TouchLayoutToVisualKeyboardConverter in '..\kmconvert\Keyman.Developer.System.TouchLayoutToVisualKeyboardConverter.pas',
  Keyman.Developer.System.Project.kmnProjectFileAction in 'project\Keyman.Developer.System.Project.kmnProjectFileAction.pas',
  Keyman.Developer.System.Project.kpsProjectFileAction in 'project\Keyman.Developer.System.Project.kpsProjectFileAction.pas',
  Keyman.Developer.UI.Project.UfrmNewProjectParameters in 'project\Keyman.Developer.UI.Project.UfrmNewProjectParameters.pas' {frmNewProjectParameters},
  Keyman.Developer.UI.Project.UfrmNewProject in 'project\Keyman.Developer.UI.Project.UfrmNewProject.pas' {frmNewProject},
  Keyman.Developer.System.KeyboardProjectTemplate in '..\kmconvert\Keyman.Developer.System.KeyboardProjectTemplate.pas',
  Keyman.Developer.UI.ImportWindowsKeyboardDialogManager in 'main\Keyman.Developer.UI.ImportWindowsKeyboardDialogManager.pas',
  Keyman.Developer.System.ImportWindowsKeyboard in '..\kmconvert\Keyman.Developer.System.ImportWindowsKeyboard.pas',
  Keyman.Developer.System.ImportKeyboardDLL in '..\kmconvert\Keyman.Developer.System.ImportKeyboardDLL.pas',
  Keyman.System.Util.RenderLanguageIcon in '..\..\..\common\windows\delphi\ui\Keyman.System.Util.RenderLanguageIcon.pas',
  Keyman.System.PackageInfoRefreshLexicalModels in '..\common\delphi\packages\Keyman.System.PackageInfoRefreshLexicalModels.pas',
  Keyman.System.LexicalModelUtils in '..\common\delphi\lexicalmodels\Keyman.System.LexicalModelUtils.pas',
  Keyman.Developer.System.Project.kmnProjectFile in 'project\Keyman.Developer.System.Project.kmnProjectFile.pas',
  Keyman.Developer.System.Project.modelTsProjectFileAction in 'project\Keyman.Developer.System.Project.modelTsProjectFileAction.pas',
  Keyman.Developer.System.LexicalModelCompile in '..\common\delphi\lexicalmodels\Keyman.Developer.System.LexicalModelCompile.pas',
  Keyman.Developer.UI.Project.modelTsProjectFileUI in 'project\Keyman.Developer.UI.Project.modelTsProjectFileUI.pas',
  Keyman.Developer.System.ModelProjectTemplate in '..\kmconvert\Keyman.Developer.System.ModelProjectTemplate.pas',
  Keyman.Developer.System.ProjectTemplate in '..\kmconvert\Keyman.Developer.System.ProjectTemplate.pas',
  Keyman.Developer.UI.Project.UfrmNewModelProjectParameters in 'project\Keyman.Developer.UI.Project.UfrmNewModelProjectParameters.pas' {frmNewModelProjectParameters},
  Keyman.Developer.System.Project.wordlistTsvProjectFile in 'project\Keyman.Developer.System.Project.wordlistTsvProjectFile.pas',
  Keyman.Developer.UI.UframeWordlistEditor in 'child\Keyman.Developer.UI.UframeWordlistEditor.pas' {frameWordlistEditor},
  Keyman.System.WordlistTsvFile in '..\common\delphi\lexicalmodels\Keyman.System.WordlistTsvFile.pas',
  Keyman.Developer.UI.Project.wordlistTsvProjectFileUI in 'project\Keyman.Developer.UI.Project.wordlistTsvProjectFileUI.pas',
  Keyman.Developer.System.Project.WelcomeRenderer in 'project\Keyman.Developer.System.Project.WelcomeRenderer.pas',
  Browse4Folder in '..\ext\browse4folder\Browse4Folder.pas',
  DelphiZXIngQRCode in '..\ext\zxingqrcode\Source\DelphiZXIngQRCode.pas',
  Keyman.System.QRCode in 'main\Keyman.System.QRCode.pas',
  Keyman.Developer.UI.UfrmModelEditor in 'child\Keyman.Developer.UI.UfrmModelEditor.pas' {frmModelEditor},
  Keyman.Developer.System.LexicalModelParser in 'main\Keyman.Developer.System.LexicalModelParser.pas',
  Keyman.Developer.System.LexicalModelParserTypes in 'main\Keyman.Developer.System.LexicalModelParserTypes.pas',
  Keyman.Developer.UI.UfrmWordlistEditor in 'child\Keyman.Developer.UI.UfrmWordlistEditor.pas' {frmWordlistEditor},
  Keyman.Developer.UI.dmActionsModelEditor in 'actions\Keyman.Developer.UI.dmActionsModelEditor.pas' {modActionsModelEditor: TDataModule},
  UfrmMustIncludeDebug in 'dialogs\UfrmMustIncludeDebug.pas' {frmMustIncludeDebug},
  Sentry.Client in '..\..\..\common\windows\delphi\ext\sentry\Sentry.Client.pas',
  Sentry.Client.Vcl in '..\..\..\common\windows\delphi\ext\sentry\Sentry.Client.Vcl.pas',
  sentry in '..\..\..\common\windows\delphi\ext\sentry\sentry.pas',
  Keyman.System.KeymanSentryClient in '..\..\..\common\windows\delphi\general\Keyman.System.KeymanSentryClient.pas',
  Keyman.System.Standards.LangTagsRegistry in '..\..\..\common\windows\delphi\standards\Keyman.System.Standards.LangTagsRegistry.pas',
  Keyman.Developer.System.Project.UrlRenderer in 'project\Keyman.Developer.System.Project.UrlRenderer.pas',
  Keyman.System.KeymanCore in 'main\Keyman.System.KeymanCore.pas',
  Keyman.System.KeymanCoreDebug in 'main\Keyman.System.KeymanCoreDebug.pas',
  UfrmDebugStatus_CallStack in 'debug\UfrmDebugStatus_CallStack.pas' {frmDebugStatus_CallStack},
  Keyman.System.Debug.DebugEvent in 'debug\Keyman.System.Debug.DebugEvent.pas',
  Keyman.System.Debug.DebugCore in 'debug\Keyman.System.Debug.DebugCore.pas',
  Keyman.System.VisualKeyboardImportKMX in 'main\Keyman.System.VisualKeyboardImportKMX.pas',
  Keyman.UI.Debug.CharacterGridRenderer in 'debug\Keyman.UI.Debug.CharacterGridRenderer.pas',
  UfrmDebugStatus_Platform in 'debug\UfrmDebugStatus_Platform.pas' {frmDebugStatus_Platform},
  UfrmDebugStatus_Options in 'debug\UfrmDebugStatus_Options.pas' {frmDebugStatus_Options},
  Keyman.Developer.System.KeymanDeveloperPaths in 'main\Keyman.Developer.System.KeymanDeveloperPaths.pas',
  Keyman.Developer.System.ValidateKpsFile in '..\common\delphi\compiler\Keyman.Developer.System.ValidateKpsFile.pas',
  Keyman.Developer.UI.UfrmServerOptions in 'dialogs\Keyman.Developer.UI.UfrmServerOptions.pas' {frmServerOptions},
  Keyman.Developer.System.ServerAPI in 'http\Keyman.Developer.System.ServerAPI.pas',
  Keyman.System.FontLoadUtil in 'main\Keyman.System.FontLoadUtil.pas';

{$R *.RES}
{$R ICONS.RES}
{$R VERSION.RES}
{$R MANIFEST.RES}

// CEF3 needs to set the LARGEADDRESSAWARE flag which allows 32-bit processes to use up to 3GB of RAM.
// If you don't add this flag the rederer process will crash when you try to load large images.
{$SetPEFlags IMAGE_FILE_LARGE_ADDRESS_AWARE}

const
  LOGGER_DEVELOPER_IDE_TIKE = TKeymanSentryClient.LOGGER_DEVELOPER_IDE + '.tike';
begin
  TKeymanSentryClient.Start(TSentryClientVcl, kscpDeveloper, LOGGER_DEVELOPER_IDE_TIKE);
  try
    try
      CoInitFlags := COINIT_APARTMENTTHREADED;

      FInitializeCEF := TCEFManager.Create;
      try
        if FInitializeCEF.Start then
        begin
          InitThemeLibrary;
          SetThemeAppProperties(STAP_ALLOW_NONCLIENT or STAP_ALLOW_CONTROLS or STAP_ALLOW_WEBCONTENT);
          Application.MainFormOnTaskBar := True;
          Application.Initialize;
        //  TStyleManager.TrySetStyle(FKeymanDeveloperOptions.DisplayTheme);
          Application.Title := 'Keyman Developer';
          //TBX.TBXSetTheme('OfficeXP2');
          if TikeActive then Exit;
          Application.CreateForm(TmodWebHttpServer, modWebHttpServer);
          try
            Application.CreateForm(TfrmKeymanDeveloper, frmKeymanDeveloper);
            Application.Run;
          finally
            FreeAndNil(modWebHttpServer);
          end;
        end;
      finally
        FInitializeCEF.Free;
      end;
    except
      on E:Exception do
        SentryHandleException(E);
    end;
  finally
    TKeymanSentryClient.Stop;
  end;
end.
