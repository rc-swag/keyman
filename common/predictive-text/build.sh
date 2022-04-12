#!/bin/bash
#
# Compiles the Language Modeling Layer for common use in predictive text and autocorrective applications.
# Designed for optimal compatibility with the Keyman Suite.
#

# Exit on command failure and when using unset variables:
set -eu

# Include some helper functions from resources

## START STANDARD BUILD SCRIPT INCLUDE
# adjust relative paths as necessary
THIS_SCRIPT="$(greadlink -f "${BASH_SOURCE[0]}" 2>/dev/null || readlink -f "${BASH_SOURCE[0]}")"
. "$(dirname "$THIS_SCRIPT")/../../resources/build/build-utils.sh"
## END STANDARD BUILD SCRIPT INCLUDE

. "$KEYMAN_ROOT/resources/shellHelperFunctions.sh"

# This script runs from its own folder
cd "$(dirname "$THIS_SCRIPT")"

# Exit status on invalid usage.
EX_USAGE=64

LMLAYER_OUTPUT=build
WORKER_OUTPUT=build/intermediate
INCLUDES_OUTPUT=build/includes
NAKED_WORKER=$WORKER_OUTPUT/index.js
EMBEDDED_WORKER=$WORKER_OUTPUT/embedded_worker.js

# Builds the top-level JavaScript file for use in browsers (the second stage of compilation)
build-browser () {
  npm run tsc -- -b ./browser.tsconfig.json || fail "Could not build top-level browser-targeted JavaScript file."
  # cp ./index.d.ts $INCLUDES_OUTPUT/LMLayer.d.ts
  # cp ./message.d.ts $INCLUDES_OUTPUT/message.d.ts
}

# Builds the top-level JavaScript file for use on Node (the second stage of compilation)
build-headless () {
  npm run tsc -- -b ./tsconfig.json || fail "Could not build top-level node-targeted JavaScript file."
}

build-wrapped-worker () {
  # Build worker first; the main file depends on it.
  # Then wrap the worker; Then build the main file.

  build-worker && wrap-worker || fail "Could not build inner-level JavaScript file for use in the Worker."
}

# Builds the inner JavaScript worker (the first stage of compilation).
# This script must be wrapped.
build-worker () {
  if ! [ -d $WORKER_OUTPUT ]; then
    mkdir -p "$WORKER_OUTPUT" # Includes any base folders recursively.
  fi

  npm run tsc -- -b ./worker/tsconfig.json || fail "Could not build worker."

  get_builder_OS

  # macOS has a slightly different sed, which needs an extension to use for a backup file.  Thanks, Apple.
  BACKUP_EXT=
  if [ $os_id == 'mac' ]; then
    BACKUP_EXT='.bak'
  fi

  # Tweak the output index.d.ts to have an updated reference to message.d.ts
#  sed -i $BACKUP_EXT 's/path="\.\.\/\.\.\/message\.d\.ts"/path="message\.d\.ts"/g' "${WORKER_OUTPUT}/index.d.ts" \
#    || fail "Could not update message.d.ts reference"
#  cp $INCLUDES_OUTPUT/message.d.ts $WORKER_OUTPUT/message.d.ts
#  cp $WORKER_OUTPUT/index.d.ts $INCLUDES_OUTPUT/LMLayerWorker.d.ts
  rm $WORKER_OUTPUT/index.tsbuildinfo
}

# A nice, extensible method for -clean operations.  Add to this as necessary.
clean ( ) {
  if [ -d $WORKER_OUTPUT ]; then
    rm -rf "$WORKER_OUTPUT" || fail "Failed to erase the prior build."
  fi

  if [ -d $LMLAYER_OUTPUT ]; then
    rm -rf "$LMLAYER_OUTPUT" || fail "Failed to erase the prior build."
  fi
}

