#!/usr/bin/env bash

## START STANDARD BUILD SCRIPT INCLUDE
# adjust relative paths as necessary
THIS_SCRIPT="$(readlink -f "${BASH_SOURCE[0]}")"
. "${THIS_SCRIPT%/*}/../../../../resources/build/build-utils.sh"
## END STANDARD BUILD SCRIPT INCLUDE

SUBPROJECT_NAME=engine/package-cache
. "$KEYMAN_ROOT/web/common.inc.sh"
. "$KEYMAN_ROOT/resources/shellHelperFunctions.sh"

# ################################ Main script ################################

builder_describe "Builds Keyman Engine modules for keyboard cloud-querying & caching + model caching." \
  "@/common/web/es-bundling" \
  "@/common/web/input-processor build" \
  "@/web/src/engine/paths" \
  "clean" \
  "configure" \
  "build" \
  "test" \
  "--ci+                     Set to utilize CI-based test configurations & reporting."

# Possible TODO?s
# "upload-symbols   Uploads build product to Sentry for error report symbolification.  Only defined for $DOC_BUILD_EMBED_WEB" \

builder_describe_outputs \
  configure   /node_modules \
  build       /web/build/$SUBPROJECT_NAME/lib/index.mjs

builder_parse "$@"

#### Build action definitions ####

do_build () {
  compile $SUBPROJECT_NAME

  $BUNDLE_CMD    "${KEYMAN_ROOT}/web/build/${SUBPROJECT_NAME}/obj/index.js" \
    --out        "${KEYMAN_ROOT}/web/build/${SUBPROJECT_NAME}/lib/index.mjs" \
    --format esm

  $BUNDLE_CMD    "${KEYMAN_ROOT}/web/build/${SUBPROJECT_NAME}/obj/domCloudRequester.js" \
    --out        "${KEYMAN_ROOT}/web/build/${SUBPROJECT_NAME}/lib/dom-cloud-requester.mjs" \
    --format esm

  $BUNDLE_CMD    "${KEYMAN_ROOT}/web/build/${SUBPROJECT_NAME}/obj/nodeCloudRequester.js" \
    --out        "${KEYMAN_ROOT}/web/build/${SUBPROJECT_NAME}/lib/node-cloud-requester.mjs" \
    --format   esm \
    --platform node
}

builder_run_action configure verify_npm_setup
builder_run_action clean rm -rf "${KEYMAN_ROOT}/web/build/${SUBPROJECT_NAME}"
builder_run_action build do_build
builder_run_action test test-headless "${SUBPROJECT_NAME}"
