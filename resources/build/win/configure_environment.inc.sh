#
# Functions for building three include scripts:
#
#   * environment_generated.inc.sh
#   * delphi_environment_generated.inc.sh
#   * visualstudio_environment_generated.inc.sh
#
# These include scripts define variables that may change from machine to
# machine. This script should not be directly sourced, as environment.inc.sh
# will source this script as required.
#

_locate_programFilesX86() {
  # ProgramFilesx86="$(cygpath -u "`printenv 'ProgramFiles(x86)'`")"
  # ProgramFilesx86="$(printenv 'ProgramFiles(x86)')"
  ProgramFiles="$(cygpath -w -F 38)"           # 38 = CSIDL_PROGRAM_FILES
  ProgramFilesx86="$(cygpath -w -F 42)"        # 42 = CSIDL_PROGRAM_FILESX86
  CommonProgramFilesx86="$(cygpath -w -F 44)"  # 44 = CSIDL_PROGRAM_FILES_COMMONX86
}

_build_win_environment() {
  local ENVSH="$KEYMAN_ROOT/resources/build/win/environment_generated.inc.sh"
  echo "# Windows development environment settings generated by configure_environment.inc.sh; do not modify" > "$ENVSH"
  echo "ProgramFiles=\"$(cygpath -u "$ProgramFiles")\"" >> "$ENVSH"
  echo "ProgramFilesx86=\"$(cygpath -u "$ProgramFilesx86")\"" >> "$ENVSH"
  echo "CommonProgramFilesx86=\"$(cygpath -u "$CommonProgramFilesx86")\"" >> "$ENVSH"
  echo "INSTALLPATH_KEYMANDESKTOP=\"$(cygpath -u "$ProgramFilesx86")/Keyman/Keyman Desktop\"" >> "$ENVSH"
  echo "INSTALLPATH_KEYMANDEVELOPER=\"$(cygpath -u "$ProgramFilesx86")/Keyman/Keyman Developer\"" >> "$ENVSH"
  echo "INSTALLPATH_KEYMANENGINE=\"$(cygpath -u "$CommonProgramFilesx86")/Keyman/Keyman Engine\"" >> "$ENVSH"
}

# 1. Find vsdevcmd.bat

_locate_vsdevcmd() {
  local vswhere="$(cygpath -u "$ProgramFilesx86\\Microsoft Visual Studio\\Installer\\vswhere.exe")"
  VSInstallationPath="$(cygpath -u "$("$vswhere" -latest -property installationPath)")"
  VSDevCmd_Path="$VSInstallationPath/Common7/Tools/VsDevCmd.bat"
}


_build_vs_environment() {
  echo "@CALL \"$(cygpath -w "$VSDevCmd_Path")\" > nul" > devenv.bat
  echo @SET >> devenv.bat

  cmd //c "devenv.bat" > devenv.tmp
  cmd //c "set" > env.tmp
  diff devenv.tmp env.tmp --suppress-common-lines | grep -e '^<' | cut -c 3- - > newenv.tmp

  echo "# VC++ development environment generated by configure_environment.inc.sh constructed from vsdevcmd.bat; do not modify" > "$KEYMAN_ROOT/resources/build/win/visualstudio_environment_generated.inc.sh"

  while read -r line; do
    IFS==; lineDelim=($line); unset IFS
    local var="${lineDelim[0]}"
    local value="${lineDelim[1]}"
    if [[ "$var" == PATH ]]; then
      # We'll append the new path; TODO: remove dups?
      value="$PATH:$value"
    fi

    echo "export ${lineDelim[0]}=\"$(cygpath -up "${lineDelim[1]}")\"" >> "$KEYMAN_ROOT/resources/build/win/visualstudio_environment_generated.inc.sh"
  done < newenv.tmp

  rm -f newenv.tmp devenv.tmp env.tmp devenv.bat
}

_locate_rsvars() {
  #
  # Delphi Compiler Configuration - Delphi 10.3.2
  #
  DELPHI_VERSION=20.0
  DCC32PATH="$(cygpath -u "$ProgramFilesx86\\Embarcadero\\Studio\\$DELPHI_VERSION\\bin")"
  RSVars_path="$DCC32PATH/rsvars.bat"
}

_build_delphi_environment() {
  echo "@CALL \"$(cygpath -w "$RSVars_path")\" > nul" > devenv.bat
  echo @SET >> devenv.bat

  cmd //c "devenv.bat" > devenv.tmp
  cmd //c "set" > env.tmp
  diff devenv.tmp env.tmp --suppress-common-lines | grep -e '^<' | cut -c 3- - > newenv.tmp

  echo "# Delphi development environment generated by configure_environment.inc.sh constructed from rsvars.bat; do not modify" > "$KEYMAN_ROOT/resources/build/win/delphi_environment_generated.inc.sh"

  while read -r line; do
    IFS==; lineDelim=($line); unset IFS
    local var="${lineDelim[0]}"
    local value="${lineDelim[1]}"
    if [[ "$var" == PATH ]]; then
      # We'll append the new path; TODO: remove dups?
      value="$PATH:$value"
    fi

    echo "export ${lineDelim[0]}=\"$(cygpath -up "${lineDelim[1]}")\"" >> "$KEYMAN_ROOT/resources/build/win/delphi_environment_generated.inc.sh"
  done < newenv.tmp

  rm -f newenv.tmp devenv.tmp env.tmp devenv.bat
}

configure_windows_build_environment() {
  _locate_programFilesX86
  _build_win_environment

  _locate_vsdevcmd
  _build_vs_environment

  _locate_rsvars
  _build_delphi_environment
}
