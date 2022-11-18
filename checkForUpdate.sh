#!/bin/bash

if [ ! -d ".git" ]; then
    exit
fi

git fetch > /dev/null

UPSTREAM=${1:-'@{u}'}
LOCAL=$(git rev-parse @)
REMOTE=$(git rev-parse "$UPSTREAM")
BASE=$(git merge-base @ "$UPSTREAM")

if [ $LOCAL = $REMOTE ]; then
    echo "The upstream is up to date."
elif [ $LOCAL = $BASE ]; then
    echo "There's new update! You can use git pull to update!"
else
    exit
fi
