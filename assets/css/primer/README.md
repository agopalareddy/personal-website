# Primer Design Tokens (vendored)

Vendored from `@primer/primitives` v11.9.0.

## Files

| File                  | Source                                                                  |
| --------------------- | ----------------------------------------------------------------------- |
| base-size.css         | `@primer/primitives/dist/css/base/size/size.css`                        |
| base-typography.css   | `@primer/primitives/dist/css/base/typography/typography.css`            |
| size.css              | `@primer/primitives/dist/css/functional/size/size.css`                  |
| border.css            | `@primer/primitives/dist/css/functional/size/border.css`                |
| breakpoints.css       | `@primer/primitives/dist/css/functional/size/breakpoints.css`           |
| typography.css        | `@primer/primitives/dist/css/functional/typography/typography.css`      |
| motion.css            | `@primer/primitives/dist/css/functional/motion/motion.css`              |
| theme-light.css       | `@primer/primitives/dist/css/functional/themes/light.css`               |
| theme-dark.css        | `@primer/primitives/dist/css/functional/themes/dark.css`                |
| theme-dark-dimmed.css | `@primer/primitives/dist/css/functional/themes/dark-dimmed.css`         |
| theme-light-hc.css    | `@primer/primitives/dist/css/functional/themes/light-high-contrast.css` |
| theme-dark-hc.css     | `@primer/primitives/dist/css/functional/themes/dark-high-contrast.css`  |
| **primer.css**        | concatenation of all above, in order                                    |

## Update procedure

```bash
# 1. Bump version in package.json
npm install --save-dev @primer/primitives@latest

# 2. Re-vendor
npm run vendor:primer

# 3. Review diff, commit
git add assets/css/primer/ scripts/icons.py assets/js/icons.js
git commit -m "chore: vendor @primer/primitives vX.Y.Z"
```

## Do not edit

All files in this directory are auto-generated. Edit `scripts/vendor-primer.mjs` to change the vendoring logic, then re-run.
