import { Icon } from '../common/Icon';
import type { ProjectEntry } from '../../content/types';
import { projectCategoryClass, projectDetailUrl } from '../../content/projectDisplay';

const VENUE_LABELS: Record<string, string> = {
  WashU: 'Washington University in St. Louis',
  OWU: 'Ohio Wesleyan University',
  MITxSureStart: 'MITxSureStart',
  Personal: 'Personal Projects',
};

/** How many technologies a row names before collapsing the rest into "+N". */
const ROW_TECH_LIMIT = 4;

/** Quiet per-row links (code, demo, paper, slides) — text only, no fills. */
function ProjectRowLinks({ p }: { p: ProjectEntry }) {
  const shown = p.technologies.slice(0, ROW_TECH_LIMIT);
  const hidden = p.technologies.length - shown.length;
  return (
    <div className="card-actions">
      {shown.length > 0 && (
        <span className="row-tech">
          {shown.join(' · ')}
          {hidden > 0 && ` · +${hidden}`}
        </span>
      )}
      {p.github && (
        <a
          href={p.github}
          target="_blank"
          rel="noopener"
          className="row-link"
          aria-label={`Code for ${p.title} on GitHub (opens in a new tab)`}
        >
          <Icon name="MARK_GITHUB_16" /> Code
        </a>
      )}
      {p.demo && (
        <a href={p.demo} className="row-link" aria-label={`Demo of ${p.title}`}>
          <Icon name="ROCKET_16" /> Demo
        </a>
      )}
      {p.pdf && (
        <a
          href={p.pdf}
          target="_blank"
          rel="noopener"
          className="row-link"
          aria-label={`PDF paper for ${p.title} (opens in a new tab)`}
        >
          <Icon name="FILE_16" /> PDF
        </a>
      )}
      {p.presentation && (
        <a
          href={p.presentation}
          target="_blank"
          rel="noopener"
          className="row-link"
          aria-label={`Slides for ${p.title} (opens in a new tab)`}
        >
          <Icon name="FILE_16" /> Slides
        </a>
      )}
    </div>
  );
}

/**
 * One row in the /projects/ list: title | category | dates, then venue, a
 * one-line excerpt, and a quiet line naming the main technologies and any
 * code/demo/paper links. The title link is stretched over the whole row in
 * CSS; the per-row links sit above it.
 *
 * Keeps the legacy class names / data-* attributes the filter island
 * (catalog-filter.ts) and e2e specs select on. `data-search` still carries
 * every technology, so search matches ones the row doesn't print.
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
      className="project-card timeline-card catalog-row"
      id={`proj-${p.id}`}
      data-category={p.category}
      data-group={p.venue_tag}
      data-year={year}
      data-date={p.date}
      data-title={p.title}
      data-search={search}
    >
      <h3 className="project-title">
        <a href={projectDetailUrl(p)}>{p.title}</a>
      </h3>
      <span className={`card-category ${projectCategoryClass(p.category)}`}>{p.category}</span>
      <span className="card-venue">{p.formatted_date}</span>
      <div className="card-org-context">{venueLabel}</div>
      <p className="project-excerpt">{p.excerpt}</p>
      <ProjectRowLinks p={p} />
    </div>
  );
}
