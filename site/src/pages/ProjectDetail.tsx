import { Layout } from '../components/chrome/Layout';
import { Icon } from '../components/common/Icon';
import {
  DetailShell,
  DetailLinks,
  type AboutItem,
  type DetailLink,
} from '../components/detail/DetailShell';
import { projectCategoryClass } from '../content/projectDisplay';
import { projectPager, projectRelated } from '../content/detailNav';
import type { ExperienceEntry, ProjectEntry } from '../content/types';

/**
 * A project's detail page, on the shared DetailShell. `content_html` is
 * trusted, pre-rendered HTML from the content pipeline (research.md R4) —
 * injected as-is, not re-parsed. `projects` and `experiences` are the full
 * lists, for the newer/older links and the related experience entries.
 */
export function ProjectDetailPage({
  p,
  projects,
  experiences,
  ogImage,
  jsonLd,
}: {
  p: ProjectEntry;
  projects: ProjectEntry[];
  experiences: ExperienceEntry[];
  ogImage?: string;
  jsonLd?: string;
}) {
  const links: DetailLink[] = [];
  if (p.github)
    links.push({ label: 'Code on GitHub', href: p.github, icon: <Icon name="MARK_GITHUB_16" /> });
  if (p.demo) links.push({ label: 'Live demo', href: p.demo, icon: <Icon name="ROCKET_16" /> });
  if (p.pdf) links.push({ label: 'Paper (PDF)', href: p.pdf, icon: <Icon name="FILE_16" /> });
  if (p.presentation)
    links.push({ label: 'Slides', href: p.presentation, icon: <Icon name="FILE_16" /> });

  const about: AboutItem[] = [
    {
      label: 'Category',
      value: (
        <span className={`card-category ${projectCategoryClass(p.category)}`}>{p.category}</span>
      ),
      lead: true,
    },
    { label: 'Venue', value: p.venue },
    { label: 'Dates', value: p.formatted_date, lead: true },
  ];
  if (p.technologies.length > 0) {
    about.push({ label: 'Built with', value: p.technologies.join(', ') });
  }
  if (links.length > 0) {
    about.push({ label: 'Links', value: <DetailLinks links={links} />, lead: true });
  }

  return (
    <Layout
      activePage="projects"
      title={p.title}
      description={p.excerpt}
      // SEO metadata (canonical/og/twitter) and internal <a href> navigation
      // (ProjectCard, Home featured projects, etc.) consistently use the
      // canonical .html-suffixed URL — matches sitemap.xml and Search Console.
      canonicalUrl={`https://agreddy.com${p.permalink}.html`}
      ogImage={ogImage}
      jsonLd={jsonLd}
    >
      <DetailShell
        crumbs={[{ label: 'Projects', href: '/projects/' }]}
        title={p.title}
        subtitle={p.excerpt}
        about={about}
        aboutLabel="About this project"
        related={projectRelated(p, experiences)}
        pager={projectPager(p, projects)}
      >
        {p.figure && (
          <figure className="detail-figure">
            <img
              src={p.figure.src}
              alt={p.figure.alt}
              width={p.figure.width}
              height={p.figure.height}
              decoding="async"
            />
            <figcaption>{p.figure.caption}</figcaption>
          </figure>
        )}
        {p.pipeline && (
          <figure className="detail-figure">
            <ol className="pipeline">
              {p.pipeline.stages.map((stage, i) => (
                <li className="pipeline-stage" key={stage.title}>
                  <p className="pipeline-stage-title">
                    <span className="pipeline-stage-number">Stage {i + 1}</span> {stage.title}
                  </p>
                  <ol className="pipeline-steps">
                    {stage.steps.map((step) => (
                      <li key={step}>{step}</li>
                    ))}
                  </ol>
                </li>
              ))}
            </ol>
            <figcaption>{p.pipeline.caption}</figcaption>
          </figure>
        )}
        <section className="page__content" dangerouslySetInnerHTML={{ __html: p.content_html }} />
      </DetailShell>
    </Layout>
  );
}
