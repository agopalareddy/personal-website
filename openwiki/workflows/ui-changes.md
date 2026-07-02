# Changing Shared UI Components

The site has several reusable UI systems that affect most pages. This guide covers the change process for each.

## Design tokens and CSS

Source: `assets/css/style.css`

Change process:

1. Read `DESIGN.md` first — the aesthetic rule may already exist
2. Find the relevant CSS custom property (tokens are in `@layer tokens`)
3. Update the value for both light and dark themes
4. Test all three theme modes
5. Bump `style.css?v=` query string in HTML heads

### Theme colors

Defined in `assets/css/style.css` under `:root` and `:root[data-resolved-theme='dark']`. Key variables:

- `--accent`: `#1a3478` (light) / `#6b9fff` (dark)
- `--bg-base`, `--bg-surface`, `--bg-surface-hover`
- `--text-primary`, `--text-secondary`, `--text-muted`
- `--border-color`, `--border-hover`

### Changing accent colors

- Light mode: Deep Institutional Navy (`#1a3478`) — appears only on interactive elements
- Dark mode: Periwinkle Blue (`#6b9fff`) — lighter value for legibility
- The "One Accent Rule" (DESIGN.md): never use accent as a background fill

## Theme slider

Source: `assets/js/theme.js`

- Acts on DOMContentLoaded
- Reads `localStorage.getItem('theme')`
- Writes `data-active-theme` and `data-resolved-theme` on `<html>`
- CSS selectors use `[data-resolved-theme]` for theme switching
- Placeholder elements: `#theme-toggle` (nav) and `#theme-toggle-footer`

## Status badge

Source: `assets/js/status-badge.js`

- Auto-mounts on pages with `.academic-sidebar`
- Configurable via `data-status-*` attributes
- Idempotent: skip if already mounted or hardcoded badge exists

## Catalog renderers

Source: `assets/js/projects-catalog.js`, `assets/js/experience-catalog.js`

- Both read inline JSON payloads from their listing page
- Schema changes require updating generator + renderer + tests simultaneously
- Run listing page tests after any renderer change

## Testing after UI changes

1. Run Playwright suite (desktop + mobile)
2. Run axe accessibility audit
3. Visually check experience and project listing pages
4. Verify mobile TOC/filter drawer behavior
