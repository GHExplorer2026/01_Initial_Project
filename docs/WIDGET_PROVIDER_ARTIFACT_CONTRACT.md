# WIDGET_PROVIDER_ARTIFACT_CONTRACT.md

## Contract
- Version: `1.0`
- Artifact Name: `provider-win-x64.zip`
- Scope: Local provider runtime bundle for `02_Widget_Native_Runtime`.

## Required Contents
- `.next/standalone/**`
- `.next/static/**`
- `public/**` (if present in repo)
- `bootstrap/provider-start.json`

## `bootstrap/provider-start.json`
Required fields:
- `artifactVersion: string`
- `appVersion: string`
- `defaultPort: number`
- `healthPath: string` (default `/api/healthz`)
- `entryRel: string` (default `.next/standalone/server.js`)
- `sourceModeDefault: "live" | "fixtures"`

## Build Rule
1. Artifact is generated after `npm run build`.
2. Packaging command:
   - `npm run artifact:widget-provider`
3. Output files:
   - `artifacts/provider-win-x64.zip`
   - `artifacts/provider-win-x64.sha256`

## Consumer Rule (Widget Runtime)
1. Artifact is extracted below `%LocalAppData%/MacroEvents/provider`.
2. Widget bootstrap resolves:
   - provider entry via `entryRel`
   - health endpoint via `healthPath`
3. Widget does not scrape sources directly.
