#!/usr/bin/env bash
set -u -o pipefail

artifact_dir="widget-runtime/artifacts"
mkdir -p "$artifact_dir"

started_at_utc="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
commit_sha="$(git rev-parse HEAD)"
branch="$(git rev-parse --abbrev-ref HEAD)"
run_id="${RUN_ID:-local-$(date -u +%Y%m%d%H%M%S)}"
profile="${WIDGET_GATE_PROFILE:-full}"

freeze_status="failure"
contract_status="failure"
typecheck_status="failure"
lint_status="skipped"
unit_status="skipped"
build_status="skipped"
security_compliance_status="skipped"
rollback_status="skipped"
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

if [[ "$profile" == "full" ]]; then
  lint_status="failure"
  unit_status="failure"
  build_status="failure"
  security_compliance_status="failure"
  rollback_status="failure"

  if run_check "lint" "PATH=\"$HOME/.nvm/versions/node/v20.20.0/bin:\$PATH\" npm run lint"; then
    lint_status="success"
  fi

  if run_check "unit" "TMPDIR=/tmp PATH=\"$HOME/.nvm/versions/node/v20.20.0/bin:\$PATH\" npm run unit"; then
    unit_status="success"
  fi

  if run_check "build" "TMPDIR=/tmp PATH=\"$HOME/.nvm/versions/node/v20.20.0/bin:\$PATH\" npm run build"; then
    build_status="success"
  fi

  if run_check "security-compliance" "bash scripts/check_widget_runtime_rc_evidence.sh --security"; then
    security_compliance_status="success"
  fi

  if run_check "rollback" "bash scripts/check_widget_runtime_rc_evidence.sh --rollback"; then
    rollback_status="success"
  fi

  if [[ "$freeze_status" == "success" \
    && "$contract_status" == "success" \
    && "$typecheck_status" == "success" \
    && "$lint_status" == "success" \
    && "$unit_status" == "success" \
    && "$build_status" == "success" \
    && "$security_compliance_status" == "success" \
    && "$rollback_status" == "success" ]]; then
    overall_status="success"
  fi
else
  if [[ "$freeze_status" == "success" && "$contract_status" == "success" && "$typecheck_status" == "success" ]]; then
    overall_status="success"
  fi
fi

finished_at_utc="$(date -u +%Y-%m-%dT%H:%M:%SZ)"

cat >"$artifact_dir/gate-metadata.json" <<EOF
{
  "run_id": "$run_id",
  "commit_sha": "$commit_sha",
  "branch": "$branch",
  "profile": "$profile",
  "started_at_utc": "$started_at_utc",
  "finished_at_utc": "$finished_at_utc"
}
EOF

cat >"$artifact_dir/checks-summary.json" <<EOF
{
  "profile": "$profile",
  "check_widget_runtime_freeze": "$freeze_status",
  "contract": "$contract_status",
  "typecheck": "$typecheck_status",
  "lint": "$lint_status",
  "unit": "$unit_status",
  "build": "$build_status",
  "security_compliance": "$security_compliance_status",
  "rollback": "$rollback_status",
  "status": "$overall_status"
}
EOF

if [[ "$overall_status" != "success" ]]; then
  exit 1
fi

echo "widget runtime gate passed"
