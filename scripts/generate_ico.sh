#!/bin/bash
set -eu

PNG="${1}"
DEST_ICO="${2}"

convert "${PNG}" -define icon:auto-resize "${DEST_ICO}"
