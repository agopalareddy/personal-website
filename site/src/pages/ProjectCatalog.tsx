import { Layout } from "../components/chrome/Layout";
import { ProjectCard } from "../components/catalog/ProjectCard";
import type { ProjectEntry } from "../content/types";

/**
 * Ported from projects/index.html. Static, unfiltered listing grouped by
 * year (matching assets/js/projects-catalog.js's renderProjects() grouping)
 * — filter/search/sort is User Story 3 scope (useCatalogFilter), layered on
 * top of this same markup later as a hydrated island.
 */
export function ProjectCatalogPage({ projects }: { projects: ProjectEntry[] }) {
  const sorted = [...projects].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  let lastYear: number | null = null;
  const items: JSX.Element[] = [];
  for (const p of sorted) {
    const year = p.date ? parseInt(p.date.split("-")[0], 10) : null;
    if (year && year !== lastYear) {
      items.push(
        <h2 className="timeline-year" id={`year-${year}`} key={`year-${year}`}>
          {year}
        </h2>,
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
    >
      <h1 className="page-intro-title">Academic &amp; Engineering Projects</h1>
      <p className="page-intro-lead">
        Academic, full-stack applications, machine learning research, and systems engineering
        projects.
      </p>
      <div className="projects-container">
        <div className="project-timeline timeline-section" id="projectGrid">
          {items}
        </div>
      </div>
    </Layout>
  );
}
