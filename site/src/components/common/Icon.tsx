import { ICONS } from "./icons-data";

export type IconName = keyof typeof ICONS;

/**
 * Renders a vendored octicon SVG (ported from assets/js/icons.js — the same
 * source `scripts/icons.py` embeds server-side today). Markup is trusted,
 * vendored-at-build-time SVG, not user input, so dangerouslySetInnerHTML is
 * the plain, correct tool here (matches research.md R4's trust boundary).
 */
export function Icon({ name, className }: { name: IconName; className?: string }) {
  const svg = ICONS[name];
  if (!svg) {
    throw new Error(`Icon "${String(name)}" is not in the vendored octicon set`);
  }
  return <span className={className} dangerouslySetInnerHTML={{ __html: svg }} />;
}
