/*
  Name:             calldll
  Copyright:        Copyright (C) SIL International.
  Documentation:    
  Description:      
  Create Date:      11 Mar 2009

  Modified Date:    13 Oct 2014
  Authors:          mcdurdin
  Related Files:    
  Dependencies:     

  Bugs:             
  Todo:             
  Notes:            
  History:          11 Mar 2009 - mcdurdin - I1894 - Fix threading bugs introduced in I1888
                    11 Dec 2009 - mcdurdin - I934 - x64 - Initial version
                    12 Mar 2010 - mcdurdin - I934 - x64 - Complete
                    12 Mar 2010 - mcdurdin - I2229 - Remove hints and warnings
                    04 May 2010 - mcdurdin - I2351 - Robustness - verify _td return value
                    03 Oct 2011 - mcdurdin - I3094 - IMX DLLs do not support x64
                    03 Oct 2011 - mcdurdin - I3091 - KMGetContext crashes with assertion failure due to buffer size mismatch
                    24 Jan 2012 - mcdurdin - I3173 - Keyman Developer crash when unloading forced keyboard in rare cases
                    04 Nov 2012 - mcdurdin - I3525 - V9.0 - Merge of I3173 - Keyman can crash when Keyman_StopForcingKeyboard called and keyboard is not already forced
                    05 Nov 2012 - mcdurdin - I3547 - V9.0 Use _countof to tidyup code
                    13 Oct 2014 - mcdurdin - I4452 - V9.0 - Chinese keyboard is not working correctly
*/

#include "pch.h"

typedef BOOL (WINAPI *InitDllFunction)(PSTR name);

/* Add a dll to the list of dlls associated with the keyboard */ 
// core processor implmentation also uses the 
static LPIMDLL AddIMDLL(LPINTKEYBOARDINFO lpkbi, LPSTR kbdpath, LPSTR dllfilename)
{
	DWORD j;
  SendDebugMessageFormat(0, sdmKeyboard, 0, "AddIMDLL: Enter");
	for(j = 0; j < lpkbi->nIMDLLs; j++)
		if(!_stricmp(lpkbi->IMDLLs[j].Filename, dllfilename)) break;

	if(j < lpkbi->nIMDLLs) return &lpkbi->IMDLLs[j];

	char drive[_MAX_DRIVE], dir[_MAX_DIR], fullname[_MAX_PATH], newdllname[_MAX_FNAME];

	strcpy_s(fullname, _countof(fullname), kbdpath);
	_splitpath_s(fullname, drive, _countof(drive), dir, _countof(dir), NULL, 0, NULL, 0);   // I3547

#ifdef _WIN64
  char dllname[_MAX_FNAME], dllext[_MAX_EXT], newdllext[_MAX_EXT];   // I3094
  _splitpath_s(dllfilename, NULL, 0, NULL, 0, dllname, _countof(dllname), dllext, _countof(dllext));   // I3547
  strcpy_s(newdllext, _countof(newdllext), ".x64");   // I3547
  strcat_s(newdllext, _countof(newdllext), dllext);   // I3547
  _makepath_s(fullname, _countof(fullname), drive, dir, dllname, newdllext);   // I3547
  _makepath_s(newdllname, _countof(newdllname), NULL, NULL, dllname, newdllext);   // I3547
#else
	_makepath_s(fullname, _countof(fullname), drive, dir, dllfilename, NULL);   // I3547
  strcpy_s(newdllname, _countof(newdllname), dllfilename);  // I3094   // I3547
#endif

	/* Load the DLL */

	HINSTANCE hModule = LoadLibrary(fullname); // Try keyboard dir first
	if(!hModule) hModule = LoadLibrary(newdllname); // Try anywhere on the path -- LIBRARY_NAME dir first  // I3094
        if (!hModule) {
          SendDebugMessageFormat(0, sdmKeyboard, 0, "AddIMDLL: hModule not loadded fullname[%s] newdllname[%s]", fullname, newdllname);
          return NULL;
        }
	/* Initialise the DLL */

	InitDllFunction idf = (InitDllFunction) GetProcAddress(hModule, "KeymanIMInit");
	if(idf && !(*idf)(lpkbi->Name))
	{
		FreeLibrary(hModule);
		return NULL;
	}
	
	/* Add the DLL to the list of DLLs */

	LPIMDLL imd = new IMDLL[lpkbi->nIMDLLs + 1];
	if(lpkbi->nIMDLLs > 0)
	{
		memcpy(imd, lpkbi->IMDLLs, sizeof(IMDLL) * lpkbi->nIMDLLs);
		delete lpkbi->IMDLLs;
	}
	lpkbi->IMDLLs = imd;
	strncpy(imd->Filename, dllfilename, 255);
	imd->Filename[255] = 0;
	imd->nHooks = 0;
	imd->Hooks = NULL;
	imd->hModule = hModule;
	lpkbi->nIMDLLs++;
        SendDebugMessageFormat(0, sdmKeyboard, 0, "AddIMDLL: Exit");
	return imd;
}

