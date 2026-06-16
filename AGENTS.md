# AGENTS.md — personal-website (agreddy.com)

> Agent reference for the static personal site at `https://agreddy.com/`.
> GitHub: `agopalareddy/personal-website` · GCP path: `/opt/personal-website/` · Branch: `main`

---

## Git commit authorship (required)

**Never add Cursor or any AI tool as author or co-author on commits.**

- Do **not** append `Co-authored-by: Cursor <cursoragent@cursor.com>` (or similar) to commit messages.
- Do **not** set git `user.name` / `user.email` to Cursor or agent identities.
- Commits must list only the repository owner as author. The human user owns all authorship.
- Before pushing, verify with: `git log -1 --format='%B'` — the body must not contain `Co-authored-by:` lines for agents.
- If co-author trailers were added by mistake, rewrite history to remove them before pushing (or force-push after user approval if already on remote).
- **Enforced locally:** `.husky/commit-msg` and `.husky/prepare-commit-msg` strip `Co-authored-by: Cursor <cursoragent@cursor.com>` on every commit. Do not disable these hooks.

---

## Deploy

Static site — no build step.

```bash
git push origin main
ssh gcp-showcase "cd /opt/personal-website && git fetch origin && git reset --hard origin/main"
```

After CSS changes, bump `style.css?v=` in HTML heads when cache invalidation is needed.

### Updating the resume PDF

The resume PDF lives in **two places** in the repo — both must be identical or the served file will be stale:

| Repo path                           | Served URL                                              |
| ----------------------------------- | ------------------------------------------------------- |
| `files/reddy_resume.pdf`            | `https://agreddy.com/files/reddy_resume.pdf`            |
| `files/resume_tex/reddy_resume.pdf` | `https://agreddy.com/files/resume_tex/reddy_resume.pdf` |

After recompiling the `.tex`, copy the PDF to the flat path before committing:

```bash
cp files/resume_tex/reddy_resume.pdf files/reddy_resume.pdf
git add files/reddy_resume.pdf files/resume_tex/reddy_resume.pdf
```

**Root-ownership gotcha:** if `files/reddy_resume.pdf` ever becomes `root`-owned on the VM (e.g. from a past scp-as-root), `git reset --hard` silently skips it. Fix with:

```bash
ssh gcp-showcase "sudo chown adurs:adurs /opt/personal-website/files/reddy_resume.pdf"
```

Then re-run the deploy command and the correct file will land.

---

## Key paths

| Path                              | Purpose                                                                                                                      |
| --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `assets/css/style.css`            | Design tokens, components, layouts (`@layer tokens`)                                                                         |
| `assets/js/theme.js`              | 3-state theme slider, `data-resolved-theme`, dynamic `theme-color`                                                           |
| `assets/js/projects-catalog.js`   | Projects listing renderer — **has its own hardcoded `projects` array, separate from the JSON blob in `projects/index.html`** |
| `assets/js/experience-catalog.js` | Experience listing renderer                                                                                                  |
| `accessibility.html`              | WCAG statement — update when a11y-affecting changes ship                                                                     |
| `infra/nginx/`                    | Tracked snapshots of VM nginx configs + deploy script (see below)                                                            |
| `scripts/verify_ga4.py`           | GA4 Realtime API smoke test (see below)                                                                                      |

See workspace [`AGENTS.md`](../AGENTS.md) §12–13 for accessibility statement and email obfuscation rules.

---

## Adding a new project (two catalogs!)

The `/projects/` page has **two independent copies of the project list** — both must be updated or the new project won't show up for JS-enabled visitors:

1. **`scripts/projects_database.json`** — source of truth. Add an entry, then run:

   ```bash
   cd scripts && python3 generate_site.py --projects
   ```

   This regenerates `projects/index.html` (embedded JSON + noscript fallback cards), the detail page `projects/<slug>.html`, and `sitemap.xml`.
   ⚠️ The generator currently rewrites _all_ project detail pages to an older template (missing GA tag, wrong CSS version). After running, `git diff` and revert any detail pages you didn't intend to touch — only keep the new page and `projects/index.html`/`sitemap.xml` changes.

