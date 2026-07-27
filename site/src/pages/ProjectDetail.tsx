import { Layout } from '../components/chrome/Layout';
import { Icon } from '../components/common/Icon';
import type { ProjectEntry } from '../content/types';

/**
 * Ported from a generated project detail page (e.g. projects/aiparkinscan.html).
 * `content_html` is trusted, pre-rendered HTML from the existing content
 * pipeline (research.md R4) — injected as-is, not re-parsed.
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
  return (
    <Layout
      activePage="projects"
      title={p.title}
      description={p.excerpt}
      // SEO metadata (canonical/og/twitter) uses the .html-suffixed URL —
      // matches today's sitemap.xml and generated <head> tags exactly.
      // Internal <a href> navigation (ProjectCard, etc.) still uses the
      // extension-less `permalink` field, unchanged.
      canonicalUrl={`https://agreddy.com${p.permalink}.html`}
      ogImage={ogImage}
      jsonLd={jsonLd}
    >
      <h1 style={{ fontFamily: 'var(--font-heading)', marginBottom: '0.5rem' }}>{p.title}</h1>
      <p
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.9rem',
          fontStyle: 'italic',
          color: 'var(--text-muted)',
          marginBottom: '2rem',
        }}
      >
        {p.venue} — {p.formatted_date}
      </p>
      <section className="page__content" dangerouslySetInnerHTML={{ __html: p.content_html }} />

      <div
        style={{
          marginTop: '2rem',
          borderTop: '1px solid var(--border-color)',
          paddingTop: '1.5rem',
        }}
      >
        <h4
          style={{
            fontFamily: 'var(--font-heading)',
            marginBottom: '0.5rem',
            color: 'var(--text-primary)',
          }}
        >
          Technologies Applied
        </h4>
        <div className="project-tech">
          {p.technologies.map((t) => (
            <span className="tech-tag" key={t}>
              {t}
            </span>
          ))}
        </div>
      </div>

      <div
        className="card-actions"
        style={{ marginTop: '2rem', justifyContent: 'flex-start', gap: '1rem' }}
      >
        {p.github && (
          <a href={p.github} target="_blank" rel="noopener" className="card-btn btn-github">
            <Icon name="MARK_GITHUB_16" /> GitHub{' '}
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        )}
        {p.demo && (
          <a href={p.demo} className="card-btn btn-demo">
            <Icon name="ROCKET_16" /> Demo
          </a>
        )}
        {p.pdf && (
          <a href={p.pdf} target="_blank" rel="noopener" className="card-btn btn-pdf">
            <Icon name="FILE_16" /> PDF Paper <span className="sr-only">(opens in a new tab)</span>
          </a>
        )}
        {p.presentation && (
          <a href={p.presentation} target="_blank" rel="noopener" className="card-btn btn-pdf">
            <Icon name="FILE_16" /> Slides <span className="sr-only">(opens in a new tab)</span>
          </a>
        )}
      </div>
    </Layout>
  );
}
