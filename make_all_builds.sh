#!/bin/bash
set -e

BASEDIR="$(readlink -f $(dirname $0))"
HSDATADIR="$BASEDIR/hs-data"

for tag in $(git -C "$HSDATADIR" tag); do
	git -C "$HSDATADIR" reset --hard "$tag"
	python "$BASEDIR/generate.py" --input-dir="$HSDATADIR" --output-dir="$BASEDIR/out/$tag"
done
