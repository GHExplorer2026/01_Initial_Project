#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${1:-http://127.0.0.1:3000}"
REGIONS="${2:-USA,EZ}"

weekly_url="${BASE_URL}/api/weekly?regions=${REGIONS}"
ics_url="${BASE_URL}/api/weekly.ics?regions=${REGIONS}"
root_url="${BASE_URL}/"

echo "[smoke] ui: ${root_url}"
root_html="$(curl -fsS "${root_url}")"
echo "${root_html}" | grep -q 'Country Scope' || { echo "missing ui heading: Country Scope"; exit 1; }
echo "${root_html}" | grep -q 'Wochenausblick generieren' || { echo "missing generate button label"; exit 1; }
echo "${root_html}" | grep -q '\.ICS herunterladen' || { echo "missing ics button label"; exit 1; }
echo "${root_html}" | grep -q 'aria-label="Strict output block"' || { echo "missing strict output block aria label"; exit 1; }
echo "[smoke] ui ok"

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
normalized_ics_file="$(mktemp)"
tr -d '\r' < "${body_file}" > "${normalized_ics_file}"

vevent_count="$(grep -c '^BEGIN:VEVENT$' "${normalized_ics_file}" || true)"
category_count="$(grep -c '^CATEGORIES:Wirtschafts-Event$' "${normalized_ics_file}" || true)"
if [[ "${vevent_count}" -gt 0 ]] && [[ "${category_count}" -ne "${vevent_count}" ]]; then
  echo "missing required category in one or more VEVENTs (vevents=${vevent_count}, categories=${category_count})"
  sed -n '1,120p' "${normalized_ics_file}"
  rm -f "${normalized_ics_file}"
  exit 1
fi
rm -f "${normalized_ics_file}"
echo "[smoke] ics ok"

rm -f "${headers_file}" "${body_file}"
echo "[smoke] done"
