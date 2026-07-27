# Quickstart: Validating the Migration

Prerequisites: Node.js v26 (already in use for this repo's tooling), the existing repo
checkout, no new accounts/services required (this feature is build-tooling only).

## 1. Validate the User Story 1 proof-of-concept (projects section)

```bash
npm install
npm run build:site   # named to avoid colliding with the existing root "dev" script (tasks.md T005)
```

**Expected outcome**: `projects/index.html` and every `projects/<slug>.html` listed in
[contracts/url-contract.md](contracts/url-contract.md) are written to their existing
repo-root paths, unchanged in visible content from the pre-migration versions. Compare
manually or via `git diff --stat projects/` immediately after a clean build with no
data changes — expect no unexpected structural diff, only whitespace/attribute
changes attributable to the new renderer.

## 2. Confirm no-JS behavior (FR-006)

```bash
npx playwright test --project=chromium -g "no-js" 2>/dev/null || true
```

Or manually: open a built page with the browser's JavaScript disabled and confirm
navigation, default theme, and content are all present — per data-model.md's Page
Chrome section, the theme-init snippet and page content must not depend on any script
execution to appear correctly.

## 3. Run the existing accessibility suite against the new build (FR-007, SC-003)

```bash
cd tests
node a11y/run-audit.mjs http://localhost:<preview-port>/projects/ a11y/detail-projects.json
```

Serve the built output locally first (e.g. `python3 -m http.server` from the repo
root, matching the existing `npm run dev` pattern) before pointing the audit at it.
Expect 0 violations, matching the `wcag2a`/`wcag2aa` tag scope already configured in
`tests/a11y/run-audit.mjs`.

## 4. Run the existing end-to-end suite (FR-008, SC-004)

```bash
cd tests
npx playwright test
```

Expect all specs in `tests/e2e/*.spec.ts` to pass. Any failure due to a changed
selector (not changed behavior) should be fixed in the test, per research.md R6 — a
behavior change is a real regression and blocks the migration.

## 5. Confirm URL parity (FR-004, SC-001)

Walk every route in [contracts/url-contract.md](contracts/url-contract.md)'s route
inventory table and confirm it resolves. For the generated sections, this can be
scripted by diffing the new build's route manifest against the pre-migration
`sitemap.xml`.

## 6. Confirm the sitemap is derived, not stale (FR-009)

```bash
diff <(curl -s https://agreddy.com/sitemap.xml | grep -o '<loc>[^<]*' ) \
     <(grep -o '<loc>[^<]*' sitemap.xml)   # after a local build
```

Expect no entries missing and no stale entries once the migration is content-complete
(User Story 2+); during the User Story 1 proof-of-concept, expect the sitemap to still
be produced by the old generator, since only `/projects/` has moved (research.md R5,
mixed-stack transition per spec.md FR-013).

## Go/no-go gate (User Story 4)

Full parity is confirmed — and the legacy `scripts/generate_site.py`, `cv_parser.py`,
and `assets/js/*` are safe to delete — only once steps 2–6 above all pass with zero
new violations/failures across the **entire** site, not just the User Story 1 slice.
