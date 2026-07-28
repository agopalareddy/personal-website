# Implementation Plan: Scroll to Top Button

**Branch**: `002-scroll-to-top-button` | **Date**: 2026-07-28 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/002-scroll-to-top-button/spec.md`

## Summary

Add a site-wide "scroll to top" button, hydrated as a new client-side island (`site/src/islands/scroll-to-top.ts`) mounted once in `Layout.tsx` so it renders on every page. It toggles visibility via a `ResizeObserver`/`scroll` listener comparing `document.documentElement.scrollHeight` against viewport height (so it never appears on non-scrollable pages, and reacts to layout changes), scrolls the page to top on click/Enter/Space using `prefers-reduced-motion`-aware `window.scrollTo`, and is styled with existing Primer tokens reusing the already-vendored `chevron-down` octicon rotated 180° (no new icon vendoring needed).

## Technical Context

**Language/Version**: TypeScript (site/), targeting the same browser baseline as the other islands (evergreen browsers; no IE11 support implied elsewhere in the codebase)

**Primary Dependencies**: None new. Reuses React (build-time render only, this island is vanilla DOM per the existing island pattern — see `toggle.ts`), `@primer/octicons` (already vendored, reusing `CHEVRON_DOWN_16`), existing `assets/css/style.css` token system

**Storage**: N/A

**Testing**: Playwright (`tests/e2e/*.spec.ts`, `tests/playwright.config.ts`), pattern already established by `theme-picker.spec.ts` / `nav-integrity.spec.ts`; axe-core accessibility check per Constitution IV

**Target Platform**: Static site served by nginx, all pages (desktop + mobile viewports)

**Project Type**: Static website with build-time React SSR + hydrated client islands (single project, no frontend/backend split)

**Performance Goals**: No measurable regression to page weight (button SVG + script is a few hundred bytes, one new Vite chunk loaded on every page like `theme` and `email-protection` already are)

**Constraints**: Must not require a build step beyond the existing `npm run build:site` / Vite island bundling; must not introduce raw hex colors (Constitution III); must respect `prefers-reduced-motion` (Constitution IV); must not appear on pages short enough to not scroll (spec FR-004)

**Scale/Scope**: One new island file, one new CSS component block, one Layout.tsx mount point, one Vite manifest entry, one E2E spec file

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

- **I. Static-First, No Runtime Server**: PASS — pure client-side JS island, no server/build-step dependency beyond the existing Vite island bundling already used for `theme`, `cv-modal`, etc.
- **II. Generated Content Is Source-of-Truth via JSON**: N/A — this feature touches no `experience/`/`projects/` generated content.
- **III. Primer Tokens Only, No Raw Hex**: PASS — button styled entirely with existing `--bgColor-*`/`--fgColor-*`/`--borderColor-*` tokens already used elsewhere in `style.css`; icon reuses the already-vendored `CHEVRON_DOWN_16` octicon (rotated via CSS transform) rather than introducing a new icon or icon set.
- **IV. Accessibility Is Non-Negotiable (WCAG 2.1 AA)**: PASS — button is a real `<button>` (native keyboard/AT support), has an accessible name, respects `prefers-reduced-motion`, and gets an axe-core check added to the Playwright suite. Does not require an `accessibility.html` statement update since it adds an affordance rather than changing any existing accessibility claim.
- **V. Restraint Over Spectacle**: PASS — small fixed-position icon button, no entrance animation beyond a simple opacity/visibility toggle tied directly to a real state change (scroll position), consistent with "motion must justify its own existence."
- **VI. Human-Only Git Authorship**: N/A at plan stage — enforced by existing Husky hooks at commit time.

No violations. Complexity Tracking section is not needed.

## Project Structure

### Documentation (this feature)

```text
specs/002-scroll-to-top-button/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

No `contracts/` directory — this feature exposes no API, CLI, or other external interface; it is purely client-side UI behavior internal to the static site.

### Source Code (repository root)

```text
site/src/islands/
└── scroll-to-top.ts         # NEW — scroll listener, visibility toggle, click-to-top handler

site/src/components/chrome/
└── Layout.tsx                # MODIFIED — render the button markup once, site-wide

assets/css/
└── style.css                  # MODIFIED — new .scroll-to-top component block (Primer tokens only)

site/build/
└── render.mjs                 # MODIFIED — add scroll-to-top island to commonIslands (loaded every page)

vite.config.ts                  # MODIFIED — register site/src/islands/scroll-to-top.ts as a new Rollup input

tests/e2e/
└── scroll-to-top.spec.ts     # NEW — Playwright coverage for show/hide, click-to-top, reduced-motion, axe-core
```

**Structure Decision**: This is a single static site project (no frontend/backend split). The button follows the existing "island" pattern exactly (`site/src/islands/*.ts` for behavior, mounted from `Layout.tsx` chrome, bundled by the existing Vite config, injected as a `commonIslands` script tag in `render.mjs` so it loads on every page — the same mechanism already used for the theme picker and email protection). No new architectural pattern is introduced.

## Complexity Tracking

_No violations — table not needed._
