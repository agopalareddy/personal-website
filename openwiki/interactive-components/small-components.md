# Status Badge, CV Modal & Email Protection

Small reusable JS components that provide targeted functionality across the site.

## Status Badge

Source: `assets/js/status-badge.js` (~5 KB)

Auto-mounts a status badge (e.g. "Open to opportunities") into any page containing `<aside class="academic-sidebar">`.

### Configuration via data attributes

| Attribute                | Default                             | Description                                  |
| ------------------------ | ----------------------------------- | -------------------------------------------- |
| `data-status-badge`      | `"Open to opportunities"`           | Badge text; `"off"` to skip                  |
| `data-status-aria-label` | `"Currently open to opportunities"` | Screen reader label                          |
| `data-status-variant`    | `"available"`                       | `available`, `busy`, `unavailable`, `custom` |
| `data-status-pulse`      | `"true"`                            | Animated dot indicator                       |
| `data-status-icon`       | `null`                              | Font Awesome class                           |

### DOM behavior

- Idempotent: mounting twice on the same sidebar is a no-op.
- If a page already has a hardcoded `.status-badge`, auto-mount skips it.
- Insertion point: inside `.author-avatar-wrapper`, before `.author-links`.
- Uses `WeakSet` to track mounted instances.

### Recent history

- `3216b8a`: introduced reusable component, replacing hardcoded badges
- `c3ff767`, `dcb1ae7`, `55a7781`, `e49c6a6`: insertion point refinements for different page types

## CV Modal

Source: `assets/js/cv-modal.js` (~2 KB)

Opens a `<dialog>` element for inline PDF preview of CV/resume documents.

### Behavior

- Trigger: elements with `[data-action="open-document"]`
- Reads `data-doc-title` and `data-doc-src` from trigger
- Falls back to `window.open()` on mobile (< 640px) or if `<dialog>` is unsupported
- Resets iframe to `about:blank` on close (prevents audio/video leakage)
- Detects dark mode to set `iframe.style.colorScheme`

### Why it exists

Provides a polished inline preview without navigating away from the page, while gracefully degrading on mobile.

## Email Protection

Source: `assets/js/email-protection.js` (~1.5 KB)

Obfuscates email addresses from scrapers by storing them as base64-encoded parts in data attributes.

### How it works

1. HTML has `<a data-email-user="YWR1cnM=" data-email-domain="Z21haWwuY29t">`
2. `email-protection.js` decodes `atob()` on `DOMContentLoaded`
3. Sets the `href="mailto:..."` and optional display text
4. Removes raw data attributes after decoding, adds class `email-decoded`

Bots that don't execute JS see no email in the raw HTML.

## Change guidance

- Status badge: if adding a new sidebar variant, test that it doesn't duplicate on already-badged pages.
- CV modal: the `iframe` reset on close is important for security — don't remove it.
- Email protection: keep the `atob()` calls — they are the entire security mechanism.

## Source map

- `assets/js/status-badge.js`
- `assets/js/cv-modal.js`
- `assets/js/email-protection.js`
- Git: `3216b8a`, `e49c6a6` (status badge evolution)
