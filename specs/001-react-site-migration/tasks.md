---
description: 'Task list for migrating site generation to a component-based build'
---

# Tasks: Migrate Site Generation to a Component-Based Build

**Input**: Design documents from `/specs/001-react-site-migration/`
**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/url-contract.md](./contracts/url-contract.md), [quickstart.md](./quickstart.md)

**Tests**: Not generated as separate contract/unit test tasks — the feature explicitly reuses and updates the _existing_ `tests/e2e/` and `tests/a11y/` suites (FR-008) rather than writing a new suite from scratch. Test-touching tasks are embedded in each user story below.

**Organization**: Tasks are grouped by user story (spec.md P1–P4) for independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Maps task to spec.md's US1/US2/US3/US4
- File paths are exact per plan.md's Project Structure

---

## Phase 1: Setup

**Purpose**: Project initialization — no user story can start before this.

- [x] T001 Add `vite`, `react`, `react-dom`, `ajv`, and TypeScript types as dependencies in `package.json` (research.md R7 — merged into existing root `package.json`, no new workspace)
- [x] T002 [P] Create the `site/` source tree: `site/src/components/{chrome,catalog,detail,common}/`, `site/src/pages/`, `site/src/hooks/`, `site/src/content/schemas/`, `site/src/styles/` (plan.md Project Structure)
- [x] T003 [P] Create `vite.config.ts` at repo root with `root: './site'`, configuring build output to write into the existing served paths at the repository root rather than a separate `dist/` (research.md R2)
- [x] T004 [P] Create `tsconfig.json` covering `site/src/**`
- [x] T005 Add `"build:site"` and `"dev:site"` scripts to `package.json` (named to avoid colliding with the existing root `"dev"` script, which still runs the Python preview server; `quickstart.md` uses `build:site` explicitly for this reason)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: The render pipeline, chrome, theming, icons, and validated content loading that every user story's pages depend on.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [x] T006 Define the Project Entry JSON Schema in `site/src/content/schemas/project-entry.schema.json` — required vs. nullable fields per data-model.md's Project Entry table (FR-014)
- [x] T007 [P] Define the Experience Entry JSON Schema in `site/src/content/schemas/experience-entry.schema.json`, per the field mapping already documented in `scripts/experience_schema.md` (FR-014)
- [x] T008 Implement an `ajv`-based `validateEntry()` helper in `site/src/content/validate.ts` that validates one entry against a schema and throws a build-failing error naming the entry's `id` and the offending field (FR-014, SC-007)
- [x] T009 Verify T008 against a deliberately malformed fixture entry (missing required field, wrong type) and confirm the build fails with an error naming the entry and field, not a silent bad page (SC-007)
- [x] T010 [P] Implement `loadProjects()` in `site/src/content/loadProjects.ts` — reads `scripts/projects_database.json`, validates every entry via T008
- [x] T011 [P] Implement `loadExperience()` in `site/src/content/loadExperience.ts` — reads `scripts/experience_database.json`, validates every entry via T008
- [x] T012 Port `assets/js/icons.js`'s octicon SVG table into a shared `Icon` component in `site/src/components/common/Icon.tsx` (or an `icons.ts` constants module it wraps) — consumed by chrome, theming, and modal components below (closes the icon-rendering gap `assets/js/icons.js` currently fills)
- [x] T013 Implement the chrome component tree in `site/src/components/chrome/` (`Layout.tsx`, `Nav.tsx`, `Sidebar.tsx`, `Footer.tsx`, `Head.tsx`), porting `scripts/chrome.py`'s template logic (FR-003, data-model.md Page Chrome). `Sidebar.tsx` MUST render the profile status badge (today's `assets/js/status-badge.js`) directly from props/config as static markup — the runtime auto-mount script becomes unnecessary once the badge is just part of the rendered component tree.
- [x] T014 Implement `useTheme` + `ThemePicker` in `site/src/hooks/useTheme.ts` + `site/src/components/common/ThemePicker.tsx`, porting `assets/js/theme.js` (6 theme modes, `localStorage` key `color-scheme`, inline no-FOUC `<head>` snippet, sun/moon icons via T012) — required by `Head`/`Sidebar` on every page (FR-005, FR-006)
- [x] T015 Implement the build-time static-render entry point `site/build/render.mjs`: given a React page component, render it to static HTML via `react-dom/server` and write it to a target file path (research.md R1)
- [x] T016 Wire per-component client-hydration bundling between `vite.config.ts` and `site/build/render.mjs`: each interactive component gets its own small hydration entry point, built by Vite, referenced via a `<script type="module">` tag injected into the rendered HTML — islands, not whole-page hydration (research.md R1/R3), keeping each bundle within the 50 KB gzipped/page budget (SC-008)

