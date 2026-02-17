# Output Schema Golden

## Global Structure
- Header line (`📊 WOCHENAUSBLICK <start> – <end>`)
- Five day sections (`### <weekday>, <date>`)
- Each section contains either event lines or one fixed note line

## Example Skeleton
```
📊 WOCHENAUSBLICK 10.02.2026 – 14.02.2026

### Montag, 10. Februar
08:00 Uhr: Euro Zone Verbraucherpreisindex (CPI) - **TOP-EVENT**

### Dienstag, 11. Februar
All Day: USA Bank Holiday

### Mittwoch, 12. Februar
Hinweis: Keine verifizierten Events gefunden.
```

## Fixed Note Lines
- `Hinweis: Keine Handelstermine – Wochenende oder Feiertag.`
- `Hinweis: Keine Handelstermine – Feiertag.`
- `Hinweis: Keine verifizierten Events gefunden.`

## Line Format
- Timed: `HH:MM Uhr: <country> <title>[ - **TOP-EVENT**]`
- All-day: `All Day: <country> <title>[ - **TOP-EVENT**]`

## Constraints
- No trailing spaces.
- Unix newlines in API text response.
- Deterministic spacing and punctuation.
