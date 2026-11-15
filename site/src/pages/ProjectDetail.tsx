import { Layout } from '../components/chrome/Layout';
import { Icon } from '../components/common/Icon';
import {
  DetailShell,
  DetailLinks,
  type AboutItem,
  type DetailLink,
} from '../components/detail/DetailShell';
import { projectCategoryClass } from '../content/projectDisplay';
import type { ProjectEntry } from '../content/types';

/**
 * A project's detail page, on the shared DetailShell. `content_html` is
 * trusted, pre-rendered HTML from the content pipeline (research.md R4) —
 * injected as-is, not re-parsed.
 */
export function ProjectDetailPage({
  p,
  ogImage,
  jsonLd,
}: {
  p: ProjectEntry;
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
    },
    { label: 'Venue', value: p.venue },
    { label: 'Dates', value: p.formatted_date },
  ];
  if (p.technologies.length > 0) {
    about.push({ label: 'Built with', value: p.technologies.join(', ') });
  }
  if (links.length > 0) {
    about.push({ label: 'Links', value: <DetailLinks links={links} /> });
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
      >
        <section className="page__content" dangerouslySetInnerHTML={{ __html: p.content_html }} />
      </DetailShell>
    </Layout>
  );
}
