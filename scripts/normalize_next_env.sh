#!/usr/bin/env bash
set -euo pipefail

target_file="next-env.d.ts"
canonical_line='import "./.next/types/routes.d.ts";'
dev_line='import "./.next/dev/types/routes.d.ts";'

if [[ ! -f "${target_file}" ]]; then
  echo "normalize_next_env: file not found: ${target_file}" >&2
  exit 1
fi

if grep -Fq "${dev_line}" "${target_file}"; then
  sed -i "s|${dev_line}|${canonical_line}|g" "${target_file}"
fi

if ! grep -Fq "${canonical_line}" "${target_file}"; then
  echo "normalize_next_env: canonical import line is missing after normalization" >&2
  exit 1
fi

echo "normalize_next_env: ${target_file} normalized"
