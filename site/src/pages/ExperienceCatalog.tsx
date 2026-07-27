import { Layout } from "../components/chrome/Layout";
import { ExperienceEntryCard } from "../components/catalog/ExperienceEntryCard";
import { experienceOrderDate } from "../content/experienceDisplay";
import type { ExperienceEntry } from "../content/types";

/**
 * Ported from experience/index.html. Static, unfiltered listing grouped by
 * completion/receipt year (matching assets/js/experience-catalog.js's
 * renderExperiences() grouping) — filter/search/sort/org/year dropdowns and
 * the "On this page" TOC are User Story 3 scope (useCatalogFilter), layered
 * on top of this same markup later as a hydrated island (same deferral as
 * ProjectCatalogPage).
 */
export function ExperienceCatalogPage({ entries }: { entries: ExperienceEntry[] }) {
  const sorted = [...entries].sort(
    (a, b) => new Date(experienceOrderDate(b)).getTime() - new Date(experienceOrderDate(a)).getTime(),
  );

  let lastYear: number | null = null;
  const items: JSX.Element[] = [];
  for (const e of sorted) {
    const orderDate = experienceOrderDate(e);
    const year = orderDate ? parseInt(orderDate.split("-")[0], 10) : null;
    if (year && year !== lastYear) {
      items.push(
        <h2 className="timeline-year" id={`year-${year}`} key={`year-${year}`}>
          {year}
        </h2>,
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
      <div className="experience-container">
        <div className="experience-timeline timeline-section" id="experienceGrid">
          {items}
        </div>
      </div>
    </Layout>
  );
}
