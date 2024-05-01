#!/usr/bin/env bash
## START STANDARD BUILD SCRIPT INCLUDE
# adjust relative paths as necessary
THIS_SCRIPT="$(readlink -f "${BASH_SOURCE[0]}")"
. "${THIS_SCRIPT%/*}/../../../resources/build/build-utils.sh"
## END STANDARD BUILD SCRIPT INCLUDE

cd "$THIS_SCRIPT_PATH"

builder_describe "Build kmconvert" clean configure build test publish install
builder_parse "$@"

#-------------------------------------------------------------------------------------------------------------------

source "$KEYMAN_ROOT/resources/build/win/environment.inc.sh"
WIN32_TARGET="$WIN32_TARGET_PATH/kmconvert.exe"

builder_describe_outputs \
  configure:project    /resources/build/win/delphi_environment_generated.inc.sh \
  build:project        /developer/src/kmconvert/$WIN32_TARGET

#-------------------------------------------------------------------------------------------------------------------

function do_clean() {
  rm -rf bin obj manifest.res manifest.xml *.dproj.local version.res icons.RES icons.res *.identcache
}

function do_build() {
  run_in_vs_env rc icons.rc
  delphi_msbuild kmconvert.dproj "//p:Platform=Win32"
  sentrytool_delphiprep "$WIN32_TARGET" kmconvert.dpr
  tds2dbg "$WIN32_TARGET"

  cp "$WIN32_TARGET" "$DEVELOPER_PROGRAM"
  if [[ -f "$WIN32_TARGET_PATH/kmconvert.dbg" ]]; then
    cp "$WIN32_TARGET_PATH/kmconvert.dbg" "$DEVELOPER_DEBUGPATH"
  fi

  rm -rf "$DEVELOPER_PROGRAM/projects/templates"
  mkdir -p "$DEVELOPER_PROGRAM/projects/templates"
  cp -R data/* "$DEVELOPER_PROGRAM/projects/templates"
}

function do_publish() {
  # test that (a) linked manifest exists and correct
  "$MT" -nologo -inputresource:"$DEVELOPER_PROGRAM/kmconvert.exe" -validate_manifest

  "$SIGNCODE" //d "Keyman Developer" "$DEVELOPER_PROGRAM/kmconvert.exe"

  "$SYMSTORE" "$DEVELOPER_PROGRAM)/kmconvert.exe" //t keyman-developer
  "$SYMSTORE" "$DEVELOPER_DEBUGPATH)/kmconvert.dbg" //t keyman-developer
}

function do_install() {
  cp "$DEVELOPER_PROGRAM/kmconvert.exe" "$INSTALLPATH_KEYMANDEVELOPER/kmconvert.exe"
}

builder_run_action clean:project        do_clean
builder_run_action configure:project    configure_windows_build_environment
builder_run_action build:project        do_build
# builder_run_action test:project         do_test
builder_run_action publish:project      do_publish
builder_run_action install:project      do_install
