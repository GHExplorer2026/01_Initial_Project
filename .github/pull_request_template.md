## Summary
- [ ] Describe the change in 1-3 bullets.

## SPEC-Critical Checklist
- [ ] `regions` remains primary; `countries` is only deprecated alias.
- [ ] Strict output strings are unchanged and still canonical.
- [ ] TOP suffix remains exact: ` - **TOP-EVENT**`.
- [ ] Holiday/weekend/error notes remain exact canonical lines.
- [ ] ICS still includes in every `VEVENT`: `CATEGORIES:Wirtschafts-Event`.
- [ ] ICS remains RFC5545-compatible (`CRLF`, folding, `VTIMEZONE`, TZID usage).
- [ ] UID and DTSTAMP remain deterministic.
- [ ] `SOURCE_MODE` behavior unchanged (`fixtures` default, `live` optional).
- [ ] No live-network dependency introduced into CI tests.

## Validation
- [ ] `npm run verify` passes locally.
- [ ] CI `lint`, `typecheck`, `unit`, `snapshot`, `build` pass.

## Notes
- [ ] Mention any intentional tradeoff or follow-up task.
