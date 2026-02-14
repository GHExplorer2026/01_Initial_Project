# ARCHITECTURE.md — Deterministic Macro Events Weekly Outlook App

## 1. Layering

### `src/core/*` (pure, deterministic)
- `weekResolver.ts`
- `classifier.ts`
- `normalize.ts`
- `merge.ts`
- `dedupeGroup.ts`
- `holidayEngine.ts`
- `rendererStrictDe.ts`
- `icsSerializer.ts`
- `scope.ts`
- `types.ts`, `constants.ts`

Rules:
- No network access.
- No framework/runtime coupling.
- Deterministic output for identical input fixtures.

### `src/server/*` (I/O adapters + orchestration)
- `orchestrator.ts`
- `sourceMode.ts`
- `sources/common.ts`
- `sources/investing.ts`
- `sources/tradingview.ts`
- `sources/tertiary/approved.ts`

Rules:
- Handles source fetching/parsing and resilience.
- Decides fixture vs live mode centrally (`SOURCE_MODE`).
- Produces canonical `WeeklyOutput` consumed by API routes.

### `src/app/*` (transport + UI)
- `app/api/weekly/route.ts`
- `app/api/weekly.ics/route.ts`
- `app/page.tsx`

Rules:
- HTTP contract handling only.
- No business-rule duplication from `core`.
- Strict output text is passed through unchanged from orchestrator/core.

## 2. Data Flow
1. Resolve week in Europe/Berlin (Mo–Fr rules).
2. Parse scope (`regions` primary, `countries` deprecated alias).
3. Fetch primary + secondary sources (fixture/live by `SOURCE_MODE`).
4. Trigger tertiary only by governance rules.
5. Normalize + classify A–F (`uncertain => exclude`).
6. Merge by source priority (`Investing > TradingView > Tertiary`).
7. Dedupe + group lines (same region/time => `" / "`).
8. Apply holiday/weekend/error day logic.
9. Render strict DE output text.
10. Generate RFC5545 ICS with deterministic UID/DTSTAMP and mandatory category.
11. Return JSON or ICS API response.

## 3. Determinism Anchors
- Fixtures are the default source mode (`SOURCE_MODE=fixtures`).
- Snapshot tests assert byte-stable strict text + ICS.
- ICS invariants:
  - CRLF
  - line folding
  - `VTIMEZONE` Europe/Berlin
  - deterministic `UID`
  - deterministic `DTSTAMP`
  - `CATEGORIES:Wirtschafts-Event` in every `VEVENT`

## 4. Build vs Runtime Network
- Build phase:
  - Needs npm registry access (`npm ci`).
  - CI and Docker builder are source of truth for install/build.
- Runtime phase:
  - No dependency install required.
  - Optional live source internet access (Investing, TradingView, approved tertiary).

## 5. CI Gates
- `lint`
- `typecheck`
- `unit`
- `snapshot`
- `build`

Local consolidated gate:
- `npm run verify`
