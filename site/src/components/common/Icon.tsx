import { ICONS } from "./icons-data";

export type IconName = keyof typeof ICONS;

/**
 * Renders a vendored octicon SVG (ported from assets/js/icons.js — the same
 * source `scripts/icons.py` embeds server-side today). Markup is trusted,
 * vendored-at-build-time SVG, not user input, so dangerouslySetInnerHTML is
 * the plain, correct tool here (matches research.md R4's trust boundary).
 *
 * `display: contents` makes this wrapper's own box disappear from layout —
 * the <svg> becomes the effective flex/inline item, matching the original
 * markup (where the <svg> was an unwrapped direct child of e.g. .nav-link,
 * .author-links li, .card-meta — all of which flex-align on their direct
 * children). Without this, the wrapper span (not the svg) is what
 * align-items: center centers, and everything sits top-aligned instead.
 */
export function Icon({ name, className }: { name: IconName; className?: string }) {
  const svg = ICONS[name];
  if (!svg) {
    throw new Error(`Icon "${String(name)}" is not in the vendored octicon set`);
  }
  return (
    <span
      className={className}
      style={{ display: "contents" }}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
