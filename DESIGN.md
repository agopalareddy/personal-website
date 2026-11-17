# Design System — agreddy.com

GitHub Primer design system, powered by `@primer/primitives` design tokens.

## Token Source

Design tokens are vendored from `@primer/primitives` into `assets/css/primer/`.
Files are concatenated into `primer.css` and linked before the site's `style.css`.
Version is pinned in `package.json` (`devDependencies`).

**Update procedure:**

```bash
npm install --save-dev @primer/primitives@latest
npm run vendor:primer
git add assets/css/primer/ scripts/icons.py assets/js/icons.js
```

## Architecture

```
primer.css (vendored tokens: size, typography, motion, colors, 5 themes)
  └─ style.css (@layer reset, base, components, utilities)
       Uses ONLY Primer functional tokens — no raw hex values
       (one exception: the Dark dimmed text colours, see rule 1)
```

`style.css` itself has no build step. Pages are rendered to static HTML from `site/src/` by `npm run build:site` and served by nginx.

## Rules

1. **Only Primer functional tokens.** Never raw hex in `style.css` or page markup.
   - **One exception: Dark dimmed text colours.** Primer's dimmed theme puts `--fgColor-accent` (links), `-done`, `-severe`, `-sponsors` and `-danger` at 4.0–4.3:1 on its page background, under the 4.5:1 the Accessibility page promises. The unlayered block at the top of `style.css` replaces each with the next lighter step of the same Primer dimmed scale (5.2:1). It is unlayered because `primer.css` is, and unlayered rules beat `@layer`. `tests/e2e/theme-contrast.spec.ts` checks every theme; re-check the block after `npm run vendor:primer`.
2. **System font stack only.** `--fontStack-system` for body, `--fontStack-monospace` for code.
3. **Flat, restrained interactions.** Border-color transitions on hover. No shadows, transforms, or glow effects.
4. **Octicons only.** Vendored inline SVGs from `@primer/octicons`. Font Awesome fully removed.
5. **Keep existing class names / IDs.** Renaming touches catalog JS + generators + 4 test specs for zero user value.
6. **Wellness/ is out of scope.** Standalone mini-app, untouched.

## Theme System

| Picker option              | `data-color-mode` | `data-light-theme`    | `data-dark-theme`    |
| -------------------------- | ----------------- | --------------------- | -------------------- |
| Sync with system (default) | `auto`            | `light`               | `dark`               |
| Light                      | `light`           | `light`               | `dark`               |
| Light high contrast        | `light`           | `light_high_contrast` | `dark`               |
| Dark                       | `dark`            | `light`               | `dark`               |
| Dark dimmed                | `dark`            | `light`               | `dark_dimmed`        |
| Dark high contrast         | `dark`            | `light`               | `dark_high_contrast` |

- Static default: `<html data-color-mode="auto" data-light-theme="light" data-dark-theme="dark">`
- Inline head snippet (before stylesheets) prevents FOUC
- JS picker (`theme.js`) uses `<details class="theme-picker">` with 6 radio options
- localStorage key: `color-scheme` (legacy `theme` key auto-migrated)
- No-JS: correct auto theme via static defaults + media-query branches in vendored CSS

## Color Tokens

All component colors map to Primer functional tokens. The key ones:

| Purpose                          | Token                       |
| -------------------------------- | --------------------------- |
| Page background                  | `--bgColor-default`         |
| Card/surface background          | `--bgColor-default`         |
| Muted background                 | `--bgColor-muted`           |
| Primary text                     | `--fgColor-default`         |
| Secondary/muted text             | `--fgColor-muted`           |
| Accent (links, emphasis)         | `--fgColor-accent`          |
| Accent fill (buttons, skip link) | `--bgColor-accent-emphasis` |
| Text on accent fill              | `--fgColor-onEmphasis`      |
| Default border                   | `--borderColor-default`     |
| Muted border                     | `--borderColor-muted`       |
| Emphasis border (hover)          | `--borderColor-emphasis`    |
| Focus outline                    | `--focus-outlineColor`      |

Category labels map to semantic roles:

| Category      | Role      | Token pair                                                 |
| ------------- | --------- | ---------------------------------------------------------- |
| Research      | accent    | `--fgColor-accent` / `--borderColor-accent-emphasis`       |
| Web           | done      | `--fgColor-done` / `--borderColor-done-emphasis`           |
| Tools         | success   | `--fgColor-success` / `--borderColor-success-emphasis`     |
| Professional  | sponsors  | `--fgColor-sponsors` / `--borderColor-sponsors-emphasis`   |
| Education     | success   | `--fgColor-success` / `--borderColor-success-emphasis`     |
| Leadership    | severe    | `--fgColor-severe` / `--borderColor-severe-emphasis`       |
| Awards        | attention | `--fgColor-attention` / `--borderColor-attention-emphasis` |
| Presentations | done      | `--fgColor-done` / `--borderColor-done-emphasis`           |

No category uses `danger`: red reads as an error. Categories that share a color never appear in the same list (Tools is a project category, Education an experience one).

## Component Patterns

