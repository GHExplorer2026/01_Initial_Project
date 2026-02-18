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

(
  cd "${STAGING_DIR}"
  find . -type f | LC_ALL=C sort | zip -X -q "${ZIP_PATH}" -@
)

sha256sum "${ZIP_PATH}" | awk '{print $1}' > "${SHA_PATH}"

echo "artifact=${ZIP_PATH}"
echo "sha256=$(cat "${SHA_PATH}")"
