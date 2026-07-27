import { Layout } from '../components/chrome/Layout';
import { ProjectCard } from '../components/catalog/ProjectCard';
import { CatalogFilter } from '../components/catalog/CatalogFilter';
import type { ProjectEntry } from '../content/types';

const CATEGORIES = [
  { value: 'all', label: 'All' },
  { value: 'Research & ML', label: 'Research & ML' },
  { value: 'Software & Tools', label: 'Software & Tools' },
  { value: 'Web Apps', label: 'Web Apps' },
];

const VENUE_OPTIONS = [
  { value: 'all', label: 'All Institutions/Venues' },
  { value: 'WashU', label: 'Washington University in St. Louis' },
  { value: 'OWU', label: 'Ohio Wesleyan University' },
  { value: 'MITxSureStart', label: 'MITxSureStart' },
  { value: 'Personal', label: 'Personal Projects' },
];

/**
 * Ported from projects/index.html. Static listing grouped by year (matching
 * assets/js/projects-catalog.js's renderProjects() grouping); filter/search/
 * sort/TOC are hydrated client-side by site/src/islands/catalog-filter.ts
 * (T039/T042) reading the data-* attributes ProjectCard sets on each card —
 * this initial server-rendered order is also the island's default state.
 */
export function ProjectCatalogPage({ projects }: { projects: ProjectEntry[] }) {
  const sorted = [...projects].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  const years = Array.from(
    new Set(projects.map((p) => (p.date ? parseInt(p.date.split('-')[0], 10) : null)))
  )
    .filter((y): y is number => y !== null)
    .sort((a, b) => b - a);

  let lastYear: number | null = null;
  const items: JSX.Element[] = [];
  for (const p of sorted) {
    const year = p.date ? parseInt(p.date.split('-')[0], 10) : null;
    if (year && year !== lastYear) {
      items.push(
        <h2 className="timeline-year" id={`year-${year}`} key={`year-${year}`}>
          {year}
        </h2>
      );
      lastYear = year;
    }
    items.push(<ProjectCard p={p} key={p.id} />);
  }

  return (
    <Layout
      activePage="projects"
      title="Academic & Engineering Projects"
      description="Academic and engineering projects by Aadarsha Gopala Reddy, featuring research on cognitive driving signatures for early Alzheimer's prediction, reinforcement learning for datacenter cooling, and modern systems."
      canonicalUrl="https://agreddy.com/projects/"
      contentAriaLabel="Projects Grid Content"
      sidebarExtra={
        <CatalogFilter
          categories={CATEGORIES}
          categoryGroupAriaLabel="Category Filters"
          searchId="projectSearch"
          searchPlaceholder="Search projects, tags, venues..."
          searchAriaLabel="Search projects by title, tags, or venues"
          groupSelectId="venueFilter"
          groupAriaLabel="Filter projects by institution or venue"
          groupOptions={VENUE_OPTIONS}
          yearSelectId="yearFilter"
          yearAriaLabel="Filter projects by year range"
          years={years}
          sortSelectId="projectSort"
          sortAriaLabel="Sort projects chronologically or alphabetically"
        />
      }
    >
      <h1 className="page-intro-title">Academic &amp; Engineering Projects</h1>
      <p className="page-intro-lead">
        Academic, full-stack applications, machine learning research, and systems engineering
        projects.
      </p>
      <div className="projects-container">
        <p id="resultsCount" className="results-count" aria-live="polite" />
        <div className="project-timeline timeline-section" id="projectGrid">
          {items}
        </div>
        <div id="emptyState" className="empty-state" hidden>
          No projects match your search or filter criteria.
          <button type="button" id="clearFiltersBtn" className="card-btn btn-detail">
            Clear Filters
          </button>
        </div>
      </div>
    </Layout>
  );
}
