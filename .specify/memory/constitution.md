<!--
Sync Impact Report
Version change: [TEMPLATE] → 1.0.0 (initial ratification)
Modified principles: n/a (first fill of template placeholders)
Added sections:
  - Core Principles I–VI
  - Additional Constraints (Security & Secrets)
  - Development Workflow (Content Pipeline, Documentation Sync, Build Discipline)
  - Governance
Removed sections: none
Templates requiring updates:
  - .specify/templates/plan-template.md — ✅ compatible (Constitution Check gate references this file dynamically, no static edit needed)
  - .specify/templates/spec-template.md — ✅ compatible (generic feature-spec structure, no constitution-specific claims to update)
  - .specify/templates/tasks-template.md — ✅ compatible (its DB/auth/mobile examples are explicitly labeled illustrative sample tasks that /speckit-tasks must replace per-feature; no static edit required)
  - Installed speckit-* command files — ✅ no outdated agent-specific references found
Follow-up TODOs: none — ratification date set to date of this amendment since no prior constitution existed.
-->

# Personal Website (agreddy.com) Constitution

## Core Principles

### I. Static-First, No Runtime Server

The site MUST remain a static HTML/CSS/JS artifact servable by nginx with no
application server, no build step, and no runtime backend. Any feature that would
require a server process, database, or build pipeline MUST be rejected or redesigned
to fit static hosting before it is accepted.

**Rationale**: The entire deployment model (git push → `git fetch && git reset --hard`
on the GCP VM, served directly by nginx) depends on the site being static. Introducing
a runtime dependency breaks the deploy story and the low-maintenance guarantee that
makes this project sustainable as a side project.

### II. Generated Content Is Source-of-Truth via JSON

Content under `experience/` and `projects/` is generated output, not hand-authored
HTML. Changes MUST go through `scripts/experience_database.json` /
`scripts/projects_database.json` and `scripts/generate_site.py` — never direct edits to
generated pages. The `/projects/` catalog additionally requires updating
`assets/js/projects-catalog.js` in the same change, since it duplicates project data
for client-side rendering.

**Rationale**: Generated pages are silently overwritten on the next regeneration.
Hand-editing them creates work that vanishes without warning, and forgetting the JS
catalog produces a catalog page that disagrees with the detail pages it links to.

### III. Primer Tokens Only, No Raw Hex

All colors in `assets/css/style.css` and page markup MUST resolve to `@primer/primitives`
functional tokens (e.g. `--fgColor-accent`, `--bgColor-muted`). Raw hex values, and
Font Awesome or any icon set other than vendored `@primer/octicons`, MUST NOT be
introduced.

**Rationale**: Token-only styling is what makes the 6-mode theme system (light, dark,
dimmed, and two high-contrast variants) correct for free — a raw hex value breaks in at
least one of those modes. This was a deliberate, completed migration (Font Awesome was
fully removed); reintroducing either erodes the guarantee.

### IV. Accessibility Is Non-Negotiable (WCAG 2.1 AA)

Every interactive element MUST be keyboard-accessible, color MUST NOT be the sole
carrier of meaning, and all animation MUST respect `prefers-reduced-motion`. Changes
touching interaction or visual state MUST be checked against axe-core (the existing
Playwright + `@axe-core/playwright` suite) and MUST update `accessibility.html` when
the change affects the accessibility statement's claims.

**Rationale**: One of the two named audiences (academic reviewers, recruiters) may
depend on assistive technology, and the accessibility statement is a public claim —
letting it drift from reality is worse than not making the claim.

### V. Restraint Over Spectacle

Visual and interaction design MUST favor precision and information density over
decoration. Explicitly rejected: gradient-heavy or glassmorphic ornamentation,
SaaS-style metric cards, identical icon+heading+text card grids repeated as filler, and
entrance animations that do not confirm an interaction or guide attention. Motion MUST
justify its own existence; if removing an animation loses no information, remove it.

