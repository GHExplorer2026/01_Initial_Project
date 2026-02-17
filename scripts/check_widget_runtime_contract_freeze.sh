#!/usr/bin/env bash
set -euo pipefail

manifest="widget-runtime/contracts/contract-freeze.sha256"

if [[ ! -f "$manifest" ]]; then
  echo "widget-runtime contract freeze manifest missing: $manifest"
  exit 1
fi

while read -r expected path; do
  [[ -z "${expected:-}" ]] && continue
  [[ "${expected:0:1}" == "#" ]] && continue

  if [[ ! -f "$path" ]]; then
    echo "widget-runtime contract freeze check failed: missing $path"
    exit 1
  fi

  actual="$(sha256sum "$path" | awk '{print $1}')"
  if [[ "$actual" != "$expected" ]]; then
    echo "widget-runtime contract freeze check failed: $path"
    echo "  expected: $expected"
    echo "  actual:   $actual"
    exit 1
  fi
done < "$manifest"

echo "widget-runtime contract freeze check passed"
