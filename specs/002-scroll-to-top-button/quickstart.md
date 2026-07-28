# Quickstart: Validating the Scroll to Top Button

## Prerequisites

- Repo dependencies installed: `npm install`
- Playwright browsers installed (one-time): `npx playwright install`

## Build and serve

```bash
npm run build:site   # regenerates HTML + bundles islands (incl. scroll-to-top) via Vite
npm run dev           # or: python3 -m http.server 8080, serves the static output locally
```

## Manual validation (maps to spec.md Acceptance Scenarios)

1. Open a long page, e.g. `http://localhost:8080/experience/` or any experience/project detail page.
   - At the top of the page: button is not visible. (US1 Scenario 1)
   - Scroll down: button fades in. (US1 Scenario 2)
   - Click it: page smooth-scrolls to top, button fades out. (US1 Scenario 3)
   - Scroll back up manually without clicking: button hides once at top. (US1 Scenario 4)
2. Open a short page — e.g. `http://localhost:8080/accessibility.html` or a page confirmed to fit one viewport at your window size.
   - Confirm the button never appears, at any scroll attempt (there is none). (US2 Scenario 1)
   - Shrink the browser window height until the page becomes scrollable; confirm the button now behaves per US1. (US2 Scenario 2)
3. Resize to a mobile viewport (or use browser device toolbar, e.g. 375×812) and repeat step 1 — confirm the button appears, doesn't overlap nav/content, and is tappable. (US3)
4. Enable OS/browser "reduce motion" and repeat the click-to-top step — confirm the page jumps instantly instead of animating. (FR-008 / edge case)
5. Keyboard-only pass: `Tab` to the button once visible, confirm visible focus outline, activate with `Enter`/`Space`, confirm it scrolls to top. Confirm a screen reader (or the accessibility tree in devtools) announces an accessible name like "Scroll to top". (FR-007)

## Automated validation

```bash
npx playwright test tests/e2e/scroll-to-top.spec.ts
```

Expected coverage (see `tasks.md` for the authoring task): visibility toggle on scroll, hidden on a non-scrollable fixture page, click scrolls to top, reduced-motion uses instant scroll, axe-core has zero violations for the button in both visible and hidden states.
