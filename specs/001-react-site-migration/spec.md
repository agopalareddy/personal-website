# Feature Specification: Migrate Site Generation to a Component-Based Build

**Feature Branch**: `001-react-site-migration`

**Created**: 2026-07-26

**Status**: Draft

**Input**: User description: "Replace the custom Python static-site generator (`scripts/generate_site.py` + `cv_parser.py`, ~1255 lines, driving ~200 generated pages from `experience_database.json` and `projects_database.json`) with a component-based build whose output is still fully static and served by nginx exactly as today. Shared page chrome (nav/sidebar/footer) becomes one reusable component. Client-side behavior (catalog filter/search, modals, theme toggle, email obfuscation) is ported alongside. Existing styling (Primer tokens + `style.css`) carries over largely unchanged. Proposed rollout: scaffold + shared chrome + one migrated content section as a proof of concept, then extend to the rest."

## Clarifications

### Session 2026-07-26

- Q: Should the two JSON content databases (`projects_database.json`, `experience_database.json`) gain schema validation as part of this migration, and if so, what mechanism? → A: Yes — JSON Schema (not protobuf; JSON remains the authoring/storage format, unchanged per FR-002 and constitution Principle II). Validation runs at build time.
- Q: Should the migration set a measurable JS-payload budget (plan.md's "no added client-side framework runtime cost" had no number)? → A: Yes — ≤ 50 KB gzipped of additional JS per page, matching the islands architecture (research.md R1: only small hydration bundles ship, no full framework runtime).

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Prove the Approach on One Section (Priority: P1)

The maintainer wants a working, deployable slice — the shared page chrome plus one
content section (e.g. the projects catalog and its detail pages) — rebuilt on the new
approach, coexisting with the rest of the still-Python-generated site, before
committing to migrating everything.

**Why this priority**: The full migration is a large mechanical effort (~1255 lines of
generator logic, ~200 pages, several hand-authored pages, and a client-side JS layer).
Proving parity — same URLs, same visible content, same accessibility behavior — on one
section first is the cheapest way to catch a wrong approach before it's sunk cost
across the whole site.

**Independent Test**: Can be fully tested by visiting every existing `/projects/` URL
against both the old and new builds and confirming the rendered content, navigation
chrome, and accessibility tree are equivalent, without touching any other section of
the site.

**Acceptance Scenarios**:

1. **Given** the existing `projects_database.json`, **When** the new build runs,
   **Then** it produces a catalog page and one detail page per entry at the same URLs
   the current generator produces, with equivalent visible content.
2. **Given** a visitor navigating from the new projects section to any other part of
   the site (still on the old generator), **When** they click a chrome link (nav,
   sidebar, footer), **Then** navigation works with no broken links and no visual
   discontinuity in the shared chrome.
3. **Given** the proof-of-concept build output, **When** it is deployed, **Then** it
   is served as static files by the existing nginx configuration with no changes to
   the deployment process.

---

### User Story 2 - Migrate Remaining Generated Content (Priority: P2)

The maintainer wants the rest of the JSON-driven content (the full `projects/` and
`experience/` sections) rebuilt on the new approach, so that `generate_site.py` and
`cv_parser.py` can be retired and content additions no longer require touching two
separate places (the data file and the hand-maintained JS catalog renderer).

**Why this priority**: This is the bulk of the mechanical work and the main source of
today's maintenance risk (the projects catalog is currently duplicated between the
generator's JSON source and a separately hand-maintained JS array that must be kept in
sync manually). Retiring that duplication is the core value of this migration.

**Independent Test**: Can be fully tested by regenerating the entire site from both
JSON databases and diffing every produced page's visible content and URL against the
current production output, independent of the hand-authored pages in User Story 3.

**Acceptance Scenarios**:

1. **Given** an entry added to a JSON database, **When** the site is built, **Then**
   both its catalog listing and its detail page appear correctly from that single edit
   — no second, separately maintained file needs to be updated.
2. **Given** the full set of existing generated pages, **When** the new build replaces
   the old generator, **Then** every existing URL still resolves to equivalent visible
   content.

---

### User Story 3 - Migrate Hand-Authored Pages and Client Behavior (Priority: P3)

The maintainer wants the remaining hand-authored pages (home, CV/resume hub,
availability, accessibility statement, 404) and the existing client-side behaviors
(theme switching, catalog filter/search, modals, email obfuscation) carried over so the
old asset pipeline (`assets/js/*`) can be fully retired.

