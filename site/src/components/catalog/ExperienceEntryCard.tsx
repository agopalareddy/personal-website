import type { ExperienceEntry } from '../../content/types';
import {
  experienceDisplayTitle,
  formatDateRange,
  categoryLabel,
  experienceOrderDate,
  orgGroup,
} from '../../content/experienceDisplay';
import { experienceSearchText } from '../../content/search';

/**
 * One row in the /experience/ list: title | category | dates, then a meta
 * line (organization • context • location) and a one-line excerpt. The
 * title link is stretched over the whole row in CSS, so the row is one
 * click target and needs no separate "Details" button.
 *
 * Keeps the legacy class names / data-* attributes the filter island
 * (catalog-filter.ts) and e2e specs select on.
 */
export function ExperienceEntryCard({ e }: { e: ExperienceEntry }) {
  const title = experienceDisplayTitle(e);
  const detailUrl = `/experience/${e.category}/${e.id}.html`;
  const dateRange = formatDateRange(e.start_date, e.end_date);

  const subtitleParts = [e.organization, e.role_context, e.location].filter(
    (v): v is string => !!v
  );

  const orderDate = experienceOrderDate(e);
  const year = orderDate ? orderDate.split('-')[0] : '';
  const search = experienceSearchText(e);

  return (
    <div
      className="project-card timeline-card experience-card catalog-row"
      id={`exp-${e.id}`}
      data-category={e.category}
      data-group={orgGroup(e.organization)}
      data-year={year}
      data-date={orderDate}
      data-title={title}
      data-search={search}
    >
      <h3 className="project-title">
        <a href={detailUrl}>{title}</a>
      </h3>
      <span className={`card-category cat-${e.category}`}>{categoryLabel(e.category)}</span>
      <span className="card-venue">{dateRange}</span>
      {subtitleParts.length > 0 && (
        <div className="card-org-context">{subtitleParts.join(' • ')}</div>
      )}
      {e.excerpt && <p className="project-excerpt">{e.excerpt}</p>}
    </div>
  );
}
