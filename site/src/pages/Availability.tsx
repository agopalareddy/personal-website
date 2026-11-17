import { Layout } from '../components/chrome/Layout';
import { Icon } from '../components/common/Icon';

// Week view. There is deliberately no `ctz` parameter: without one the embed
// shows times in the visitor's own time zone (with one, everyone gets that
// zone). The card header already says what this is, so the embed's own
// title, tabs, print button, calendar list and time-zone footer are switched
// off; its date and prev/next controls stay.
const CALENDAR_SRC =
  'https://calendar.google.com/calendar/embed?' +
  [
    'src=90e3e7baecc6c8fb063ea0e230c0040bfe5ce8d086c944a9351720d1e9d72b9e%40group.calendar.google.com',
    'mode=WEEK',
    'showTitle=0',
    'showPrint=0',
    'showTabs=0',
    'showCalendars=0',
    'showTz=0',
  ].join('&');

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
      <p className="page-intro-lead">
        View the weekly calendar or book a meeting directly. I work on US Eastern time; the calendar
        below shows your own. The booking page lists open slots and sends you a calendar invite.
      </p>

      <section className="calendar-card" aria-labelledby="calendar-card-title">
        <div className="calendar-card-header">
          <h2 className="calendar-card-title" id="calendar-card-title">
            Week view <span className="calendar-card-note">· Your local time</span>
          </h2>
          <a
            className="btn-primary"
            href="https://calendar.app.google/rbrkCokvTAM6tb7i7"
            target="_blank"
            rel="noopener"
          >
            <Icon name="CALENDAR_16" /> Book a meeting
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>
        {/* Google's embed has no dark theme, so the frame stays white in every
            site theme; the card around it is what follows the theme. */}
        <iframe
          className="availability-calendar-frame"
          src={CALENDAR_SRC}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Weekly availability calendar"
        />
        {/* Privacy extensions and some browsers block Google embeds, which
            leaves a blank frame; this line is the way out either way. */}
        <p className="calendar-card-footer">
          Calendar not showing?{' '}
          <a href={CALENDAR_SRC} target="_blank" rel="noopener">
            Open it on Google Calendar<span className="sr-only"> (opens in a new tab)</span>
          </a>
          , or use Book a meeting.
        </p>
      </section>
    </Layout>
  );
}
