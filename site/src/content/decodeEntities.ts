const NAMED_ENTITIES: Record<string, string> = {
  '&amp;': '&',
  '&apos;': "'",
  '&quot;': '"',
  '&mdash;': '—',
  '&ndash;': '–',
  '&ldquo;': '“',
  '&rdquo;': '”',
  '&deg;': '°',
  '&rarr;': '→',
};

/**
 * The source JSON databases pre-escape HTML entities in plain-text fields
 * (a holdover from the old Python generator, which interpolated them
 * directly into HTML via f-strings with no auto-escaping). React/JSX DOES
 * auto-escape `{value}` interpolations, so rendering these fields as-is
 * double-escapes them (e.g. "&apos;" becomes "&amp;apos;", visibly wrong).
 * Decoding here restores plain Unicode text; JSX then escapes it correctly
 * exactly once. Does NOT touch `content_html` — that field is real,
 * intentionally-escaped HTML (research.md R4), injected unescaped on purpose.
 */
export function decodeEntities(text: string): string {
  return text.replace(
    /&(amp|apos|quot|mdash|ndash|ldquo|rdquo|deg|rarr);/g,
    (m) => NAMED_ENTITIES[m]
  );
}
