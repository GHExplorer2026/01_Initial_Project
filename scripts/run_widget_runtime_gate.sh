#!/usr/bin/env bash
set -u -o pipefail

artifact_dir="widget-runtime/artifacts"
mkdir -p "$artifact_dir"

started_at_utc="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
commit_sha="$(git rev-parse HEAD)"
branch="$(git rev-parse --abbrev-ref HEAD)"
run_id="${RUN_ID:-local-$(date -u +%Y%m%d%H%M%S)}"

freeze_status="failure"
contract_status="failure"
typecheck_status="failure"
overall_status="failure"

run_check() {
  local name="$1"
  local cmd="$2"
  local log="$artifact_dir/${name}.log"

  if bash -lc "$cmd" >"$log" 2>&1; then
    echo "[$name] PASS"
    return 0
  fi

  echo "[$name] FAIL"
  tail -n 40 "$log" || true
  return 1
}

if run_check "freeze" "PATH=\"$HOME/.nvm/versions/node/v20.20.0/bin:\$PATH\" npm run check:widget-runtime-freeze"; then
  freeze_status="success"
fi

if run_check "contract" "TMPDIR=/tmp PATH=\"$HOME/.nvm/versions/node/v20.20.0/bin:\$PATH\" npm run contract:widget-feed"; then
  contract_status="success"
fi

if run_check "typecheck" "PATH=\"$HOME/.nvm/versions/node/v20.20.0/bin:\$PATH\" npm run typecheck"; then
  typecheck_status="success"
fi

if [[ "$freeze_status" == "success" && "$contract_status" == "success" && "$typecheck_status" == "success" ]]; then
  overall_status="success"
fi

finished_at_utc="$(date -u +%Y-%m-%dT%H:%M:%SZ)"

cat >"$artifact_dir/gate-metadata.json" <<EOF
{
  "run_id": "$run_id",
  "commit_sha": "$commit_sha",
  "branch": "$branch",
  "started_at_utc": "$started_at_utc",
  "finished_at_utc": "$finished_at_utc"
}
EOF

cat >"$artifact_dir/checks-summary.json" <<EOF
{
  "check_widget_runtime_freeze": "$freeze_status",
  "contract": "$contract_status",
  "typecheck": "$typecheck_status",
  "status": "$overall_status"
}
EOF

if [[ "$overall_status" != "success" ]]; then
  exit 1
fi

echo "widget runtime gate passed"