**Why this priority**: These pages and behaviors are lower-volume than the generated
content but are what most visitors actually interact with first (home page) and rely
on (theme choice, working contact links). They depend on the shared chrome and build
tooling from User Story 1, so they follow once that foundation is proven.

**Independent Test**: Can be fully tested by exercising each interactive behavior
(switch through all theme options, filter/search the catalogs, open a modal, reveal an
obfuscated email address) on the migrated pages and confirming equivalent behavior to
the current site, independent of whether User Story 2 is complete.

**Acceptance Scenarios**:

1. **Given** a visitor with JavaScript disabled, **When** they load any migrated page,
   **Then** navigation, the default theme, and page content remain usable (no blank or
   broken page).
2. **Given** a visitor switching theme options, **When** they reload the page or
   revisit the site later, **Then** their chosen theme persists exactly as it does
   today.
3. **Given** a visitor on the projects or experience catalog, **When** they filter or
   search, **Then** results update the same way they do on the current site.

---

### User Story 4 - Confirm No Regression Before Cutover (Priority: P4)

The maintainer wants the existing accessibility and end-to-end test coverage
(currently asserting against the old generated DOM) updated to run against the new
build, and the sitemap generation step reproduced, so that the migration can be
confirmed regression-free before it fully replaces the current site.

**Why this priority**: Without this, "parity" is just a claim. This closes the loop
and is the actual go/no-go gate for retiring the old pipeline, so it depends on the
other stories being substantially complete.

**Independent Test**: Can be fully tested by running the full existing test suite
against the new build's output and confirming it passes with no new failures or
accessibility violations, and that the generated sitemap matches the site's real URL
set.

**Acceptance Scenarios**:

1. **Given** the new build's output, **When** the existing accessibility test suite
   runs against it, **Then** it reports no new violations compared to the current site.
2. **Given** the new build's output, **When** the existing end-to-end test suite runs
   against it, **Then** all currently-passing checks still pass (selectors updated as
   needed, behavior unchanged).
3. **Given** the complete set of pages after migration, **When** the sitemap is
   generated, **Then** it lists exactly the site's real URLs with no missing or stale
   entries.

### Edge Cases

- What happens when a JSON database entry is missing a field the old generator
  tolerated silently (e.g. an optional link or date)? The new build must handle it the
  same way (omit gracefully) rather than failing the build.
- Existing URLs (catalog pages, detail pages, hand-authored pages) MUST NOT change as
  part of this migration — external links, bookmarks, and the sitemap depend on them.
- Visitors with JavaScript disabled must retain a usable no-JS experience (correct
  default theme, working navigation) exactly as the current site provides.
- Visitors with `prefers-reduced-motion` set must see the same suppressed/substituted
  animations as today.
- While User Stories 1–2 are in progress, some pages are served by the old generator
  and some by the new build simultaneously — shared chrome (nav/sidebar/footer) and
  shared styling must look and behave identically across both, so the seam is
  invisible to a visitor.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: The site's build process MUST produce a set of static files that nginx
  serves exactly as it does today, with no application server, database, or other
  runtime dependency introduced.
- **FR-002**: The build MUST source project and experience content from the existing
  JSON databases as the single source of truth — a new or edited entry MUST require
  editing only that JSON data, not a second hand-maintained rendering file.
- **FR-003**: Shared page chrome (navigation, sidebar, footer, and shared `<head>`
  metadata) MUST be implemented as one reusable unit rather than duplicated per page,
  so a chrome change only needs to be made once.
- **FR-004**: Every URL reachable on the current production site MUST remain reachable
  at the same path after migration, serving equivalent visible content.
- **FR-005**: All existing client-side behaviors — theme selection and persistence,
  catalog filter/search, modal dialogs, and email-address obfuscation — MUST be
  preserved with equivalent behavior after migration.
- **FR-006**: The migrated site MUST continue to function without JavaScript for
  navigation, default theme rendering, and page content, matching current no-JS
  fallback behavior.
- **FR-007**: The migrated site MUST continue to meet the project's existing
  accessibility bar (WCAG 2.1 AA, verified via the existing automated accessibility
  test tooling) with no new violations introduced.
- **FR-008**: The existing automated end-to-end test suite MUST be updated to run
  against the new build's output and MUST pass with equivalent coverage to today.
- **FR-009**: Sitemap generation MUST be reproduced against the new build so the
  published sitemap continues to list exactly the site's real, current URL set.
