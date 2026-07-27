# Implementation Plan: Migrate Site Generation to a Component-Based Build

**Branch**: `001-react-site-migration` | **Date**: 2026-07-26 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-react-site-migration/spec.md`

## Summary

Replace the ~1,340-line Python generator (`scripts/generate_site.py` + `cv_parser.py`)
and the hand-maintained `assets/js/*.js` client behaviors with a Vite + React build.
The two existing JSON databases (`projects_database.json`, `experience_database.json`)
remain the single content source; page chrome (nav/sidebar/footer/head) becomes one
`Layout` component; client behaviors (theme, catalog filter/search, modals, email
obfuscation) become hooks/components. The build's output is written back into the
existing served paths at the repo root (`index.html`, `projects/*.html`,
`experience/**/*.html`, etc.) so nginx's `root /opt/personal-website` and the
`git push` → `git fetch && git reset --hard` deploy flow need no changes. Rollout is
staged: prove the approach on the projects section first (User Story 1), then migrate
the rest of the generated content (US2), then hand-authored pages and client JS (US3),
then bring test/sitemap coverage back to full parity as the go/no-go gate (US4).

## Technical Context

**Language/Version**: TypeScript/JavaScript (ES2022+) on Node.js v26 for the build;
Python 3 generator code is retired, not extended.

**Primary Dependencies**: Vite (build tool) + React 18+ for components; `ajv` for
build-time JSON Schema validation of the two content databases (FR-014, research.md
R8); existing `@primer/primitives` / `@primer/octicons` design-token and icon vendoring
carries over unchanged; existing Playwright + `@axe-core/playwright` for tests.

**Storage**: N/A — content lives in the two existing JSON files
(`scripts/projects_database.json`, `scripts/experience_database.json`), read at build
time, not at runtime. No database, no runtime storage.

**Testing**: Existing `tests/` Playwright suite (`tests/e2e/*.spec.ts`) and the
`tests/a11y/` axe-core audits, updated to run against the new build's rendered output.

**Target Platform**: Static files served by nginx on the existing GCP Compute Engine VM
(`/opt/personal-website`), consumed by desktop and mobile browsers. No server runtime.

**Project Type**: Static site generator (frontend-only; no backend/API surface).

**Performance Goals**: ≤ 50 KB gzipped of additional client-side JavaScript per page
versus today (SC-008) — enforced by the islands architecture (research.md R1: small,
independently-hydrated bundles only, no whole-page framework runtime).

**Constraints**: Build output MUST land at the same repository paths the site is
served from today (`index.html`, `projects/*.html`, `experience/**/*.html`, `cv/`,
`availability/`, `404.html`, `accessibility.html`) — nginx's `root` and `try_files`
config, and the git-push-based deploy flow, do not change (FR-010). No-JS behavior and
WCAG 2.1 AA MUST be preserved (FR-006, FR-007).

**Scale/Scope**: ~200 generated pages (22 projects + ~178 experience entries across 6
categories) + 6 hand-authored pages (home, CV hub, availability, accessibility, 404,
plus the out-of-scope wellness mini-app which this feature does not touch).

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Principle                                         | Status                      | Notes                                                                                                                                                                                                            |
| ------------------------------------------------- | --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| I. Static-First, No Runtime Server                | ⚠ Partial — justified below | Runtime guarantee (nginx serves static files, no app server, no DB) is fully preserved. The literal "no build step" clause is nominally violated: Vite build runs before commit/deploy. See Complexity Tracking. |
| II. Generated Content Is Source-of-Truth via JSON | ✅ Pass                     | This feature's entire point is enforcing this — FR-002, and it fixes the current partial violation (projects catalog duplicated into `assets/js/projects-catalog.js`) that principle II already prohibits.       |
| III. Primer Tokens Only, No Raw Hex               | ✅ Pass                     | `style.css` and vendored Primer tokens carry over unchanged (Assumption); components author against the same token set, no raw hex introduced.                                                                   |
| IV. Accessibility Is Non-Negotiable (WCAG 2.1 AA) | ✅ Pass                     | FR-007/SC-003, gated by the existing axe-core suite (US4).                                                                                                                                                       |
| V. Restraint Over Spectacle                       | ✅ Pass                     | Assumption states no intentional visual redesign; component decomposition must not introduce new decorative motion/animation beyond what exists today.                                                           |
| VI. Human-Only Git Authorship                     | ✅ Pass                     | Unaffected by this feature; husky hooks remain in place.                                                                                                                                                         |

**Gate result**: PASS with one justified, documented deviation (Principle I, literal
text only — see Complexity Tracking). No unjustified violations block Phase 0.

## Project Structure

### Documentation (this feature)

```text
specs/001-react-site-migration/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output
├── data-model.md         # Phase 1 output
├── quickstart.md         # Phase 1 output
├── contracts/            # Phase 1 output
│   └── url-contract.md
└── tasks.md               # Phase 2 output (/speckit-tasks — not created here)
```

### Source Code (repository root)

```text
site/                          # New Vite + React source (replaces scripts/generate_site.py, cv_parser.py, assets/js/*)
├── src/
│   ├── components/
│   │   ├── chrome/            # Layout, Nav, Sidebar, Footer, Head — the one reusable chrome unit (FR-003)
│   │   ├── catalog/           # Catalog list/filter/search UI shared by projects + experience
│   │   ├── detail/            # Shared detail-page shell (project detail, experience detail)
│   │   └── common/            # Modal, ThemePicker, StatusBadge, icon wrappers
│   ├── pages/                 # Hand-authored pages: Home, CvHub, Availability, Accessibility, NotFound
│   ├── hooks/                 # useTheme, useCatalogFilter, useEmailProtection, useModal
│   ├── content/                # Build-time readers: loadProjects(), loadExperience() over the JSON databases
│   │   └── schemas/            # project-entry.schema.json, experience-entry.schema.json (FR-014)
│   └── styles/                 # style.css + assets/css/primer/ imported as-is (Principle III)
├── vite.config.ts              # outDir configured to write into repo-root served paths, not a separate dist/
└── package.json                 # Or merged into existing root package.json — decided in research.md

