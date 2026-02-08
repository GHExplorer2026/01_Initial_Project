# RULES fuer den Projektstart

## 1. Scope und Ziele
- Definiere ein klares MVP mit maximal 3 Kernzielen.
- Schreibe fuer jedes Ziel eine messbare Erfolgsmetrik.
- Verschiebe Nice-to-have Features in ein separates Backlog.

## 2. Architektur und Entscheidungen
- Dokumentiere die initiale Architektur auf 1 Seite.
- Halte wichtige Entscheidungen als ADR fest (Problem, Optionen, Entscheidung, Konsequenz).
- Vermeide fruehe Komplexitaet; bevorzuge einfache, erweiterbare Loesungen.

## 3. Repository und Struktur
- Nutze eine konsistente Ordnerstruktur (`src/`, `tests/`, `docs/`, optional `scripts/`).
- Halte `README.md` immer lauffaehig (Setup, Run, Test, Build).
- Versioniere keine Geheimnisse, nur `.env.example`.

## 4. Branching und Commits
- Arbeite ueber kurze Feature-Branches.
- Verwende aussagekraeftige Commit-Messages im Imperativ.
- Merge in den Hauptbranch nur ueber Pull Request.

## 5. Code-Qualitaet
- Definiere Formatter und Linter ab Tag 1.
- Kein Code ohne Review in den Hauptbranch.
- Halte Funktionen klein, testbar und eindeutig benannt.

## 6. Tests und Definition of Done
- Schreibe Tests fuer kritische Pfade zuerst.
- Jeder PR muss lokal und in CI gruen sein.
- Definition of Done: Code, Tests, Dokumentation, Logging/Fehlerbehandlung aktualisiert.

## 7. CI/CD Mindeststandard
- CI prueft mindestens: Install, Lint, Test, Build.
- Pipeline soll bei Fehlern hart abbrechen.
- Deployment nur aus versionierten, reproduzierbaren Builds.

## 8. Security und Betrieb
- Nutze Principle of Least Privilege fuer Zugriffe.
- Behandle Input immer als potenziell unsicher (Validation/Sanitization).
- Erstelle frueh Basis-Observability: strukturierte Logs, Error Tracking, Health Checks.

## 9. Dokumentation und Zusammenarbeit
- Dokumentiere Entscheidungen dort, wo sie getroffen werden (`docs/` und ADRs).
- Pflege offene Fragen mit Owner und Faelligkeitsdatum.
- Fuehre kurze, regelmaessige Syncs mit klaren Entscheidungen statt langer Meetings.

## 10. Aenderungsdisziplin
- Aendere immer nur das Noetige pro PR.
- Vermeide versteckte Nebenwirkungen und "stillen" Scope-Creep.
- Wenn Annahmen unsicher sind, markiere sie explizit und plane Validierung.

