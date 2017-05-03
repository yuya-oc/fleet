#!/bin/sh
set -eu

IMAGE="${1}"
DEST="${2}"

curl xn--9i8hku.ws/yosemite-icon/api \
  -F "icon_image=@${IMAGE}" \
  -F 'base_color=rgb(31, 136, 188)' \
  > "${DEST}"
