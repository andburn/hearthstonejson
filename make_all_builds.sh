#!/bin/bash
set -e

BASEDIR="$(readlink -f $(dirname $0))"
HSDATADIR=${HSDATA:-"$BASEDIR/hs-data"}
OUTDIR="$BASEDIR/v1"
LIVEDIR="/srv/http/api.hearthstonejson.com/html/v1"

builds=($(printf "%s\n" $(git -C "$HSDATADIR" tag) | sort -n))
maxbuild="${builds[-1]}"

mkdir -p "$OUTDIR"

for tag in ${builds[@]}; do
	git -C "$HSDATADIR" reset --hard "$tag"
	python "$BASEDIR/generate.py" --input-dir="$HSDATADIR" --output-dir="$OUTDIR/$tag"
done

# Update enums list
python -m hearthstone.enums > "$OUTDIR/enums.json"

# Symlink latest build
ln -s "$maxbuild" "$OUTDIR/latest"

if [[ "$HOST" == "hearthsim.net" ]]; then
	rm -rf "$LIVEDIR"
	mv "$OUTDIR" "$LIVEDIR"
	chown -R www-data:www-data "$LIVEDIR"
fi
