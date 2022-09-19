#!/usr/bin/env bash
#
# Compiles development-related KeymanWeb resources for use with developing/running tests.
#   - the Recorder module (for engine tests)
#   - the DOM module (for touch-alias and element-interface tests)

set -eu

## START STANDARD BUILD SCRIPT INCLUDE
# adjust relative paths as necessary
THIS_SCRIPT="$(greadlink -f "${BASH_SOURCE[0]}" 2>/dev/null || readlink -f "${BASH_SOURCE[0]}")"
. "$(dirname "$THIS_SCRIPT")/../../../resources/build/build-utils.sh"
## END STANDARD BUILD SCRIPT INCLUDE

. "$KEYMAN_ROOT/resources/shellHelperFunctions.sh"

action=
target=
function action_failure() {
  if [ -n "$action" ]; then
    builder_report failure $action $target
  fi
}

trap action_failure err

################################ Main script ################################


builder_describe \
  "Compiles the web-oriented utility function module." \
  configure \
  clean \
  build \
  ":module      Builds recorder-core module" \
  ":proctor     Builds headless-testing, node-oriented 'proctor' component"

builder_parse "$@"

# START - Script parameter configuration
REPORT_STYLE="local"  # Default setting.

if builder_has_option --ci; then
  REPORT_STYLE="ci"

  echo "Replacing user-friendly test reports with CI-friendly versions."
fi

# END - Script parameter configuration

if builder_has_action configure :module || builder_has_action configure :proctor; then
  action=configure
  target=:project

  verify_npm_setup

  "$KEYMAN_ROOT/common/web/keyman-version/build.sh"

  builder_report success configure :project
fi

if builder_has_action clean :module; then
  action=clean
  target=:module
  npm run tsc -- -b --clean "src/tsconfig.json"

  builder_report success clean :module
fi

if builder_has_action clean :proctor; then
  action=clean
  target=:module
  npm run tsc -- -b --clean "$THIS_SCRIPT_PATH/src/nodeProctor.tsconfig.json"

  builder_report success clean :proctor
fi

if builder_has_action build :module; then
  action=build
  target=:module
  npm run tsc -- --build "$THIS_SCRIPT_PATH/src/tsconfig.json"

  builder_report success build :module
fi

if builder_has_action build :proctor; then
  action=build
  target=:proctor
  npm run tsc -- --build "$THIS_SCRIPT_PATH/src/nodeProctor.tsconfig.json"

  builder_report success build :proctor
fi