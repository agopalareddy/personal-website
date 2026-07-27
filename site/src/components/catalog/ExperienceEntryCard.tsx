import { Icon } from '../common/Icon';
import type { ExperienceEntry } from '../../content/types';
import {
  experienceDisplayTitle,
  formatDateRange,
  categoryLabel,
  experienceOrderDate,
  orgGroup,
} from '../../content/experienceDisplay';

/**
 * Ported from assets/js/experience-catalog.js's createExperienceCard().
 * Filter/search/sort behavior (renderExperiences()) is User Story 3 scope
 * (useCatalogFilter) — this component only renders one card's static markup.
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
  const orgLower = (e.organization || '').toLowerCase();
  const aliases = [
    orgLower.includes('washington university') ? 'washu' : '',
    orgLower.includes('ohio wesleyan') ? 'owu' : '',
  ];
  const search = [title, e.excerpt, e.organization, e.role_context, e.location, ...aliases]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  return (
    <div
      className="project-card card-surface timeline-card experience-card"
      id={`exp-${e.id}`}
      data-category={e.category}
      data-group={orgGroup(e.organization)}
      data-year={year}
      data-date={orderDate}
      data-title={title}
      data-search={search}
    >
      <span className="timeline-marker" />
      <div className="card-meta">
        <span className={`card-category cat-${e.category}`}>{categoryLabel(e.category)}</span>
        <span className="card-venue">{dateRange}</span>
      </div>
      <h3 className="project-title">
        <a href={detailUrl} aria-label={`Explore dedicated detail page for ${title}`}>
          {title}
        </a>
      </h3>
      {subtitleParts.length > 0 && (
        <div className="card-org-context">{subtitleParts.join(' • ')}</div>
      )}
      <p className="project-excerpt">{e.excerpt}</p>
      <div className="card-actions">
        <a
          href={detailUrl}
          className="card-btn btn-detail"
          aria-label={`Explore dedicated detail page for ${title}`}
        >
          <Icon name="INFO_16" /> Details
        </a>
      </div>
    </div>
  );
}
