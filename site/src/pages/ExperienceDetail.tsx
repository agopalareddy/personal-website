import { Layout } from '../components/chrome/Layout';
import { Icon, type IconName } from '../components/common/Icon';
import {
  DetailShell,
  DetailLinks,
  type AboutItem,
  type DetailLink,
} from '../components/detail/DetailShell';
import type { ExperienceEntry, ProjectEntry } from '../content/types';
import { formatDateRange, categoryLabel, LINK_TYPE_ICONS } from '../content/experienceDisplay';
import { experiencePager, experienceRelated } from '../content/detailNav';

function sectionHeading(category: string): string {
  if (category === 'presentations' || category === 'awards') return 'About';
  if (category === 'education') return 'Highlights';
  return 'Responsibilities & Contributions';
}

/**
 * An experience entry's detail page, on the same DetailShell as projects:
 * the facts (organization, location, dates, links) sit in the About column
 * and the responsibilities are the prose. `experiences` and `projects` are
 * the full lists, for the newer/older links and the related projects.
 */
export function ExperienceDetailPage({
  e,
  experiences,
  projects,
}: {
  e: ExperienceEntry;
  experiences: ExperienceEntry[];
  projects: ProjectEntry[];
}) {
  const dateRange = formatDateRange(e.start_date, e.end_date);

  // One-line awards use the same sentence as excerpt and only bullet — say it once.
  const subtitle = e.excerpt && e.excerpt.trim() !== e.responsibilities[0]?.trim() ? e.excerpt : '';

  const links: DetailLink[] = e.links.map((l) => ({
    label: l.label,
    href: l.url,
    icon: <Icon name={(LINK_TYPE_ICONS[l.type] ?? 'LINK_EXTERNAL_16') as IconName} />,
  }));

  const about: AboutItem[] = [
    {
      label: 'Category',
      value: <span className={`card-category cat-${e.category}`}>{categoryLabel(e.category)}</span>,
      lead: true,
    },
  ];
  if (e.organization) about.push({ label: 'Organization', value: e.organization, lead: true });
  if (e.role_context) about.push({ label: 'Context', value: e.role_context });
  for (const person of e.people ?? []) about.push({ label: person.role, value: person.name });
  if (e.location) about.push({ label: 'Location', value: e.location });
  if (dateRange) about.push({ label: 'Dates', value: dateRange, lead: true });
  if (links.length > 0) {
    about.push({ label: 'Links', value: <DetailLinks links={links} />, lead: true });
  }

  return (
    <Layout
      activePage="experience"
      title={e.title}
      description={e.excerpt || e.title}
      canonicalUrl={`https://agreddy.com/experience/${e.category}/${e.id}.html`}
      ogType="article"
    >
      <DetailShell
        crumbs={[
          { label: 'Experience', href: '/experience/' },
          { label: categoryLabel(e.category), href: `/experience/?category=${e.category}` },
        ]}
        title={e.title}
        subtitle={subtitle}
        about={about}
        aboutLabel="About this entry"
        related={experienceRelated(e, projects)}
        pager={experiencePager(e, experiences)}
      >
        {e.responsibilities.length > 0 && (
          <section className="page__content">
            <h2>{sectionHeading(e.category)}</h2>
            <ul>
              {e.responsibilities.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </section>
        )}
      </DetailShell>
    </Layout>
  );
}
