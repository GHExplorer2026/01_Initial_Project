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

## Nächster Schritt
- Runtime-Entrypoint und minimale Fenster-Shell im separaten Projektpfad starten.
