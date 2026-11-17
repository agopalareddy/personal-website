import type { ExperienceEntry, ProjectEntry } from './types';
import { experienceDisplayTitle } from './experienceDisplay';

/**
 * Catalog search, shared by the build (Home decides which skills to link)
 * and the filter island (catalog-filter.ts), so a link only appears where
 * the search will find something.
 *
 * A plain query matches anywhere ("jav" finds JavaScript, as you type).
 * A query in double quotes matches whole words only, so "Java" does not
 * find JavaScript. Home's skill links use the quoted form.
 */
export function matchesQuery(text: string, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const quoted = q.length > 2 && q.startsWith('"') && q.endsWith('"');
  if (!quoted) return text.includes(q);
  const term = q
    .slice(1, -1)
    .trim()
    .replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`(?<![a-z0-9])${term}(?![a-z0-9])`).test(text);
}

function aliases(org: string): string[] {
  const lower = org.toLowerCase();
  return [
    lower.includes('washington university') ? 'washu' : '',
    lower.includes('ohio wesleyan') ? 'owu' : '',
  ];
}

/** The text a project row is searched by (its data-search attribute). */
export function projectSearchText(p: ProjectEntry): string {
  return [p.title, p.excerpt, p.venue, p.venue_tag, ...p.technologies, ...aliases(p.venue || '')]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}

/** The text an experience row is searched by (its data-search attribute). */
export function experienceSearchText(e: ExperienceEntry): string {
  return [
    experienceDisplayTitle(e),
    e.excerpt,
    e.organization,
    e.role_context,
    e.location,
    ...(e.people ?? []).map((person) => person.name),
    ...aliases(e.organization || ''),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}