- **FR-010**: The deployment process (push to the repository, pull and serve on the
  production host) MUST require no new manual steps for the maintainer beyond what
  exists today.
- **FR-011**: The proof-of-concept (User Story 1 — scaffold, shared chrome, and one
  migrated content section) MUST be completed, deployed, and reviewed as a standalone
  checkpoint before migration work extends to the remaining content, hand-authored
  pages, or client-side behaviors.
- **FR-012**: The standalone wellness mini-app (`wellness/`, including its own
  client-side state) is OUT OF SCOPE for this migration and MUST NOT be touched by it.
  It is not part of this website going forward — relocating it to its own project
  outside this repository is tracked as a separate, unrelated effort.
- **FR-013**: During the migration window, the production site MAY run a mixed stack —
  some sections served from the old generator's output, others from the new build,
  simultaneously — provided shared chrome and styling remain visually and behaviorally
  identical across both, so the seam is invisible to a visitor.
- **FR-014**: Both content databases MUST be validated against a JSON Schema at build
  time. A build MUST fail with a clear, actionable error identifying the offending
  entry and field when an entry doesn't conform, rather than silently producing a
  broken or incomplete page. Fields already optional/nullable in current data (e.g. a
  project's `demo`/`pdf`/`presentation` links) MUST remain optional in the schema —
  validation formalizes today's existing tolerance, it does not tighten it.

### Key Entities

- **Project Entry**: A single portfolio project — title, description, links (repo/demo),
  category/role, technologies used, and any generated detail-page content. Currently
  duplicated between `projects_database.json` (source) and a hand-maintained JS array;
  this migration collapses that to one source.
- **Experience Entry**: A single experience/timeline item (role, organization, dates,
  description) sourced from `experience_database.json`, rendered both in a timeline/
  catalog view and as an individual detail page.
- **Page Chrome**: The shared structural content around page-specific content —
  navigation bar, sidebar profile card, footer, and shared document metadata — reused
  identically across all pages regardless of content type.
- **Content Schema**: A JSON Schema definition per database (Project Entry, Experience
  Entry) formalizing required vs. optional fields and their types, per FR-014. Not a
  new data source — a validation contract layered over the existing two databases.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: 100% of URLs live on the site before migration remain reachable and
  resolve to equivalent visible content after migration (zero broken links, zero
  sitemap drift).
- **SC-002**: Adding one new project or experience entry requires editing exactly one
  data source, down from the current two (data file plus a separately hand-maintained
  catalog renderer).
- **SC-003**: The existing accessibility test suite reports zero new violations on the
  migrated site compared to the pre-migration baseline.
- **SC-004**: The existing end-to-end test suite passes in full against the migrated
  site, covering theme switching, catalog filter/search, modals, and email protection.
- **SC-005**: A visitor with JavaScript disabled can still navigate the site and read
  every page's content after migration, matching current no-JS behavior.
- **SC-006**: The maintainer's deployment steps (from `git push` to the change being
  live) are unchanged in number and nature from today's process.
- **SC-007**: A malformed content entry (missing required field, wrong type) is caught
  at build time with an error naming the entry and field, before it can reach a
  published page — zero malformed entries silently reach production.
- **SC-008**: Each migrated page ships no more than 50 KB (gzipped) of additional
  client-side JavaScript beyond what today's page already loads.

## Assumptions

- The proof-of-concept on one content section first (User Story 1), followed by the
  rest, is the confirmed rollout — not a full migration completed before any deploy.
- The `wellness/` mini-app is out of scope for this migration entirely (FR-012).
  Moving it out of this repository into its own project is a separate, unrelated
  effort and is not planned or tracked as part of this feature.
- A mixed-stack transition period (old generator and new build serving different
  sections simultaneously) is acceptable, as long as shared chrome/styling stay
  identical across both (FR-013).
- Visual design, Primer design tokens, and existing CSS carry over with no intentional
  visual redesign — this migration is a generation/architecture change, not a redesign.
- The two JSON databases (`experience_database.json`, `projects_database.json`) remain
  the content data model; this migration does not change what data is captured, only
  how it is rendered into pages — JSON Schema validation (FR-014) is a build-time
  correctness check layered on top, not a format change (protobuf was considered and
  rejected: no service/network boundary exists to justify it, and it would break
  hand-editability of the databases).
- Retiring `scripts/generate_site.py`, `cv_parser.py`, and the legacy `assets/js/*`
  client scripts is an intended end state once parity is confirmed (User Story 4),
  not something that must happen atomically with the first proof-of-concept.
