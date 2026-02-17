# WIDGET_E2E_SMOKE_BLOCKER.md

## Kontext
Task `W-1111`: erster end-to-end runtime smoke mit fixture feed.

## Durchgeführte Schritte
1. Smoke-Script erstellt: `scripts/smoke_widget_runtime.sh`.
2. Lokaler Startversuch von Next dev auf `127.0.0.1:3000`.
3. Smoke-Aufruf gegen `/widget-preview` und `/api/widget-feed`.

## Blocker
Im aktuellen Agent-Shell-Kontext tritt beim Serverstart konsistent auf:
- `Error: listen EPERM: operation not permitted 127.0.0.1:3000`

Damit ist der lokale Runtime-Smoke in dieser Ausführungsumgebung blockiert.

## Empfohlene Verifikation im User-Terminal
1. `PATH="$HOME/.nvm/versions/node/v20.20.0/bin:$PATH" TMPDIR=/tmp SOURCE_MODE=fixtures npm run dev -- --hostname 127.0.0.1 --port 3000`
2. In zweiter Shell: `bash scripts/smoke_widget_runtime.sh http://127.0.0.1:3000`

## Status
- Agent-Shell-Kontext: `Blocked` (Port-Bind-Sperre bleibt umgebungsspezifisch bestehen).
- Delivery-Status: `Resolved via user terminal smoke` (siehe `docs/WIDGET_E2E_SMOKE_EVIDENCE.md`).
