import type { ProjectEntry } from './types';

/** Category label color class (`.cat-*` in style.css) for a project category. */
export function projectCategoryClass(category: string): string {
  if (category === 'Research & ML') return 'cat-research';
  if (category === 'Web Apps') return 'cat-web';
  if (category === 'Software & Tools') return 'cat-tools';
  return '';
}

/**
 * Canonical detail-page URL. Internal links consistently use the
 * `.html`-suffixed form — it matches sitemap.xml and Search Console.
 */
export function projectDetailUrl(p: ProjectEntry): string {
  return p.permalink.endsWith('.html') ? p.permalink : `${p.permalink}.html`;
}

/** Four-digit year of a project's date, or '' when it has none. */
export function projectYear(p: ProjectEntry): string {
  return p.date ? p.date.split('-')[0] : '';
}
