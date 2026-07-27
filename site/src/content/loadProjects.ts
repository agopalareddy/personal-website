import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { validateEntry } from './validate';
import { decodeEntities } from './decodeEntities';
import type { ProjectEntry } from './types';

const DATABASE_PATH = fileURLToPath(
  new URL('../../../scripts/projects_database.json', import.meta.url)
);

/**
 * Reads projects_database.json — the single source of truth for project
 * content (FR-002) — validating every entry against the Project Entry
 * schema before it can reach a page (FR-014).
 */
export function loadProjects(): ProjectEntry[] {
  const raw = readFileSync(DATABASE_PATH, 'utf-8');
  const entries = JSON.parse(raw) as ProjectEntry[];
  for (const entry of entries) {
    validateEntry('project', entry as unknown as Record<string, unknown>);
    // content_html is intentionally left encoded — see decodeEntities' docs.
    entry.title = decodeEntities(entry.title);
    entry.excerpt = decodeEntities(entry.excerpt);
    entry.venue = decodeEntities(entry.venue);
    entry.venue_tag = decodeEntities(entry.venue_tag);
    entry.formatted_date = decodeEntities(entry.formatted_date);
    entry.category = decodeEntities(entry.category);
  }
  return entries;
}
