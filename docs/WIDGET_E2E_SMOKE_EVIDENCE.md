# WIDGET_E2E_SMOKE_EVIDENCE.md

## Zweck
Formaler Nachweis für `W-1111` und `W-1114` nach erfolgreichem Runtime-Smoke im User-Terminal.

## Run Metadata
- Datum: `2026-02-17`
- Ausführungsumgebung: `Windows PowerShell + WSL bash`
- Node Runtime: `v20.20.0` (WSL PATH)
- Source Mode: `fixtures`

## Ausgeführte Kommandos
1. Serverstart:
   - `wsl.exe -e bash -lc 'cd /mnt/c/Users/maloe/Documents/Codex_Projects/01_Initial_Project && TMPDIR=/tmp SOURCE_MODE=fixtures PATH="$HOME/.nvm/versions/node/v20.20.0/bin:$PATH" npm run dev -- --hostname 127.0.0.1 --port 3000'`
2. Smoke:
   - `wsl.exe -e bash -lc 'cd /mnt/c/Users/maloe/Documents/Codex_Projects/01_Initial_Project && bash scripts/smoke_widget_runtime.sh http://127.0.0.1:3000'`

## Beobachtete Outputs
- Server:
  - `✓ Ready in 11.5s`
  - `HEAD /widget-preview 200`
  - `GET /api/widget-feed?regions=USA,EZ&datePreset=today 200`
- Smoke:
  - `[widget-smoke] page: http://127.0.0.1:3000/widget-preview`
  - `[widget-smoke] feed: http://127.0.0.1:3000/api/widget-feed?regions=USA,EZ&datePreset=today`
  - `widget feed ok; events=0`
  - `[widget-smoke] done`

## Ergebnis
- `W-1111`: `PASS`
- `W-1114`: `PASS`

## Hinweis
Der vorherige Agent-Shell-Portbind-Blocker (`EPERM`) bleibt als umgebungsspezifische Einschränkung dokumentiert, ist aber für die Delivery durch erfolgreichen User-Terminal-Smoke entblockt.
