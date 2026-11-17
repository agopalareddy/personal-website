import type { PagerLink, RelatedLink } from '../components/detail/DetailShell';
import {
  categoryLabel,
  experienceDisplayTitle,
  experienceOrderDate,
  formatDateRange,
} from './experienceDisplay';
import { projectDetailUrl, projectYear } from './projectDisplay';
import type { ExperienceEntry, ProjectEntry } from './types';

/**
 * Cross-links and newer/older links for detail pages. The one source for the
 * cross-links is `related_projects` in the experience database (a list of
 * project slugs); project pages get the reverse direction from the same
 * list, so a link can never exist one way only.
 */

export function projectSlug(p: ProjectEntry): string {
  return p.permalink.replace(/^\/projects\//, '');
}

export function experienceDetailUrl(e: ExperienceEntry): string {
  return `/experience/${e.category}/${e.id}.html`;
}

/** Projects an experience entry names in `related_projects`. */
export function experienceRelated(e: ExperienceEntry, projects: ProjectEntry[]): RelatedLink[] {
  return e.related_projects.map((slug) => {
    const p = projects.find((x) => projectSlug(x) === slug && x.has_detail);
    if (!p) {
      throw new Error(`Experience "${e.id}": related project "${slug}" has no detail page`);
    }
    // A link that repeats the page's own title reads as a link to itself.
    const label = p.title === experienceDisplayTitle(e) ? 'Project write-up' : p.title;
    return { label, href: projectDetailUrl(p), note: `Project · ${projectYear(p)}` };
  });
}

/** Experience entries that name this project in their `related_projects`. */
export function projectRelated(p: ProjectEntry, experiences: ExperienceEntry[]): RelatedLink[] {
  const slug = projectSlug(p);
  return experiences
    .filter((e) => e.related_projects.includes(slug))
    .map((e) => ({
      label:
        experienceDisplayTitle(e) === p.title
          ? `${categoryLabel(e.category)} entry: ${e.organization}`
          : experienceDisplayTitle(e),
      href: experienceDetailUrl(e),
      note: [categoryLabel(e.category), formatDateRange(e.start_date, e.end_date)]
        .filter(Boolean)
        .join(' · '),
    }));
}

function neighbours<T>(
  list: T[],
  current: T,
  toLink: (item: T) => PagerLink
): { newer?: PagerLink; older?: PagerLink } {
  const i = list.indexOf(current);
  return {
    newer: i > 0 ? toLink(list[i - 1]) : undefined,
    older: i >= 0 && i < list.length - 1 ? toLink(list[i + 1]) : undefined,
  };
}

/** The projects either side of this one, newest first (the catalog's order). */
export function projectPager(p: ProjectEntry, projects: ProjectEntry[]) {
  const ordered = projects.filter((x) => x.has_detail).sort((a, b) => b.date.localeCompare(a.date));
  return {
    label: 'More projects',
    ...neighbours(ordered, p, (x) => ({ label: x.title, href: projectDetailUrl(x) })),
  };
}

/** The entries either side of this one within its category, newest first. */
export function experiencePager(e: ExperienceEntry, experiences: ExperienceEntry[]) {
  const ordered = experiences
    .filter((x) => x.category === e.category)
    .sort((a, b) => experienceOrderDate(b).localeCompare(experienceOrderDate(a)));
  return {
    label: `More in ${categoryLabel(e.category)}`,
    ...neighbours(ordered, e, (x) => ({
      label: experienceDisplayTitle(x),
      href: experienceDetailUrl(x),
    })),
  };
}
