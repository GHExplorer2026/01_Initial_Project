#!/usr/bin/env bash
set -euo pipefail

target_file="next-env.d.ts"
canonical_line='import "./.next/types/routes.d.ts";'
dev_line='import "./.next/dev/types/routes.d.ts";'

if [[ ! -f "${target_file}" ]]; then
  echo "check_next_env: file not found: ${target_file}" >&2
  exit 1
fi

if grep -Fq "${dev_line}" "${target_file}"; then
  echo "check_next_env: drift detected (${dev_line}) in ${target_file}" >&2
  echo "run: npm run fix:next-env" >&2
  exit 1
fi

if ! grep -Fq "${canonical_line}" "${target_file}"; then
  echo "check_next_env: canonical import line missing in ${target_file}" >&2
  echo "expected: ${canonical_line}" >&2
  exit 1
fi

echo "check_next_env: ${target_file} is canonical"
