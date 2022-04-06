#!/bin/bash

# This script will automatically have Xcode's build environment (and variables),
# so there's no need to do anything extra to fetch them.

# Some fun details for interacting with Xcode:
#  - echo "warning: foo" will generate an actual compile warning within Xcode:  "foo"
#  - echo "error: bar" will likewise generate a compile error within Xcode: "bar"

function buildWarning() {
  echo "warning: $1"
}

function buildError() {
  echo "error: $1"
}

# Imports the autogenerated environment.sh from command-line builds.
function importEnvironment() {
  # Requires that KEYMAN_ROOT is set... which it should be, if a build is successfully
  if [ -z "${KEYMAN_ROOT:-}" ]; then
    buildError "KEYMAN_ROOT is not defined.  Recommendation:  define it as a project-wide \"user-defined\" Build Setting for the \"$PROJECT_NAME\" project."
    exit 1
  else
    # As defined within build-utils.sh, which this script does NOT call.  (It was already called externally.)
    ENVIRONMENT_SH="$KEYMAN_ROOT/resources/environment.sh"
    . "$ENVIRONMENT_SH"
  fi
}

# Build Phase:  "Set Bundle Versions"
# Takes one parameter:  "TAGGED".  Defaults to false (iOS: KMEI, SWKeyboard), sets tagged info if true (iOS: Keyman)
#
# Thanks to https://medium.com/@bestiosdevelope/automatic-build-incrementation-technique-for-ios-release-94eb0d08785b
# for its documentation in this matter.
function phaseSetBundleVersions() {
  if [[ $# -gt 0 ]]; then
    TAGGED="$1" # Should be just `true`, unless someone gets 'creative' later.  But we compare against `true`.
  else
    TAGGED=false
  fi

  # For command-line builds, VERSION and VERSION_WITH_TAG) are forwarded through xcodebuild.
  if [ -z "${VERSION:-}" ]; then
    # We're not a command-line build... so we'll need to retrieve these values ourselves with ./build-utils.sh.
    # Note that this script's process will not have access to TC environment variables, but that's fine for
    # local builds triggered through Xcode's UI, which aren't part of our CI processes.
    . "$KEYMAN_ROOT/resources/build/build-utils.sh"
    echo "UI build - fetching version from repository:"
    echo "  Plain:  $VERSION"
    echo "  Tagged: $VERSION_WITH_TAG"
    echo "  Environment: $VERSION_ENVIRONMENT"
  else
    echo "Command-line build - using provided version parameters"
  fi

  # Now, to set the build number (CFBundleVersion)
  # 1.0 is the default for all released builds. For PRs, we use 0.PR#.0, and
  # increment the final portion
  BUILD_NUMBER=$VERSION
  if [ ! -z "${TEAMCITY_PR_NUMBER-}" ]; then
    if [[ $TEAMCITY_PR_NUMBER =~ ^[0-9]+$ ]]; then
      BUILD_NUMBER=$VERSION.$TEAMCITY_PR_NUMBER.0
    fi
  fi

  APP_PLIST="$TARGET_BUILD_DIR/$INFOPLIST_PATH"
  echo "Setting $VERSION for $TARGET_BUILD_DIR/$INFOPLIST_PATH"
  /usr/libexec/Plistbuddy -c "Set :CFBundleVersion $BUILD_NUMBER" "$APP_PLIST"
  /usr/libexec/Plistbuddy -c "Set :CFBundleShortVersionString $VERSION" "$APP_PLIST"

  # If we are running a PR build, then ...
  if [ ! -z "${TEAMCITY_PR_NUMBER-}" ]; then
    if [[ $TEAMCITY_PR_NUMBER =~ ^[0-9]+$ ]]; then
      pushd "$KEYMAN_ROOT/ios/keyman/Keyman" > /dev/null
      FASTLANE_ITC_TEAM_ID=687465

      fastlane manual_testflight_prs || exit 1
      popd > /dev/null
    fi
  fi

  # Only attempt to write this when directly specified (otherwise, generates minor warning)
  if [ $TAGGED == true ]; then
    echo "Setting $VERSION_WITH_TAG for tagged version"
    /usr/libexec/Plistbuddy -c "Set :KeymanVersionWithTag $VERSION_WITH_TAG" "$APP_PLIST"
    echo "Setting $VERSION_ENVIRONMENT"
    /usr/libexec/Plistbuddy -c "Set :KeymanVersionEnvironment $VERSION_ENVIRONMENT" "$APP_PLIST"
  fi

  if [ -f "${BUILT_PRODUCTS_DIR}/${WRAPPER_NAME}.dSYM/Contents/Info.plist" ]; then
    DSYM_PLIST="${BUILT_PRODUCTS_DIR}/${WRAPPER_NAME}.dSYM/Contents/Info.plist"
    echo "Setting $VERSION for $DSYM_PLIST"
    /usr/libexec/PlistBuddy -c "Set :CFBundleVersion $BUILD_NUMBER" "$DSYM_PLIST"
    /usr/libexec/PlistBuddy -c "Set :CFBundleShortVersionString $VERSION" "$DSYM_PLIST"
  fi
}

# Used by Keyman for iOS to update the human-readable string for its Settings screen.
function setSettingsBundleVersion() {
  # For command-line builds, VERSION and VERSION_WITH_TAG) are forwarded through xcodebuild.
  if [ -z "${VERSION:-}" ]; then
    # We're not a command-line build... so we'll need to retrieve these values ourselves with ./build-utils.sh.
    # Note that this script's process will not have access to TC environment variables, but that's fine for
    # local builds triggered through Xcode's UI, which aren't part of our CI processes.
    . "$KEYMAN_ROOT/resources/build/build-utils.sh"
    echo "UI build - fetching version from repository:"
    echo "  Plain:  $VERSION"
    echo "  Tagged: $VERSION_WITH_TAG"
    echo "  Environment: (not setting, assume 'local')"
  else
    echo "Command-line build - using provided version parameters"
  fi

  SETTINGS_PLIST="${BUILT_PRODUCTS_DIR}/${PRODUCT_NAME}.app/Settings.bundle/Root.plist"
  echo "Setting $VERSION_WITH_TAG for $SETTINGS_PLIST"
  # We assume that entry 0 = the version "preference" entry.
  /usr/libexec/PlistBuddy -c "Set :PreferenceSpecifiers:0:DefaultValue $VERSION_WITH_TAG" "$SETTINGS_PLIST"
}

# Build Phase:  Upload dSYM (debug) files to Sentry
# Takes one parameter - the SENTRY_PROJECT target.  The other parameter needs to be set as an "input file" within Xcode.
function phaseSentryDsymUpload() {

  if [[ $# -gt 0 ]]; then
    SENTRY_PROJECT_TARGET="$1" # should only be `keyman-ios`, `keyman-mac`, or the like, but just in case.
  else
    buildError "SENTRY_PROJECT parameter was not provided to Sentry upload utility function."
    exit 1
  fi

  # Import environment information!
  importEnvironment
  if [ $? -ne 0 ]; then
    exit 1
  fi

  # Reference for this detection check for the input file: https://www.iosdev.recipes/xcode/input-output-files/
  if [ -z "${SCRIPT_INPUT_FILE_0:-}" ]; then
    buildError "Run Script must have an input file set: \${DWARF_DSYM_FOLDER_PATH}/\${DWARF_DSYM_FILE_NAME}/Contents/Resources/DWARF/\${TARGET_NAME}"
    exit 1
  fi

  if [ -z "${SENTRY_AUTH_TOKEN:-}" ]; then
    # Left as a warning so that builds aren't blocked for random contributors.
    # Likewise for the Sentry errors later.
    buildWarning "Cannot successfully upload the dSYM to sentry if a Sentry auth token is not provided."
  fi

  # The remaining update logic seen here was auto-generated at https://sentry.keyman.com/keyman/keyman-ios/getting-started/cocoa-swift/
  if which sentry-cli >/dev/null; then
    export SENTRY_PROJECT="$SENTRY_PROJECT_TARGET"
    export SENTRY_LOG_LEVEL=info
    ERROR=$(sentry-cli upload-dif "$DWARF_DSYM_FOLDER_PATH" 2>&1 >/dev/null)
    if [ ! $? -eq 0 ]; then
      buildWarning "sentry-cli - $ERROR"
    fi
  else
    buildWarning "sentry-cli not installed; please run \"brew install getsentry/tools/sentry-cli\" to remedy"
  fi
}