- **Header**: UnderlineNav (`.nav-links`), active tab with `aria-current="page"` + 2px accent underline. Below 48em the nav row becomes a fixed bottom tab bar and `.mobile-topbar` (site name + compact theme button) sits at the top of the page.
- **Sidebar**: Profile (`.academic-sidebar`), circular avatar, octicon contact links; identity only, on every page. The name is plain text, not a heading, so the page `h1` is the first heading. On Home the role line is hidden (the lede says the same). On phones the sidebar shows on Home only, as one compact row (64px avatar, name, icon-only links). The avatar is a 192/384px WebP `srcset`.
- **Section heading**: `.section-heading` — an `h2` on a rule with an optional link or control at the right end.
- **Catalog rows**: Compact list rows (`.catalog-row` on `.project-card` / `.experience-card`) — title | category | date on one line, meta and a one-line excerpt under it. The whole row links to the detail page (stretched title link); `.row-link`s sit above it. Rows are grouped in a bordered box per year under a `.timeline-year` heading that shows the count.
- **Catalog toolbar**: `.catalog-toolbar` above the list — search, two dropdowns (organization or venue, sort), category tabs with counts (`.catalog-tabs` of `.filter-btn[aria-pressed]`), then "Jump to" year links and the results count. Years are jumped to, not filtered. Tab counts follow the search and the dropdown. On phones the tab strip scrolls sideways and fades at the edge that has more tabs (`data-fade`); the dropdowns sit side by side from about 390px and on a line each below that.
- **Detail pages**: one template (`DetailShell.tsx`) for projects and experience — `.breadcrumb`, `h1`, summary, then prose beside an About column (`.detail-about`: category, organization or venue, dates, built with, links). The column drops under the prose when the content area is narrower than 44rem; the lead facts (category, dates, links) then show in a strip under the title (`.detail-meta`) instead, so only one copy is ever displayed. Titles over 48 characters drop to the title size on phones. A project may open with one `.detail-figure` (a real capture or a figure from the work, with a caption). After the prose: `.detail-related` links to pages about the same work, and `.detail-pager` links to the newer and older entry in the same list.
- **Home**: `.home-lede`, then `.home-actions` (Resume, Book a meeting) straight after it so both are in the first screen on a phone, a 2×2 grid of pinned projects (`.home-pins`; each pin has the catalog title, a description, one result line `.home-pin-result` and the stack `.home-pin-stack`), and skills as a label/list grid (`.home-skills`) that shows four areas until expanded. Skill lists are separated by dots that never start or end a line. A skill links to a whole-word search of Projects, else Experience, and is plain text when neither has a match. On phones the "Hello" `h1` is visually hidden, since the profile card above it already gives the name.
- **Buttons**: three classes only — `.btn-primary` (green; at most one per page or card), `.btn-default` (outline), `.btn-link` (text). One size: 36px tall, 44px on phones.
- **Category labels**: Colored Label (`.card-category.cat-*`: pill, 1px border, role-based color)
- **Cards**: 1px border, 6px radius, border-color change on hover. Used for pinned projects, CV documents (`.document-row`, with a page-1 thumbnail column) and the calendar (`.calendar-card`, which has a header bar and a fallback footer line). Project pipeline diagrams (`.pipeline`) use the same border and radius: muted stage boxes holding default-background step boxes.
- **Search/Select**: FormControl with leading octicon search icon
- **Footer**: GitHub-style (top border, muted link row + copyright)
- **Theme picker**: `<details>` dropdown with 6 radio options; `--compact` variant is an icon-only button. Rendered at build time as a `<template>` and driven by a small plain script (`site/src/islands/theme.ts`), with no UI library on the client
- **Scroll to top**: fixed round button; on phones it shows only while scrolling up
- **Status badge**: Profile status pill (success/attention/danger variants); currently switched off in `Sidebar.tsx`

## Typography

Site type scale (five steps only — defined as `--site-text-*` in `style.css`):

| Token                 | Size            | Use                                        |
| --------------------- | --------------- | ------------------------------------------ |
| `--site-text-display` | 32px / 2rem     | Page titles (`h1`)                         |
| `--site-text-title`   | 20px / 1.25rem  | Section titles (`h2`)                      |
| `--site-text-body`    | 16px / 1rem     | Subheads (`h3`), ledes, row and pin titles |
| `--site-text-small`   | 14px / 0.875rem | Body copy, nav, buttons, form controls     |
| `--site-text-caption` | 12px / 0.75rem  | Labels, meta, counts                       |

- Font: `--fontStack-system` (body/headings), `--fontStack-monospace` (code)
- Line height: `--text-body-lineHeight-large` (1.5)
- Root `html` font-size stays `16px` so rem math stays stable
- Prose is capped at 72ch (`:where(.academic-content) p, ul, ol`); components that need the full width set `max-width: none`
- Prose defaults are written with `:where()` so they carry no specificity — component classes override them without `!important`

## Accessibility

- WCAG 2.1 AA target (verified with axe-core)
- 6 theme options include high-contrast modes
- `prefers-reduced-motion: reduce` kill-switch on all animations
- `forced-colors: active` compatible (octicons use `currentColor`)
- All interactive elements keyboard-accessible
- Theme announcements via `aria-live` region
- No-JS: correct auto theme, working nav, noscript card fallbacks
