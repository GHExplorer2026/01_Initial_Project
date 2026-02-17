# Style Tokens and A11y

## Color Tokens
- `--bg-base: #0b0f14`
- `--bg-elevated: #121824`
- `--card-glass: rgba(255,255,255,0.08)`
- `--card-border: rgba(255,255,255,0.18)`
- `--accent-cyan: #22d3ee`
- `--accent-purple: #8b5cf6`
- `--top-event: #f97316`
- `--text-primary: #e5e7eb`
- `--text-muted: #9ca3af`

## Typography
- UI font: `Inter, system-ui, sans-serif`
- Output block: `ui-monospace, SFMono-Regular, Menlo, monospace`

## Motion
- Hover glow on cards/buttons (`120ms` to `180ms`).
- Smooth collapse/expand for day sections (`200ms` ease).
- Loading shimmer only on pending output card.

## Accessibility Rules
- Maintain WCAG AA contrast for text on backgrounds.
- Ensure visible focus ring on all interactive controls.
- Support keyboard navigation for checkboxes and action buttons.
- Preserve reduced-motion compatibility for animated elements.

## Economic Calendar Table Contract
- Keep fixed table headers:
  `Date + Time | Currency | Event | Importance | Actual | Forecast | Previous`.
- Keep weekday group rows visually distinct from event rows.
- Use `—` token for missing metrics in UI cells.
