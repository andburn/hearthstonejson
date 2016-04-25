#!/bin/bash
set -e

BASEDIR="$(readlink -f $(dirname $0))"
HSDATADIR="$BASEDIR/hs-data"
OUTDIR="$BASEDIR/v1"
LIVEDIR="/srv/http/api.hearthstonejson.com/html/v1"

builds=($(printf "%s\n" $(git -C "$HSDATADIR" tag) | sort -n))
maxbuild="${builds[-1]}"

mkdir -p "$OUTDIR"

for tag in ${builds[@]}; do
	git -C "$HSDATADIR" reset --hard "$tag"
	python "$BASEDIR/generate.py" --input-dir="$HSDATADIR" --output-dir="$OUTDIR/$tag"
done

sudo rsync -rtv "$OUTDIR" "$LIVEDIR"
sudo rm "$LIVEDIR/latest"
# Symlink latest build
sudo ln -s "$maxbuild" "$LIVEDIR/latest"
sudo chown -R www-data:www-data "$LIVEDIR"
