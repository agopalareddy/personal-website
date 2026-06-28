---
name: agreddy.com
description: Personal portfolio and professional archive — precise, rigorous, understated
colors:
  ink-deep: '#0c1222'
  ink-secondary: '#3d4a5c'
  ink-muted: '#5c6b7f'
  accent-navy: '#1a3478'
  accent-navy-hover: '#254aa3'
  accent-soft: '#e8eef8'
  surface: '#ffffff'
  base: '#f7f8fa'
  surface-hover: '#eef1f5'
  border: '#e2e8f0'
  border-hover: '#cbd5e1'
  accent-periwinkle: '#6b9fff'
  pdf-red: '#f43f5e'
typography:
  display:
    fontFamily: "'Lora', 'Cambria', 'Georgia', serif"
    fontSize: '2.75rem'
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: '-0.01em'
  headline:
    fontFamily: "'Lora', 'Cambria', 'Georgia', serif"
    fontSize: '1.75rem'
    fontWeight: 400
    lineHeight: 1.3
  title:
    fontFamily: "'Lora', 'Cambria', 'Georgia', serif"
    fontSize: '1.4rem'
    fontWeight: 400
    lineHeight: 1.3
  body:
    fontFamily: "'Aptos', system-ui, -apple-system, sans-serif"
    fontSize: '1rem'
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "'Aptos', system-ui, sans-serif"
    fontSize: '0.875rem'
    fontWeight: 600
    lineHeight: 1.4
  kicker:
    fontFamily: "'JetBrains Mono', 'Fira Code', monospace"
    fontSize: '0.74rem'
    fontWeight: 700
    letterSpacing: '0.08em'
rounded:
  sm: '4px'
  md: '8px'
  lg: '12px'
  xl: '16px'
  pill: '999px'
spacing:
  xs: '4px'
  sm: '8px'
  md: '16px'
  lg: '24px'
  xl: '32px'
  2xl: '40px'
  3xl: '64px'
components:
  button-primary:
    backgroundColor: '{colors.accent-navy}'
    textColor: '#ffffff'
    rounded: '{rounded.sm}'
    padding: '8px 16px'
  button-primary-hover:
    backgroundColor: '{colors.accent-navy-hover}'
    textColor: '#ffffff'
  button-secondary:
    backgroundColor: 'transparent'
    textColor: '{colors.ink-secondary}'
    rounded: '{rounded.sm}'
    padding: '8px 16px'
  button-secondary-hover:
    backgroundColor: '{colors.surface-hover}'
    textColor: '{colors.ink-deep}'
  card:
    backgroundColor: '{colors.surface}'
    rounded: '{rounded.md}'
    padding: '32px'
  card-hover:
    backgroundColor: '{colors.surface}'
  filter-pill:
    backgroundColor: '{colors.surface}'
    textColor: '{colors.ink-secondary}'
    rounded: '{rounded.sm}'
    padding: '6px 14px'
  filter-pill-active:
    backgroundColor: '{colors.accent-soft}'
    textColor: '{colors.accent-navy}'
---

# Design System: agreddy.com

## 1. Overview

**Creative North Star: "The Technical Archive"**

This design system is built for retrieval, not discovery. The visitor arrives knowing what they want — a research record, a project outcome, a CV — and the system's job is to surface it without getting in the way. Decoration is a liability. Every chrome element that makes the eye stop is a tax on the reader's attention; that attention belongs to the work itself.

Restraint here is not passivity. The system works hard through precision: a consistent 4px grid, a serif/sans pairing that signals both academic authority and technical legibility, a color system that uses its single accent with the discipline of a red pen in an otherwise monochrome manuscript. Surfaces layer through tonal contrast (cool off-white base, white surface) rather than through shadow drama. The interface reads as _considered_, not _designed_.

The dual audience — engineering recruiters and academic faculty — share one requirement: they must be able to trust what they're reading. Visual noise destroys that trust instantly. The Technical Archive earns credibility by looking like it has nothing to prove.

**Key Characteristics:**

- Typographic hierarchy carries all structural weight; layout chrome is minimal
- Accent navy used sparingly — interactive elements, active states, accent dots only
- Information density treated as a feature, not a problem to solve
- Motion limited to state confirmations (hover lift, active underline, dot scale); no entrance choreography
- Dual-theme (light/dark) with identical semantic structure; no token invented for one theme only

