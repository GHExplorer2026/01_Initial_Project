# widget-runtime

## Zweck
Getrennter Runtime-Bereich für das Windows Desktop Widget (Option C).

## Scope
- Nur Widget-UI Runtime Artefakte.
- Keine Source-Fetch Logik.
- Feed-Consumer gegen `GET /api/widget-feed`.

## Contract Sources
- `docs/WIDGET_FEED_CONTRACT.md`
- `docs/WIDGET_SETTINGS_CONTRACT.md`
- `docs/WIDGET_STYLE_GUIDE.md`
- `docs/WIDGET_PROJECT_BOUNDARY.md`

## Gate Baseline
- E0/E1/E2/E3/E4/E5 gemäß `docs/WIDGET_EXECUTION_CHECKLIST.md`.
- E2->E3 Transition Evidence: `docs/WIDGET_E2_E3_TRANSITION.md`.

## Contract Freeze (W-1115)
- Frozen contract manifest: `widget-runtime/contracts/contract-freeze.sha256`
- Verification command: `npm run check:widget-runtime-freeze`
- Runtime slice must not proceed if the freeze check is red.

## Nächster Schritt
- Execute Full-RC runtime gate (default): `npm run gate:widget-runtime`
