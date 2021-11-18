/*
  Name:             calldll
  Copyright:        Copyright (C) SIL International.
  Documentation:
  Description:
  Create Date:      11 Dec 2009

  Modified Date:    11 Dec 2009
  Authors:          mcdurdin
  Related Files:
  Dependencies:

  Bugs:
  Todo:
  Notes:
  History:          11 Dec 2009 - mcdurdin - I934 - x64 - Initial version
*/

#ifndef __CALLDLL_H
#define __CALLDLL_H

BOOL LoadDLLs(LPINTKEYBOARDINFO lpkbi);
BOOL UnloadDLLs(LPINTKEYBOARDINFO lpkbi);
BOOL DeactivateDLLs(LPINTKEYBOARDINFO lpkbi);
BOOL ActivateDLLs(LPINTKEYBOARDINFO lpkbi);

/**
 * Load the all the dlls use by the current keyboard
 * // TODO: 5444 This will become the only LoadDLLs function
 * @param   lpkbi  The keyboard for which to load the dlls
 * @return  BOOL  True on success
 */
BOOL LoadDLLsCore(LPINTKEYBOARDINFO lpkbi);


BOOL IsIMWindow(HWND hwnd);

void CallDLL(LPINTKEYBOARDINFO lpkbi, DWORD storenum);
uint8_t IM_CallBackCore(void* callbackObject, km_kbp_state* km_state, uint32_t UniqueStoreNo);

extern "C" BOOL _declspec(dllexport) WINAPI KMDisplayIM(HWND hwnd, BOOL FShowAlways);
extern "C" BOOL _declspec(dllexport) WINAPI KMHideIM();
void KMUpdateIM();

#endif
