#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ARTIFACTS_DIR="${ROOT_DIR}/artifacts"
STAGING_DIR="${ARTIFACTS_DIR}/provider-win-x64"
ZIP_PATH="${ARTIFACTS_DIR}/provider-win-x64.zip"
SHA_PATH="${ARTIFACTS_DIR}/provider-win-x64.sha256"

cd "${ROOT_DIR}"

if [ ! -f ".next/standalone/server.js" ]; then
  echo "Missing .next/standalone/server.js. Run npm run build first."
  exit 1
fi

rm -rf "${STAGING_DIR}" "${ZIP_PATH}" "${SHA_PATH}"
mkdir -p "${STAGING_DIR}/.next" "${STAGING_DIR}/bootstrap" "${ARTIFACTS_DIR}"

cp -R ".next/standalone" "${STAGING_DIR}/.next/standalone"
cp -R ".next/static" "${STAGING_DIR}/.next/static"

if [ -d "public" ]; then
  cp -R "public" "${STAGING_DIR}/public"
fi

cat > "${STAGING_DIR}/bootstrap/provider-start.json" <<EOF
{
  "artifactVersion": "1.0",
  "appVersion": "$(node -p "require('./package.json').version")",
  "defaultPort": 3000,
  "healthPath": "/api/healthz",
  "entryRel": ".next/standalone/server.js",
  "sourceModeDefault": "live"
}
EOF

create_zip_with_native_zip() {
  (
    cd "${STAGING_DIR}"
    find . -type f | LC_ALL=C sort | zip -X -q "${ZIP_PATH}" -@
  )
}

create_zip_with_powershell() {
  local src_win dst_win
  src_win="$(wslpath -w "${STAGING_DIR}")"
  dst_win="$(wslpath -w "${ZIP_PATH}")"

  powershell.exe -NoProfile -Command "\$ErrorActionPreference='Stop'; \$src='${src_win}'; \$dst='${dst_win}'; if (Test-Path -LiteralPath \$dst) { Remove-Item -LiteralPath \$dst -Force }; \$items = Get-ChildItem -LiteralPath \$src -Force | ForEach-Object { \$_.FullName }; if (\$items.Count -eq 0) { throw 'staging directory empty' }; Compress-Archive -Path \$items -DestinationPath \$dst -CompressionLevel Optimal"
}

create_zip_with_python() {
  python3 - "${STAGING_DIR}" "${ZIP_PATH}" <<'PY'
import os
import sys
import zipfile

src = sys.argv[1]
dst = sys.argv[2]
files = []
for root, _dirs, names in os.walk(src):
    for name in names:
        full = os.path.join(root, name)
        rel = os.path.relpath(full, src).replace("\\", "/")
        files.append((rel, full))

files.sort(key=lambda x: x[0])
with zipfile.ZipFile(dst, "w", compression=zipfile.ZIP_DEFLATED) as zf:
    for rel, full in files:
        zf.write(full, arcname=rel)
PY
}

if command -v zip >/dev/null 2>&1; then
  create_zip_with_native_zip
elif command -v bsdtar >/dev/null 2>&1; then
  (cd "${STAGING_DIR}" && bsdtar -a -cf "${ZIP_PATH}" .)
elif command -v python3 >/dev/null 2>&1; then
  create_zip_with_python
elif command -v powershell.exe >/dev/null 2>&1 && command -v wslpath >/dev/null 2>&1; then
  create_zip_with_powershell
else
  echo "No zip tool available. Install 'zip' or run inside WSL with PowerShell bridge."
  exit 1
fi

sha256sum "${ZIP_PATH}" | awk '{print $1}' > "${SHA_PATH}"

echo "artifact=${ZIP_PATH}"
echo "sha256=$(cat "${SHA_PATH}")"