---

## 2. Colors: The Institutional Palette

A near-achromatic cool system anchored by one accent that functions like institutional ink.

### Primary

- **Deep Institutional Navy** (`#1a3478`): The accent in light mode. Used on interactive elements (links, active nav, focus rings, active tab underlines, timeline year dots), never as a background fill. Its rarity is the point — when this color appears, the element is actionable or selected.

### Secondary

- **Periwinkle Blue** (`#6b9fff`): The accent in dark mode only. Lighter value of the same hue family, legible against the dark surface (`#1a1d26`). Never used in light mode.

### Neutral

- **Ink Deep** (`#0c1222`): Primary text in light mode. Near-black with a cool blue undertone that harmonizes with the accent. Not pure black — the warmth stays out.
- **Ink Secondary** (`#3d4a5c`): Body text, card descriptions, supporting content. The workhorse color; most prose lives here.
- **Ink Muted** (`#5c6b7f`): Metadata, timestamps, secondary labels, icons at rest. If it doesn't need to be read first, it's this color.
- **Cool Base** (`#f7f8fa`): Page background. Barely-there cool gray — not cream, not warm. The anti-default.
- **White Surface** (`#ffffff`): Cards, modals, sidebar. The clearest layer above base.
- **Surface Hover** (`#eef1f5`): Hover states on surface elements. Subtle directional shift toward the accent hue.
- **Accent Soft** (`#e8eef8`): Active filter pill fills, focus rings, accent icon wrappers. The accent's wash — used as fill where full accent would be too heavy.
- **Border** (`#e2e8f0`): Dividers, card outlines, input strokes. Defines layers without competing with content.

### Named Rules

**The One Accent Rule.** Deep Institutional Navy (`#1a3478`) appears only on interactive elements and their active states. Never as a section background, decorative stripe, or non-interactive element fill. Its rarity makes every appearance meaningful.

**The Anti-Cream Rule.** The page background is `#f7f8fa` — cool, not warm. The warm-neutral band (sand, parchment, ivory, linen) is prohibited. Warmth lives in the writing and the serif heading font, not in background tints.

---

## 3. Typography

**Display / Heading Font:** Lora (with Cambria, Georgia serif fallbacks)
**Body Font:** Aptos (with system-ui, -apple-system, Segoe UI, Roboto fallbacks)
**Mono / Kicker Font:** JetBrains Mono (with Fira Code, Courier New fallbacks)

**Character:** Lora is a literary serif with optical anchoring — authoritative without being stiff. Aptos is the new Microsoft system default, humanist and legible at small sizes. The pairing works on a contrast axis (serif display, sans body) and reinforces the dual-register credibility: the serif says _scholarship_, the sans says _shipping_.

### Hierarchy

- **Display** (Lora, weight 400, 2.75rem, line-height 1.2, tracking −0.01em): Page-level h1 headings only. One per page. Not used for section headers within content.
- **Headline** (Lora, weight 400, 1.75–2.2rem, line-height 1.3): Section h2 inside modal headers, experience/project page titles, academic content h2. The modal's project name renders here.
- **Title** (Lora, weight 400–500, 1.35–1.5rem, line-height 1.3): Card titles (project names, experience titles), sidebar author name, tab panel h3. The reading entry point for every card.
- **Body** (Aptos/system-ui, weight 400, 0.95–1rem, line-height 1.6): All prose, card descriptions, tab pane paragraphs. Line length capped at ~680px container width (~65–75ch at 16px).
- **Label** (Aptos, weight 500–600, 0.8–0.875rem, line-height 1.4): Navigation links, button text, filter pills, metadata rows, tech tags. The functional layer.
- **Kicker** (JetBrains Mono, weight 700, 0.74rem, uppercase, tracking 0.08em, accent color): Section identity markers used sparingly — one per page maximum. The `.section-kicker` class only; not the muted `.header-accent` variant.

### Named Rules

**The One Kicker Rule.** Monospace uppercase kickers (`.section-kicker`) appear at most once per page, in accent color, to identify a section. The muted uppercase tracked variant (`.header-accent`, `text-muted` + `letter-spacing: 0.12em`) is the anti-reference — do not add it to new sections. Ubiquitous eyebrows are the AI grammar tell.

