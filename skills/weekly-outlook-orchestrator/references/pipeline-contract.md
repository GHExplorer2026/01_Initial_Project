# Pipeline Contract

## Stage Order (Fixed)
1. `weekResolver`
2. `countryScope`
3. `holidayFilter`
4. `fetchPrimaryInvesting`
5. `fetchSecondaryTradingView`
6. `fetchTertiaryApproved` (conditional)
7. `normalizeTimezoneBerlin`
8. `filterTimeKindAndScope` (`exact` + `all_day`, exclude tentative/missing)
9. `classifyAF`
10. `resolveConflictsByPriority`
11. `dedupeAndGroup`
12. `markTopEvents`
13. `renderStrictDE`
14. `generateIcs`
15. `emitApiPayloadAndTelemetry`

## Required Inputs
- `regions`: allowed set only (`USA, EZ, UK, JP, CH, CA, AU, NZ`)
- `requestTimeISO`
- `parserVersion`

## Required Outputs
- `renderedText: string`
- `events: EconomicEvent[]`
- `days: RenderDay[]`
- `meta: { parserVersion: string, generatedAtISO: string, sourceMode: string, sourcesUsed: string[] }`
- `icsPayload: string` (for ICS endpoint)

## Failure Policy
- Primary source unreachable: continue with degraded mode and explicit note.
- Primary + secondary both unavailable: emit empty-day notes, no synthetic data.
- Stage contract violation: fail request with classified internal error.
