# ICS RFC5545 Outlook Profile

## VCALENDAR Fields
- `BEGIN:VCALENDAR`
- `VERSION:2.0`
- `PRODID:-//MacroEvents//WeeklyOutlook//DE`
- `CALSCALE:GREGORIAN`
- `METHOD:PUBLISH`

## VEVENT Required Fields
- `UID:<deterministic-hash>`
- `DTSTAMP:<UTC timestamp>`
- `DTSTART;TZID=Europe/Berlin:<YYYYMMDDTHHMM00>`
- `DTEND;TZID=Europe/Berlin:<YYYYMMDDTHHMM00>`
- `SUMMARY:<render title>`
- `CATEGORIES:Wirtschafts-Event`

## Serialization Requirements
- CRLF line endings.
- RFC5545 line folding at 75 octets.
- Stable property ordering across runs.

## UID Input Contract
Hash input tuple:
`weekStart|country|datetimeBerlinISO|titleNormalized|parserVersion`

## Validation Checks
- Each VEVENT has category line.
- Calendar parsers can import file without structural errors.
- Snapshot output is stable for identical fixtures.
