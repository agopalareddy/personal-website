import { THEME_INLINE_SNIPPET } from './theme-inline-snippet';

const ASSETS_VERSION = '2.0.0';

export interface HeadProps {
  title: string;
  description: string;
  canonicalUrl: string;
  ogType?: 'website' | 'article';
  /** Per-page OG/Twitter image override — defaults to the site avatar. */
  ogImage?: string;
  /** Pre-serialized schema.org JSON-LD, injected as a <script type="application/ld+json"> tag. */
  jsonLd?: string;
}

const GA4_MEASUREMENT_ID = 'G-QWNGSMS0LY';

/** Ported from scripts/chrome.py's render_head(). */
export function Head({
  title,
  description,
  canonicalUrl,
  ogType = 'article',
  ogImage = 'https://agreddy.com/images/profile.png',
  jsonLd,
}: HeadProps) {
  const fullTitle = `${title} - Aadarsha Gopala Reddy`;
  return (
    <head>
      {/* Google tag (gtag.js) */}
      <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}`} />
      <link rel="preconnect" href="https://www.googletagmanager.com" />
      <link rel="preconnect" href="https://www.google-analytics.com" />
      <script
        dangerouslySetInnerHTML={{
          __html: `window.dataLayer = window.dataLayer || [];
function gtag() { dataLayer.push(arguments); }
gtag('js', new Date());
gtag('config', '${GA4_MEASUREMENT_ID}');`,
        }}
      />
      <script dangerouslySetInnerHTML={{ __html: THEME_INLINE_SNIPPET }} />
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="description" content={description} />
      <title>{fullTitle}</title>

      <link rel="stylesheet" href={`/assets/css/primer/primer.css?v=${ASSETS_VERSION}`} />
      <link rel="stylesheet" href={`/assets/css/style.css?v=${ASSETS_VERSION}`} />

      <link rel="apple-touch-icon" sizes="180x180" href="/images/mstile-150x150.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/images/mstile-70x70.png" />
      <link rel="manifest" href="/images/manifest.json" />
      <link rel="mask-icon" href="/images/safari-pinned-tab.svg" color="#0a0a16" />
      <meta name="msapplication-TileColor" content="#0a0a16" />
      <meta name="msapplication-TileImage" content="/images/mstile-144x144.png" />
      <meta name="msapplication-config" content="/images/browserconfig.xml" />

      <meta name="theme-color" media="(prefers-color-scheme: light)" content="#ffffff" />
      <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#0d1117" />

      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="Aadarsha Gopala Reddy" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:site" content="@aadarsha2002" />

      <link rel="canonical" href={canonicalUrl} />
      {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />}
    </head>
  );
}
