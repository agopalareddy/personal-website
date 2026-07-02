# Accessibility Tests & Compliance

The site targets **WCAG 2.1 Level AA**, verified through automated axe-core audits and structural checks.

## Accessibility statement

Source: `ACCESSIBILITY.md` and `/accessibility.html` (live page)

Documents implemented features:

- Skip navigation link on every page
- Semantic HTML5 landmarks (`<nav>`, `<main>`, `<aside>`, `<article>`, `<footer>`)
- Heading hierarchy (single `<h1>`, sequential `<h2>`/`<h3>`)
- `aria-pressed` on filter buttons
- `aria-expanded` on collapsible TOC/drawers
- `aria-label` on form controls
- `aria-hidden="true"` on decorative icons
- Screen-reader-only `<span class="sr-only">` for new-tab warnings
- Focus indicators with dynamic borders
- `prefers-reduced-motion` support suppresses animations
- Color contrast: minimum 4.5:1 ratio (normal text), 3:1 (large text)

## Axe-core audits

Source: `tests/a11y/run-audit.mjs`

Runs `@axe-core/playwright` against experience listing and detail pages, storing results as JSON baselines in `tests/a11y/*.json`.

### Current baselines

| File                       | Content                  |
| -------------------------- | ------------------------ |
| `detail-awards.json`       | Award detail page        |
| `detail-education.json`    | Education detail page    |
| `detail-leadership.json`   | Leadership detail page   |
| `detail-professional.json` | Professional detail page |
| `experience-listing.json`  | Experience listing page  |

### Running audits

```bash
node tests/a11y/run-audit.mjs
```

Requires `@axe-core/playwright` (installed at root, listed in `package.json`).

## Structural validation

`scripts/generate_site.py` includes validation: it checks sitemap integrity and document linkages after generation.

## Keyboard navigation

- Skip link is the first focusable element
- Tab order: nav → skip link target → main content → sidebar → footer
- Filter pills and sort controls are keyboard-operable
- CV modal can be opened/closed with keyboard

## Change guidance

- After adding interactive elements, ensure they have ARIA roles and states.
- After visually redesigning any component, verify contrast ratios against `--text-primary`, `--text-secondary`, and `--accent`.
- After adding animations, add `@media (prefers-reduced-motion: reduce)` overrides.
- Run the axe audit after significant UI changes.
- Update `accessibility.html` when adding new accessibility features.

## Source map

- `ACCESSIBILITY.md`
- `accessibility.html` (live page)
- `tests/a11y/run-audit.mjs`
- `tests/a11y/*.json` (baseline results)
- `assets/css/style.css` (reduced-motion queries, focus styles)
- `assets/js/experience-catalog.js` (ARIA state management)
- `assets/js/projects-catalog.js` (ARIA state management)
