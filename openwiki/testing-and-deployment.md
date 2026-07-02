# Testing and Deployment

This repository uses browser tests and lightweight operational checks rather than a conventional build pipeline. The public site is static, so verification focuses on HTML structure, JS interactions, accessibility, and production delivery.

## Test stack

### Root scripts

The root `package.json` defines the site’s developer workflow:

- `npm run dev` → `python3 -m http.server 8080`
- `npm run format` → Prettier across the repository
- `npm run prepare` → Husky setup

### Browser tests

`tests/package.json` defines a Playwright-based suite with:

- `npm test`
- `npm run test:desktop`
- `npm run test:mobile`

The Playwright suite checks both content and interactions. Important specs include:

- `tests/e2e/nav-integrity.spec.ts` — verifies the five-item nav across page families
- `tests/e2e/experience-listing.spec.ts` — checks listing filters, search, sorting, ARIA state, empty state, and timeline grouping
- `tests/e2e/experience-detail.spec.ts` — checks detail-page structure and back-navigation
- `tests/e2e/smoke.spec.ts` — basic availability smoke checks

### Accessibility audits

`tests/a11y/` contains JSON outputs and a runner script for axe-based audits. These files appear to store baseline or recorded results for the experience listing and detail pages.

## What to run when changing things

### Shared navigation or layout

Run the nav integrity and smoke coverage, then spot-check affected pages:

- `tests/e2e/nav-integrity.spec.ts`
- `tests/e2e/smoke.spec.ts`

### Experience listing or schema changes

Run the experience listing and detail tests:

- `tests/e2e/experience-listing.spec.ts`
- `tests/e2e/experience-detail.spec.ts`

These are especially important if you change:

- the experience schema
- filter labels or categories
- org/year formatting
- detail page generation

### Visual / UI changes

Because shared CSS and JS are used site-wide, test both desktop and mobile flows after changes to:

- `assets/css/style.css`
- `assets/js/theme.js`
- `assets/js/cursor-glow.js`
- `assets/js/status-badge.js`
- `assets/js/projects-catalog.js`
- `assets/js/experience-catalog.js`

## Deployment model

Production is a static checkout on a GCP VM at `/opt/personal-website/`. The repository’s README and `AGENTS.md` both state that deployment is Git-based:

1. push to `main`
2. update the production checkout with `git fetch` + `git reset --hard origin/main`

There is no public-site build step. Nginx serves the checked-out files directly.

## Nginx and analytics

`infra/nginx/README.md` explains the tracked Nginx config snapshot and deploy script.

Important operational points:

- live config is the source of truth on the VM, the repo stores snapshots for recovery
- the CSP must keep GA4 endpoints in `connect-src`
- `./infra/nginx/deploy.sh` validates and reloads nginx
- `./scripts/verify_ga4.py` is the smoke test for analytics connectivity

## Change guidance for future agents

Before committing changes that touch shared content or UI:

1. run the relevant Playwright tests
2. inspect the generated HTML diffs for unintended rewrites
3. verify the site still loads locally via a simple HTTP server
4. if deployment or CSP changed, run the GA4 verification script

## Source map

### Source files

- `package.json`
- `tests/package.json`
- `tests/e2e/nav-integrity.spec.ts`
- `tests/e2e/experience-listing.spec.ts`
- `tests/e2e/experience-detail.spec.ts`
- `tests/e2e/smoke.spec.ts`
- `tests/a11y/run-audit.mjs`
- `tests/a11y/*.json`
- `README.md`
- `AGENTS.md`
- `infra/nginx/README.md`
- `scripts/verify_ga4.py`

### Git evidence

- `01a435d fix(a11y): resolve skipped heading levels in listings`
- `6084ad6 fix(mobile): tighten TOC gap, refactor projects-catalog to DOM API`
- `c064a2f fix: stop cross-toggle between filter and TOC buttons on mobile`
- `e45716e fix: collapse mobile 'On this page' TOC when aria-expanded=false`
