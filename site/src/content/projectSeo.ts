import type { ProjectEntry } from './types';

/**
 * Ported from generate_site.py's build_project_json_ld(). The MS thesis gets
 * ScholarlyArticle; everything else gets SoftwareApplication (has a live
 * demo) or SoftwareSourceCode (source-only) so search engines and LLM
 * crawlers can tell written research apart from shipped code.
 */
export function buildProjectJsonLd(
  project: ProjectEntry,
  canonicalUrl: string,
  ogImage: string
): string {
  const base: Record<string, unknown> = {
    '@context': 'https://schema.org',
    name: project.title,
    description: project.excerpt,
    url: canonicalUrl,
    image: ogImage,
    author: { '@type': 'Person', name: 'Aadarsha Gopala Reddy' },
  };

  if (project.id === '2026-04-ms-thesis') {
    base['@type'] = 'ScholarlyArticle';
    base.datePublished = project.date;
    if (project.pdf) base.sameAs = project.pdf;
  } else if (project.demo) {
    base['@type'] = 'SoftwareApplication';
    base.applicationCategory = 'WebApplication';
    base.installUrl = `https://agreddy.com${project.demo}`;
    if (project.technologies.length > 0) base.operatingSystem = 'Any (web-based)';
  } else {
    base['@type'] = 'SoftwareSourceCode';
    if (project.github) base.codeRepository = project.github;
    if (project.technologies.length > 0) base.programmingLanguage = project.technologies;
  }

  return JSON.stringify(base);
}
