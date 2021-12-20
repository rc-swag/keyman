unit Keyman.Developer.System.KMDevServerAPI;

interface

uses
  System.Classes,
  System.Net.HttpClient,
  System.Net.Mime;

type
  TKMDevServerDebugAPI = class
  private
    class var
      FStatusChecked: Boolean;
      FngrokEnabled: Boolean;
      FngrokEndpoint: string;
    class function IsDebugObjectRegistered(const objectType, id: string): Boolean; static;
    class procedure Post(const api: string; mfd: TMultipartFormData); static;
    class function HostName: string; static;
  public
    class function Running: Boolean; static;

    class procedure StartServer; static;
    class procedure StopServer; static;

    class function IsKeyboardRegistered(const Filename: string): Boolean; static;
    class procedure RegisterKeyboard(const Filename, Version, FontFace, OskFontFace: string); static;
    class procedure UnregisterKeyboard(const Filename: string); static;

    class function IsPackageRegistered(const Filename: string): Boolean; static;
    class procedure RegisterPackage(const Filename, Name: string); static;
    class procedure UnregisterPackage(const Filename: string); static;

    class function IsModelRegistered(const Filename: string): Boolean; static;
    class procedure RegisterModel(const Filename: string); static;
    class procedure UnregisterModel(const Filename: string); static;

    class function IsFontRegistered(const Filename: string): Boolean; static;
    class procedure RegisterFont(const Filename, Facename: string); overload; static;
    class procedure RegisterFont(Filedata: TStream; const Facename: string); overload; static;
    class procedure UnregisterFont(const Facename: string); static;

    class function GetStatus: Boolean; static;
    class function UpdateStatus: Boolean; static;

    class property ngrokEnabled: Boolean read FngrokEnabled;
    class property ngrokEndpoint: string read FngrokEndpoint;
    class property StatusChecked: Boolean read FStatusChecked;
  end;

implementation

uses
  System.JSON,
  System.NetEncoding,
  System.Net.URLClient,
  System.SysUtils,
  KeymanDeveloperOptions,
  Keyman.Developer.System.KeymanDeveloperPaths,
  Keyman.System.KeyboardUtils,
  Keyman.System.LexicalModelUtils,
  utilexecute,
  utilsystem,
  Winapi.ShlObj,
  Winapi.Windows;

{ TKMDevServerDebugAPI }

class procedure TKMDevServerDebugAPI.StartServer;
var
  pi: TProcessInformation;
  sw: Integer;
begin
  if Running then
    Exit;

//  if FKeymanDeveloperOptions.WebHostKeepNGrokControlWindowVisible
//    then sw := SW_SHOWNORMAL
//    else sw := SW_HIDE;

  sw := SW_SHOWNORMAL;

  if not TUtilExecute.Execute(Format('"%s" .', [TKeymanDeveloperPaths.NodePath]),
    TKeymanDeveloperPaths.KMDevServerPath, sw, pi) then
  begin
    RaiseLastOSError; //ShowMessage(SysErrorMessage(GetLastError));
  end;

  FStatusChecked := False;
end;

function QueryFullProcessImageName(
  hProcess: THandle;
  dwFlags: DWORD;
  lpExeName: LPWSTR;
  var lpdwSize: DWORD): BOOL; stdcall; external kernel32
  name 'QueryFullProcessImageNameW';

class procedure TKMDevServerDebugAPI.StopServer;
var
  mfd: TMultipartFormData;
begin
  mfd := TMultipartFormData.Create;
  try
    Post('shutdown', mfd);
  finally
    mfd.Free;
  end;

  FStatusChecked := False;
end;

class function TKMDevServerDebugAPI.Running: Boolean;
var
  s: TStringStream;
  pid: Integer;
  h: THandle;
  buf: array[0..MAX_PATH] of char;
  sz: DWord;
  fs: TFileStream;
begin
  Result := False;

  // TODO: check a ping endpoint instead?

  if not FileExists(TKeymanDeveloperPaths.KMDevServerDataPath + 'lock.json') or
    not FileExists(TKeymanDeveloperPaths.KMDevServerDataPath + 'pid.json') then
  begin
    Exit;
  end;

  {if System.SysUtils.DeleteFile(TKeymanDeveloperPaths.KMDevServerDataPath + 'lock.json') then
  begin
    // Suggests improper shutdown of node as lock.json should not be deleteable
    // if the server is running
    Exit;
  end;}

  fs := TFileStream.Create(TKeymanDeveloperPaths.KMDevServerDataPath + 'pid.json', fmOpenRead);
  try
    s := TStringStream.Create('', TEncoding.UTF8);
    try
      s.CopyFrom(fs, 0);

      if not TryStrToInt(s.DataString.Trim, pid) then
        Exit;
    finally
      s.Free;
    end;
  finally
    fs.Free;
  end;

  // check the pid, and if it is node, we'll basically assume it's our one

  h := OpenProcess(PROCESS_ALL_ACCESS, False, pid);
  if h = 0 then
    Exit;
  try
    sz := MAX_PATH;
    if not QueryFullProcessImageName(h, 0, buf, sz) then
      Exit;
    if not SameText(ExtractFileName(buf), 'node.exe') then
      Exit;
  finally
    CloseHandle(h);
  end;

  Result := True;
end;


class function TKMDevServerDebugAPI.GetStatus: Boolean;
var
  http: THttpClient;
  res: IHTTPResponse;
  o: TJSONObject;