2. **`assets/js/projects-catalog.js`** — the _actual_ renderer for JS-enabled browsers. It has its own hardcoded `const projects = [...]` array that the generator does **not** touch. Manually append the same entry here (same fields/shape) or the card silently won't render even though the SSR HTML and curl output look correct.

If a project includes a live demo app reachable via an nginx reverse-proxy path (e.g. `/speedtest/`), see "Nginx infrastructure" below for adding the proxy `location` block and `infra/nginx/deploy.sh`.

---

## Nginx infrastructure (tracked in repo)

The VM's nginx config for agreshow.com lives in **`infra/nginx/`** (snapshotted from the live VM).

| File / dir                                 | Live VM path                              | Notes                                       |
| ------------------------------------------ | ----------------------------------------- | ------------------------------------------- |
| `infra/nginx/conf.d/security-headers.conf` | `/etc/nginx/conf.d/security-headers.conf` | CSP, HSTS, X-Frame-Options, etc.            |
| `infra/nginx/sites-enabled/showcase`       | `/etc/nginx/sites-enabled/showcase`       | Server block + reverse proxies for sub-apps |

**Deploy** after editing:

```bash
./infra/nginx/deploy.sh
```

The script:

1. `scp`'s both files to the VM.
2. Uses `sudo install -m 644` to drop them in place (idempotent).
3. Runs `sudo nginx -t` (refuses to reload on syntax error).
4. Reloads with `sudo nginx -s reload`.
5. Verifies the live CSP includes `google-analytics.com` — catches the GA4 regression that bit us in 2026-06.

Certbot-managed blocks (TLS certs) are **not** in the repo; they're auto-regenerated by certbot and would only add noise.

### CSP & GA4 (important)

The CSP `connect-src` directive **must** include the GA4 endpoints, otherwise the gtag load succeeds but `g/collect` is silently blocked:

```
connect-src 'self' https://www.google-analytics.com https://www.google.com https://*.analytics.google.com https://www.googletagmanager.com
```

If you ever tighten CSP, re-run `./scripts/verify_ga4.py` to confirm hits still flow.

---

## GA4 smoke test

`scripts/verify_ga4.py` hits the GA4 Realtime API to confirm the tag is firing live.

**Auth:** uses a service-account key at `~/.config/gcp/ga-verifier.json` (chmod 600, gitignored). Mints a short-lived JWT with `analytics.readonly` scope and exchanges it for an OAuth token. **No application-default credentials needed.**

**Property:** defaults to GA4 property `539267802` (Project Showcase, G-QWNGSMS0LY, agreshow.com data stream). Override with `--property-id` or `GA4_PROPERTY_ID` env var.

**Usage:**

```bash
# Default: check agreshow.com property, fail if no active users
./scripts/verify_ga4.py

# Quiet mode for cron / CI
./scripts/verify_ga4.py --quiet

# Different property / key file
./scripts/verify_ga4.py --property-id 123456789 --key-file ~/.config/gcp/other.json

# Wait for at least 2 active users (e.g. after announcing on socials)
./scripts/verify_ga4.py --expect-min-users 2
```

**Exit codes:**

| Code  | Meaning                                                    |
| ----- | ---------------------------------------------------------- |
| 0     | OK — at least `--expect-min-users` (default 1) active user |
| 2     | Realtime API returned zero rows                            |
| 3     | Active users below expected threshold                      |
| other | Fatal (auth, network, API error)                           |

### Service account details

- SA email: `ga-verifier@projects-showcase-495903.iam.gserviceaccount.com`
- Roles: **Viewer** on the GA4 property (added manually in GA4 UI), and **Service Account Token Creator** granted to `adurs2002@gmail.com` so we can mint scoped tokens via JWT.
- Key file: `~/.config/gcp/ga-verifier.json` (chmod 600, **never commit**).
- Project: `projects-showcase-495903`. APIs enabled: `analyticsadmin.googleapis.com`, `analyticsdata.googleapis.com`.
