import { Layout } from '../components/chrome/Layout';
import { Icon, type IconName } from '../components/common/Icon';
import type { ExperienceEntry } from '../content/types';
import { formatDateRange, categoryLabel, LINK_TYPE_ICONS } from '../content/experienceDisplay';

function sectionHeading(category: string): string {
  if (category === 'presentations' || category === 'awards') return 'About';
  if (category === 'education') return 'Highlights';
  return 'Responsibilities & Contributions';
}

/**
 * Ported from a generated experience detail page (e.g.
 * experience/education/2024-08-m-s-computer-science.html) /
 * scripts/generate_site.py's generate_experience_detail_page(). Not sharing
 * a "detail shell" component with ProjectDetailPage — the two entry shapes
 * (organization/location/links/related_projects vs. content_html/tech/demo)
 * diverge enough that a shared abstraction would just be indirection.
 */
export function ExperienceDetailPage({ e }: { e: ExperienceEntry }) {
  const dateRange = formatDateRange(e.start_date, e.end_date);
  const metaText = [e.role_context, dateRange].filter(Boolean).join(' — ');

  return (
    <Layout
      activePage="experience"
      title={e.title}
      description={e.excerpt || e.title}
      canonicalUrl={`https://agreddy.com/experience/${e.category}/${e.id}.html`}
      ogType="article"
    >
      <h1 style={{ fontFamily: 'var(--font-heading)', marginBottom: '0.5rem' }}>{e.title}</h1>
      {(e.organization || metaText) && (
        <p
          className="entry-meta"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.95rem',
            color: 'var(--text-secondary)',
            margin: '0 0 0.5rem 0',
          }}
        >
          {e.organization && <strong>{e.organization}</strong>}
          {e.organization && metaText && ' — '}
          {metaText}
        </p>
      )}
      {e.location && (
        <p
          className="entry-location"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.85rem',
            color: 'var(--text-muted)',
            margin: '0 0 1.25rem 0',
          }}
        >
          <Icon name="LOCATION_16" /> {e.location}
        </p>
      )}
      <div className="entry-badge" style={{ marginBottom: '1.5rem' }}>
        <span className={`card-category cat-${e.category}`}>{categoryLabel(e.category)}</span>
      </div>

      {e.responsibilities.length > 0 && (
        <section className="page__content" style={{ marginBottom: '2rem' }}>
          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.25rem',
              marginBottom: '0.75rem',
              color: 'var(--text-primary)',
            }}
          >
            {sectionHeading(e.category)}
          </h2>
          <ul>
            {e.responsibilities.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </section>
      )}

      {e.related_projects.length > 0 && (
        <section className="related-projects" style={{ marginBottom: '2rem' }}>
          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.25rem',
              marginBottom: '0.75rem',
              color: 'var(--text-primary)',
            }}
          >
            Related Projects
          </h2>
          <ul>
            {e.related_projects.map((p) => (
              <li key={p}>
                <a href={`/projects/${p}.html`}>{p}</a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {e.links.length > 0 && (
        <section className="entry-links" style={{ marginBottom: '2rem' }}>
          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.25rem',
              marginBottom: '0.75rem',
              color: 'var(--text-primary)',
            }}
          >
            Links
          </h2>
          <ul>
            {e.links.map((l, i) => {
              const isExternal = l.url.startsWith('http://') || l.url.startsWith('https://');
              const icon = (LINK_TYPE_ICONS[l.type] ?? 'LINK_EXTERNAL_16') as IconName;
              return (
                <li key={i}>
                  <a
                    href={l.url}
                    target={isExternal ? '_blank' : undefined}
                    rel={isExternal ? 'noopener' : undefined}
                  >
                    <Icon name={icon} /> {l.label}
                    {isExternal && <span className="sr-only"> (opens in a new tab)</span>}
                  </a>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <p style={{ marginTop: '2.5rem', fontSize: '0.9rem' }}>
        <a href="/experience/">&larr; Back to all experience</a>
      </p>
    </Layout>
  );
}
