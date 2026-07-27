// Self-check for SC-007: a malformed entry must fail the build with an error
// naming the entry id and field, not silently produce a broken page.
// Run: npx tsx site/src/content/validate.check.ts
import { validateEntry, ContentValidationError } from "./validate";

const malformedProject = {
  id: "test-malformed-project",
  title: "Missing required fields on purpose",
  // excerpt, venue, venue_tag, permalink, date, formatted_date, category,
  // technologies, github, demo, pdf, presentation, has_detail, content_html
  // are all intentionally absent.
};

try {
  validateEntry("project", malformedProject);
  console.error("FAIL: validateEntry did not reject a malformed project entry");
  process.exit(1);
} catch (err) {
  if (!(err instanceof ContentValidationError)) {
    console.error("FAIL: threw the wrong error type:", err);
    process.exit(1);
  }
  if (!err.message.includes("test-malformed-project")) {
    console.error("FAIL: error message doesn't name the offending entry id:", err.message);
    process.exit(1);
  }
  console.log("PASS:", err.message);
}