**Checkpoint**: Foundation ready — chrome (incl. status badge), icons, theming, validated content loading, and the render pipeline all exist. User story implementation can now begin.

---

## Phase 3: User Story 1 - Prove the Approach on One Section (Priority: P1) 🎯 MVP

**Goal**: Rebuild the projects catalog and its detail pages on the new pipeline, coexisting with the still-Python-generated rest of the site.

**Independent Test**: Visit every existing `/projects/` URL against both the old and new builds; confirm rendered content, navigation chrome, and accessibility tree are equivalent, without touching any other section.

### Implementation for User Story 1

- [x] T017 [P] [US1] Create `ProjectCard` in `site/src/components/catalog/ProjectCard.tsx`
- [x] T018 [P] [US1] Create `ProjectCatalogPage` in `site/src/pages/ProjectCatalog.tsx` (all projects, wrapped in `Layout`)
- [x] T019 [P] [US1] Create `ProjectDetailPage` in `site/src/pages/ProjectDetail.tsx` (renders one entry's `content_html` via the trusted-HTML injection decision in research.md R4)
- [x] T020 [US1] Wire `site/build/render.mjs` to render `/projects/` and `/projects/<permalink>.html` (every `has_detail: true` entry) using `loadProjects()` (T010), writing to the exact paths in `contracts/url-contract.md`
- [x] T021 [US1] Update any `tests/e2e/*.spec.ts` selectors touching `/projects/*` that changed due to the new markup (FR-008) — do not alter passing assertions about behavior
- [x] T022 [US1] Run `tests/a11y/run-audit.mjs` against the new `/projects/` pages; confirm 0 new violations (FR-007, SC-003)
- [x] T023 [US1] Diff every current `/projects/` URL (old generator output vs. new build output) for visible-content parity (SC-001) and confirm chrome links between the new and still-old sections are unbroken (Acceptance Scenario 2)
- [x] T024 [US1] Deploy the proof-of-concept via the existing `git push` deploy flow (no infra changes) and confirm it serves correctly as static files (Acceptance Scenario 3, FR-010)

**Checkpoint**: `/projects/` fully on the new pipeline, reviewed and deployed as the standalone checkpoint required by FR-011 before continuing.

---

## Phase 4: User Story 2 - Migrate Remaining Generated Content (Priority: P2)

**Goal**: Bring the rest of the JSON-driven content (all `experience/` categories, remaining `projects/` behavior) onto the new pipeline so `generate_site.py`/`cv_parser.py` are no longer needed for content generation.

**Independent Test**: Regenerate the entire site from both JSON databases and diff every produced page's visible content and URL against current production, independent of User Story 3's hand-authored pages.

### Implementation for User Story 2

- [x] T025 [P] [US2] Create `ExperienceEntryCard` in `site/src/components/catalog/ExperienceEntryCard.tsx`
- [x] T026 [P] [US2] Create the combined `/experience/` timeline page in `site/src/pages/ExperienceCatalog.tsx`
- [ ] T027 [P] [US2] ~~Create `ExperienceCategoryListing`~~ — **skipped**: `contracts/url-contract.md`'s route inventory has no per-category listing route (only `/experience/` and `/experience/<category>/<slug>.html` detail pages), and no such page exists in current production (`experience/education/` etc. contain only detail-page files, no `index.html`). Building it would be scope not backed by the contract or the live site.
- [x] T028 [P] [US2] Create `ExperienceDetailPage` in `site/src/pages/ExperienceDetail.tsx`, reusing the detail-shell pattern from T019 via `site/src/components/detail/`
- [x] T029 [US2] Wire `render.mjs` to render `/experience/`, each category index, and each `has_detail: true` entry's detail page using `loadExperience()` (T011), per `contracts/url-contract.md`'s experience route inventory
- [x] T030 [US2] Replace the sitemap-writing portion of `generate_site.py` with `scripts/generate-sitemap.mjs`, deriving the URL list from the same route manifest `render.mjs` produces (research.md R5, FR-009)
- [x] T031 [US2] Update `tests/e2e/experience-listing.spec.ts`, `experience-detail.spec.ts`, and `nav-integrity.spec.ts` for any changed selectors (FR-008)
- [x] T032 [US2] Run `tests/a11y/` audits against all experience pages; confirm 0 new violations (FR-007)
- [x] T033 [US2] Full generated-content diff: confirm every pre-migration `/projects/*` and `/experience/*` URL still resolves to equivalent content (SC-001), and that adding a test entry to either JSON database produces its listing + detail page from that one edit alone (SC-002, Acceptance Scenario 1)

**Checkpoint**: All generated content (projects + experience) on the new pipeline. `generate_site.py`/`cv_parser.py` are only still needed for nothing at this point — their remaining callers are addressed in User Story 3/4.

---

## Phase 5: User Story 3 - Migrate Hand-Authored Pages and Client Behavior (Priority: P3)

**Goal**: Migrate the 5 remaining hand-authored pages and port every existing client-side behavior so `assets/js/*` can be retired.

**Independent Test**: Exercise each interactive behavior (theme switching, catalog filter/search, modal, email reveal) on the migrated pages and confirm parity with the current site, independent of whether User Story 2 is complete.

### Implementation for User Story 3

- [ ] T034 [P] [US3] Create `Home` page in `site/src/pages/Home.tsx`
- [ ] T035 [P] [US3] Create `CvHub` page in `site/src/pages/CvHub.tsx` (porting `cv/index.html`'s structure)
- [ ] T036 [P] [US3] Create `Availability` page in `site/src/pages/Availability.tsx`
- [ ] T037 [P] [US3] Create `Accessibility` statement page in `site/src/pages/Accessibility.tsx` — must stay accurate to actual a11y behavior (Constitution Principle IV)
- [ ] T038 [P] [US3] Create `NotFound` (404) page in `site/src/pages/NotFound.tsx`
- [ ] T039 [P] [US3] Implement `useCatalogFilter` + `CatalogFilter` in `site/src/hooks/useCatalogFilter.ts` + `site/src/components/catalog/CatalogFilter.tsx`, porting the filter/search logic from `assets/js/projects-catalog.js` and `assets/js/experience-catalog.js`
- [ ] T040 [P] [US3] Implement `useModal` + `Modal` in `site/src/hooks/useModal.ts` + `site/src/components/common/Modal.tsx`, porting `assets/js/cv-modal.js` (using `Icon` from T012 for the close control)
- [ ] T041 [P] [US3] Implement `useEmailProtection` in `site/src/hooks/useEmailProtection.ts`, porting `assets/js/email-protection.js`'s obfuscation/reveal logic
- [ ] T042 [US3] Wire `CatalogFilter` (T039) into `ProjectCatalogPage`/`ExperienceCatalogPage` as a hydrated island (T016's mechanism)
- [ ] T043 [US3] Wire `render.mjs` to render the 5 hand-authored pages (T034–T038) to their existing paths (`index.html`, `cv/index.html`, `availability/index.html`, `accessibility.html`, `404.html`)
- [ ] T044 [US3] Confirm no-JS behavior across every migrated page: navigation, default theme, and content all present with JavaScript disabled (FR-006, SC-005, Acceptance Scenario 1)
- [ ] T045 [US3] Confirm theme choice persists across reload/revisit exactly as today (Acceptance Scenario 2)
- [ ] T046 [US3] Update `tests/e2e/theme-picker.spec.ts` and `tests/e2e/smoke.spec.ts` for any changed selectors (FR-008)
- [ ] T047 [US3] Delete `assets/js/theme.js`, `projects-catalog.js`, `experience-catalog.js`, `cv-modal.js`, `email-protection.js`, `status-badge.js`, `icons.js` — fully superseded by T012/T013/T014/T039–T041

**Checkpoint**: Every page and interactive behavior is served by the new pipeline. Only full-suite regression confirmation (User Story 4) remains before retiring the old generator.

---

## Phase 6: User Story 4 - Confirm No Regression Before Cutover (Priority: P4)

**Goal**: Run full existing test/sitemap coverage against the complete new build as the go/no-go gate for deleting the old pipeline.

**Independent Test**: Run the full existing test suite against the new build's output; confirm it passes with no new failures or accessibility violations, and that the sitemap matches the site's real URL set.

### Implementation for User Story 4

- [ ] T048 [US4] Run the complete `tests/a11y/` audit suite against every migrated page; confirm 0 new violations vs. the pre-migration baseline (FR-007, SC-003)
- [ ] T049 [US4] Run the complete `tests/e2e/` Playwright suite against the fully migrated site; confirm 100% pass (FR-008, SC-004)
- [ ] T050 [US4] Diff the generated `sitemap.xml` against the pre-migration production sitemap; confirm no missing or stale entries (FR-009, SC-001, Acceptance Scenario 3)
- [ ] T051 [US4] Confirm the deployment step count/nature is unchanged (`git push` → `git fetch && git reset --hard` on the VM) (FR-010, SC-006)
- [ ] T052 [US4] Delete `scripts/generate_site.py` and `scripts/cv_parser.py` — only after T048–T051 all pass

**Checkpoint**: All user stories independently functional and confirmed regression-free. Legacy Python pipeline retired.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Documentation and cleanup that spans multiple user stories.

- [ ] T053 [P] Update `AGENTS.md`'s "Editing experience or project content" / "Adding a new project (two catalogs!)" sections **and** `README.md`'s "Content Workflows" section (README.md:101,118,131 currently document the now-deleted `python3 scripts/generate_site.py --projects/--experiences` commands) — the dual-catalog problem they describe no longer exists post-migration (SC-002)
- [ ] T054 [P] Audit every component under `site/src/components/` and `site/src/pages/` for raw hex values (must resolve to Primer functional tokens only, Constitution Principle III) and any unrequested decorative motion (Constitution Principle V) introduced during T017–T047
- [ ] T055 [P] Run `openwiki --update "migrated site generation from Python generator to Vite+React SSG"` per the constitution's Documentation Sync workflow
- [ ] T056 [P] Remove now-unused Python tooling references under `scripts/` (e.g. `.ruff_cache/`) once no Python remains there
- [ ] T057 Run the full `quickstart.md` validation pass end-to-end as the final confirmation

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies.
- **Foundational (Phase 2)**: Depends on Setup. BLOCKS all user stories — chrome, icons, theming, validated loaders, and the render pipeline are shared by every story.
- **User Story 1 (Phase 3)**: Depends on Foundational only. Must complete and be deployed/reviewed before Phase 4 begins (FR-011).
- **User Story 2 (Phase 4)**: Depends on Foundational + User Story 1's proven pipeline (FR-011). Independent of User Story 3.
- **User Story 3 (Phase 5)**: Depends on Foundational + User Story 1. Independent of User Story 2's completion state (spec.md's Independent Test for US3).
- **User Story 4 (Phase 6)**: Depends on User Stories 1–3 being substantially complete — it is the regression gate, not new functionality.
- **Polish (Phase 7)**: Depends on User Story 4 passing.

### Within Each User Story

- Components/pages before wiring them into `render.mjs`.
- Wiring into `render.mjs` before test/diff/parity confirmation tasks.
- Parity confirmation before that story's checkpoint is considered closed.

### Parallel Opportunities

- All Setup (T002–T004) and most Foundational tasks marked `[P]` can run in parallel once T001 lands.
- Within a user story, all `[P]`-marked component/page creation tasks (e.g. T017–T019, T025–T028, T034–T041) can run in parallel — different files, no cross-dependencies.
- User Story 2 and User Story 3 can proceed in parallel once User Story 1's checkpoint is signed off (both depend only on Foundational + US1, not on each other).

---

## Parallel Example: User Story 1

```bash
# Launch all component/page creation for User Story 1 together:
Task: "Create ProjectCard in site/src/components/catalog/ProjectCard.tsx"
Task: "Create ProjectCatalogPage in site/src/pages/ProjectCatalog.tsx"
Task: "Create ProjectDetailPage in site/src/pages/ProjectDetail.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 (Setup) + Phase 2 (Foundational) — the render pipeline, chrome, icons, and theming are non-negotiable prerequisites.
2. Complete Phase 3 (User Story 1).
3. **STOP and VALIDATE**: run T021–T023, deploy per T024.
4. This is the actual go/no-go checkpoint FR-011 requires before any further migration work.

### Incremental Delivery

1. Setup + Foundational → shared foundation ready.
2. User Story 1 → validate → deploy (MVP, mixed-stack with the old generator per FR-013).
3. User Story 2 and User Story 3 → can proceed in parallel → each validated independently.
4. User Story 4 → full-suite regression gate → only then delete the legacy Python pipeline (T052).
5. Polish → documentation catches up to the new reality.

---

## Notes

- `[P]` tasks touch different files with no dependencies on incomplete tasks.
- `[Story]` labels trace every task back to spec.md's user stories for independent-delivery tracking.
- The legacy Python generator and `assets/js/*` are deleted only in T047/T052, never earlier — User Stories 1–3 run in a deliberate mixed-stack transition (spec.md FR-013).
- Commit after each task or logical group, per this repo's one-atomic-change-per-commit convention.
