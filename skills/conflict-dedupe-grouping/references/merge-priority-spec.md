# Merge Priority Spec

## Key Definitions
- `dedupeKey = country + datetimeBerlinISO + titleNormalized`
- `groupKey = country + datetimeBerlinISO`

## Winner Selection
1. Prefer highest-priority source with valid exact time.
2. If same source tier appears multiple times, prefer latest parser version.
3. If still tied, prefer record with longer normalized title (higher specificity).

## Grouping Rules
- All records with same `groupKey` become one line.
- Line title is joined with ` / `.
- Preserve top-event marker if any grouped record is top event.

## Ordering
- Primary sort: datetime ascending.
- Secondary sort: country order `USA, EZ, UK, JP, CH, CA, AU, NZ`.
- Tertiary sort: normalized title ascending.
