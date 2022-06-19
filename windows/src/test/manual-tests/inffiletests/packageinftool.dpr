program packageinftool;

{$APPTYPE CONSOLE}

{$R *.res}

uses
  System.SysUtils,
  PackageInfo in '..\..\global\delphi\general\PackageInfo.pas',
  utilfiletypes in '..\..\global\delphi\general\utilfiletypes.pas',
  utilstr in '..\..\global\delphi\general\utilstr.pas',
  StockFileNames in '..\..\global\delphi\cust\StockFileNames.pas',
  Unicode in '..\..\..\..\common\windows\delphi\general\Unicode.pas',
  KeymanVersion in '..\..\..\..\common\windows\delphi\general\KeymanVersion.pas',
  VersionInfo in '..\..\global\delphi\general\VersionInfo.pas',
  utilsystem in '..\..\global\delphi\general\utilsystem.pas',
  utilexecute in '..\..\global\delphi\general\utilexecute.pas',
  utildir in '..\..\global\delphi\general\utildir.pas',
  RegistryKeys in '..\..\..\..\common\windows\delphi\general\RegistryKeys.pas',
  GetOsVersion in '..\..\..\..\common\windows\delphi\general\GetOsVersion.pas',
  kpsfile in '..\..\global\delphi\general\kpsfile.pas',
  PackageFileFormats in '..\..\global\delphi\general\PackageFileFormats.pas',
  packageinf in 'packageinf.pas',
  kmpinffile in '..\..\global\delphi\general\kmpinffile.pas',
  JsonUtil in '..\..\global\delphi\general\JsonUtil.pas';

begin
  try
    run
    { TODO -oUser -cConsole Main : Insert code here }
  except
    on E: Exception do
      Writeln(E.ClassName, ': ', E.Message);
  end;
end.