**Rationale**: The brand is "precise, rigorous, understated" for a dual academic/
recruiting audience that spends 2–5 minutes extracting information, not being sold to.
This is a considered anti-pattern list (`PRODUCT.md`), not an arbitrary taste
preference — violating it undermines the credibility the whole site is built to convey.

### VI. Human-Only Git Authorship

No commit or PR MUST carry an AI tool as author or co-author (no `Co-Authored-By:
Claude`, Cursor, or any agent identity). This is enforced by `.husky/commit-msg` and
`.husky/prepare-commit-msg` and MUST NOT be bypassed with `--no-verify`.

**Rationale**: Commits belong to the human maintainer. This is already enforced by a
git hook; the constitution makes the requirement explicit so agents don't attempt to
work around it as an obstacle.

## Additional Constraints

### Security & Secrets

- `.env` files, service-account keys, private keys, and other credentials MUST NOT be
  committed. `scripts/verify_ga4.py` reads its key from `~/.config/gcp/ga-verifier.json`,
  outside the repo, specifically to keep it out of version control.
- Email addresses MUST NOT appear in raw `mailto:` HTML; obfuscation goes through
  `assets/js/email-protection.js`.
- Anything placed under `files/` is public and servable — treat additions there as a
  publish action, not a storage action.
- Nginx CSP `connect-src` MUST continue to allow the GA4 endpoints
  (`www.google-analytics.com`, `www.google.com`, `*.analytics.google.com`,
  `www.googletagmanager.com`) whenever CSP is modified; re-run
  `./scripts/verify_ga4.py` after any CSP change.

## Development Workflow

### Content Pipeline Discipline

Adding or editing a project or experience entry follows: edit the JSON database → run
`generate_site.py` for the affected section → `git diff` the generated output and
revert any unintended detail-page rewrites → commit JSON and generated HTML together →
for projects, also update `assets/js/projects-catalog.js` in the same commit.

### Documentation Sync (OpenWiki)

After any change significant enough to affect architecture, the design system,
interactive components, content pipelines, nginx config, or test coverage, run
`openwiki --update "<description>"` (or manually update the relevant `openwiki/` pages
if the CLI is unavailable). Generated OpenWiki pages MUST NOT be hand-edited outside of
that flow.

### Build Discipline (LaTeX artifacts)

`.tex`/`.sty` edits under `files/*_tex/` MUST be recompiled two-pass with `pdflatex`,
build artifacts (`.aux`, `.log`, `.out`, `.fls`, `.fdb_latexmk`, `.synctex.gz`) cleaned
before commit, and the compiled PDF flat-copied into `files/` alongside its `_tex`
source, since serving requires the flat copy. Orphaned lines/widows MUST be diagnosed
by inspecting the rendered PDF page-by-page, never guessed from the `.tex` source.

## Governance

This constitution supersedes ad hoc practice recorded only in chat history or prior
sessions. `AGENTS.md` (and its `CLAUDE.md` symlink) remains the day-to-day operational
reference for exact commands; where the two disagree, this constitution's principles
take precedence and `AGENTS.md` MUST be updated to match.

**Amendment procedure**: Propose the change, update this file (including the Sync
Impact Report header), bump the version per the policy below, and check the templates
listed in that report for needed updates in the same change.

**Versioning policy** (semantic versioning applied to governance):

- **MAJOR**: Removing or redefining a principle in a way that is backward-incompatible
  with prior guidance.
- **MINOR**: Adding a new principle or materially expanding an existing one.
- **PATCH**: Wording clarifications and non-semantic fixes.

**Compliance review**: Any change touching styling, generated content, accessibility,
or deployment should be checked against the relevant principle above before merging.
Complexity or deviation from a principle (e.g., introducing a build step) MUST be
justified in the change description or rejected.

**Version**: 1.0.0 | **Ratified**: 2026-07-26 | **Last Amended**: 2026-07-26
