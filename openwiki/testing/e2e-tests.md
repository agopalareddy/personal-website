# Playwright E2E Tests

The test suite uses Playwright with two viewport projects (desktop 1280×720, mobile 375×667).

## Configuration

Source: `tests/playwright.config.ts`

```ts
export default defineConfig({
  testDir: './e2e',
  timeout: 30000,
  projects: [
    { name: 'desktop', use: { viewport: { width: 1280, height: 720 } } },
    { name: 'mobile', use: { viewport: { width: 375, height: 667 } } },
  ],
});
```

Tests run against `PLAYWRIGHT_TEST_BASE_URL` (defaults to `https://agreddy.com`, override for local).

## Running tests

```bash
# Start local server
python3 -m http.server 8000

# From tests/ directory
PLAYWRIGHT_TEST_BASE_URL=http://127.0.0.1:8000 npm test

# Or by viewport
npm run test:desktop
npm run test:mobile
```

## Test files

| File                         | What it tests                                                                                 |
| ---------------------------- | --------------------------------------------------------------------------------------------- |
| `smoke.spec.ts`              | Basic page availability (200 responses)                                                       |
| `nav-integrity.spec.ts`      | Five-item nav bar is present and correct across page families                                 |
| `experience-listing.spec.ts` | Filter buttons, search, sort, org/year dropdowns, empty state, timeline grouping, ARIA states |
| `experience-detail.spec.ts`  | Detail page structure, breadcrumbs, back-navigation                                           |

## When to run

| Change type               | Tests to run                                              |
| ------------------------- | --------------------------------------------------------- |
| Nav/layout change         | `nav-integrity.spec.ts`, `smoke.spec.ts`                  |
| Experience content/schema | `experience-listing.spec.ts`, `experience-detail.spec.ts` |
| Project content/schema    | No dedicated spec yet — run smoke + visual spot-check     |
| CSS/JS/shared UI          | All tests in both desktop and mobile                      |
| Generator output change   | Listing + detail specs                                    |

## Key assertions (experience listing)

- All filter buttons toggle `aria-pressed` correctly
- Search filters by keyword
- Sort changes card order (ascending/descending)
- Org and year dropdowns exist and filter
- Empty state displays when all cards filtered out
- Cards show timeline grouping and year boundaries
- "Present" labels appear for current entries

## Change guidance

- Tests are found at `tests/e2e/*.spec.ts` — locate the right file before adding assertions.
- Mobile viewport may hide UI elements (sidebar, TOC) — account for this in selectors.
- After adding a new page family, add a nav-integrity assertion for it.

## Source map

- `tests/playwright.config.ts`
- `tests/package.json`
- `tests/e2e/smoke.spec.ts`
- `tests/e2e/nav-integrity.spec.ts`
- `tests/e2e/experience-listing.spec.ts`
- `tests/e2e/experience-detail.spec.ts`
