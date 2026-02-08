# Output Schema Golden

## Global Structure
- Header line
- Five day sections (`### <weekday>, <date>`)
- Each section contains either event lines or one fixed note line

## Example Skeleton
```
## Wochenausblick (Europe/Berlin)

### Montag, 10. Februar
08:00 EZ Verbraucherpreisindex (CPI) - **TOP-EVENT**

### Dienstag, 11. Februar
Hinweis: Keine relevanten Termine.
```

## Fixed Note Lines
- `Hinweis: Wochenende.`
- `Hinweis: Feiertag.`
- `Hinweis: Keine relevanten Termine.`
- `Hinweis: Datenlage unsicher.`

## Line Format
`HH:MM <country> <title>[ - **TOP-EVENT**]`

## Constraints
- No trailing spaces.
- Unix newlines in API text response.
- Deterministic spacing and punctuation.
