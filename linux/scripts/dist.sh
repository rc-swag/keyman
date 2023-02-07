#!/bin/bash

# Build dist tarballs or Debian orig tarballs
# and put them in dist/

# parameters: ./dist.sh [origdist] [proj]
# origdist = create Debian orig.tar.gz
# proj = only make tarball for this project

set -e

## START STANDARD BUILD SCRIPT INCLUDE
# adjust relative paths as necessary
THIS_SCRIPT="$(greadlink -f "${BASH_SOURCE[0]}" 2>/dev/null || readlink -f "${BASH_SOURCE[0]}")"
. "$(dirname "$THIS_SCRIPT")/../../resources/build/build-utils.sh"
## END STANDARD BUILD SCRIPT INCLUDE

BASEDIR=$(pwd)
extra_projects="keyman"

if [ "$1" == "origdist" ]; then
    create_origdist=1
    shift
fi

if [ "$1" != "" ]; then
    echo "$1"
    if [ "$1" == "keyman" ]; then
        extra_projects="$1"
    else
        echo "project $1 does not exist"
        exit 1
    fi
fi

rm -rf dist
mkdir -p dist

# configure and make dist for autotool projects
for proj in ${extra_projects}; do
    # dist for keyman
    cp -a debian ../
    cd ..
    echo "3.0 (native)" > debian/source/format
    dch keyman --newversion "${VERSION}" --force-bad-version --nomultimaint
    dpkg-source --tar-ignore=*~ --tar-ignore=.git --tar-ignore=.gitattributes \
        --tar-ignore=.gitignore --tar-ignore=experiments --tar-ignore=debian \
        --tar-ignore=.github --tar-ignore=.vscode --tar-ignore=android \
        --tar-ignore=common/models --tar-ignore=common/predictive-text \
        --tar-ignore=common/resources --tar-ignore=common/schemas \
        --tar-ignore=common/test --tar-ignore=common/web --tar-ignore=common/windows \
        --tar-ignore=developer --tar-ignore=docs --tar-ignore=ios \
        --tar-ignore=linux/keyman-config/buildtools/build-langtags.py --tar-ignore=__pycache__ \
        --tar-ignore=linux/help --tar-ignore=linux/Jenkinsfile \
        --tar-ignore=linux/keyboardprocessor \
        --tar-ignore=mac --tar-ignore=node_modules --tar-ignore=oem \
        --tar-ignore=linux/build* --tar-ignore=core/build \
        --tar-ignore=resources/devbox --tar-ignore=resources/git-hooks \
        --tar-ignore=resources/scopes \
        --tar-ignore=resources/build/*.lua --tar-ignore=resources/build/jq* \
        --tar-ignore=resources/build/vswhere* --tar-ignore=results \
        --tar-ignore=web --tar-ignore=windows --tar-ignore=keyman_1* \
        --tar-ignore=dist --tar-ignore=.pbuilderrc --tar-ignore=VERSION \
        --tar-ignore=scripts -Zgzip -b .
    mv ../keyman_"${VERSION}".tar.gz linux/dist/keyman-"${VERSION}".tar.gz
    echo "3.0 (quilt)" > debian/source/format
    cd "$BASEDIR"
done

# create orig.tar.gz
if [ -n "$create_origdist" ]; then
    cd dist
    pkgvers="keyman-$VERSION"
    tar xfz keyman-"${VERSION}".tar.gz
    mv -v keyman "${pkgvers}" 2>/dev/null || mv -v "$(find . -mindepth 1 -maxdepth 1 -type d)" "${pkgvers}"
    tar cfz "keyman_${VERSION}.orig.tar.gz" "${pkgvers}"
    rm "keyman-${VERSION}.tar.gz"
    rm -rf "${pkgvers}"
fi
