#!/usr/bin/env bash
## START STANDARD BUILD SCRIPT INCLUDE
# adjust relative paths as necessary
THIS_SCRIPT="$(readlink -f "${BASH_SOURCE[0]}")"
. "${THIS_SCRIPT%/*}/../../resources/build/build-utils.sh"
## END STANDARD BUILD SCRIPT INCLUDE

builder_describe \
  "Build Keyman Developer" \
  clean \
  configure \
  build \
  "api                          Analyze API and prepare API documentation" \
  test \
  ":utils=common/web/utils      Developer utils" \
  ":kmcmplib                    Compiler - .kmn compiler" \
  ":kmc-analyze                 Compiler - Analysis Tools" \
  ":kmc-keyboard-info           Compiler - .keyboard_info Module" \
  ":kmc-kmn                     Compiler - .kmn to .kmx and .js Keyboard Module" \
  ":kmc-ldml                    Compiler - LDML Keyboard Module" \
  ":kmc-model                   Compiler - Lexical Model Module" \
  ":kmc-model-info              Compiler - .model_info Module" \
  ":kmc-package                 Compiler - Package Module" \
  ":kmc                         Compiler - Command Line Interface" \
  :kmanalyze :kmdecomp :kmconvert :samples :server :setup :tike \
  :inst

builder_parse "$@"

builder_describe_outputs \
  configure  /developer/src/tike/xml/layoutbuilder/keymanweb-osk.ttf

builder_run_action configure cp "$KEYMAN_ROOT/common/resources/fonts/keymanweb-osk.ttf" "$KEYMAN_ROOT/developer/src/tike/xml/layoutbuilder/"

builder_run_child_actions clean configure build test api

function build_api() {
  api-documenter markdown -i ../build/api -o ../build/docs
  # TODO: Copy to help.keyman.com and open PR
}

builder_run_action api build_api
