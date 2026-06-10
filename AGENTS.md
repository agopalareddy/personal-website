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

---

## Key paths

| Path                              | Purpose                                                            |
| --------------------------------- | ------------------------------------------------------------------ |
| `assets/css/style.css`            | Design tokens, components, layouts (`@layer tokens`)               |
| `assets/js/theme.js`              | 3-state theme slider, `data-resolved-theme`, dynamic `theme-color` |
| `assets/js/projects-catalog.js`   | Projects listing renderer                                          |
| `assets/js/experience-catalog.js` | Experience listing renderer                                        |
| `accessibility.html`              | WCAG statement — update when a11y-affecting changes ship           |

See workspace [`AGENTS.md`](../AGENTS.md) §12–13 for accessibility statement and email obfuscation rules.
