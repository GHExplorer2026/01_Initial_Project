#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${1:-http://127.0.0.1:3000}"
REGIONS="${2:-USA,EZ}"
EXPECTED_SOURCE_MODE="${3:-fixtures}"

weekly_url="${BASE_URL}/api/weekly?regions=${REGIONS}"
ics_url="${BASE_URL}/api/weekly.ics?regions=${REGIONS}"
root_url="${BASE_URL}/"

echo "[smoke] ui: ${root_url}"
root_html="$(curl -fsS "${root_url}")"
echo "${root_html}" | grep -q 'Country Scope' || { echo "missing ui heading: Country Scope"; exit 1; }
echo "${root_html}" | grep -q 'Wochenausblick generieren' || { echo "missing generate button label"; exit 1; }
echo "${root_html}" | grep -q '\.ICS herunterladen' || { echo "missing ics button label"; exit 1; }
echo "${root_html}" | grep -q 'Strict Output anzeigen' || { echo "missing strict output toggle label"; exit 1; }
if ! echo "${root_html}" | grep -q 'Strict Output ist ausgeblendet.' && ! echo "${root_html}" | grep -q 'aria-label="Strict output block"'; then
  echo "missing strict output default-hidden hint or strict output block"
  exit 1
fi
echo "[smoke] ui ok"

echo "[smoke] weekly: ${weekly_url}"
weekly_json="$(curl -fsS "${weekly_url}")"
echo "${weekly_json}" | grep -q '"renderedText"' || { echo "missing renderedText"; exit 1; }
echo "${weekly_json}" | grep -q '"meta"' || { echo "missing meta"; exit 1; }
echo "${weekly_json}" | grep -q '"sourceMode"' || { echo "missing meta.sourceMode"; exit 1; }
echo "${weekly_json}" | grep -q '"sourcesUsed"' || { echo "missing meta.sourcesUsed"; exit 1; }
echo "${weekly_json}" | node -e '
const fs = require("fs");
const payload = JSON.parse(fs.readFileSync(0, "utf8"));
const expectedMode = process.argv[1];
const requestedRegions = process.argv[2].split(",").map((v) => v.trim().toUpperCase()).filter(Boolean);
const regionLabels = {
  USA: "USA",
  EZ: "Euro Zone",
  UK: "United Kingdom",
  JP: "Japan",
  CH: "Switzerland",
  CA: "Canada",
  AU: "Australia",
  NZ: "New Zealand"
};
const allowedLabels = requestedRegions
  .map((code) => regionLabels[code])
  .filter((label) => typeof label === "string")
  .sort((a, b) => b.length - a.length);
