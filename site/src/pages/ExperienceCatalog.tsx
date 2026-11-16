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
  { value: 'all', label: 'All organizations' },
  { value: 'WashU', label: 'Washington University in St. Louis' },
  { value: 'OWU', label: 'Ohio Wesleyan University' },
  { value: 'Corporate', label: 'Corporate / Industry' },
  { value: 'Personal', label: 'Other / Personal' },
];

/**
 * /experience/ — static list grouped by completion/receipt year. The toolbar's
 * search, dropdowns, category tabs, and "Jump to year" links are hydrated
 * client-side by site/src/islands/catalog-filter.ts, the same generic engine
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

  const yearOf = (e: ExperienceEntry): number | null => {
    const d = experienceOrderDate(e);
    return d ? parseInt(d.split('-')[0], 10) : null;
  };
  const yearCounts = new Map<number, number>();
  const categoryCounts: Record<string, number> = { all: entries.length };
  for (const e of entries) {
    const y = yearOf(e);
    if (y) yearCounts.set(y, (yearCounts.get(y) ?? 0) + 1);
    categoryCounts[e.category] = (categoryCounts[e.category] ?? 0) + 1;
  }

  let lastYear: number | null = null;
  const items: JSX.Element[] = [];
  for (const e of sorted) {
    const year = yearOf(e);
    if (year && year !== lastYear) {
      const n = yearCounts.get(year) ?? 0;
      items.push(
        <h2
          className="timeline-year"
          id={`year-${year}`}
          key={`year-${year}`}
          data-count={`${n} ${n === 1 ? 'entry' : 'entries'}`}
        >
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
    >
      <h1 className="page-intro-title">Experience</h1>
      <p className="page-intro-lead">
        Professional, research, leadership, and academic experience across industry and academia.
      </p>
      <CatalogFilter
        categories={CATEGORIES}
        categoryCounts={categoryCounts}
        categoryGroupAriaLabel="Category Filters"
        searchId="experienceSearch"
        searchPlaceholder="Search experience"
        searchAriaLabel="Search experience by title, organization, or keyword"
        groupSelectId="orgFilter"
        groupAriaLabel="Filter experience by organization"
        groupOptions={ORG_OPTIONS}
        years={years}
        sortSelectId="experienceSort"
        sortAriaLabel="Sort experience chronologically or alphabetically"
        initialResultsText={`Showing ${entries.length} entries.`}
      />
      <div className="experience-container">
        <div className="experience-timeline timeline-section" id="experienceGrid">
          {items}
        </div>
        <div id="emptyState" className="empty-state" hidden>
          <p>No experience entries match your search or filters.</p>
          <button type="button" id="clearFiltersBtn" className="btn-default">
            Clear filters
          </button>
        </div>
      </div>
    </Layout>
  );
}
