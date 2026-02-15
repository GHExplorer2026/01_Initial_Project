#!/usr/bin/env bash
set -euo pipefail

cleanup() {
  bash scripts/normalize_next_env.sh >/dev/null 2>&1 || true
}

trap cleanup EXIT INT TERM

export TZ=Europe/Berlin
export SOURCE_MODE=fixtures

next dev --hostname 127.0.0.1 --port 3000 "$@"
