import { Layout } from '../components/chrome/Layout';
import { ExperienceEntryCard } from '../components/catalog/ExperienceEntryCard';
import { CatalogFilter } from '../components/catalog/CatalogFilter';
import { experienceOrderDate } from '../content/experienceDisplay';
import type { ExperienceEntry } from '../content/types';

const CATEGORIES = [
  { value: 'all', label: 'All' },
  { value: 'professional', label: 'Professional' },
  { value: 'education', label: 'Education' },
  { value: 'research', label: 'Research' },
  { value: 'leadership', label: 'Leadership' },
  { value: 'presentations', label: 'Presentations' },
  { value: 'awards', label: 'Awards' },
];

const ORG_OPTIONS = [
  { value: 'all', label: 'All Organizations' },
  { value: 'WashU', label: 'Washington University in St. Louis' },
  { value: 'OWU', label: 'Ohio Wesleyan University' },
  { value: 'Corporate', label: 'Corporate / Industry' },
  { value: 'Personal', label: 'Other / Personal' },
];

/**
 * Ported from experience/index.html. Static listing grouped by completion/
 * receipt year (matching assets/js/experience-catalog.js's
 * renderExperiences() grouping); filter/search/sort/org/year dropdowns and
 * the "On this page" TOC are hydrated client-side by
 * site/src/islands/catalog-filter.ts (T039/T042), the same generic engine
 * ProjectCatalogPage uses.
 */
export function ExperienceCatalogPage({ entries }: { entries: ExperienceEntry[] }) {
  const sorted = [...entries].sort(
    (a, b) =>
      new Date(experienceOrderDate(b)).getTime() - new Date(experienceOrderDate(a)).getTime()
  );
  const years = Array.from(
    new Set(
      entries.map((e) => {
        const d = experienceOrderDate(e);
        return d ? parseInt(d.split('-')[0], 10) : null;
      })
    )
  )
    .filter((y): y is number => y !== null)
    .sort((a, b) => b - a);

  let lastYear: number | null = null;
  const items: JSX.Element[] = [];
  for (const e of sorted) {
    const orderDate = experienceOrderDate(e);
    const year = orderDate ? parseInt(orderDate.split('-')[0], 10) : null;
    if (year && year !== lastYear) {
      items.push(
        <h2 className="timeline-year" id={`year-${year}`} key={`year-${year}`}>
          {year}
        </h2>
      );
      lastYear = year;
    }
    items.push(<ExperienceEntryCard e={e} key={e.id} />);
  }

  return (
    <Layout
      activePage="experience"
      title="Experience"
      description="Aadarsha Gopala Reddy's professional, research, leadership, and academic experience."
      canonicalUrl="https://agreddy.com/experience/"
      contentAriaLabel="Experience Grid Content"
      sidebarExtra={
        <CatalogFilter
          categories={CATEGORIES}
          categoryGroupAriaLabel="Category Filters"
          searchId="experienceSearch"
          searchPlaceholder="Search experience..."
          searchAriaLabel="Search experience by title, organization, or keyword"
          groupSelectId="orgFilter"
          groupAriaLabel="Filter experience by organization"
          groupOptions={ORG_OPTIONS}
          yearSelectId="yearFilter"
          yearAriaLabel="Filter experience by year range"
          years={years}
          sortSelectId="experienceSort"
          sortAriaLabel="Sort experience chronologically or alphabetically"
        />
      }
    >
      <h1 className="page-intro-title">Experience</h1>
      <p className="page-intro-lead">
        Professional, research, leadership, and academic experience across industry and academia.
      </p>
      <div className="experience-container">
        <p id="resultsCount" className="results-count" aria-live="polite" />
        <div className="experience-timeline timeline-section" id="experienceGrid">
          {items}
        </div>
        <div id="emptyState" className="empty-state" hidden>
          No experience entries match your search or filter criteria.
          <button type="button" id="clearFiltersBtn" className="card-btn btn-detail">
            Clear Filters
          </button>
        </div>
      </div>
    </Layout>
  );
}
