# UI, Theming, and Accessibility

This site’s presentation layer is intentionally opinionated: a restrained, editorial portfolio aesthetic with reusable card surfaces, a three-state theme switcher, and accessibility baked into the structure.

## Design system overview

`DESIGN.md` is the best source for the aesthetic rules. It defines the site as a “technical archive” with:

- cool, near-achromatic surfaces
- a single deep navy accent in light mode
- a periwinkle accent in dark mode
- serif headings and sans-serif body copy
- subtle hover lift rather than dramatic animation
- high information density

The design system is not decorative documentation only; it explains why shared CSS classes and JS behaviors exist the way they do.

## Core UI systems

### Shared CSS

`assets/css/style.css` contains the design tokens and the majority of the reusable layout and component styles:

- cards and surfaces
- buttons and filters
- sidebar and modal layout
- responsive rules
- theme variables and color tokens

Recent commits show a lot of work here on mobile spacing, border rings, modal behavior, and hover interactions. That means this file is the highest-risk change surface for visual regressions.

### Theme slider

`assets/js/theme.js` implements a 3-state theme control:

- light
- device/system
- dark

It stores the user’s choice in `localStorage`, resolves system mode against `prefers-color-scheme`, updates the `data-active-theme` and `data-resolved-theme` attributes, and keeps the `theme-color` meta tag in sync.

Important details for future changes:

- there are two placement targets: the main toggle and a footer toggle placeholder
- the control is built programmatically with DOM APIs
- the script also updates a page-year placeholder and adds a card click delegation behavior

### Status badge

`assets/js/status-badge.js` is a reusable component that auto-mounts into `.academic-sidebar` elements. It removes the need to duplicate “open to opportunities” style badges across HTML pages.

The component is configurable through `data-status-*` attributes and supports variants such as available, busy, unavailable, and custom.

### Card glow and card-surface behavior

`assets/js/cursor-glow.js` adds the cursor-following spotlight effect to `.card-surface` elements. Recent git history shows this effect was tuned to avoid spilling across invisible or collapsed areas.

`theme.js` also delegates click behavior for card bodies, sending users to the main project link when they click anywhere on the card except a button or link.

### Listing page renderers

Both listing pages use JS renderers to power interactive filtering and sorting:

- `assets/js/projects-catalog.js`
- `assets/js/experience-catalog.js`

These scripts are the main source of truth for how the catalogs feel in the browser. They are also where accessibility state is managed, such as:

- `aria-pressed` on filter pills
- `aria-expanded` for mobile drawers / TOCs
- empty states and keyboard interaction

## Accessibility model

The site targets WCAG 2.1 AA, as documented in `ACCESSIBILITY.md`.

### Structural expectations

- semantic landmarks are used for nav, sidebar, main, article, and footer
- pages should keep a clean heading hierarchy
- a skip link exists for keyboard users
- icons should be decorative unless specifically announced

### Tested behaviors

The Playwright tests assert accessibility-relevant interactions such as:

- nav integrity across page families
- filter button keyboard activation and ARIA state changes
- experience listing search and sorting
- detail page structure
- presence of current/present date labels

### Mobile accessibility

The repo has several recent fixes specifically for mobile toggles and collapsible UI. The history suggests mobile users are a first-class audience, not a fallback case.

## Practical change guidance

When changing UI or accessibility behavior:

- inspect `DESIGN.md` first to see whether the aesthetic rule already exists
- check both `assets/css/style.css` and the relevant JS behavior file
- verify the listing pages after any filter, TOC, or theme change
- update tests if the interaction model changes
- be careful not to introduce duplicate status badges or broken aria states

## Source map

### Source files

- `DESIGN.md`
- `ACCESSIBILITY.md`
- `assets/css/style.css`
- `assets/js/theme.js`
- `assets/js/status-badge.js`
- `assets/js/cursor-glow.js`
- `assets/js/projects-catalog.js`
- `assets/js/experience-catalog.js`
- `assets/js/cv-modal.js`
- `assets/js/email-protection.js`

### Git evidence

- `3216b8a feat: reusable status-badge component, uniform across all pages`
- `3247502 feat(ui): shared card-surface base, global cursor glow, click ripple`
- `5c05e69 feat(ui): press state + smooth collapse/expand animations`
- `0c8dc38 fix(ui): non-bouncy easing + theme slider icons`
- `96285c8 fix(modal): halo reaches across the full modal surface`
- `e45716e fix: collapse mobile 'On this page' TOC when aria-expanded=false`
