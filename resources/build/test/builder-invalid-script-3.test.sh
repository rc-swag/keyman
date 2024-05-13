#!/usr/bin/env bash
## START STANDARD BUILD SCRIPT INCLUDE
# adjust relative paths as necessary
THIS_SCRIPT="$(readlink -f "${BASH_SOURCE[0]}")"
. "${THIS_SCRIPT%/*}/../../../resources/build/builder.inc.sh"
# END STANDARD BUILD SCRIPT INCLUDE

# Test that error exit does not occur, should exit 0

builder_describe "This is a test script"
builder_parse "$@"
