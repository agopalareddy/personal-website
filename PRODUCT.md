# Product

## Register

brand

## Users

Primary: engineering recruiters and hiring managers at tech companies, research labs, and
startups evaluating Aadarsha for software / data / ML engineering roles.

Secondary: academic researchers and faculty (WashU collaborators, conference contacts,
potential PhD advisors) verifying depth of research and technical work.

Both audiences arrive with intent — they were given the URL or found it via LinkedIn/GitHub —
and spend 2–5 minutes skimming. Desktop-first but must hold up fully on mobile (recruiters
review on phones). They care about signal density and quality-of-work indicators, not
marketing copy.

## Product Purpose

Personal portfolio and professional archive for Aadarsha Gopala Reddy (agreddy.com). A
static site that surfaces research, projects, experience, and downloadable documents (CV,
resume) to support job search and academic networking.

Success: a visitor browses at least two pages, finds what they came for quickly, and has a
clear path to reach out or download a document.

## Brand Personality

Precise · Rigorous · Understated

Voice: direct and clear, no hype or marketing language. The work is stated, not sold.

Tone: quietly confident. Academic authority without academic stuffiness. Warmth lives in the
writing, not in decorative flourishes.

Emotional goal: convey depth and seriousness through restraint. Complexity is present in the
research; the interface should stay out of its way.

Reference point: brittanychiang.com aesthetic — strong visual hierarchy, purposeful motion,
project showcase with detail — but pulled toward the understated end. Less theatrical,
more editorial.

## Anti-references

- Loud, gradient-heavy portfolios that perform excitement rather than competence.
- Cream / warm-parchment neutrals as the default background — that reads as AI-generated in 2026.
- Metric cards (big number + small label + supporting stats) — SaaS cliché.
- Identical card grids with icon + heading + text repeated endlessly.
- Gradient text or decorative glassmorphism used as ornamentation.
- Tiny uppercase tracked eyebrows above every section (`.header-accent` pattern) — avoid
  using it ubiquitously; one deliberate use per page maximum.

## Design Principles

1. **Let the work speak.** Surface research titles, project outcomes, and experience
   concisely. Decorative chrome is an interruption, not a feature.

2. **Restrained is not flat.** Understated means precise spacing, careful typographic
   hierarchy, and subtle depth — not a blank page. Craft shows in the details the visitor
   barely notices.

3. **Dual-register credibility.** The site must feel credible in both an academic context
   (faculty reviewing a thesis) and a recruiting context (a hiring manager with 30 seconds).
   Neither audience should feel like a secondary target.

4. **Motion as punctuation.** Any animation earns its place by guiding attention or
   confirming an interaction. No entrance animations just because it looks lively. Each reveal
   should fit what it reveals.

5. **Information density is a feature.** Visitors arrive to extract information. Whitespace
   serves hierarchy, not emptiness. A page that rewards careful reading is more valuable than
   one that rewards scrolling.

## Accessibility & Inclusion

Target WCAG 2.1 AA. Accessibility statement maintained at `/accessibility.html`. Tests run
via axe-core + Playwright. Skip link present. Reduced-motion must suppress or substitute all
animations. Color must not be the sole means of conveying information. Keyboard navigation
through all interactive elements required.
