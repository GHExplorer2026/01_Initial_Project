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
grep -qi '^content-type: text/calendar; charset=utf-8' "${headers_file}" || { echo "invalid ICS content-type"; exit 1; }
grep -q $'\r' "${body_file}" || { echo "ICS is missing CRLF bytes"; exit 1; }
grep -q 'BEGIN:VCALENDAR' "${body_file}" || { echo "missing VCALENDAR"; exit 1; }
grep -q 'CATEGORIES:Wirtschafts-Event' "${body_file}" || { echo "missing required category"; exit 1; }
echo "[smoke] ics ok"

rm -f "${headers_file}" "${body_file}"
echo "[smoke] done"
