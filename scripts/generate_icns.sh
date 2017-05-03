#!/bin/bash
set -eu

FILE="${1}"
DEST_DIR="${2%.icns}"
ICONSET="${DEST_DIR}.iconset"

function generate() {
  local SIZE="${1}"
  local DEST_SIZE="${SIZE}x${SIZE}"
  convert -scale "${DEST_SIZE}" "${FILE}" "${ICONSET}/icon_${DEST_SIZE}.png"
  local RETINA_SIZE="$(expr ${SIZE} \* 2)"
  local RETINA_DEST_SIZE="${RETINA_SIZE}x${RETINA_SIZE}"
  convert -scale "${RETINA_DEST_SIZE}" "${FILE}" "${ICONSET}/icon_${DEST_SIZE}@2x.png"
}

mkdir -p "${ICONSET}"

for i in 16 32 128 256 512
do
  generate "${i}"
done

iconutil -c icns "${DEST_DIR}.iconset"
rm -r "${DEST_DIR}.iconset"
