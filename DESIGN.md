# Design System — agreddy.com

GitHub Primer design system, powered by `@primer/primitives` design tokens.

## Token Source

Design tokens are vendored from `@primer/primitives` into `assets/css/primer/`.
Files are concatenated into `primer.css` and linked before the site's `style.css`.
Version is pinned in `package.json` (`devDependencies`).

**Update procedure:**

```bash
npm install --save-dev @primer/primitives@latest
npm run vendor:primer
git add assets/css/primer/ scripts/icons.py assets/js/icons.js
```

## Architecture

```
primer.css (vendored tokens: size, typography, motion, colors, 5 themes)
  └─ style.css (@layer reset, base, components, utilities)
       Uses ONLY Primer functional tokens — no raw hex values
```

No build step. Static HTML/CSS/JS served by nginx.

## Rules

1. **Only Primer functional tokens.** Never raw hex in `style.css` or page markup.
2. **System font stack only.** `--fontStack-system` for body, `--fontStack-monospace` for code.
3. **Flat, restrained interactions.** Border-color transitions on hover. No shadows, transforms, or glow effects.
4. **Octicons only.** Vendored inline SVGs from `@primer/octicons`. Font Awesome fully removed.
5. **Keep existing class names / IDs.** Renaming touches catalog JS + generators + 4 test specs for zero user value.
6. **Wellness/ is out of scope.** Standalone mini-app, untouched.

## Theme System

| Picker option              | `data-color-mode` | `data-light-theme`    | `data-dark-theme`    |
| -------------------------- | ----------------- | --------------------- | -------------------- |
| Sync with system (default) | `auto`            | `light`               | `dark`               |
| Light                      | `light`           | `light`               | `dark`               |
| Light high contrast        | `light`           | `light_high_contrast` | `dark`               |
| Dark                       | `dark`            | `light`               | `dark`               |
| Dark dimmed                | `dark`            | `light`               | `dark_dimmed`        |
| Dark high contrast         | `dark`            | `light`               | `dark_high_contrast` |

- Static default: `<html data-color-mode="auto" data-light-theme="light" data-dark-theme="dark">`
- Inline head snippet (before stylesheets) prevents FOUC
- JS picker (`theme.js`) uses `<details class="theme-picker">` with 6 radio options
- localStorage key: `color-scheme` (legacy `theme` key auto-migrated)
- No-JS: correct auto theme via static defaults + media-query branches in vendored CSS

## Color Tokens

All component colors map to Primer functional tokens. The key ones:

| Purpose                          | Token                       |
| -------------------------------- | --------------------------- |
| Page background                  | `--bgColor-default`         |
| Card/surface background          | `--bgColor-default`         |
| Muted background                 | `--bgColor-muted`           |
| Primary text                     | `--fgColor-default`         |
| Secondary/muted text             | `--fgColor-muted`           |
| Accent (links, emphasis)         | `--fgColor-accent`          |
| Accent fill (buttons, skip link) | `--bgColor-accent-emphasis` |
| Text on accent fill              | `--fgColor-onEmphasis`      |
| Default border                   | `--borderColor-default`     |
| Muted border                     | `--borderColor-muted`       |
| Emphasis border (hover)          | `--borderColor-emphasis`    |
| Focus outline                    | `--focus-outlineColor`      |

Category labels map to semantic roles:

| Category      | Role      | Token pair                                                 |
| ------------- | --------- | ---------------------------------------------------------- |
| Research      | accent    | `--fgColor-accent` / `--borderColor-accent-emphasis`       |
| Web           | done      | `--fgColor-done` / `--borderColor-done-emphasis`           |
| Tools         | success   | `--fgColor-success` / `--borderColor-success-emphasis`     |
| Professional  | sponsors  | `--fgColor-sponsors` / `--borderColor-sponsors-emphasis`   |
| Education     | attention | `--fgColor-attention` / `--borderColor-attention-emphasis` |
| Leadership    | severe    | `--fgColor-severe` / `--borderColor-severe-emphasis`       |
| Awards        | danger    | `--fgColor-danger` / `--borderColor-danger-emphasis`       |
| Presentations | done      | `--fgColor-done` / `--borderColor-done-emphasis`           |

## Component Patterns

- **Header**: UnderlineNav (`.nav-links`), active tab with `aria-current="page"` + 2px accent underline
- **Sidebar**: Profile card (`.academic-sidebar`), circular avatar, octicon contact links
- **Cards**: Box pattern (`.card-surface`, `.project-card`, `.experience-card`), flat border, hover changes `border-color`
- **Buttons**: Primer Button variants (`btn-github`, `btn-demo`, `btn-pdf`, `btn-detail`)
- **Category labels**: Colored Label (pill, 1px border, role-based color)
- **Tech tags**: Topic tag (pill, `--bgColor-accent-muted`)
- **Search/Select**: FormControl with leading octicon search icon
- **Timeline**: Vertical rail (2px line, dot markers at year headers and cards)
- **TOC**: NavList (borderless, aria-expanded toggle)
- **Footer**: GitHub-style (top border, muted link row + copyright)
- **Theme picker**: `<details>` dropdown with 6 radio options
- **Status badge**: Profile status pill (success/attention/danger variants)

## Typography

- Body: `--fontStack-system`, 16px (`--text-body-size-large`)
- Headings: `--fontStack-system`, `--text-title-size-large` (32px) / `-medium` (20px) / `-small` (16px)
- Code: `--fontStack-monospace`, `--text-codeBlock-size`
- Line height: `--text-body-lineHeight-large` (1.5)

## Accessibility

- WCAG 2.1 AA target (verified with axe-core)
- 6 theme options include high-contrast modes
- `prefers-reduced-motion: reduce` kill-switch on all animations
- `forced-colors: active` compatible (octicons use `currentColor`)
- All interactive elements keyboard-accessible
- Theme announcements via `aria-live` region
- No-JS: correct auto theme, working nav, noscript card fallbacks
