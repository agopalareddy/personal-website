import type { ExperienceEntry } from "./types";

/** Ported from assets/js/experience-catalog.js's getOrgShort(). */
function orgShort(org: string): string {
  const lower = org.toLowerCase();
  if (lower.includes("washington university")) {
    if (lower.includes("drives")) return "Washington University (DRIVES)";
    return "Washington University in St. Louis";
  }
  if (lower.includes("ohio wesleyan")) return "Ohio Wesleyan University";
  if (lower.includes("crittero")) return "Crittero";
  if (lower.includes("lab714")) return "Lab714";
  if (lower.includes("mitxsurestart") || lower.includes("mitx")) return "MITxSureStart";
  if (lower.includes("denison")) return "Denison University";
  if (lower.includes("next genius")) return "Next Genius";
  if (lower.includes("ages & science coach")) return "Science Coach";
  if (lower.includes("spring student symposium")) return "OWU Symposium";
  if (lower.includes("patricia belt conrades")) return "OWU Symposium";
  if (lower.includes("graduate student affairs") || lower.includes("gsaab")) return "GSAAB";
  if (lower.includes("career engagement") || lower.includes("cce")) return "CCE Board";
  if (lower.includes("umang")) return "Umang";
  if (lower.includes("hackwashu")) return "HackWashU";
  if (lower.includes("hindu student")) return "HSC";
  if (lower.includes("gpsc") || lower.includes("student council")) return "GPSC";
  if (lower.includes("wesleyan council") || lower.includes("wcsa")) return "WCSA";
  if (lower.includes("neurds")) return "The Neurds";
  if (lower.includes("programming board")) return "CPB";
  if (lower.includes("mathematics, computer science")) return "Math/CS Board";
  return org.split(",")[0].trim();
}

/**
 * Ported from experience-catalog.js's getExperienceDisplayTitle() /
 * generate_site.py's experience_display_title(). Leadership entries get a
 * " - <org short label>" suffix appended, unless the org is already implied
 * by the title.
 */
export function experienceDisplayTitle(e: ExperienceEntry): string {
  const title = (e.title || "").trim();
  if (!title || e.category !== "leadership") return title;

  const org = (e.organization || "").trim();
  const short = orgShort(org);
  if (!short) return title;
  if (short === "Science Coach" || short === "OWU Symposium") return title;

  const titleLower = title.toLowerCase();
  if (titleLower.includes(short.toLowerCase())) return title;
  if (org && titleLower.includes(org.toLowerCase())) return title;

  return `${title} - ${short}`;
}

const MONTH_NAMES_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function formatMonthYear(iso: string | null): string {
  if (!iso) return "";
  const m = /^(\d{4})-(\d{2})-\d{2}$/.exec(iso);
  if (!m) return iso;
  const month = parseInt(m[2], 10);
  if (month < 1 || month > 12) return iso;
  return `${MONTH_NAMES_SHORT[month - 1]} ${m[1]}`;
}

/** Ported from generate_site.py's format_date_range(). */
export function formatDateRange(startDate: string | null, endDate: string | null): string {
  const start = formatMonthYear(startDate);
  if (!start) return "";
  if (endDate === null) return `${start} – Present`;
  const end = formatMonthYear(endDate);
  if (!end || end === start) return start;
  return `${start} – ${end}`;
}

export const CATEGORY_LABELS: Record<string, string> = {
  professional: "Professional",
  education: "Education",
  research: "Research",
  leadership: "Leadership",
  awards: "Awards",
  presentations: "Presentations",
};

export function categoryLabel(cat: string): string {
  return CATEGORY_LABELS[cat] ?? cat;
}

/** Ported from generate_site.py's LINK_TYPE_ICONS. */
export const LINK_TYPE_ICONS: Record<string, string> = {
  publication: "FILE_16",
  github: "MARK_GITHUB_16",
  demo: "ROCKET_16",
  paper: "FILE_16",
  talk: "FILE_16",
  award: "TROPHY_16",
  organization: "ORGANIZATION_16",
  other: "LINK_EXTERNAL_16",
};

/** Order entries by completion/receipt date, not start date (matches getOrderDate()). */
export function experienceOrderDate(e: ExperienceEntry): string {
  return e.end_date || e.start_date || "1970-01-01";
}
