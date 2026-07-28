# Phase 0 Research: Scroll to Top Button

No `NEEDS CLARIFICATION` markers were left in Technical Context — this feature is small enough that the existing codebase conventions (islands pattern, Primer tokens, Playwright + axe-core) directly answer every open question. Findings below are the concrete decisions made and why, so Phase 1 design and `/speckit-tasks` don't re-derive them.

## R1: Where does the button live in the render pipeline?

**Decision**: Mount the button markup in `site/src/components/chrome/Layout.tsx` (the one shared chrome wrapper rendered on every page — nav, sidebar, footer already live here) and register its behavior as a new island (`site/src/islands/scroll-to-top.ts`) added to the `commonIslands` array in `site/build/render.mjs`, the same array `theme` and `email-protection` already use to load on every page.

**Rationale**: `Layout.tsx` is explicitly documented as "the one reusable chrome unit" (see its own comment, and `render.mjs`'s `commonIslands`/per-page island-tag pattern). Adding a second, page-by-page injection point would duplicate work already solved by this mechanism and risks pages silently missing the button.

**Alternatives considered**: A per-page opt-in (like `catalogFilterIsland`, only added to catalog pages) — rejected because the spec requires the button on _any_ scrollable page, not a known subset, and the set of "long enough to scroll" pages changes as content grows (experience/project detail pages, resume/CV pages, etc.) — chrome-level mounting is the only option that doesn't need updating every time a page's length crosses the threshold.

## R2: How to detect "is this page scrollable" (FR-004)?

**Decision**: In the island's own runtime check (not build-time), compare `document.documentElement.scrollHeight > document.documentElement.clientHeight` (with a small epsilon, e.g. `> clientHeight + 1`, to avoid 1px rounding false positives). Re-evaluate on `scroll`, `resize`, and via a `ResizeObserver` on `document.body` to catch async content growth (images loading, fonts swapping) per the spec's edge cases.

**Rationale**: Scrollability is inherently a runtime/layout fact — it depends on final rendered content height across arbitrary page templates, fonts, and viewport size. No build-time signal (e.g. "this page template is usually long") is reliable enough to satisfy "no need to show on non-scrollable pages" (spec, verbatim) without risking a flash-of-button on pages that happen to be borderline.

**Alternatives considered**: A `postMessage`/`IntersectionObserver` sentinel element at the bottom of `<body>` — rejected as unnecessary complexity; the `scrollHeight`/`clientHeight` comparison is a single, cheap, well-understood check with no extra DOM.

## R3: Icon choice

**Decision**: Reuse the already-vendored `CHEVRON_DOWN_16` octicon from `site/src/components/common/icons-data.ts`, rotated 180° via a CSS `transform: rotate(180deg)` on the button.

**Rationale**: `scripts/vendor-primer.mjs` maintains an explicit per-icon allowlist (`'chevron-down': [16]`); no up/arrow-up icon is currently vendored. Adding one means editing the vendoring script, regenerating `icons-data.ts` / `assets/js/icons.js` / `scripts/icons.py`, and reviewing that diff — real but avoidable work for what is visually a rotated chevron. CSS rotation of an existing, already-reviewed icon is the smaller, lower-risk change and stays within Constitution III (Primer tokens/icons only — still a vendored octicon, just transformed).

**Alternatives considered**: Vendoring `arrow-up` or `chevron-up` — cleaner semantically but touches four generated files for a purely cosmetic difference; deferred unless a future feature needs an actual "up" glyph elsewhere (at which point vendoring it properly becomes worth the diff).

## R4: Scroll-to-top mechanism and reduced motion (FR-008)

**Decision**: `window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })`.

**Rationale**: Native browser smooth-scroll needs no library and is the same primitive-scale decision already made for this site's other islands (no new dependency, per the "already-installed dependency" step of not reaching past stdlib/native platform features). `matchMedia('(prefers-reduced-motion: reduce)')` is the standard, already-established way this constitution's Principle IV expects reduced-motion to be honored.

**Alternatives considered**: A JS-driven `requestAnimationFrame` easing loop — rejected, `scrollTo({behavior: 'smooth'})` has full support in the site's target evergreen-browser baseline and needs zero maintenance.

## R5: Styling

**Decision**: New `.scroll-to-top` component block in `assets/css/style.css`, fixed-position (`position: fixed`, bottom-right, respecting safe-area insets on mobile), using existing tokens: `--bgColor-default`/`--bgColor-muted` background, `--fgColor-default` icon color, `--borderColor-muted` border, `--fgColor-accent` focus outline (matching the existing focus-outline pattern already at `style.css:113,131`). Visibility toggled by a CSS class (`.is-visible`) the island adds/removes, transitioning `opacity`/`visibility` (not `display`, so it stays in the accessibility tree only when relevant — `aria-hidden` toggled alongside the class) — a short, non-decorative transition tied to a real state change, consistent with Constitution V.

**Rationale**: Matches the token-only, restrained-motion rules already in force sitewide; reuses the exact focus-outline convention already established for other interactive chrome elements instead of inventing a new one.

**Alternatives considered**: A ready-made "scroll to top" library/snippet — rejected outright per Constitution I/III (would either pull in raw hex colors or a new dependency for ~20 lines of CSS the codebase already has the tokens for).