**The Weight Restraint Rule.** Lora at weight 400 is the default for headings. Weight 500 appears only on the author name sidebar (personal brand anchor). Weight 700+ does not appear in Lora. Bold emphasis is carried by Aptos labels and kickers, not the display face.

---

## 4. Elevation

This system is minimally lifted: cards and containers have subtle structural presence, and interactive elements confirm hover with a slight ascent. Shadows are intimate and cool-tinted — they do not dramatize.

### Shadow Vocabulary

- **Ambient** (`0 1px 3px rgba(12, 18, 34, 0.05)`): Default resting state for cards, sidebar containers, document rows. Barely perceptible; separates surface from base without announcing itself.
- **Structural** (`0 4px 6px -1px rgba(12, 18, 34, 0.05), 0 2px 4px -1px rgba(12, 18, 34, 0.03)`): Applied on card hover (`translateY(-2px)`) and inside modals. The "lift" confirmation that makes interaction feel physical without being theatrical.
- **Overlay** (`0 20px 50px rgba(12, 18, 34, 0.15)`): Reserved for the document modal (fullscreen PDF viewer). The only strong shadow in the system; justified because the modal sits above everything else.

### Named Rules

**The Flat-at-Rest Rule.** No element receives shadow-md at rest. Structural elevation is earned by hover or modal open state — never a default decoration. If an element looks flat at rest and lifted on interaction, it's correct. If it looks lifted at rest, remove the shadow.

**The Backdrop Exception Rule.** Glassmorphic backdrop-filter (`blur`) is permitted on exactly two surfaces: the sticky nav header (functional — prevents content from bleeding through on scroll) and the document modal overlay (functional — reinforces the overlay hierarchy). It is never decorative. No card, sidebar panel, or section receives blur.

---

## 5. Components

### Buttons

Quiet confidence: small, purposeful, never loud. The primary button does not need to be large to be authoritative.

- **Shape:** Gently squared (4px radius). Matches the form control vocabulary — `--radius-control`.
- **Primary (`.btn-demo`, `.doc-row-btn.btn-primary`, `.site-action-btn`):** Deep Institutional Navy background, white text. Padding ~8px 16px. On hover: accent-hover (`#254aa3`) + ambient shadow. No text transform, no letter spacing — plain weight 600 Aptos.
- **GitHub/Dark (`.btn-github`):** `ink-deep` (`#0c1222`) background, surface (`#fff`) text. Signals code provenance; the dark fill is intentional contrast with the primary blue.
- **PDF Red (`.btn-pdf`):** `#f43f5e` background, white text. Reserved for document download only — the one warm-accent allowed in the system as a semantic signal.
- **Secondary / Ghost (`.btn-detail`, `.doc-row-btn.btn-secondary`):** Transparent fill, `border` stroke, `ink-secondary` text. On hover: `surface-hover` fill, `border-hover` stroke, `ink-deep` text.
- **Focus:** `outline: 2px solid var(--accent)` at 2–3px offset. Consistent across all interactive elements.

### Filter Pills

- **Style:** Surface background, `border` stroke, `ink-secondary` text, 4px radius, weight 600.
- **Active:** `accent-soft` fill, `accent-navy` text and border. The wash + text + border triple confirms selection without loud color.
- **Hover (deselected):** `surface-hover` fill, `border-hover` stroke, `ink-deep` text.

### Cards / Containers

- **Corner Style:** Gently rounded (8px, `--radius-md`). Not pill, not sharp — positioned between functional and editorial.
- **Background:** White surface on cool-gray base. The contrast between `#ffffff` and `#f7f8fa` is the primary depth layer.
- **Shadow Strategy:** Ambient at rest; structural on hover. See Elevation.
- **Border:** 1px `border` (`#e2e8f0`) at rest; `border-hover` (`#cbd5e1`) on hover.
- **Internal Padding:** 2rem (32px) standard card; 1rem 1.25rem project-card (tighter, list-density context).
- **Hover transform:** `translateY(-2px)` — a 2–3px lift that confirms interactivity without announcing it.
- **Spotlight effect:** A radial gradient mask tracks the cursor on `.spotlight-card::before`, casting an accent-colored glow along the border — subtle, purposeful, memorable.

### Search Input

- **Style:** White surface fill, 1px `border` stroke, 4px radius. Left-padded icon. Placeholder text in `ink-muted`.
- **Focus:** `border-color` shifts to `accent-navy`; `box-shadow: 0 0 0 3px accent-soft` ring confirms focus state. Legible, not loud.

