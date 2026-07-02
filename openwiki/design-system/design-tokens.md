# Design Tokens

The design system is defined declaratively via CSS custom properties in `assets/css/style.css`, organized into `@layer tokens`. These tokens are the single source of truth for all visual primitives.

## Source: `assets/css/style.css`

The token layer (lines 7–120) defines:

### Typographic families

```css
--font-heading: 'Lora', 'Cambria', 'Georgia', serif;
--font-body: 'Aptos', system-ui, -apple-system, ...sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace;
```

### Spacing scale (4px base)

| Token         | Value   |
| ------------- | ------- |
| `--space-xs`  | 0.25rem |
| `--space-sm`  | 0.5rem  |
| `--space-md`  | 1rem    |
| `--space-lg`  | 1.5rem  |
| `--space-xl`  | 2rem    |
| `--space-2xl` | 2.5rem  |
| `--space-3xl` | 4rem    |

### Border radii

| Token           | Value |
| --------------- | ----- |
| `--radius-sm`   | 4px   |
| `--radius-md`   | 8px   |
| `--radius-lg`   | 12px  |
| `--radius-xl`   | 16px  |
| `--radius-pill` | 999px |

### Semantic colors (light mode)

Tokens prefixed `--bg-*`, `--text-*`, `--border-*`, `--accent-*`:

| Token              | Hex       | Role                         |
| ------------------ | --------- | ---------------------------- |
| `--bg-base`        | `#f7f8fa` | Page background              |
| `--bg-surface`     | `#ffffff` | Card, modal, sidebar         |
| `--text-primary`   | `#0c1222` | Main body text               |
| `--text-secondary` | `#3d4a5c` | Supporting prose             |
| `--text-muted`     | `#5c6b7f` | Metadata, timestamps         |
| `--accent`         | `#1a3478` | Interactive elements (light) |
| `--accent-hover`   | `#254aa3` | Button/link hover            |

### Dark mode overrides

Applied via `[data-resolved-theme='dark']` selectors:

| Token (dark)     | Hex       | Role                   |
| ---------------- | --------- | ---------------------- |
| `--bg-base`      | `#1a1d26` | Page background        |
| `--bg-surface`   | `#232731` | Card surface           |
| `--accent`       | `#6b9fff` | Periwinkle (dark only) |
| `--text-primary` | `#e8ecf4` | Body text              |

### Z-index stack

```css
--z-sticky: 100;
--z-header: 1000;
--z-skip: 1010;
--z-modal: 9999;
```

### Design rules (from DESIGN.md)

1. **One Accent Rule**: Deep navy appears only on interactive elements, never as background fill.
2. **Anti-Cream Rule**: Background is cool `#f7f8fa`, never warm (sand, parchment, cream).
3. **Flat-at-Rest Rule**: No shadows at rest; elevation is earned on hover.
4. **Backdrop Exception**: `backdrop-filter: blur()` only on sticky nav and modal overlay.

## Change guidance

- Always update both `:root` (light) and `[data-resolved-theme='dark']` tokens together.
- After changing CSS, bump the `style.css?v=` query string in all HTML `<head>` elements.
- Run Playwright tests on both desktop and mobile viewports after token changes.

## Source map

- `assets/css/style.css` — token definitions (lines 7–120)
- `DESIGN.md` — design rationale and rules
- `PRODUCT.md` — brand personality and audience constraints
