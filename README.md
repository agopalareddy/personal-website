# Aadarsha Gopala Reddy — Personal Website _(personal-website)_

Static personal website and project archive for agreddy.com, rendered at build time from React and served as plain HTML.

The site presents projects, research and teaching experience, CV/resume documents, and
availability, served as a static Nginx site on a Contabo Cloud VPS with no
runtime application server. Content for projects and experience is generated from JSON
databases in `scripts/`; end-to-end coverage lives under `tests/` using Playwright.

## Table of Contents

- [Security](#security)
- [Background](#background)
- [Install](#install)
- [Usage](#usage)
  - [CLI](#cli)
- [Content Workflows](#content-workflows)
- [Testing](#testing)
- [Deployment](#deployment)
- [Nginx and Analytics](#nginx-and-analytics)
- [Thanks](#thanks)
- [Maintainers](#maintainers)
- [Contributing](#contributing)
- [License](#license)

## Security

- Public hosting is HTTPS-only with security headers configured in Nginx.
- Email addresses are rendered client-side by `assets/js/email-protection.js`.
- External links opened in a new tab use `rel="noopener"`.
- Do not commit `.env` files, private keys, service-account keys, or temporary build
  artifacts.
- Keep public PDFs intentional — anything tracked in `files/` is served by the web server.
  Cover letters, references and the LinkedIn export are gitignored and stay local;
  `tests/e2e/private-files.spec.ts` checks that they return 404 in production.
- The phone number is not in any tracked file. The CV and resume read it from a
  gitignored `files/private_contact.tex` and print it only in copies built for an
  employer.
- See [ACCESSIBILITY.md](ACCESSIBILITY.md) for the WCAG statement.

## Background

- The design system is GitHub Primer: tokens are vendored from `@primer/primitives` into
  `assets/css/primer/`, icons are inline Octicons, and `assets/css/style.css` uses only
  Primer functional tokens. See [DESIGN.md](DESIGN.md).
- The site is built from React components in `site/src/` via `site/build/render.mjs`
  (`react-dom/server`), which writes static HTML directly to the repo-root paths Nginx
  serves. Small interactive behaviors (theme selection, email protection, catalog
  filtering, PDF previews) are hydrated "islands" bundled by Vite into `assets/site/`.
- Project and experience detail pages are generated from JSON sources under `scripts/`
  and must not be edited directly — see [Content Workflows](#content-workflows).
- Tracked snapshots of the production Nginx configuration live under `infra/nginx/`.

```text
personal-website/
├── index.html                  # Home page
├── projects/                   # Projects catalog and generated detail pages
├── experience/                 # Experience catalog and generated detail pages
├── cv/                         # CV and resume document hub
├── availability/               # Public availability page
├── assets/
│   ├── css/                    # Vendored Primer tokens and site styles
│   ├── js/                     # Legacy scripts still used by out-of-scope /files/ pages
│   └── site/                   # Vite-built hydration island bundles (generated)
├── site/                       # React components, pages, and the build script
├── files/                      # Public CV/resume PDFs and their LaTeX sources
├── images/                     # Site images, CV thumbnails, icons, manifest assets
├── scripts/                    # Content databases and content-adjacent tooling
├── tests/                      # Playwright test suite
└── infra/nginx/                # Production Nginx config snapshots and deploy script
```

## Install

Requires Node.js (for the site build and tooling) and Python 3 (for local serving and
auxiliary scripts like `verify_ga4.py`).

```bash
npm install
```

### Dependencies

- `npm run build:site` calls `pdfinfo` and `pdftoppm` (poppler-utils) to read each CV
  PDF's page count and render its page-1 thumbnail for `/cv/`.
- Playwright end-to-end tests have their own dependency set — see
  [Testing](#testing).
- GA4 verification (`scripts/verify_ga4.py`) needs a service-account key at
  `~/.config/gcp/ga-verifier.json` (gitignored, not installed by `npm install`).

## Usage

Serve the site locally from the repository root:

```bash
python3 -m http.server 8000
```

Open [http://localhost:8000](http://localhost:8000). Use a local server instead of
opening files directly so relative paths, PDF previews, and browser security behavior
match production.

### CLI

Format HTML, CSS, JavaScript, JSON, and Markdown with Prettier:

```bash
npm run format
```

Rebuild the entire site from its React components and JSON databases:

```bash
npm run build:site
```

Run the GA4 Realtime API smoke test:

```bash
./scripts/verify_ga4.py
```

## Content Workflows

### Projects

Project metadata lives in `scripts/projects_database.json` — the single source of
truth (no second hand-maintained copy). After editing, rebuild:

```bash
npm run build:site
```

This writes `projects/index.html` and every `has_detail: true` entry's detail page,
and regenerates `sitemap.xml` from the build's own route manifest.

A project can open its detail page with a `figure` (one WebP image with a caption) or a
`pipeline` (a staged flow diagram drawn in HTML, so it follows the theme and stays
legible on phones). Cross-links to experience entries are set once, in each experience
entry's `related_projects` list; the build fails if a slug has no detail page.

### Experience

Experience metadata lives in `scripts/experience_database.json`. After editing,
rebuild:

```bash
npm run build:site
```

This writes `experience/index.html`, every entry's detail page, and regenerates
`sitemap.xml`. An entry may list `people` (role and name), shown in its About column
and included in search.

When an entry's URL changes or two entries merge, add a 301 for the old path to
`infra/nginx/sites-enabled/showcase`.

### CV and Resume PDFs

Public PDFs are stored in `files/`. LaTeX source lives in `files/cv_tex/` and
`files/resume_tex/`; `files/cover_tex/` is local only.

Build a document from its source directory (the resume needs `xelatex`, since it loads
Lato through `fontspec`):

```bash
latexmk -pdf reddy_cv.tex
latexmk -xelatex reddy_resume.tex
```

The `/cv/` page reads its "Updated" date from git and its page counts, thumbnails and
section lists from the PDFs and `.tex` files, so rebuild the site after committing a
document change.

Clean LaTeX auxiliary files before committing:

```bash
rm -f *.aux *.log *.fls *.fdb_latexmk *.out *.synctex.gz
```

## Testing

Install test dependencies from `tests/` if needed:

```bash
cd tests
npm install
```

Serve the site locally from the repository root, then run Playwright from `tests/`:

```bash
PLAYWRIGHT_TEST_BASE_URL=http://127.0.0.1:8000 npm test
```

Run one viewport group:

```bash
npm run test:desktop
npm run test:mobile
```

## Deployment

Production is a static Git checkout at `/opt/personal-website/` on the showcase VM.
Deployments are Git-based; do not copy site files with `scp`.

```bash
git push origin main
ssh contabo-showcase "cd /opt/personal-website && git fetch origin && git reset --hard origin/main"
```

There is no build step on the server — the generated HTML is committed, and Nginx
serves files directly from the checked-out repository. Cache busting is automated:
`npm run cache:bump` (or the `pre-commit` hook, which runs it whenever `style.css` or
another shared chrome asset is staged) rewrites every `?v=` query string to a content
hash of the changed file, so there's nothing to bump by hand.

## Nginx and Analytics

The tracked Nginx configuration snapshot is in `infra/nginx/`.

```bash
./infra/nginx/deploy.sh
```

CSP `connect-src` must include the GA4 endpoints or `g/collect` is silently blocked.
Re-run the verifier after tightening CSP:

```bash
./scripts/verify_ga4.py
```

## Thanks

- [Primer](https://primer.style/) design tokens and
  [Octicons](https://primer.style/octicons/) for the design system and icons.
- [Playwright](https://playwright.dev/) and [Axe](https://github.com/dequelabs/axe-core)
  for end-to-end and accessibility testing.

## Maintainers

[@agopalareddy](https://github.com/agopalareddy)

## Contributing

This is a personal site; issues and small PRs (typos, accessibility fixes, broken
links) are welcome via
[GitHub Issues](https://github.com/agopalareddy/personal-website/issues).

Commit hooks block AI co-author trailers on commits — human authorship only. Run
`npm run format` before committing.

## License

[MIT](LICENSE) © Aadarsha Gopala Reddy
