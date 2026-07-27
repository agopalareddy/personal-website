import Ajv, { type ValidateFunction } from 'ajv';
import projectEntrySchema from './schemas/project-entry.schema.json';
import experienceEntrySchema from './schemas/experience-entry.schema.json';

const ajv = new Ajv({ allErrors: true });
const validators = {
  project: ajv.compile(projectEntrySchema),
  experience: ajv.compile(experienceEntrySchema),
} satisfies Record<string, ValidateFunction>;

export class ContentValidationError extends Error {
  constructor(entryId: string, kind: string, details: string) {
    super(`[${kind} entry "${entryId}"] failed schema validation: ${details}`);
    this.name = 'ContentValidationError';
  }
}

/**
 * Validates one content entry against its schema. Throws a build-failing
 * ContentValidationError naming the entry id and offending field on mismatch
 * (FR-014, SC-007) rather than letting a malformed entry reach a page.
 */
export function validateEntry(
  kind: 'project' | 'experience',
  entry: Record<string, unknown>
): void {
  const validate = validators[kind];
  if (validate(entry)) return;

  const entryId = typeof entry.id === 'string' ? entry.id : '<missing id>';
  const details = (validate.errors ?? [])
    .map((e) => `${e.instancePath || '(root)'} ${e.message}`)
    .join('; ');
  throw new ContentValidationError(entryId, kind, details);
}
