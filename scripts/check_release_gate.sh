#!/usr/bin/env bash
set -euo pipefail

marker_file="${1:-docs/release-gate-last-success.json}"

if [[ ! -f "${marker_file}" ]]; then
  echo "marker file not found: ${marker_file}" >&2
  exit 1
fi

head_sha="$(git rev-parse HEAD)"
head_subject="$(git show -s --format=%s HEAD)"
parent_sha=""
if git rev-parse --verify HEAD^ >/dev/null 2>&1; then
  parent_sha="$(git rev-parse HEAD^)"
fi

result="$(
  node -e '
const fs = require("fs");
const path = process.argv[1];
const head = process.argv[2];
const parent = process.argv[3];
const headSubject = process.argv[4];
const marker = JSON.parse(fs.readFileSync(path, "utf8"));
const status = String(marker.status || "").toLowerCase();
const sha = String(marker.sha || "");
const runUrl = String(marker.run_url || "");
const runId = String(marker.run_id || "");
const stepOutcomes = marker.step_outcomes && typeof marker.step_outcomes === "object" ? marker.step_outcomes : {};
const installStep = String(stepOutcomes.install || "");
const verifyStep = String(stepOutcomes.verify || "");
const smokeStep = String(stepOutcomes.smoke || "");
const smokeCheckTailB64 = String(marker.smoke_check_tail_b64 || "");
const smokeLogTailB64 = String(marker.smoke_log_tail_b64 || "");
const decodeTail = (value) => {
  if (!value) return "";
  try {
    const decoded = Buffer.from(value, "base64").toString("utf8");
    return decoded.split("\n").filter(Boolean).slice(-6).join("\n");
  } catch {
    return "";
  }
};
const smokeCheckTail = decodeTail(smokeCheckTailB64);
const smokeLogTail = decodeTail(smokeLogTailB64);
const markerCommitSubject = "chore(ci): record release gate marker [skip release-gate]";
const headIsMarkerCommit = headSubject === markerCommitSubject;
const shaMatchesHead = sha === head;
const shaMatchesParentOfMarkerHead = headIsMarkerCommit && parent && sha === parent;
const ok = status === "success" && (shaMatchesHead || shaMatchesParentOfMarkerHead);
process.stdout.write(JSON.stringify({
  ok,
  status,
  sha,
  head,
  parent,
  runUrl,
  headIsMarkerCommit,
  runId,
  installStep,
  verifyStep,
  smokeStep,
  smokeCheckTail,
  smokeLogTail
}));
' "${marker_file}" "${head_sha}" "${parent_sha}" "${head_subject}"
)"

ok="$(node -e 'const r=JSON.parse(process.argv[1]); process.stdout.write(String(r.ok));' "${result}")"
status="$(node -e 'const r=JSON.parse(process.argv[1]); process.stdout.write(r.status);' "${result}")"
sha="$(node -e 'const r=JSON.parse(process.argv[1]); process.stdout.write(r.sha);' "${result}")"
run_url="$(node -e 'const r=JSON.parse(process.argv[1]); process.stdout.write(r.runUrl);' "${result}")"
run_id="$(node -e 'const r=JSON.parse(process.argv[1]); process.stdout.write(r.runId || "");' "${result}")"
install_step="$(node -e 'const r=JSON.parse(process.argv[1]); process.stdout.write(r.installStep || "");' "${result}")"
verify_step="$(node -e 'const r=JSON.parse(process.argv[1]); process.stdout.write(r.verifyStep || "");' "${result}")"
smoke_step="$(node -e 'const r=JSON.parse(process.argv[1]); process.stdout.write(r.smokeStep || "");' "${result}")"
smoke_check_tail="$(node -e 'const r=JSON.parse(process.argv[1]); process.stdout.write(r.smokeCheckTail || "");' "${result}")"
smoke_log_tail="$(node -e 'const r=JSON.parse(process.argv[1]); process.stdout.write(r.smokeLogTail || "");' "${result}")"

head_is_marker_commit="$(node -e 'const r=JSON.parse(process.argv[1]); process.stdout.write(String(r.headIsMarkerCommit));' "${result}")"
parent_sha_out="$(node -e 'const r=JSON.parse(process.argv[1]); process.stdout.write(r.parent || "");' "${result}")"

if [[ "${ok}" != "true" ]]; then
  echo "release gate marker check failed" >&2
  echo "  expected: status=success and sha=${head_sha}" >&2
  if [[ "${head_is_marker_commit}" == "true" ]] && [[ -n "${parent_sha_out}" ]]; then
    echo "            (or sha=${parent_sha_out} because HEAD is release-gate marker commit)" >&2
  fi
  echo "  actual:   status=${status} sha=${sha}" >&2
  if [[ -n "${run_id}" ]]; then
    echo "  run_id:   ${run_id}" >&2
  fi
  if [[ -n "${install_step}${verify_step}${smoke_step}" ]]; then
    echo "  steps:    install=${install_step:-n/a} verify=${verify_step:-n/a} smoke=${smoke_step:-n/a}" >&2
  fi
  if [[ -n "${run_url}" ]]; then
    echo "  run_url:  ${run_url}" >&2
  fi
  if [[ -n "${smoke_check_tail}" ]]; then
    echo "  smoke_check_tail:" >&2
    echo "${smoke_check_tail}" >&2
  fi
  if [[ -n "${smoke_log_tail}" ]]; then
    echo "  smoke_log_tail:" >&2
    echo "${smoke_log_tail}" >&2
  fi
  exit 1
fi

echo "release gate marker valid for HEAD"
if [[ -n "${run_id}" ]]; then
  echo "run_id=${run_id}"
fi
if [[ -n "${install_step}${verify_step}${smoke_step}" ]]; then
  echo "steps=install:${install_step:-n/a},verify:${verify_step:-n/a},smoke:${smoke_step:-n/a}"
fi
echo "run_url=${run_url}"