if (!payload || typeof payload !== "object") {
  console.error("weekly payload is not an object");
  process.exit(1);
}
if (typeof payload.renderedText !== "string") {
  console.error("renderedText is not a string");
  process.exit(1);
}
if (payload.renderedText.includes("http://") || payload.renderedText.includes("https://")) {
  console.error("strict output contains links");
  process.exit(1);
}
const firstLine = payload.renderedText.split("\n")[0] || "";
if (!firstLine.startsWith("📊 WOCHENAUSBLICK ")) {
  console.error("strict header missing or malformed");
  process.exit(1);
}
if (!/^📊 WOCHENAUSBLICK \d{2}\.\d{2}\.\d{4} – \d{2}\.\d{2}\.\d{4}$/.test(firstLine)) {
  console.error(`strict header date format invalid: ${firstLine}`);
  process.exit(1);
}
const dayHeaders = payload.renderedText.split("\n").filter((line) => line.startsWith("### "));
if (dayHeaders.length !== 5) {
  console.error(`unexpected number of day headers: ${dayHeaders.length}`);
  process.exit(1);
}
const allowedNotes = new Set([
  "Hinweis: Keine Handelstermine – Wochenende oder Feiertag.",
  "Hinweis: Keine Handelstermine – Feiertag.",
  "Hinweis: Keine verifizierten Events gefunden."
]);
const lines = payload.renderedText.split("\n");
for (const line of lines) {
  if (
    line.length > 0 &&
    !line.startsWith("📊 ") &&
    !line.startsWith("### ") &&
    !line.startsWith("Hinweis: ")
  ) {
    if (!/^(?:\d{2}:\d{2} Uhr:|All Day:) .+$/.test(line)) {
      console.error(`invalid event line format: ${line}`);
      process.exit(1);
    }
    const afterPrefix = line.replace(/^(?:\d{2}:\d{2} Uhr:|All Day:) /, "");
    const hasAllowedLabel = allowedLabels.some((label) => afterPrefix.startsWith(`${label} `));
    if (!hasAllowedLabel) {
      console.error(`event line violates selected regions scope: ${line}`);
      process.exit(1);
    }
  }
  if (line.startsWith("Hinweis: ") && !allowedNotes.has(line)) {
    console.error(`unexpected Hinweis line: ${line}`);
    process.exit(1);
  }
  if (line.includes("TOP-EVENT") && !line.endsWith(" - **TOP-EVENT**")) {
    console.error(`invalid TOP-EVENT suffix format: ${line}`);
    process.exit(1);
  }
}
const meta = payload.meta;
if (!meta || typeof meta !== "object") {
  console.error("meta missing or invalid");
  process.exit(1);
}
if (meta.sourceMode !== expectedMode) {
  console.error(`unexpected sourceMode: ${meta.sourceMode} (expected ${expectedMode})`);
  process.exit(1);
}
if (!Array.isArray(meta.sourcesUsed)) {
  console.error("sourcesUsed is not an array");
  process.exit(1);
}
if (meta.sourcesUsed.length === 0) {
  console.error("sourcesUsed is empty");
  process.exit(1);
}
const hasPrimaryOrSecondary = meta.sourcesUsed.some((item) => item === "investing" || item === "tradingview");
if (!hasPrimaryOrSecondary) {
  console.error("sourcesUsed missing investing/tradingview");
  process.exit(1);
}
' "${EXPECTED_SOURCE_MODE}" "${REGIONS}"
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
content_disposition_line="$(
  awk 'BEGIN{IGNORECASE=1} /^content-disposition:/ { sub(/\r$/, "", $0); print $0 }' "${headers_file}" | tail -n1
)"
if [[ -z "${content_disposition_line}" ]] || [[ ! "${content_disposition_line}" =~ filename=\"Wochenausblick_[0-9]{4}-[0-9]{2}-[0-9]{2}\.ics\" ]]; then
  echo "invalid ICS content-disposition: ${content_disposition_line:-<missing>}"
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

description_count="$(grep -c '^DESCRIPTION:Importance: ' "${normalized_ics_file}" || true)"
if [[ "${vevent_count}" -gt 0 ]] && [[ "${description_count}" -ne "${vevent_count}" ]]; then
  echo "missing metrics DESCRIPTION in one or more VEVENTs (vevents=${vevent_count}, descriptions=${description_count})"
  sed -n '1,120p' "${normalized_ics_file}"
  rm -f "${normalized_ics_file}"
  exit 1
fi

if [[ "${vevent_count}" -gt 0 ]]; then
  REGIONS="${REGIONS}" node -e '
const fs = require("fs");
const content = fs.readFileSync(process.argv[1], "utf8");
const requestedRegions = (process.env.REGIONS || "")
  .split(",")
  .map((v) => v.trim().toUpperCase())
  .filter(Boolean);
const regionLabels = {
  USA: "USA",
  EZ: "Euro Zone",
  UK: "United Kingdom",
  JP: "Japan",
  CH: "Switzerland",
  CA: "Canada",
  AU: "Australia",
  NZ: "New Zealand"
};
const allowedLabels = requestedRegions
  .map((code) => regionLabels[code])
  .filter((label) => typeof label === "string")
  .sort((a, b) => b.length - a.length);
const summaries = content
  .split("\n")
  .filter((line) => line.startsWith("SUMMARY:"))
  .map((line) => line.slice("SUMMARY:".length));
for (const summary of summaries) {
  const hasAllowedLabel = allowedLabels.some((label) => summary.startsWith(`${label} `));
  if (!hasAllowedLabel) {
    console.error(`ics summary violates selected regions scope: ${summary}`);
    process.exit(1);
  }
}
' "${normalized_ics_file}"
fi
rm -f "${normalized_ics_file}"
echo "[smoke] ics ok"

rm -f "${headers_file}" "${body_file}"
echo "[smoke] done"
