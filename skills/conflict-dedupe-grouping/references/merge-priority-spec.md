# Merge Priority Spec

## Key Definitions
- `eventKey = country + dateBerlinISO + titleNormalized`
- `dedupeKey = country + dateBerlinISO + timeKind + timeHHMM + titleNormalized`
- `groupKey = country + dateBerlinISO + timeKind + timeHHMM`

## Winner Selection
1. Prefer `exact` over `all_day` if both exist for the same `eventKey`.
2. Then prefer highest-priority source.
3. Backfill missing metrics (`importance`, `actual`, `forecast`, `previous`) field-by-field from lower priority only when missing.
4. If same source tier appears multiple times, prefer latest parser version.
5. If still tied, prefer record with longer normalized title (higher specificity).

## Grouping Rules
- All records with same `groupKey` become one line.
- Line title is joined with ` / `.
- Preserve top-event marker if any grouped record is top event.

## Ordering
- Primary sort: date ascending.
- Secondary sort: `all_day` before timed rows, then `timeHHMM` ascending.
- Tertiary sort: country order `USA, EZ, UK, JP, CH, CA, AU, NZ`.
- Quaternary sort: normalized title ascending.
