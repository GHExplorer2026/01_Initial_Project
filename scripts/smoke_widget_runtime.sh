#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${1:-http://127.0.0.1:3000}"

echo "[widget-smoke] page: ${BASE_URL}/widget-preview"
page_headers="$(curl -sSI "${BASE_URL}/widget-preview")"
echo "${page_headers}" | grep -qi "200" || { echo "widget preview page not reachable"; exit 1; }

echo "[widget-smoke] feed: ${BASE_URL}/api/widget-feed?regions=USA,EZ&datePreset=today"
feed_json="$(curl -sS "${BASE_URL}/api/widget-feed?regions=USA,EZ&datePreset=today")"

echo "${feed_json}" | node -e '
const fs=require("fs");
const payload=JSON.parse(fs.readFileSync(0,"utf8"));
if(!payload.meta){ console.error("missing meta"); process.exit(1); }
if(payload.meta.feedVersion!=="1.1"){ console.error("unexpected feedVersion"); process.exit(1); }
if(payload.meta.timezoneReference!=="UTC"){ console.error("unexpected timezoneReference"); process.exit(1); }
if(!Array.isArray(payload.events)){ console.error("events is not array"); process.exit(1); }
if(payload.events.length>0){
  const e=payload.events[0];
  const required=["eventId","datetimeUTC","timeKind","region","currency","titleRaw","importance","isTopEvent"];
  for(const k of required){ if(!(k in e)){ console.error("missing event field: "+k); process.exit(1);} }
}
console.log("widget feed ok; events="+payload.events.length);
'

echo "[widget-smoke] done"
