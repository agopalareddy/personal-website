# Tasks: Scroll to Top Button

**Input**: Design documents from `/specs/002-scroll-to-top-button/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [quickstart.md](./quickstart.md)

**Tests**: Included. Constitution IV requires an axe-core accessibility check on any change touching interaction/visual state, and this feature's independent-test criteria are behavioral (show/hide, click-to-scroll) — Playwright is the existing tool for exactly this (`tests/e2e/theme-picker.spec.ts` is the closest precedent).

**Organization**: Tasks are grouped by user story (spec.md priorities P1/P2/P3) so each can be implemented and validated independently.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Maps task to US1/US2/US3 from spec.md
- File paths are exact, per plan.md's Project Structure

## Path Conventions

Single static-site project (no frontend/backend split). Paths per plan.md: `site/src/islands/`, `site/src/components/chrome/`, `assets/css/`, `site/build/`, `vite.config.ts`, `tests/e2e/`.

---

## Phase 1: Setup

**Purpose**: Register the new island in the build pipeline so it exists (empty/stub) before any behavior is added.

- [x] T001 Add `'scroll-to-top': resolve(__dirname, 'site/src/islands/scroll-to-top.ts')` to the `rollupOptions.input` map in [vite.config.ts](../../vite.config.ts), matching the existing entries for `theme`, `email-protection`, etc.
- [x] T002 Create the stub island file `site/src/islands/scroll-to-top.ts` with a no-op `export {}` (real logic added in Phase 3), so T001's Vite input resolves.

**Checkpoint**: `npm run build:site` succeeds with the new empty island bundled.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Get the button's markup rendering on every page and wired into the island-loading mechanism, with no interactive behavior yet (button exists in DOM, permanently hidden). This is the shared plumbing every user story's behavior attaches to.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete — all three stories modify the same island file and depend on the button existing in the DOM.

- [x] T003 In [site/src/components/chrome/Layout.tsx](../../site/src/components/chrome/Layout.tsx), add the button markup right before `<script src="/assets/js/sw-register.js" />`: a `<button type="button" id="scroll-to-top" class="scroll-to-top" aria-label="Scroll to top" aria-hidden="true" tabindex="-1">` wrapping an `<Icon name="CHEVRON_DOWN_16" />` (import `Icon` from `../common/Icon`), matching the existing chrome-component pattern (see Footer.tsx for import style).
- [x] T004 In [site/build/render.mjs](../../site/build/render.mjs), add `const scrollToTopIsland = islandScriptTag(manifest, 'src/islands/scroll-to-top.ts');` and append it to the `commonIslands` array (alongside `themeIsland`, `emailProtectionIsland`) so it loads on every generated page.
- [x] T005 [P] In [assets/css/style.css](../../assets/css/style.css), add the base `.scroll-to-top` component block per research.md R5: `position: fixed`, bottom-right placement with safe-area-inset support, sizing/padding consistent with other icon buttons in the file, `background-color: var(--bgColor-default)`, `border: 1px solid var(--borderColor-muted)`, `color: var(--fgColor-default)`, focus-visible outline using `var(--fgColor-accent)` (match the pattern at style.css:113/131), a `transform: rotate(180deg)` on the inner icon (per research.md R3), and default state `opacity: 0; visibility: hidden; pointer-events: none;` with a short `transition: opacity` — plus `.scroll-to-top.is-visible { opacity: 1; visibility: visible; pointer-events: auto; }`.

**Checkpoint**: Button renders in the DOM on every page (verify via `npm run build:site` + inspecting generated HTML), permanently invisible since nothing toggles `.is-visible` yet.

---

## Phase 3: User Story 1 - Return to top from a long page (Priority: P1) 🎯 MVP

**Goal**: On any scrollable page, scrolling away from the top reveals the button; activating it (click, or keyboard Enter/Space) returns to the top; scrolling back to the top hides it again.

**Independent Test**: Open a known-long page (e.g. an experience or project detail page), scroll down, confirm the button appears; click it; confirm the page returns to the top and the button hides.

### Tests for User Story 1

- [x] T006 [P] [US1] Add `tests/e2e/scroll-to-top.spec.ts` with a Playwright test group `"scroll to top — core behavior"` covering: button hidden at page load/top of a long page; button visible after `page.mouse.wheel` / `page.evaluate(() => window.scrollTo(0, 800))`; clicking the button scrolls `window.scrollY` back to `0`; button hides again once back at top. Follow `tests/playwright.config.ts` conventions and the structure of `tests/e2e/theme-picker.spec.ts`.
- [x] T007 [P] [US1] In the same spec file, add a keyboard-only test: `Tab` to the button once visible, confirm it receives focus with a visible outline (`toHaveCSS` on `outline-style`/`outline-color` or a focus-visible class), activate with `Enter`, confirm scroll returns to top.

### Implementation for User Story 1

- [x] T008 [US1] In `site/src/islands/scroll-to-top.ts`, implement the core toggle: `document.getElementById('scroll-to-top')`, a `SHOW_THRESHOLD_PX` constant (e.g. `300`), a `scroll` event listener (passive) that adds/removes the `is-visible` class and toggles `aria-hidden`/`tabindex` based on `window.scrollY > SHOW_THRESHOLD_PX`, run once on load to set initial state.
- [x] T009 [US1] In the same file, implement the click handler per research.md R4: on click, `window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })`.
- [x] T010 [US1] Guard both listeners with a null check on `document.getElementById('scroll-to-top')` (defensive — matches the existing island pattern of tolerating a missing target element) and register the island's entry call (e.g. an IIFE or `DOMContentLoaded`-safe top-level call, matching how `toggle.ts`/`home-skill-toggle.ts` self-invoke).

**Checkpoint**: User Story 1 fully functional on any page long enough to scroll — button shows/hides on scroll position and returns to top on activation, independent of Stories 2 and 3. Run `npx playwright test tests/e2e/scroll-to-top.spec.ts` to confirm T006/T007 pass.

---

## Phase 4: User Story 2 - No clutter on short pages (Priority: P2)

**Goal**: The button never appears on a page that isn't tall enough to scroll, and correctly starts appearing if the page later becomes scrollable (resize, async content growth).

**Independent Test**: Open a page short enough to fit the viewport, confirm the button never renders even after attempting to scroll; resize the window shorter until the page becomes scrollable, confirm the button now behaves per US1.

### Tests for User Story 2

- [x] T011 [P] [US2] In `tests/e2e/scroll-to-top.spec.ts`, add a test that navigates to a page/viewport combination confirmed non-scrollable (e.g. set a tall `page.setViewportSize` on a short page, or use `accessibility.html` if it fits at default size — verify via `page.evaluate(() => document.documentElement.scrollHeight <= document.documentElement.clientHeight)` as the test's own precondition assertion) and confirms `#scroll-to-top` never gets the `is-visible` class or a non-zero `opacity`, including after a forced `scroll` event dispatch.
- [x] T012 [P] [US2] In the same file, add a resize test: start on a non-scrollable viewport/page combination, confirm button absent; shrink `page.setViewportSize` height so the same content now exceeds the viewport; confirm the button becomes available (scrolls + shows) per US1's rules.

