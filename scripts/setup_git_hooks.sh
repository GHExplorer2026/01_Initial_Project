#!/usr/bin/env bash
set -euo pipefail

repo_root="$(git rev-parse --show-toplevel 2>/dev/null || true)"
if [[ -z "${repo_root}" ]]; then
  echo "setup_git_hooks: not inside a git repository" >&2
  exit 1
fi

cd "${repo_root}"

if [[ ! -d ".githooks" ]]; then
  echo "setup_git_hooks: .githooks directory is missing" >&2
  exit 1
fi

chmod +x .githooks/pre-commit scripts/normalize_next_env.sh scripts/check_next_env.sh
git config core.hooksPath .githooks

echo "setup_git_hooks: core.hooksPath set to .githooks"