display_usage ( ) {
  echo "Usage: $0 [-clean] [-skip-package-install | -S] [-test | -tdd]"
  echo "       $0 -help"
  echo
  echo "  -clean                 to erase pre-existing build products before a re-build"
  echo "  -help                  displays this screen and exits"
  echo "  -skip-package-install  (or -S) skips dependency updates"
  echo "  -tdd                   skips dependency updates, builds, then runs unit tests only"
  echo "  -test                  runs unit and integration tests after building"
}

# Creates embedded_worker.js. Must be run after the worker is built for the
# first time
wrap-worker ( ) {
  echo "> wrap-worker-code LMLayerWorkerCode ${NAKED_WORKER} > ${EMBEDDED_WORKER}"
  wrap-worker-code LMLayerWorkerCode "${NAKED_WORKER}" > "${EMBEDDED_WORKER}" || die
  mv "${EMBEDDED_WORKER}" "${NAKED_WORKER}"
}

# Wraps JavaScript code in a way that can be embedded in a worker.
# To get the inner source code, include the file generated by this function,
# then use name.toString() where `name` is the name passed into this
# function.
wrap-worker-code ( ) {
  name="$1"
  js="$2"
  echo "// Autogenerated code. Do not modify!"
  echo "// --START:LMLayerWorkerCode--"
  printf "function %s () {\n" "${name}"

  # Since the worker is compiled with "allowJS=false" so that we can make
  # declaration files, we have to insert polyfills here.

  # This one's a minimal, targeted polyfill.  es6-shim could do the same,
  # but also adds a lot more code the worker doesn't need to use.
  # Recommended by MDN while keeping the worker lean and efficient.
  cat "../../node_modules/string.prototype.codepointat/codepointat.js" || die

  # Needed to ensure functionality on some older Android devices.  (API 19-23 or so)
  cat "../../node_modules/string.prototype.startswith/startswith.js" || die

  # These two are straight from MDN - I didn't find any NPM ones that don't
  # use the node `require` statement for the second.  They're also relatively
  # short and simple, which is good.
  cat "polyfills/array.fill.js"
  cat "polyfills/array.from.js"

  # For Object.values, for iteration over object-based associate arrays.
  cat "polyfills/object.values.js"

  # Needed to support Symbol.iterator, as used by the correction algorithm.
  cat "polyfills/symbol-es6.min.js"

  # Needed to 'support' String.normalize within iOS 9.
  # For our limited use case thereof; is definitely NOT a general polyfill.
  # (The file size on a true one would be quite high.)
  cat "polyfills/string.normalize.js"

  echo ""

  cat "${js}"
  printf "\n}\n"
  echo "// --END:LMLayerWorkerCode--"
}

################################ Main script ################################

run_tests=0
fetch_deps=true
unit_tests_only=0

# Process command-line arguments
while [[ $# -gt 0 ]] ; do
  key="$1"
  case $key in
    -clean)
      clean
      ;;
    -help|-h)
      display_usage
      exit
      ;;
    -skip-package-install|-S)
      fetch_deps=false
      ;;
    -test)
      run_tests=1
      ;;
    -tdd)
      run_tests=1
      fetch_deps=false
      unit_tests_only=1
      ;;
    *)
      echo "$0: invalid option: $key"
      display_usage
      exit $EX_USAGE
  esac
  shift # past the processed argument
done

# Check if Node.JS/npm is installed.
verify_npm_setup $fetch_deps

# Ensure that the build-product destination for any generated include .d.ts files exists.
if ! [ -d $INCLUDES_OUTPUT ]; then
  mkdir -p "$INCLUDES_OUTPUT"
fi

build-wrapped-worker || fail "LMLayer worker compilation failed."
build-browser || fail "Browser-oriented compilation failed."
build-headless || fail "Headless compilation failed."
echo "Typescript compilation successful."

if (( run_tests )); then
  if (( unit_tests_only )); then
    npm run test -- -headless || fail "Unit tests failed"
  else
    npm test || fail "Tests failed"
  fi
fi