scripts/
├── projects_database.json      # UNCHANGED — remains the source of truth (FR-002)
├── experience_database.json    # UNCHANGED
├── experience_schema.md        # UNCHANGED — canonical schema, referenced by data-model.md
└── generate-sitemap.mjs         # New: replaces the sitemap-writing portion of generate_site.py (FR-009)

# Retired at the end of migration (User Story 4 checkpoint), not deleted at US1:
# scripts/generate_site.py, scripts/cv_parser.py, assets/js/*.js

tests/                           # EXISTING Playwright + axe-core suite, updated in place (FR-008)
├── e2e/*.spec.ts
└── a11y/*.json + run-audit.mjs

wellness/                        # OUT OF SCOPE (FR-012) — untouched by every phase of this feature
```

**Structure Decision**: Single new `site/` source tree (frontend-only — there is no
backend/API split for this project). Existing `scripts/*_database.json`,
`scripts/experience_schema.md`, and `tests/` are reused in place rather than moved,
since they are already correct at their current paths and moving them would touch
files outside this feature's actual scope. The two legacy generators
(`generate_site.py`, `cv_parser.py`) and the legacy `assets/js/*` scripts are deleted
only once User Story 4 confirms full parity — not deleted as part of the User Story 1
proof-of-concept, per FR-011's staged rollout.

## Complexity Tracking

> Constitution Principle I literally bans "a build step." This section justifies why
> that text is not treated as a hard blocker here, rather than silently overriding it.

| Violation                                   | Why Needed                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | Simpler Alternative Rejected Because                                                                                                                                                                                                                                                                                                             |
| ------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Introducing a Vite build step before deploy | Hand-writing ~200 pages of JSX with no build tool is not meaningfully simpler than the 1,340-line Python generator it replaces — the whole point of this feature (FR-002, single source of truth, no hand-synced JS catalog) requires _some_ templating/build mechanism. The runtime guarantee Principle I actually protects (static files, no app server, no DB, unchanged nginx/deploy flow) is fully preserved — build output lands at the same served paths (FR-010), same as today's `generate_site.py` step already does before every commit. | Keeping the Python generator: rejected — it _is_ the problem this feature exists to fix (1,340 lines of custom logic, a catalog duplicated into hand-maintained JS, no component reuse). Writing raw HTML by hand for 200 pages: rejected — reintroduces the exact synchronization risk (Principle II) the current generator was built to avoid. |

**Follow-up (not blocking this plan)**: Principle I's wording should be tightened in a
future constitution amendment (PATCH-level: "no build step" → "no build step required
to _serve_ the site at runtime") to match what the principle's own Rationale has always
actually protected. Flagging here rather than editing the constitution as a side
effect of this plan.

## Constitution Check — Post-Design Re-check

Re-evaluated after Phase 1 (research.md + data-model.md + contracts/):

- The R1 decision (build-time SSG + hydrated islands, no client router, no full-page
  hydration) _strengthens_ compliance with Principle I's Rationale and the Performance
  Goals constraint versus a naive Vite+React SPA reading of the original ask — the
  runtime story ends up closer to today's "static HTML + a few small scripts," not
  further from it.
- No new violations introduced by the Phase 1 design. The single documented deviation
  (Complexity Tracking, above) is unchanged in scope.
- **Gate result**: PASS. Proceed to Phase 2 (`/speckit-tasks`).