/* Add a dll hook function to the list of hook functions associated with a single dll */

static BOOL AddIMDLLHook(LPIMDLL imd, LPSTR funcname, DWORD storeno, PWCHAR *dpString)
{
  SendDebugMessageFormat(0, sdmKeyboard, 0, "AddIMDLLHook: Enter");
  /* Get the procedure address for the function */

	IMDLLHOOKProc dhp = (IMDLLHOOKProc) GetProcAddress(imd->hModule, funcname);
	if(!dhp) return FALSE;

	/* Add the function to the list of functions in the DLL */

	LPIMDLLHOOK hooks = new IMDLLHOOK[imd->nHooks+1];
	if(imd->nHooks > 0)
	{
		memcpy(hooks, imd->Hooks, sizeof(IMDLLHOOK) * imd->nHooks);
		delete imd->Hooks;
	}
	imd->Hooks = hooks;
	strncpy(imd->Hooks[imd->nHooks].name, funcname, 31);
	imd->Hooks[imd->nHooks].name[31] = 0;
	imd->Hooks[imd->nHooks].storeno = storeno;
	imd->Hooks[imd->nHooks].function = dhp;
	*dpString = (PWCHAR) &imd->Hooks[imd->nHooks++];
        SendDebugMessageFormat(0, sdmKeyboard, 0, "AddIMDLLHook: Exit");
	return TRUE;
}

/* Call a DLL callback for all DLLs loaded with a given keyboard */

BOOL CallbackDLLs(LPINTKEYBOARDINFO lpkbi, PSTR cmd)
{
	//SendDebugMessageFormat(0, sdmKeyboard, 0, "ActivateDLLs: Enter");

	for(DWORD i = 0; i < lpkbi->nIMDLLs; i++)
	{
		InitDllFunction idf = (InitDllFunction) GetProcAddress(lpkbi->IMDLLs[i].hModule, cmd);
		if(idf) (*idf)(lpkbi->Name);
	}

	return TRUE;
}

/* Load the dlls associated with a keyboard */

BOOL LoadDLLs(LPINTKEYBOARDINFO lpkbi)
{
	char fullname[_MAX_PATH];

	SendDebugMessageFormat(0, sdmKeyboard, 0, "LoadDLLs: Enter");

	if(lpkbi->nIMDLLs > 0) if(!UnloadDLLs(lpkbi)) return FALSE;

  if (!GetKeyboardFileName(lpkbi->Name, fullname, _MAX_PATH)) {
          SendDebugMessageFormat(0, sdmKeyboard, 0, "LoadDLLs: Filename not found[%s]", lpkbi->Name);

      return FALSE;
  }
  if (!lpkbi->Keyboard) {
    SendDebugMessageFormat(0, sdmKeyboard, 0, "LoadDLLs: Keyboard is null");
    return FALSE;
  }
	for(DWORD i = 0; i < lpkbi->Keyboard->cxStoreArray; i++)
	{
		LPSTORE s = &lpkbi->Keyboard->dpStoreArray[i];
		if(s->dwSystemID == TSS_CALLDEFINITION)
		{
			/* Break the store string into components */

			PCHAR p = wstrtostr(s->dpString), q, r, context;

			q = strtok_s(p, ":", &context);
			r = strtok_s(NULL, ":", &context);

			if(!q || !r)
			{
				s->dwSystemID = TSS_CALLDEFINITION_LOADFAILED;
				delete[] p;
				continue;
			}

			LPIMDLL imd = AddIMDLL(lpkbi, fullname, q);
			if(imd && AddIMDLLHook(imd, r, i, &s->dpString)) s->dwSystemID = TSS_CALLDEFINITION;
			else s->dwSystemID = TSS_CALLDEFINITION_LOADFAILED;

			delete[] p;
		}
	}

	SendDebugMessageFormat(0, sdmKeyboard, 0, "LoadDLLs: Exit");
	return TRUE;
}

