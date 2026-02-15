#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 1 ]]; then
  echo "usage: $0 \"<commit message>\" [targeted test args...]"
  exit 1
fi

commit_message="$1"
shift || true

node20_prefix='TMPDIR=/tmp PATH="$HOME/.nvm/versions/node/v20.20.0/bin:$PATH"'

if [[ $# -gt 0 ]]; then
  eval "${node20_prefix} npm run unit -- \"$@\""
fi

eval "${node20_prefix} npm run verify"
npm run check:next-env

git add -A
if git diff --cached --quiet; then
  echo "no staged changes to commit"
else
  git commit -m "${commit_message}"
fi

git push origin main

for i in 1 2 3 4 5 6; do
  echo "release-gate-attempt:${i}"
  git fetch origin main --prune >/dev/null 2>&1 || true
  git pull --ff-only >/dev/null 2>&1 || true
  if eval "${node20_prefix} npm run check:release-gate"; then
    exit 0
  fi
  sleep 20
done

echo "release gate marker did not converge after retries"
exit 1
