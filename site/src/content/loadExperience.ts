import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { validateEntry } from "./validate";
import type { ExperienceEntry } from "./types";

const DATABASE_PATH = fileURLToPath(
  new URL("../../../scripts/experience_database.json", import.meta.url),
);

/**
 * Reads experience_database.json — the single source of truth for
 * experience content (FR-002) — validating every entry against the
 * Experience Entry schema before it can reach a page (FR-014).
 */
export function loadExperience(): ExperienceEntry[] {
  const raw = readFileSync(DATABASE_PATH, "utf-8");
  const entries = JSON.parse(raw) as ExperienceEntry[];
  for (const entry of entries) {
    validateEntry("experience", entry as unknown as Record<string, unknown>);
  }
  return entries;
}