### Implementation for User Story 2

- [x] T013 [US2] In `site/src/islands/scroll-to-top.ts`, add an `isPageScrollable()` helper: `document.documentElement.scrollHeight > document.documentElement.clientHeight + 1` (per research.md R2's epsilon), and gate the `scroll` handler's visibility toggle on it (button only gets `is-visible` if both `isPageScrollable()` and past the scroll threshold).
- [x] T014 [US2] In the same file, add a `ResizeObserver` on `document.body` (with a `window.resize` fallback listener if `ResizeObserver` is unavailable — check existing islands for a similar feature-detection pattern first) that re-runs the visibility check whenever layout changes, so async content growth or window resize correctly flips scrollability without waiting for the next scroll event.

**Checkpoint**: User Stories 1 AND 2 both work independently — button now respects true scrollability, not just scroll position. Run T006/T007/T011/T012 together.

---

## Phase 5: User Story 3 - Consistent behavior on mobile and desktop (Priority: P3)

**Goal**: The button is equally available and correctly positioned on mobile/touch and desktop viewports, without overlapping other chrome (nav, footer, theme toggle).

**Independent Test**: Repeat User Story 1's scroll/click test at a mobile viewport width (e.g. 375×812) and confirm the button appears, is tappable, and visually clears other fixed/sticky chrome elements.

### Tests for User Story 3

- [x] T015 [P] [US3] In `tests/e2e/scroll-to-top.spec.ts`, add a test using `page.setViewportSize({width: 375, height: 812})` (mobile) that repeats the core show/click/hide assertions from T006, plus a bounding-box check (`boundingBox()`) confirming the button doesn't overlap the nav or footer bounding boxes at that viewport.
- [x] T016 [P] [US3] Add an `@axe-core/playwright` scan (matching whatever existing test wires it in, e.g. `nav-integrity.spec.ts` or `theme-picker.spec.ts`) of the page in both button states (hidden and visible-after-scroll) asserting zero violations, per Constitution IV.

### Implementation for User Story 3

- [x] T017 [US3] In `assets/css/style.css`, add a `@media (max-width: 47.99em)` (or the project's existing mobile breakpoint, matching style.css:285) override block for `.scroll-to-top` adjusting size/offset for touch target size (minimum 44×44px per WCAG) and clearance from any mobile-specific fixed chrome (check `Nav.tsx`/`Footer.tsx` for sticky/fixed elements at mobile width before finalizing offsets).
- [x] T018 [US3] Verify (manually, or via T015's bounding-box assertion) desktop placement doesn't collide with the theme toggle or footer at the `min-width: 48em` breakpoint; adjust `.scroll-to-top`'s desktop `bottom`/`right` offsets in `assets/css/style.css` if needed.

**Checkpoint**: All three user stories independently functional. Run the full `tests/e2e/scroll-to-top.spec.ts` file.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final governance/consistency steps that span all stories.

- [x] T019 [P] Run `./quickstart.md`'s manual validation checklist end-to-end (all 5 steps) as a final human sanity pass beyond automated coverage, at [specs/002-scroll-to-top-button/quickstart.md](./quickstart.md).
- [x] T020 Run `npm run build:site` and spot-check generated HTML across at least one long page and one short page to confirm the button markup and `commonIslands` script tag are present sitewide, per plan.md's Structure Decision.
- [x] T021 Per CLAUDE.md's Documentation Sync workflow, run `openwiki --update "add scroll to top button"` (or manually update the relevant `openwiki/` interactive-components page if the CLI is unavailable), since this adds a new sitewide interactive component. Ran successfully (background retry) — `openwiki/interactive-components/small-components.md` now documents the button. `openwiki/` is gitignored, so no commit needed for this.
- [x] T022 Confirm `npx playwright test tests/e2e/scroll-to-top.spec.ts` passes in full (all of T006/T007/T011/T012/T015/T016) with zero axe-core violations, as the final gate before commit.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately.
- **Foundational (Phase 2)**: Depends on Phase 1 (island file must exist for the manifest entry to resolve) — BLOCKS all user stories.
- **User Story 1 (Phase 3)**: Depends on Foundational only. No dependency on US2/US3.
- **User Story 2 (Phase 4)**: Depends on Foundational; its implementation (T013/T014) extends the same `scroll-to-top.ts` file US1 created in T008–T010, so in practice do Phase 3 before Phase 4 even though they're logically independent (same-file edits, not a hard test dependency).
- **User Story 3 (Phase 5)**: Depends on Foundational; T017/T018 touch `style.css` only (parallel-safe with US1/US2's `.ts` work) but its tests (T015/T016) assume US1's show/click behavior already exists to test against.
- **Polish (Phase 6)**: Depends on all three user stories being complete.

### Within Each User Story

- Tests before implementation (write T006/T007 before T008–T010; T011/T012 before T013/T014; T015/T016 before T017/T018) — expect them to fail first since the behavior/markup doesn't exist yet.
- Core toggle logic (US1) before scrollability gating (US2) before responsive placement (US3), since each layers onto the same island file / CSS block.

### Parallel Opportunities

- T005 (CSS base block) can run in parallel with T003/T004 (different files).
- T006 and T007 (both new test cases in the same new file) are logically parallel-authorable but land in one file — treat as sequential edits to avoid merge conflicts within the task, despite the `[P]` marker reflecting no _cross-task_ dependency.
- T011/T012 [P] and T015/T016 [P] likewise share a file with each other and with T006/T007 — same caveat.
- T017 and T018 both touch `style.css` — do sequentially despite independence, to avoid clobbering the same file in flight.

---

## Parallel Example: User Story 1

```bash
# T006 and T007 both extend tests/e2e/scroll-to-top.spec.ts — same file, so run/write sequentially
# rather than as literal concurrent edits, even though neither depends on the other's assertions.
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001–T002).
2. Complete Phase 2: Foundational (T003–T005) — button exists in DOM, always hidden.
3. Complete Phase 3: User Story 1 (T006–T010) — button now shows/hides on scroll position and returns to top.
4. **STOP and VALIDATE**: run `npx playwright test tests/e2e/scroll-to-top.spec.ts -g "core behavior"`; manually check a long page.
5. This is already a reasonable ship point if US2/US3 need to land later — the button just won't yet respect true non-scrollable pages (it'll use scroll-position alone, which is close but not spec-exact) or mobile-specific placement (it'll use whatever the base CSS gives it).

### Incremental Delivery

1. Setup + Foundational → button exists, inert.
2. Add US1 → scroll-position-based show/hide + click-to-top → validate → this is the MVP.
3. Add US2 → true scrollability gating (spec's explicit "no need to show on non-scrollable pages" requirement) → validate.
4. Add US3 → mobile/desktop placement refinement + cross-viewport a11y check → validate.
5. Polish (Phase 6) → docs sync, full test gate, commit.

---

## Notes

- [P] tasks touch different files from concurrently-listed tasks; tasks sharing a file (noted above) are marked `[P]` only where the task-generation rule requires it for cross-task independence, but should still be applied as sequential edits in practice.
- This feature has no `contracts/` (no external interface) and no persisted entities (`data-model.md` documents only transient in-memory UI state) — no contract-test or model tasks were generated, matching plan.md's "no violations" Constitution Check.
- Commit after each phase checkpoint, consistent with the "Human-Only Git Authorship" constraint (Constitution VI) — commits are the developer's, not this task list's.
