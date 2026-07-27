import { Icon } from "../common/Icon";
import type { ExperienceEntry } from "../../content/types";
import { experienceDisplayTitle, formatDateRange, categoryLabel } from "../../content/experienceDisplay";

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
    (v): v is string => !!v,
  );

  return (
    <div
      className="project-card card-surface timeline-card experience-card"
      id={`exp-${e.id}`}
      data-category={e.category}
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
        <div className="card-org-context">{subtitleParts.join(" • ")}</div>
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
