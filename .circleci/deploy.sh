#!/usr/bin/env bash

set -e

git config --global user.email $GH_EMAIL
git config --global user.name $GH_NAME

git clone $CIRCLE_REPOSITORY_URL out

cd out
git checkout $TARGET_BRANCH || git checkout --orphan $TARGET_BRANCH
cp ./CNAME /tmp/CNAME || echo "No CNAME file"
git rm -rf .
cp /tmp/CNAME ./CNAME || echo "No CNAME file"
cd ..

echo "JWT_TOKEN=$JWT_TOKEN" > .env

cat .env

yarn build

cp -a build/. out/.

mkdir -p out/.circleci && cp -a .circleci/. out/.circleci/.
cd out

./.circleci/generate_structure.sh

git add -A
git commit -m "Automated deployment to GitHub Pages: ${CIRCLE_SHA1}" --allow-empty

git push origin $TARGET_BRANCH
cd ..
