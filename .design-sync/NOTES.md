# design-sync notes — personal-website

## Repo shape

- No build/dist for the component set — `package.json` has no `main`/`module`/`exports`.
  Converter runs in **synth-entry mode** from `site/src/components/**` (`cfg.srcDir`).
- `node_modules/personal-website` is a **symlink to the repo root** (`ln -sfn .. node_modules/personal-website`),
  gitignored. Required so the converter's `--node-modules <dir>` + `PKG=personal-website` resolves
  `PKG_DIR` without a real npm-installed copy. Recreate on a fresh clone if missing.
- Not a real component _library_ — 10 components in `site/src/components/` are this site's own
  page chrome (Nav, Footer, Layout, Head, Sidebar) plus a few catalog/common pieces
  (CatalogFilter, ExperienceEntryCard, ProjectCard, Icon, ThemePicker). User confirmed syncing
  these anyway rather than treating this as "no design system to sync."

## Prop extraction (`dtsPropsFor`)

- The converter's `.d.ts` prop extractor only scans `**/*.d.ts` files, never `.tsx` source —
  and this repo ships zero real `.d.ts` (only `site/src/vite-env.d.ts`, unrelated). So **every**
  component needed a hand-written `dtsPropsFor` entry, even ones with a real named `<Name>Props`
  interface in source (e.g. `Head`, `Layout`, `CatalogFilter`) — the interface exists in `.tsx`,
  which the extractor never reads.
- `Layout` and `Head`'s bodies are manually flattened (`LayoutProps extends HeadProps`) since
  `dtsPropsFor` bodies don't support an `extends` clause.
- `ExperienceEntryCard`/`ProjectCard` props (`e`/`p`) are inlined from `site/src/content/types.ts`
  (`ExperienceEntry`/`ProjectEntry`) since `dtsPropsFor` bodies can't reference external types.
- `Icon`'s `name` union (33 literals) is copied from `site/src/components/common/icons-data.ts`'s
  `ICONS` keys.

## Known render warns

- `[TOKENS_MISSING]`: `--base-duration-*` / `--base-easing-*` (8-9 props). **Real upstream gap**,
  not a design-sync artifact: `assets/css/primer/motion.css` (the _functional_ motion layer)
  references these base primitives, but `scripts/vendor-primer.mjs` never vendors
  `@primer/primitives/dist/css/base/motion/motion.css` (only maps the `functional/motion/motion.css`
  entry) — so the vars are referenced but never defined, on the **live site too**, not just here.
  Flagged as a separate follow-up (see chip); not fixed as part of this sync.
- `[FONT_MISSING]`: "Mona Sans VF". The live site doesn't ship this font either — first stack
  entry is a no-op, real font stack falls back to `-apple-system`/`Segoe UI`/etc. Accepted as-is;
  matches actual site behavior, not a sync regression.

## Authoring decisions

- `Head` ships as a **floor card**, deliberately. It renders only `<head>` children (meta/script/
  link tags) — zero visual output by nature, even in a real document `<head>`. Not fixable by
  authoring; the floor card (still fully functional/importable) is the honest representation.
- **Every authored preview except `Layout` wraps its output in a local `Theme` component**
  (`<div data-color-mode="auto" data-light-theme="light" data-dark-theme="dark">`), because
  Primer's functional color tokens (`--fgColor-*`, `--bgColor-*`, etc.) only activate under that
  attribute selector — normally set on `<html>` by `Layout.tsx` in real usage, but preview cards
  mount bare without it. Without the wrapper, previews render with zero color styling (plain
  black-on-white) even though layout/typography tokens (bare `:root`) still apply.
  `Layout` is the one exception — it sets these attributes on its OWN root `<html>` element
  already, so wrapping it in a second `Theme` div nests a second `<html>` and collapses the
  card to 0px height (confirmed via `.render-check.json`: `maxHeight: 0`, `allHollow: true`).
  If a future component also renders its own document-root wrapper, skip the `Theme` div for it
  too.

## Re-sync risks

- If the repo ever adds a real npm build/`exports` entry for a components package, drop
  `srcDir`/the synth-entry setup and let the converter use the real `dist` + shipped `.d.ts` —
  the hand-written `dtsPropsFor` entries can then likely be deleted (extraction will work from
  real `.d.ts`).
- `dtsPropsFor` bodies are hand-maintained copies of the real prop types — if any of the 10
  components' props change in `site/src/components/**` or `site/src/content/types.ts`, these
  entries silently go stale. No automated check catches this drift.
- `pnpm-lock.yaml` exists in the repo but is untracked/stray — `package-lock.json` is the
  git-tracked lockfile and what this sync used (`npm`).