### Navigation

- **Sticky header:** Frosted-glass effect (`background: rgba(247,248,250,0.85)` + `backdrop-filter: blur(12px)`) — the justified exception to the no-blur rule. Prevents content bleed on scroll.
- **Nav links:** `ink-secondary` default, `ink-deep` hover, `accent-navy` active with a 2px bottom underline. Weight 500 default, 600 active.
- **Theme slider (signature component):** 3-state pill (light / device / dark) with a 28px sliding thumb. The thumb slides across the track using `translateX` at 0 / 32px / 64px. Active icon colored in accent; inactive icons in `ink-muted`. This is the only UI affordance where the system is openly playful.

### Experience / Project Timeline (signature component)

A vertical connector line (`2px`, `border-color`) with accent-filled year marker dots. Year headers carry an accent circle (`0 0 0 2px var(--accent)` double ring) and a fading horizontal rule extending right (`linear-gradient(border-color → transparent)`). Timeline card dots (`0.8rem` circles) sit at rest with `bg-surface` fill and `border-color` stroke; on hover they scale to 1.25×, fill with `accent-navy`, and cast an `0 0 8px var(--accent)` glow. This is the system's most expressive moment — the glow is earned by the contrast of the otherwise shadow-free system.

---

## 6. Do's and Don'ts

### Do:

- **Do** use Deep Institutional Navy (`#1a3478`) only on interactive elements and their active states — links, buttons, active underlines, focused inputs, timeline accent dots.
- **Do** use Lora weight 400 for all headings. Typographic hierarchy is expressed through size, not weight variation within the serif face.
- **Do** use `text-wrap: balance` on h1–h3 and `text-wrap: pretty` on body prose for clean line breaks.
- **Do** use `translateY(-2px)` + shadow-md on card hover. The two signals together confirm interactivity; neither alone is enough.
- **Do** use the `.section-kicker` pattern (mono, uppercase, accent, 0.08em tracking) at most once per page to identify a key section.
- **Do** use the `.spotlight-card::before` radial gradient effect on project/experience cards — it rewards cursor exploration and reinforces the accent without overdoing it.
- **Do** include `@media (prefers-reduced-motion: reduce)` on every animation and transition. The system already has a blanket rule; don't override it.
- **Do** use `accent-soft` (`#e8eef8`) as a fill for icon wrappers and active filter pills. The wash communicates "accent territory" without the full weight of the navy.

### Don't:

- **Don't** use gradient text (`background-clip: text`). Emphasis is weight or size, never gradient. This is a hard ban.
- **Don't** use decorative glassmorphism — `backdrop-filter: blur()` on cards, sidebar panels, or section containers. Blur is reserved for the sticky nav and the document modal overlay only.
- **Don't** use metric cards (large number + small label + supporting stats). The system has no hero numbers; outcomes live in prose.
- **Don't** add identical card grids with icon + heading + body repeated for every section. The project card list uses a structured row format, not a 3-column icon-grid.
- **Don't** use the warm-neutral band as a background (`sand`, `cream`, `parchment`, `ivory`, `linen`). The background is `#f7f8fa` — cool gray. Warmth in this palette lives in the serif type and the writing voice, not in color.
- **Don't** add `.header-accent` (muted text, uppercase, `letter-spacing: 0.12em`) to new sections. This is the banned "tiny uppercase eyebrow" pattern. Use `.section-kicker` deliberately (accent color, mono font) or nothing.
- **Don't** use `border-left` greater than 1px as a colored accent stripe on cards or callouts. The accent underline on nav items (2px) is the only permitted left/bottom directional accent, and it's bottom-aligned to an active link.
- **Don't** add entrance animations (scroll-triggered opacity/translateY fades) as a system default. The only animation system today is state-confirmation (hover lift, active underline, dot scale, card filter fade-in). Adding a uniform entrance animation across all sections is the AI scaffold reflex — each reveal must earn its place.
- **Don't** use `box-shadow: 0 20px 50px rgba(0,0,0,0.15)` (overlay shadow) on anything below modal z-index. That shadow level is reserved exclusively for the fullscreen document viewer.
- **Don't** use gradient text highlights or colored section dividers as decorative elements. The border (`#e2e8f0`) is the only divider; it earns its place by separating content layers, not decorating them.
