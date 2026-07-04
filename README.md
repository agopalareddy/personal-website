# Aadarsha Gopala Reddy — Personal Website _(personal-website)_

Static personal website and project archive for agreddy.com, built with HTML, CSS, and JavaScript.

The site presents projects, research and teaching experience, CV/resume documents, and
availability, served as a static Nginx site on Google Cloud Compute Engine with no
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
- Keep public PDFs intentional — anything in `files/` can be served by the web server.
- See [ACCESSIBILITY.md](ACCESSIBILITY.md) for the WCAG statement.

## Background

- Shared design tokens and component styles live in `assets/css/style.css`.
- Client-side behavior (theme selection, email protection, catalog filtering, PDF
  previews) lives in `assets/js/`.
- Project and experience detail pages are generated from JSON sources under `scripts/`
  and must not be edited directly — see `scripts/generate_site.py`.
- Tracked snapshots of the production Nginx configuration live under `infra/nginx/`.

```text
personal-website/
├── index.html                  # Home page
├── projects/                   # Projects catalog and generated detail pages
├── experience/                 # Experience catalog and generated detail pages
├── cv/                         # CV and resume document hub
├── availability/               # Public availability page
├── assets/
│   ├── css/                    # Site-wide design system and page styles
│   ├── fonts/                  # Self-hosted font files
│   └── js/                     # Theme, catalogs, modals, and email protection
├── files/                      # Public PDFs and LaTeX source directories
├── images/                     # Site images, icons, and manifest assets
├── scripts/                    # Content databases and generators
├── tests/                      # Playwright test suite
└── infra/nginx/                # Production Nginx config snapshots and deploy script
```

## Install

Requires Node.js (for tooling) and Python 3 (for content generation and local serving).

```bash
npm install
```

### Dependencies

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

Regenerate project or experience pages from their JSON databases:

```bash
python3 scripts/generate_site.py --projects
python3 scripts/generate_site.py --experiences
```

Run the GA4 Realtime API smoke test:

```bash
./scripts/verify_ga4.py
```

## Content Workflows

### Projects

Project metadata lives in `scripts/projects_database.json`. After editing, regenerate:

```bash
python3 scripts/generate_site.py --projects
```

This writes detail pages into `projects/` and updates the JSON payload used by
`projects/index.html`. `assets/js/projects-catalog.js` holds a second, hand-maintained
copy of the project list and must be updated to match.

### Experience

Experience metadata lives in `scripts/experience_database.json`. After editing,
regenerate:

```bash
python3 scripts/generate_site.py --experiences
```

This writes detail pages into `experience/`, updates the listing page data, and
refreshes the sitemap.

### CV, Resume, and Cover Letter PDFs

Public PDFs are stored in `files/`. LaTeX source lives in `files/cv_tex/`,
`files/resume_tex/`, and `files/cover_tex/`.

Build a document from its source directory:

```bash
latexmk -pdf <document>.tex
```

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

Production is a static Git checkout at `/opt/personal-website/` on the GCP VM.
Deployments are Git-based; do not copy site files with `scp`.

```bash
git push origin main
ssh gcp-showcase "cd /opt/personal-website && git fetch origin && git reset --hard origin/main"
```

There is no build step for the public site — Nginx serves files directly from the
checked-out repository. After changing CSS, bump the `style.css?v=` query string in
HTML files when browser cache invalidation is needed.

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

- [Font Awesome](https://fontawesome.com/) for iconography.
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