// Both Core and Window keyboard processor can use this function
BOOL UnloadDLLs(LPINTKEYBOARDINFO lpkbi)
{
	if(!lpkbi)
  {
    SetLastError(ERROR_INVALID_PARAMETER);  // I3173   // I3525
    return FALSE;
  }

	CallbackDLLs(lpkbi, "KeymanIMDestroy");

	for(DWORD i = 0; i < lpkbi->nIMDLLs; i++)
	{
		FreeLibrary(lpkbi->IMDLLs[i].hModule);
		if(lpkbi->IMDLLs[i].Hooks) delete lpkbi->IMDLLs[i].Hooks;
	}

	delete lpkbi->IMDLLs;
	lpkbi->IMDLLs = NULL;
	lpkbi->nIMDLLs = 0;

	return TRUE;
}

BOOL ActivateDLLs(LPINTKEYBOARDINFO lpkbi)
{
	if(!lpkbi)
  {
    SetLastError(ERROR_INVALID_PARAMETER);  // I3173 - not actually used by this issue but added for completeness   // I3525
    return FALSE;
  }
	CallbackDLLs(lpkbi, "KeymanIMActivate");
	return TRUE;
}

BOOL DeactivateDLLs(LPINTKEYBOARDINFO lpkbi)
{
	if(!lpkbi)
  {
    SetLastError(ERROR_INVALID_PARAMETER);  // I3173   // I3525
    return FALSE;
  }
	CallbackDLLs(lpkbi, "KeymanIMDeactivate");
	return TRUE;
}

void CallDLL(LPINTKEYBOARDINFO lpkbi, DWORD storenum)
{
	SendDebugMessageFormat(0, sdmKeyboard, 0, "CallDll: Enter");
  if (!lpkbi->Keyboard) return;
  if(storenum >= lpkbi->Keyboard->cxStoreArray) return;

	LPSTORE s = &lpkbi->Keyboard->dpStoreArray[storenum];
	if(s->dwSystemID != TSS_CALLDEFINITION) return;
	if(s->dpString == NULL) return;
	LPIMDLLHOOK imdh = (LPIMDLLHOOK) s->dpString;

  PKEYMAN64THREADDATA _td = ThreadGlobals();
  if(!_td) return;

  if(_td->TIPFUpdateable) {   // I4452
	  (*imdh->function)(_td->state.msg.hwnd, _td->state.vkey, _td->state.charCode, Globals::get_ShiftState());
  }

	SendDebugMessageFormat(0, sdmKeyboard, 0, "CallDll: Exit");
}

// The callback function from core
//typedef KMN_API uint8_t (*km_kbp_keyboard_imx_platform)(km_kbp_state *, uint32_t);
// TODO need to update this to have LPINTKEYBOARDINFO lpkbi in the callback. So the callback will store the object.
// will not need km_state anymore
uint8_t
IM_CallBackCore(void* callbackObject, km_kbp_state *km_state, uint32_t UniqueStoreNo) {
  // SendDebugMessageFormat(0, sdmKeyboard, 0, "IM_CallBackCore: Enter");
  if (callbackObject == NULL) {
    return;
  }
  LPINTKEYBOARDINFO lpkbi = (LPINTKEYBOARDINFO)(callbackObject);
  if (!lpkbi->lpCoreKeyboard)
    return;
  // Iterate through hooks to find the call back
  DWORD n = 0;
  for (DWORD i = 0; i < lpkbi->nIMDLLHooks; i++) {
    if (lpkbi->lpIMDLLHooks[i]->storeno == UniqueStoreNo) {
      break;
    }
    n++;
  }
  LPIMDLLHOOK imdh = lpkbi->lpIMDLLHooks[n];

  PKEYMAN64THREADDATA _td = ThreadGlobals();
  if (!_td)
    return;

  if (_td->TIPFUpdateable) {  // I4452
    (*imdh->function)(_td->state.msg.hwnd, _td->state.vkey, _td->state.charCode, Globals::get_ShiftState());
  }

  // SendDebugMessageFormat(0, sdmKeyboard, 0, "IM_CallBackCore: Exit");

}




