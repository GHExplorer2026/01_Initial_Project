#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${1:-http://127.0.0.1:3000}"
REGIONS="${2:-USA,EZ}"

weekly_url="${BASE_URL}/api/weekly?regions=${REGIONS}"
ics_url="${BASE_URL}/api/weekly.ics?regions=${REGIONS}"

echo "[smoke] weekly: ${weekly_url}"
weekly_json="$(curl -fsS "${weekly_url}")"
echo "${weekly_json}" | grep -q '"renderedText"' || { echo "missing renderedText"; exit 1; }
echo "${weekly_json}" | grep -q '"meta"' || { echo "missing meta"; exit 1; }
echo "${weekly_json}" | grep -q '"sourceMode"' || { echo "missing meta.sourceMode"; exit 1; }
echo "${weekly_json}" | grep -q '"sourcesUsed"' || { echo "missing meta.sourcesUsed"; exit 1; }
echo "[smoke] weekly ok"

echo "[smoke] ics: ${ics_url}"
headers_file="$(mktemp)"
body_file="$(mktemp)"
curl -fsS -D "${headers_file}" "${ics_url}" -o "${body_file}"
content_type_line="$(
  awk 'BEGIN{IGNORECASE=1} /^content-type:/ { sub(/\r$/, "", $0); print tolower($0) }' "${headers_file}" | tail -n1
)"
if [[ -z "${content_type_line}" ]] || [[ "${content_type_line}" != content-type:*text/calendar* ]] || [[ "${content_type_line}" != *charset=utf-8* ]]; then
  echo "invalid ICS content-type: ${content_type_line:-<missing>}"
  echo "--- response headers ---"
  cat "${headers_file}"
  exit 1
fi

grep -q $'\r' "${body_file}" || {
  echo "ICS is missing CRLF bytes"
  echo "--- ICS preview ---"
  sed -n '1,40p' "${body_file}"
  exit 1
}
grep -q 'BEGIN:VCALENDAR' "${body_file}" || {
  echo "missing VCALENDAR"
  sed -n '1,40p' "${body_file}"
  exit 1
}
grep -q 'CATEGORIES:Wirtschafts-Event' "${body_file}" || {
  echo "missing required category"
  sed -n '1,80p' "${body_file}"
  exit 1
}
echo "[smoke] ics ok"

rm -f "${headers_file}" "${body_file}"
echo "[smoke] done"
