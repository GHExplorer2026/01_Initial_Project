# UI_EXECUTION_CHECKLIST.md

## Purpose
Provide a deterministic, repeatable checklist to validate UI execution without touching strict output or ICS rules.

## Preconditions
1. Repo is clean and synced:
   - `git fetch origin main --prune`
   - `git pull --ff-only`
2. Node runtime is `>= 20.9.0`:
   - `node -v`
3. `next-env.d.ts` is canonical:
   - `npm run check:next-env`

## Default (fixtures) UI Execution
1. Start app:
   - `TZ=Europe/Berlin SOURCE_MODE=fixtures npm run dev -- --hostname 127.0.0.1 --port 3000`
2. Validate page shell and controls:
   - `curl -sS http://127.0.0.1:3000/`
   - Must contain:
     - `Country Scope`
     - `Alle`
     - `Keine`
     - `Wochenausblick generieren`
     - `.ICS herunterladen`
     - `Strict Output`
3. Validate weekly API contract:
   - `curl -sS "http://127.0.0.1:3000/api/weekly?regions=USA,EZ"`
   - Must contain JSON meta keys:
     - `meta.sourceMode`
     - `meta.sourcesUsed`
4. Validate ICS endpoint:
   - `curl -sSI "http://127.0.0.1:3000/api/weekly.ics?regions=USA,EZ"`
   - Must return:
     - `Content-Type: text/calendar; charset=utf-8`
     - `Content-Disposition: attachment; filename="Wochenausblick_YYYY-MM-DD.ics"`
5. Run API smoke script:
   - `bash scripts/smoke_api.sh http://127.0.0.1:3000 USA,EZ fixtures`
   - Script now validates UI shell contract + weekly API + ICS contract in one pass.
   - Weekly checks include strict-header format/date pattern, 5 day headers, event-line format, no links, allowed Hinweis lines, exact TOP suffix format, and semantic `meta` invariants.
   - ICS checks include content type, attachment filename pattern `Wochenausblick_YYYY-MM-DD.ics`, CRLF bytes, and category invariants.

## Deterministic Quality Gates
1. `npm run unit`
2. `npm run snapshot`
3. `npm run lint`
4. `npm run typecheck`
5. `npm run build`

## Live Mode Spot Check (optional, not CI-gated)
1. Start app:
   - `TZ=Europe/Berlin NODE_OPTIONS=--dns-result-order=ipv4first SOURCE_MODE=live npm run dev -- --hostname 127.0.0.1 --port 3000`
2. Validate `meta.sourceMode` is `live`:
   - `curl -sS "http://127.0.0.1:3000/api/weekly?regions=USA,EZ" | tr -d '\n' | grep -o '"sourceMode":"[^"]*"'`

## Guardrails
1. No changes to strict output strings during UI execution checks.
2. No changes to ICS serialization rules during UI execution checks.
3. Do not commit generated `.next/*` artifacts.
4. If `next-env.d.ts` drifts, run `npm run fix:next-env` before commit.