extern "C" BOOL _declspec(dllexport) WINAPI KMSetOutput(PWSTR buf, DWORD backlen)
{
  SendDebugMessageFormat(0, sdmKeyboard, 0, "KMSetOutput: Enter");
  PKEYMAN64THREADDATA _td = ThreadGlobals();
  if(!_td) return FALSE;
  if(!_td->app) return FALSE;
	while(backlen-- > 0) _td->app->QueueAction(QIT_BACK, 0);
	while(*buf) _td->app->QueueAction(QIT_CHAR, *buf++);
        SendDebugMessageFormat(0, sdmKeyboard, 0, "KMSetOutput: Exit");
	return TRUE;
}

extern "C" BOOL _declspec(dllexport) WINAPI KMQueueAction(int ItemType, DWORD dwData)
{
  SendDebugMessageFormat(0, sdmKeyboard, 0, "KMQueueAction: Enter");
  PKEYMAN64THREADDATA _td = ThreadGlobals();
  if(!_td) return FALSE;
	if(!_td->app) return FALSE;
        SendDebugMessageFormat(0, sdmKeyboard, 0, "KMQueueAction: Exit");
	return _td->app->QueueAction(ItemType, dwData);
}

extern "C" BOOL _declspec(dllexport) WINAPI KMGetContext(PWSTR buf, DWORD len)
{
  SendDebugMessageFormat(0, sdmKeyboard, 0, "KMGetContext: Enter");
  PKEYMAN64THREADDATA _td = ThreadGlobals();
  if(!_td) return FALSE;
	if(!_td->app) return FALSE;
	
	PWSTR q = _td->app->ContextBufMax(len);
	if(!q) return FALSE;	// context buf does not exist

	wcscpy_s(buf, len+1, q);  // I3091
        SendDebugMessageFormat(0, sdmKeyboard, 0, "KMGetContext: Exit");
	return TRUE;
}

extern "C" BOOL _declspec(dllexport) WINAPI KMDisplayIM(HWND hwnd, BOOL FShowAlways)
{
	if(hwnd == 0) return KMHideIM();

	HWND hwndFocus = GetFocus();
	if(hwndFocus == 0) return FALSE;

	if(*Globals::hwndIM() == hwnd)
	{
		*Globals::hwndIMAlways() = FShowAlways;
		return TRUE;
	}

	*Globals::hwndIM() = hwnd;
	*Globals::hwndIMAlways() = FShowAlways;

	POINT pt;
	RECT r;
	
	GetCaretPos(&pt);
	
	int n;
	//if(pt.x == 0 && pt.y == 0) 
		n = SWP_NOMOVE; 
	//else n = 0;
	
	ClientToScreen(hwndFocus, &pt);
	GetWindowRect(hwnd, &r);
	if(pt.x + r.right - r.left >= GetSystemMetrics(SM_CXSCREEN))
		pt.x = GetSystemMetrics(SM_CXSCREEN) - (r.right - r.left);

	if(pt.y - (r.bottom-r.top) > 0) pt.y -= (r.bottom-r.top);
	else pt.y += 32; // guessing...

	SetWindowPos(hwnd, HWND_TOPMOST, pt.x,pt.y,0,0, n|SWP_NOSIZE|SWP_SHOWWINDOW|SWP_NOACTIVATE);
	
	return TRUE;
}

