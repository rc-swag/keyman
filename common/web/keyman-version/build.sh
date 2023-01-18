#!/usr/bin/env bash
#
# Builds the include script for the current Keyman version.
#

# Exit on command failure and when using unset variables:
set -eu

## START STANDARD BUILD SCRIPT INCLUDE
# adjust relative paths as necessary
THIS_SCRIPT="$(greadlink -f "${BASH_SOURCE[0]}" 2>/dev/null || readlink -f "${BASH_SOURCE[0]}")"
. "$(dirname "$THIS_SCRIPT")/../../../resources/build/build-utils.sh"
## END STANDARD BUILD SCRIPT INCLUDE

. "$KEYMAN_ROOT/resources/shellHelperFunctions.sh"

# This script runs from its own folder
cd "$THIS_SCRIPT_PATH"

################################ Main script ################################

builder_describe "Build the include script for current Keyman version" \
  configure \
  clean \
  build \
  publish \
  --dry-run

builder_describe_outputs \
  configure "/node_modules" \
  build     "build/index.js"

builder_parse "$@"


if builder_start_action configure; then
  verify_npm_setup
  builder_finish_action success configure
fi

if builder_start_action clean; then
  npm run clean
  rm -f ./version.inc.ts
  builder_finish_action success clean
fi

if builder_start_action build; then
  # Generate index.ts
  echo "
    // Generated by common/web/keyman-version/build.sh
    namespace com.keyman {
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
        static readonly SENTRY_RELEASE = \"release@$VERSION_WITH_TAG\";
      }
    }
  " > ./version.inc.ts

  # Note: in a dependency build, we'll expect keyman-version to be built by tsc -b
  if builder_is_dep_build; then
    echo "[$THIS_SCRIPT_IDENTIFIER] skipping tsc -b; will be completed by $builder_dep_parent"
  else
    npm run build -- $builder_verbose
  fi

  builder_finish_action success build
fi

if builder_start_action publish; then
  . "$KEYMAN_ROOT/resources/build/build-utils-ci.inc.sh"
  builder_publish_to_npm
  builder_finish_action success publish
fi
