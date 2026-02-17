# WIDGET_W1115_EVIDENCE.md

## Zweck
Nachweis fuer `W-1115`: Start des separaten Runtime-Slices mit eingefrorenen Verträgen.

## Gelieferte Artefakte
1. `widget-runtime/contracts/contract-freeze.sha256`
2. `scripts/check_widget_runtime_contract_freeze.sh`
3. `widget-runtime/docs/EXECUTION_GATE.md` (Freeze-Check als Pflichtcheck)
4. `widget-runtime/docs/RELEASE_GATE_EVIDENCE.md` (Freeze-Check im Evidence-Schema)
5. `widget-runtime/docs/SCOPING.md` (Freeze-Regel als Muss)
6. `widget-runtime/README.md` (W-1115 Freeze-Abschnitt)

## Zieltests (minimal)
1. `PATH="$HOME/.nvm/versions/node/v20.20.0/bin:$PATH" npm run check:widget-runtime-freeze`
2. `TMPDIR=/tmp PATH="$HOME/.nvm/versions/node/v20.20.0/bin:$PATH" npm run contract:widget-feed`

## Gate Status
- `W-1115`: `PASS` wenn beide Zieltests gruen sind.
