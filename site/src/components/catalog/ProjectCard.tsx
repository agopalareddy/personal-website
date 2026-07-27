import { Icon } from '../common/Icon';
import type { ProjectEntry } from '../../content/types';

const VENUE_LABELS: Record<string, string> = {
  WashU: 'Washington University in St. Louis',
  OWU: 'Ohio Wesleyan University',
  MITxSureStart: 'MITxSureStart',
  Personal: 'Personal Projects',
};

function categoryClass(category: string): string {
  if (category === 'Research & ML') return 'cat-research';
  if (category === 'Web Apps') return 'cat-web';
  if (category === 'Software & Tools') return 'cat-tools';
  return '';
}

function ProjectActions({ p }: { p: ProjectEntry }) {
  return (
    <div className="card-actions">
      <a
        href={p.permalink}
        className="card-btn btn-detail"
        aria-label={`Explore dedicated detail page for ${p.title}`}
      >
        <Icon name="INFO_16" /> Details
      </a>
      {p.github && (
        <a
          href={p.github}
          target="_blank"
          rel="noopener"
          className="card-btn btn-github"
          aria-label={`View ${p.title} codebase on GitHub (opens in a new tab)`}
        >
          <Icon name="MARK_GITHUB_16" /> Code <span className="sr-only">(opens in a new tab)</span>
        </a>
      )}
      {p.demo && (
        <a
          href={p.demo}
          className="card-btn btn-demo"
          aria-label={`Launch live interactive demo for ${p.title}`}
        >
          <Icon name="ROCKET_16" /> Demo
        </a>
      )}
      {p.pdf && (
        <a
          href={p.pdf}
          target="_blank"
          rel="noopener"
          className="card-btn btn-pdf"
          aria-label={`Download ${p.title} PDF paper (opens in a new tab)`}
        >
          <Icon name="FILE_16" /> PDF <span className="sr-only">(opens in a new tab)</span>
        </a>
      )}
      {p.presentation && (
        <a
          href={p.presentation}
          target="_blank"
          rel="noopener"
          className="card-btn btn-pdf"
          aria-label={`Download ${p.title} presentation slides (opens in a new tab)`}
        >
          <Icon name="FILE_16" /> Slide <span className="sr-only">(opens in a new tab)</span>
        </a>
      )}
    </div>
  );
}

/**
 * Ported from assets/js/projects-catalog.js's buildProjectCard() +
 * buildProjectActions(). Filter/search/sort behavior (renderProjects()) is
 * User Story 3 scope (useCatalogFilter) — this component only renders one
 * card's static markup.
 */
export function ProjectCard({ p }: { p: ProjectEntry }) {
  const venueLabel = VENUE_LABELS[p.venue_tag] ?? p.venue_tag;
  const year = p.date ? p.date.split('-')[0] : '';
  const venueLower = p.venue.toLowerCase();
  const aliases = [
    venueLower.includes('washington university') ? 'washu' : '',
    venueLower.includes('ohio wesleyan') ? 'owu' : '',
  ];
  const search = [p.title, p.excerpt, p.venue, p.venue_tag, ...p.technologies, ...aliases]
    .join(' ')
    .toLowerCase();
  return (
    <div
      className="project-card card-surface timeline-card"
      id={`proj-${p.id}`}
      data-category={p.category}
      data-group={p.venue_tag}
      data-year={year}
      data-date={p.date}
      data-title={p.title}
      data-search={search}
    >
      <span className="timeline-marker" />
      <div className="card-meta">
        <span className={`card-category ${categoryClass(p.category)}`}>{p.category}</span>
        <span className="card-venue">{p.formatted_date}</span>
      </div>
      <h3 className="project-title">
        <a href={p.permalink} aria-label={`Explore dedicated detail page for ${p.title}`}>
          {p.title}
        </a>
      </h3>
      <div className="card-org-context">{venueLabel}</div>
      <p className="project-excerpt">{p.excerpt}</p>
      <div className="project-tech">
        {p.technologies.map((t) => (
          <span className="tech-tag" key={t}>
            {t}
          </span>
        ))}
      </div>
      <ProjectActions p={p} />
    </div>
  );
}
