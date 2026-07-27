# Phase 0 Research: Migrate Site Generation to a Component-Based Build

## R1. Rendering model: CSR SPA vs. build-time SSG with hydrated islands

**Decision**: Render every page to full static HTML at build time (React used as a
templating engine via `react-dom/server`'s static-rendering API), then attach small,
independently-hydrated client bundles only to the specific interactive widgets (theme
picker, catalog filter/search, modals, email-address reveal). No client-side router,
no whole-page hydration.

**Rationale**: FR-006 requires navigation, default theme, and page content to keep
working with JavaScript disabled. A plain Vite + React single-page app is
client-rendered by default — with no JS, the page is blank, which fails FR-006
outright. Prerendering every route to real HTML at build time is the only way to keep
that guarantee while still using React components as the source of the markup. Islands
(hydrate only the interactive widgets) also matches the Performance Goals constraint
("no added client-side framework runtime cost") much more closely than shipping a full
React runtime to hydrate ~200 mostly-static pages — it mirrors what the current site
already does (small standalone `theme.js`, `*-catalog.js`, `cv-modal.js`,
`email-protection.js` files attached to otherwise-static HTML).

**Alternatives considered**:

- _Plain Vite + React CSR SPA_: rejected — breaks FR-006 (no-JS) and FR-004 (URLs must
  resolve to real content; a CSR app needs either a server or a rewrite rule per route
  to serve `index.html`, which the current nginx `try_files $uri $uri.html` config
  isn't set up for without changes to FR-010's "no deploy changes" constraint).
- _`vite-react-ssg` (Vite + React Router SSG plugin)_: viable, but pulls in a client
  router this site doesn't need (pages are independent documents, not an app with
  client-side transitions) and its hydration model hydrates full pages rather than
  islands. Rejected in favor of the lighter, more targeted islands approach — revisit
  only if the custom approach proves harder to maintain than expected.
- _Astro_: would give SSG + islands out of the box and is arguably a more natural fit,
  but the user's own scoping explicitly chose Vite + React. Noted as a fallback if the
  custom `react-dom/server` approach hits friction during User Story 1's
  proof-of-concept.

## R2. Build output location

**Decision**: Configure the build to write generated files directly to the existing
served paths at the repo root (`index.html`, `projects/*.html`,
`experience/**/*.html`, `cv/index.html`, `availability/index.html`,
`accessibility.html`, `404.html`) — the same paths `generate_site.py` writes to today
— rather than a separate `dist/` directory.

