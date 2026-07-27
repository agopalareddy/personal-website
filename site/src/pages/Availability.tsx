import { Layout } from "../components/chrome/Layout";
import { Icon } from "../components/common/Icon";

/** Ported from availability/index.html. */
export function AvailabilityPage() {
  return (
    <Layout
      activePage="availability"
      title="Availability"
      description="View the weekly calendar or book an appointment directly with Aadarsha Gopala Reddy."
      canonicalUrl="https://agreddy.com/availability/"
      ogType="website"
      contentAriaLabel="Weekly scheduling availability"
    >
      <h1 className="page-intro-title">Availability</h1>
      <p className="page-intro-lead">View the weekly calendar or book a meeting directly.</p>
      <div className="availability-actions">
        <a
          className="site-action-btn"
          href="https://calendar.app.google/rbrkCokvTAM6tb7i7"
          target="_blank"
          rel="noopener"
          aria-label="Book an appointment on Google Calendar (opens in a new tab)"
        >
          <Icon name="CALENDAR_16" /> Book an appointment{" "}
          <span className="sr-only">(opens in a new tab)</span>
        </a>
      </div>

      <iframe
        className="availability-calendar-frame"
        src="https://calendar.google.com/calendar/embed?src=90e3e7baecc6c8fb063ea0e230c0040bfe5ce8d086c944a9351720d1e9d72b9e%40group.calendar.google.com&ctz=America%2FChicago&mode=WEEK"
        frameBorder={0}
        scrolling="no"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Weekly availability calendar"
      />
    </Layout>
  );
}
