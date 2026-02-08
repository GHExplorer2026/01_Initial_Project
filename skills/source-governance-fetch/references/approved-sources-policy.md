# Approved Sources Policy

## Priority
1. Primary: Investing.com
2. Secondary: TradingView
3. Tertiary: approved official sources only

## Tertiary Triggers
Allow tertiary fetch only when at least one condition is true:
1. Primary and secondary conflict on event time.
2. Event exists in primary/secondary but exact time is missing and tertiary can confirm exact time.
3. Primary or secondary is temporarily unavailable and tertiary source is explicitly approved for backfill.

## Approved Tertiary Classes
- Official statistics agencies and central bank calendars.
- Government release portals with stable publication schedules.
- Reuters API only with valid license and configured credential.

## Prohibited Behavior
- Do not add tertiary records as unconstrained extra events.
- Do not replace valid primary data with lower-priority sources.
- Do not consume unapproved or scraping-restricted providers.

## Compliance Checks
- Store source name and fetch timestamp.
- Store parser version for traceability.
- Respect legal and rate-limit constraints per source adapter.