extern "C" BOOL _declspec(dllexport) WINAPI KMHideIM()
{
	if(*Globals::hwndIM() != 0)
	{
		ShowWindow(*Globals::hwndIM(), SW_HIDE);
		//PostMessage(hwndIM, WM_USER+2134, (WPARAM) hwndIMOldFocus, 0);
		*Globals::hwndIM() = 0;
		*Globals::hwndIMAlways() = FALSE;
	}
	return TRUE;
}

extern "C" BOOL _declspec(dllexport) WINAPI KMGetActiveKeyboard(PSTR buf, int nbuf)
{
  PKEYMAN64THREADDATA _td = ThreadGlobals();
  if(!_td) return FALSE;
  if(!_td->lpActiveKeyboard) return FALSE;
	strncpy_s(buf, nbuf, _td->lpActiveKeyboard->Name, nbuf-1);
	buf[nbuf-1] = 0;
	return TRUE;
}

extern "C" BOOL _declspec(dllexport) WINAPI KMGetKeyboardPath(PSTR keyboardname, PSTR buf, int nbuf)
{
	return GetKeyboardFileName(keyboardname, buf, nbuf);
}

void KMUpdateIM()
{
	if(*Globals::hwndIM() != 0)
	{
		ShowWindow(*Globals::hwndIM(), SW_HIDE);
		//PostMessage(hwndIM, WM_USER+2134, (WPARAM) hwndIMOldFocus, 0);
		*Globals::hwndIM() = 0;
		*Globals::hwndIMAlways() = FALSE;
	}
}


BOOL IsIMWindow(HWND hwnd)
{
	if(hwnd == *Globals::hwndIM()) return TRUE;
	if(!*Globals::hwndIM()) return FALSE;
	return IsChild(*Globals::hwndIM(), hwnd);
}

//------- All the functions bellow are used for interaction with the core processor.

/* Add a dll hook function to the list of hook functions associated with a single dll */

static BOOL
AddIMDLLHookCore(LPIMDLL imd, LPSTR funcname, DWORD storeno) {
  /* Get the procedure address for the function */

  IMDLLHOOKProc dhp = (IMDLLHOOKProc)GetProcAddress(imd->hModule, funcname);
  if (!dhp)
    return FALSE;

  /* Add the function to the list of functions in the DLL */

  LPIMDLLHOOK hooks = new IMDLLHOOK[imd->nHooks + 1];
  if (imd->nHooks > 0) {
    memcpy(hooks, imd->Hooks, sizeof(IMDLLHOOK) * imd->nHooks);
    delete imd->Hooks;
  }
  imd->Hooks = hooks;
  strncpy(imd->Hooks[imd->nHooks].name, funcname, 31);
  imd->Hooks[imd->nHooks].name[31] = 0;
  imd->Hooks[imd->nHooks].storeno  = storeno;
  imd->Hooks[imd->nHooks].function = dhp;
  return TRUE;
}

/* Load the dlls associated with a keyboard */

BOOL
LoadDLLsCore(LPINTKEYBOARDINFO lpkbi) {
  char fullname[_MAX_PATH];

  // SendDebugMessageFormat(0, sdmKeyboard, 0, "LoadDLLsCore: Enter");

  if (lpkbi->nIMDLLs > 0)
    if (!UnloadDLLs(lpkbi))
      return FALSE;

  if (!GetKeyboardFileName(lpkbi->Name, fullname, _MAX_PATH))
    return FALSE;
  if (!lpkbi->lpCoreKeyboard)
    return FALSE;

  km_kbp_keyboard_imx *imx_list = lpkbi->lpIMXList;

  for (; imx_list; ++imx_list) {
    LPIMDLL imd = AddIMDLL(lpkbi, fullname, wstrtostr(reinterpret_cast<LPCWSTR>(imx_list->library_name)));
    if (imd && AddIMDLLHookCore(imd, wstrtostr(reinterpret_cast<LPCWSTR>(imx_list->function_name)), imx_list->store_no)) {
    }
      // log ok
    //else
    //  log error
  }

  // SendDebugMessageFormat(0, sdmKeyboard, 0, "LoadDLLs: Exit");
  return TRUE;
}

