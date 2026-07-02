# AGENTS.md — personal-website (agreddy.com)

> Agent reference for the static personal site at `https://agreddy.com/`.
> GitHub: `agopalareddy/personal-website` · GCP path: `/opt/personal-website/` · Branch: `main`

---

## OpenWiki documentation (required reading)

This repo has auto-generated documentation under **`openwiki/`**. It covers architecture,
design system, interactive components, content pipelines, operations, testing, and common
workflows. **Read `openwiki/quickstart.md` first** — it links to every major section.

If you are an agent, start at `openwiki/quickstart.md` before making code changes.

**Keep OpenWiki updated.** After any significant change (new component, modified pipeline,
CSS token change, nginx config change, new test), run:

```bash
openwiki --update "brief description of what changed"
```

This will re-scan the diff and update only the affected pages. If you don't have the
`openwiki` CLI, review the changed files and update the relevant `openwiki/` pages manually.

---

## Git commit authorship (required)

Never add Cursor or any AI tool as author or co-author on commits. Enforced by `.husky/commit-msg` and `.husky/prepare-commit-msg`. Verify: `git log -1 --format='%B'`.

---

## Deploy

Static site — no build step.

```bash
git push origin main
ssh gcp-showcase "cd /opt/personal-website && git fetch origin && git reset --hard origin/main"
```

After CSS changes, bump `style.css?v=` in HTML heads when cache invalidation is needed.

Root-owned PDF on VM? `ssh gcp-showcase "sudo chown adurs:adurs /opt/personal-website/files/<name>.pdf"`

### Updating TeX PDFs (resume, CV, cover letter)

Tex source in `files/*_tex/`. Flat copy required in `files/` for serving:

```bash
cp files/cv_tex/reddy_cv.pdf files/reddy_cv.pdf
cp files/resume_tex/reddy_resume.pdf files/reddy_resume.pdf
cp files/cover_tex/reddy_cover.pdf files/reddy_cover.pdf
git add files/reddy_*.pdf files/*_tex/reddy_*.pdf
```

### LaTeX compilation

Always recompile after `.tex`/`.sty` edits. Two-pass `pdflatex`, clean artifacts:

```bash
cd files/cv_tex  # or resume_tex, cover_tex
pdflatex reddy_cv.tex && pdflatex reddy_cv.tex
rm -f *.aux *.log *.out *.fls *.fdb_latexmk *.synctex.gz
```

### Fixing orphaned entries

Orphans visible only in rendered PDF — never guess from `.tex`. Compile → inspect PDF page-by-page → add `\needspace{N\baselineskip}` → iterate until clean.

---

## Key paths

| Path                              | Purpose                                              |
| --------------------------------- | ---------------------------------------------------- |
| `assets/css/style.css`            | Design tokens, components, layouts (`@layer tokens`) |
| `assets/js/theme.js`              | 3-state theme slider                                 |
| `assets/js/projects-catalog.js`   | Projects renderer — **separate hardcoded array**     |
| `assets/js/experience-catalog.js` | Experience renderer                                  |
| `accessibility.html`              | WCAG statement — update on a11y changes              |
| `infra/nginx/`                    | VM nginx config snapshots + `deploy.sh`              |
| `scripts/verify_ga4.py`           | GA4 Realtime API smoke test                          |

---

## Adding a new project (two catalogs!)

`/projects/` page has two independent copies of the project list. Both must be updated:

1. `scripts/projects_database.json` — source of truth. Run `cd scripts && python3 generate_site.py --projects`. **After:** `git diff` and revert unintended detail-page rewrites.
2. `assets/js/projects-catalog.js` — JS renderer. Manually append the same entry.

---

## Nginx & CSP

Nginx config lives in `infra/nginx/`. Deploy: `./infra/nginx/deploy.sh`.

CSP `connect-src` **must** include GA4 endpoints or `g/collect` is silently blocked:

```
connect-src 'self' https://www.google-analytics.com https://www.google.com https://*.analytics.google.com https://www.googletagmanager.com
```

If you tighten CSP, re-run `./scripts/verify_ga4.py`.

---

## GA4 smoke test

`./scripts/verify_ga4.py` — GA4 Realtime API smoke test. Auth via service account key at `~/.config/gcp/ga-verifier.json` (gitignored). Exit 0 = OK. Run with `--help` for options.
