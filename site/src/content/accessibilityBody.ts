import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const BODY_PATH = fileURLToPath(new URL('./accessibility-body.html', import.meta.url));

/**
 * Raw HTML extracted verbatim from accessibility.html's <article> content —
 * loaded from disk rather than hand-transcribed into JSX, since a statement
 * about the site's own accessibility behavior (Constitution Principle IV)
 * must be byte-accurate, not just close.
 */
export function loadAccessibilityBody(): string {
  return readFileSync(BODY_PATH, 'utf-8');
}
