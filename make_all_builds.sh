#!/bin/bash
set -e

BASEDIR="$(readlink -f $(dirname $0))"
HSDATADIR="$BASEDIR/hs-data"
OUTDIR="$BASEDIR/out"

builds=($(printf "%s\n" $(git -C "$HSDATADIR" tag) | sort -n))
maxbuild="${builds[-1]}"

mkdir -p "$OUTDIR"

for tag in ${builds[@]}; do
	git -C "$HSDATADIR" reset --hard "$tag"
	python "$BASEDIR/generate.py" --input-dir="$HSDATADIR" --output-dir="$OUTDIR/$tag"
done

# Symlink latest build
ln -s "$maxbuild" "$OUTDIR/latest"