begin
  FngrokEnabled := False;
  FngrokEndpoint := '';

  http := THttpClient.Create;
  try
    try
      http.ConnectionTimeout := 100;
      res := http.Get(HostName+'api/status');
      Result := res.StatusCode = 200;
      if Result then
      begin
        o := TJSONObject.ParseJSONValue(res.ContentAsString) as TJSONObject;
        if not Assigned(o) then
          Exit(False);

        if not o.TryGetValue<Boolean>('ngrokEnabled', FngrokEnabled) then FngrokEnabled := False;
        if not o.TryGetValue<string>('ngrokEndpoint', FngrokEndpoint) then FngrokEndpoint := '';

        FStatusChecked := True;
      end;
    except
      Result := False;
    end;
  finally
    http.Free;
  end;
end;

class function TKMDevServerDebugAPI.HostName: string;
begin
  Result := 'http://localhost:'+FKeymanDeveloperOptions.WebHostDefaultPort.ToString+'/';
end;

class function TKMDevServerDebugAPI.IsDebugObjectRegistered(const objectType, id: string): Boolean;
var
  http: THttpClient;
  uri: TURI;
begin
  // TODO: port
  // TODO: refactor address
  uri := TURI.Create(HostName+'api/'+objectType);
  uri.AddParameter('id', id);
  http := THttpClient.Create;
  try
    try
      Result := http.Get(uri.ToString).StatusCode = 200;
    except
      Result := False;
    end;
  finally
    http.Free;
  end;
end;

class procedure TKMDevServerDebugAPI.Post(const api: string; mfd: TMultipartFormData);
var
  http: THttpClient;
begin
  try
    http := THttpClient.Create;
    try
      http.ConnectionTimeout := 100;
      http.Post(HostName+'api/'+api, mfd);
    finally
      http.Free;
    end;
  except
    ;
  end;
end;

//------------------------------------------------------------------------------
// Font API wrappers
//------------------------------------------------------------------------------

class function TKMDevServerDebugAPI.IsFontRegistered(
  const Filename: string): Boolean;
begin
  Result := IsDebugObjectRegistered('font', ExtractFileName(Filename));
end;

class procedure TKMDevServerDebugAPI.RegisterFont(const Filename,
  Facename: string);
var
  mfd: TMultipartFormData;
begin
  mfd := TMultipartFormData.Create(True);
  try
    mfd.AddField('id', Facename);
    mfd.AddFile('file', Filename);
    Post('font/register', mfd);
  finally
    mfd.Free;
  end;
end;

class procedure TKMDevServerDebugAPI.RegisterFont(Filedata: TStream;
  const Facename: string);
var
  mfd: TMultipartFormData;
begin
  mfd := TMultipartFormData.Create(True);
  try
    mfd.AddField('id', Facename);
    mfd.AddStream('file', Filedata, 'myfile.ttf', 'application/octet-stream');
    Post('font/register', mfd);
  finally
    mfd.Free;
  end;
end;

class procedure TKMDevServerDebugAPI.UnregisterFont(const Facename: string);
begin

end;

//------------------------------------------------------------------------------
// Keyboard API wrappers
//------------------------------------------------------------------------------

class function TKMDevServerDebugAPI.IsKeyboardRegistered(
  const Filename: string): Boolean;
begin
  Result := IsDebugObjectRegistered('keyboard', TKeyboardUtils.KeyboardFileNameToID(Filename));
end;

class procedure TKMDevServerDebugAPI.RegisterKeyboard(const Filename, Version,
  FontFace, OskFontFace: string);
var
  mfd: TMultipartFormData;
begin
  mfd := TMultipartFormData.Create(True);
  try
    mfd.AddField('id', TKeyboardUtils.KeyboardFileNameToID(Filename));
    if FontFace <> '' then mfd.AddField('fontFace', FontFace);
    if OskFontFace <> '' then mfd.AddField('oskFontFace', OskFontFace);
    mfd.AddFile('file', Filename);
    Post('keyboard/register', mfd);
  finally
    mfd.Free;
  end;
end;

class procedure TKMDevServerDebugAPI.UnregisterKeyboard(const Filename: string);
begin

end;

//------------------------------------------------------------------------------
// Model API wrappers
//------------------------------------------------------------------------------

class function TKMDevServerDebugAPI.IsModelRegistered(
  const Filename: string): Boolean;
begin
  Result := IsDebugObjectRegistered('model', TLexicalModelUtils.LexicalModelFileNameToID(Filename));
end;

class procedure TKMDevServerDebugAPI.RegisterModel(const Filename: string);
var
  mfd: TMultipartFormData;
begin
  mfd := TMultipartFormData.Create(True);
  try
    mfd.AddField('id', TLexicalModelUtils.LexicalModelFileNameToID(Filename));
    mfd.AddFile('file', Filename);
    Post('model/register', mfd);
  finally
    mfd.Free;
  end;
end;

class procedure TKMDevServerDebugAPI.UnregisterModel(const Filename: string);
begin

end;

//------------------------------------------------------------------------------
// Package API wrappers
//------------------------------------------------------------------------------

class function TKMDevServerDebugAPI.IsPackageRegistered(
  const Filename: string): Boolean;
begin
  Result := IsDebugObjectRegistered('package', TKeyboardUtils.KeyboardFileNameToID(Filename));
end;

class procedure TKMDevServerDebugAPI.RegisterPackage(const Filename,
  Name: string);
var
  mfd: TMultipartFormData;
begin
  mfd := TMultipartFormData.Create(True);
  try
    mfd.AddField('id', TKeyboardUtils.KeyboardFileNameToID(Filename));
    mfd.AddField('name', Name);
    mfd.AddFile('file', Filename);
    Post('package/register', mfd);
  finally
    mfd.Free;
  end;
end;

class procedure TKMDevServerDebugAPI.UnregisterPackage(const Filename: string);
begin

end;

class function TKMDevServerDebugAPI.UpdateStatus: Boolean;
begin
  if FStatusChecked
    then Result := True
    else Result := GetStatus;
end;

end.
