import { Layout } from '../components/chrome/Layout';
import { loadAccessibilityBody } from '../content/accessibilityBody';

/**
 * Ported from accessibility.html. The prose body is injected verbatim via
 * loadAccessibilityBody() (research.md R4 trust boundary — our own vendored
 * content) rather than hand-transcribed into JSX, since this statement's
 * accuracy about the site's actual a11y behavior is Constitution Principle
 * IV, not just nice-to-have fidelity.
 */
export function AccessibilityPage() {
  return (
    <Layout
      activePage={undefined}
      title="Accessibility Statement"
      description="Accessibility compliance details and standards commitment for Aadarsha Gopala Reddy's academic engineering portfolio."
      canonicalUrl="https://agreddy.com/accessibility.html"
      ogType="website"
      contentAriaLabel="Accessibility compliance details"
    >
      <div dangerouslySetInnerHTML={{ __html: loadAccessibilityBody() }} />
    </Layout>
  );
}