**Rationale**: nginx's `root /opt/personal-website` and `try_files $uri $uri/
$uri.html =404` (`infra/nginx/sites-enabled/showcase`) are fixed, and FR-010 requires
the deploy process to gain no new manual steps. Writing to a `dist/` folder would
require either changing nginx's root (a deploy/infra change FR-010 rules out) or an
extra copy/sync step. Writing straight to the served paths keeps the exact same
"build, commit, `git push`, `git fetch && reset --hard` on the VM" flow that exists
today — the build step simply replaces `python3 generate_site.py` as the thing run
before committing generated output.

**Alternatives considered**:

- _Separate `dist/` + nginx root change_: rejected — out of scope per FR-010, and adds
  an infra change unrelated to this feature's actual goal.
- _Build-and-copy script (`dist/` → repo root)_: rejected as unnecessary indirection —
  configuring Vite's `build.outDir`/`build.rollupOptions.output` (or, for the
  non-bundled per-page HTML output, a small custom write step) to target the real
  paths directly is simpler and has one fewer failure mode.

## R3. Client interactivity: hooks vs. direct ports of existing scripts

**Decision**: Reimplement each existing behavior as a small, independently-mountable
React component + hook, one per current script (`useTheme` / `ThemePicker` from
`theme.js`, `useCatalogFilter` / `CatalogFilter` from `*-catalog.js`, `useModal` /
`Modal` from `cv-modal.js`, `useEmailProtection` from `email-protection.js`), each
hydrated independently onto its existing DOM anchor rather than as part of one
whole-page React tree.

**Rationale**: Consistent with R1's islands decision — keeps bundles small and
per-feature, and keeps a 1:1 mapping to today's scripts so behavior parity (FR-005) is
easy to verify feature-by-feature during User Story 3.

**Alternatives considered**: Porting the scripts as plain TypeScript (no React)
was considered for the lowest-risk option, since none of them strictly need a
component model. Rejected only because the catalog filter/search UI benefits from
React's state handling for the filtered list re-render, and using React consistently
for all interactive pieces (rather than a mix of React + vanilla) keeps one mental
model for future maintenance — but this is a low-stakes choice; if a given behavior
turns out simpler as plain TS during implementation, that's a fine local deviation.

## R4. Pre-rendered HTML content fields (`content_html`)

**Decision**: Continue treating `content_html` in `projects_database.json` (and the
equivalent rendered bodies in the experience data) as trusted, pre-sanitized HTML
authored by the maintainer's own pipeline, injected via React's raw-HTML escape hatch
at render time. No new sanitization layer is introduced.

**Rationale**: This field is not user input — it's produced by the maintainer's own
existing content pipeline from LaTeX/authored source, the same trust boundary that
exists today (the Python generator already writes it into pages unescaped). Adding
sanitization would be new, unrequested scope with no corresponding requirement.

**Alternatives considered**: Re-deriving these fields from source Markdown/LaTeX at
build time instead of consuming pre-rendered HTML — rejected, out of scope; FR-002
only requires the JSON databases to remain the source of truth for build _input_, not
a change to how that HTML is produced upstream.

## R5. Sitemap generation

**Decision**: Replace the sitemap-writing portion of `generate_site.py` with a small
Node script that derives the URL list from the exact same route manifest the SSG build
step produces (not a separately hand-enumerated list), writing `sitemap.xml` at the
repo root as today.

**Rationale**: Deriving the sitemap from the actual set of rendered routes makes
FR-009/SC-001 (sitemap always matches real URLs) structurally guaranteed rather than
something that can drift if a route list is maintained twice — the same class of
duplication problem this whole feature exists to eliminate (Principle II).

**Alternatives considered**: Keeping `generate_sitemap()` in Python, run as a
post-build step reading the same JSON databases independently — rejected, since it
would re-introduce a second, separately-maintained enumeration of routes instead of
reading them from the one place the build already knows them.

## R6. Test suite adaptation strategy

**Decision**: Keep `tests/e2e/*.spec.ts` and `tests/a11y/` as-is at the framework
level (Playwright + `@axe-core/playwright`); update only the selectors/assertions that
break due to markup changes from the new components, verified page-by-page as each
User Story lands (US1 covers `/projects/`, US2 the rest of generated content, US3 the
hand-authored pages and interactive behaviors, US4 is the full-suite regression gate).

**Rationale**: FR-008 requires the _existing_ suite to keep passing with equivalent
coverage — rewriting it from scratch would both violate that requirement's intent and
throw away already-correct behavioral assertions. Since this migration is explicitly
not a redesign (Assumptions), most Playwright selectors keyed on stable class
names/roles should survive if the component migration preserves existing class names
per `DESIGN.md` rule 5 ("Keep existing class names / IDs").

**Alternatives considered**: A full test-suite rewrite alongside the migration —
rejected as unnecessary added scope and risk; only touch a test when its target markup
actually changes.

## R8. Content validation: JSON Schema vs. protobuf vs. no validation

**Decision**: Validate both content databases against a JSON Schema at build time
(via `ajv`, the de-facto standard JSON Schema validator for Node — small, no codegen
step, plain-JS API), failing the build with a per-entry/per-field error on mismatch.

**Rationale**: FR-014 needs a build-time correctness gate for the two hand-edited
databases. Protobuf was raised and rejected as the mechanism: it solves cross-service
wire compatibility, which doesn't exist here (single build process, local files, no
network boundary), and it would break hand-editability (JSON authoring would have to
go through protobuf's JSON mapping or prototext instead of being the format itself).
JSON Schema validates the exact same JSON files in place — zero authoring change,
zero new file format, matching FR-002/Constitution Principle II exactly.

**Alternatives considered**:

- _`zod` / `io-ts` (TypeScript-first runtime validators)_: viable, and arguably nicer
  if the build's data-loading code (`src/content/`) is itself TypeScript — gives
  inferred types for free. Worth revisiting during implementation as a substitute for
  `ajv` specifically (same JSON Schema _concept_, different library); not a different
  decision at the plan level since either satisfies FR-014 identically.
- _No validation (status quo)_: rejected — this was the actual problem FR-014 exists
  to close; a malformed entry today fails silently or produces a broken page, only
  caught by visual inspection.
- _Protobuf_: rejected — see Rationale above.

## R7. Where new tooling lives (`package.json` / workspace layout)

**Decision**: Add Vite/React as `devDependencies`/`dependencies` of the existing root
`package.json` rather than introducing a separate package/workspace for `site/`. The
existing `tests/` directory keeps its own separate `package.json` (already the case
today, on its own pnpm lockfile) since it's a genuinely separate toolchain (Playwright
runner) from the site build.

**Rationale**: This is a single small static site, not a monorepo — a second workspace
adds tooling overhead (multiple lockfiles, workspace config) with no corresponding
benefit at this scale. `tests/` already being separate is an existing, working
convention worth leaving alone rather than folding in as part of this feature.

**Alternatives considered**: A `site/package.json` + npm/pnpm workspaces setup —
rejected as premature structure for a project this size; revisit only if `site/`
tooling and root tooling (prettier, husky, lint-staged) start genuinely conflicting.
