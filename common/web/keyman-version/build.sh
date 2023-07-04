#!/usr/bin/env bash
#
# Builds the include script for the current Keyman version.
#

# Exit on command failure and when using unset variables:
set -eu

## START STANDARD BUILD SCRIPT INCLUDE
# adjust relative paths as necessary
THIS_SCRIPT="$(readlink -f "${BASH_SOURCE[0]}")"
. "${THIS_SCRIPT%/*}/../../../resources/build/build-utils.sh"
## END STANDARD BUILD SCRIPT INCLUDE

. "$KEYMAN_ROOT/resources/shellHelperFunctions.sh"

# This script runs from its own folder
cd "$THIS_SCRIPT_PATH"

################################ Main script ################################

builder_describe "Build the include script for current Keyman version" \
  configure \
  clean \
  build \
  "pack                      build a local .tgz pack for testing" \
  "publish                   publish to npm" \
  test \
  --dry-run

builder_describe_outputs \
  configure "/node_modules" \
  build     "/common/web/keyman-version/build/version.inc.js"

builder_parse "$@"


if builder_start_action configure; then
  verify_npm_setup
  builder_finish_action success configure
fi

if builder_start_action clean; then
  npm run clean
  rm -f ./version.inc.ts
  rm -f ./keyman-version.mts
  rm -rf build
  builder_finish_action success clean
fi

if builder_start_action build; then
  # Generate version.inc.ts
  echo "
// Generated by common/web/keyman-version/build.sh
//
// Note:  does not use the 'default' keyword so that the export name is
// correct when converted to a CommonJS module with \`esbuild\`.
export class KEYMAN_VERSION {
  static readonly VERSION = \"$VERSION\";
  static readonly VERSION_RELEASE =\"$VERSION_RELEASE\";
  static readonly VERSION_MAJOR = \"$VERSION_MAJOR\";
  static readonly VERSION_MINOR = \"$VERSION_MINOR\";
  static readonly VERSION_PATCH = \"$VERSION_PATCH\";
  static readonly TIER =\"$TIER\";
  static readonly VERSION_TAG = \"$VERSION_TAG\";
  static readonly VERSION_WITH_TAG = \"$VERSION_WITH_TAG\";
  static readonly VERSION_ENVIRONMENT = \"$VERSION_ENVIRONMENT\";
  static readonly VERSION_GIT_TAG = \"$VERSION_GIT_TAG\";
}

// Also provides it as a 'default' export.
export default KEYMAN_VERSION;
  " > ./version.inc.ts

  tsc -b $builder_verbose
  # kmlmc (the lexical model compiler) relies on a Node-based import, but after some of the earlier
  # ES-modularization work, our main output's an ES module.  Fortunately, esbuild can provide an easy stopgap.

  # Generates a CommonJS variant (in case other modules still need it).
  node ./build-bundler.js

  builder_finish_action success build
fi

if builder_start_action publish; then
  . "$KEYMAN_ROOT/resources/build/build-utils-ci.inc.sh"
  builder_publish_to_npm
  builder_finish_action success publish
elif builder_start_action pack; then
  . "$KEYMAN_ROOT/resources/build/build-utils-ci.inc.sh"
  builder_publish_to_pack
  builder_finish_action success pack
fi
