#!/usr/bin/env bash
set -euo pipefail

mode="${1:-}"

security_file="widget-runtime/docs/SECURITY_COMPLIANCE_EVIDENCE.md"
rollback_file="widget-runtime/docs/ROLLBACK_DRILL_EVIDENCE.md"

check_pass_marker() {
  local file="$1"
  local marker="$2"
  if [[ ! -f "$file" ]]; then
    echo "missing evidence file: $file"
    exit 1
  fi
  if ! rg -n "$marker" "$file" >/dev/null 2>&1; then
    echo "missing marker '$marker' in $file"
    exit 1
  fi
}

case "$mode" in
  --security)
    check_pass_marker "$security_file" "^status:[[:space:]]*PASS$"
    echo "widget runtime security/compliance evidence check passed"
    ;;
  --rollback)
    check_pass_marker "$rollback_file" "^status:[[:space:]]*PASS$"
    echo "widget runtime rollback evidence check passed"
    ;;
  *)
    check_pass_marker "$security_file" "^status:[[:space:]]*PASS$"
    check_pass_marker "$rollback_file" "^status:[[:space:]]*PASS$"
    echo "widget runtime RC evidence checks passed"
    ;;
esac
