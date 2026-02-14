#!/usr/bin/env bash
set -euo pipefail

marker_file="${1:-docs/release-gate-last-success.json}"

if [[ ! -f "${marker_file}" ]]; then
  echo "marker file not found: ${marker_file}" >&2
  exit 1
fi

head_sha="$(git rev-parse HEAD)"

result="$(
  node -e '
const fs = require("fs");
const path = process.argv[1];
const head = process.argv[2];
const marker = JSON.parse(fs.readFileSync(path, "utf8"));
const status = String(marker.status || "").toLowerCase();
const sha = String(marker.sha || "");
const runUrl = String(marker.run_url || "");
const ok = status === "success" && sha === head;
process.stdout.write(JSON.stringify({ ok, status, sha, head, runUrl }));
' "${marker_file}" "${head_sha}"
)"

ok="$(node -e 'const r=JSON.parse(process.argv[1]); process.stdout.write(String(r.ok));' "${result}")"
status="$(node -e 'const r=JSON.parse(process.argv[1]); process.stdout.write(r.status);' "${result}")"
sha="$(node -e 'const r=JSON.parse(process.argv[1]); process.stdout.write(r.sha);' "${result}")"
run_url="$(node -e 'const r=JSON.parse(process.argv[1]); process.stdout.write(r.runUrl);' "${result}")"

if [[ "${ok}" != "true" ]]; then
  echo "release gate marker check failed" >&2
  echo "  expected: status=success and sha=${head_sha}" >&2
  echo "  actual:   status=${status} sha=${sha}" >&2
  if [[ -n "${run_url}" ]]; then
    echo "  run_url:  ${run_url}" >&2
  fi
  exit 1
fi

echo "release gate marker valid for HEAD"
echo "run_url=${run_url}"
