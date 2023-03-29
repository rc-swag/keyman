#!/usr/bin/env bash
#
# Compiles sentry manager

set -eu

## START STANDARD BUILD SCRIPT INCLUDE
# adjust relative paths as necessary
THIS_SCRIPT="$(readlink -f "${BASH_SOURCE[0]}")"
. "${THIS_SCRIPT%/*}/../../../resources/build/build-utils.sh"
## END STANDARD BUILD SCRIPT INCLUDE

. "$KEYMAN_ROOT/resources/shellHelperFunctions.sh"

# This script runs from its own folder
cd "$(dirname "$THIS_SCRIPT")"

builder_describe "Builds the Sentry-reporting module used with Keyman Engine for Web" \
  "@/common/web/keyman-version" \
  clean configure build

builder_describe_outputs \
  configure          /node_modules \
  build              /common/web/sentry-manager/build/lib/index.js

builder_parse "$@"

### CLEAN ACTIONS

if builder_start_action clean; then
  rm -rf build/
  builder_finish_action success clean
fi

### CONFIGURE ACTIONS

if builder_start_action configure; then
  verify_npm_setup
  builder_finish_action success configure
fi

if builder_start_action build; then
  tsc --build "$THIS_SCRIPT_PATH/src/tsconfig.json"
  node build-bundler.js
  builder_finish_action success build
fi
