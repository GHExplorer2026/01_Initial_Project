# Classification Rules A-F

## Matching Principles
- Use deterministic keyword matching.
- Require explicit match confidence.
- If ambiguous, drop instead of guessing.

## Categories
- A: Inflation and price indexes (CPI, Core CPI, PCE, Core PCE).
- B: Labor and employment (NFP, unemployment rate, payrolls, jobless claims).
- C: Growth and output (GDP, industrial production, retail sales).
- D: Activity and sentiment (PMI, ISM, consumer confidence).
- E: Central bank and rates (rate decisions, minutes, speeches with policy impact).
- F: Other market-relevant macro releases (trade balance, housing starts, durable goods).

## TOP-EVENT Mapping
Mark top event when normalized title matches one of:
- Central bank rate decisions
- CPI or Core CPI
- PCE or Core PCE
- NFP / payrolls
- GDP
- PMI / ISM composite or manufacturing (major markets)

## Rejection Cases
- Missing exact time.
- Multiple category matches with no priority winner.
- Low-confidence parse or malformed source payload.
