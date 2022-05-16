#!/bin/bash

set -e

echo ''

# env
echo "node version: $(node -v)"
echo "npm version: $(npm -v)"

# Build vuepress project
echo "==> Start building \n $BUILD_SCRIPT"
eval "$BUILD_SCRIPT"
echo "Build success"

# Change directory to the dest
echo "==> Changing directory to '$BUILD_DIR' ..."
cd $BUILD_DIR

echo "==> Prepare to deploy"

git init
git config user.name "${GITHUB_ACTOR}"
git config user.email "${GITHUB_ACTOR}@users.noreply.github.com"

if [ -z "$(git status --porcelain)" ]; then
    echo "The BUILD_DIR is setting error or nothing produced" && \
    echo "Exiting..."
    exit 0
fi

echo "==> Starting deploying"

DEPLOY_REPO="https://username:${ACCESS_TOKEN}@github.com/zebing/knownledge.git"

git add .
git commit -m "deploy"
git push --force $DEPLOY_REPO master:pages
rm -fr .git

cd -

echo "Successfully deployed!"