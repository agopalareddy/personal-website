import { Icon } from 'personal-website';

const Theme = ({ children }) => (
  <div data-color-mode="auto" data-light-theme="light" data-dark-theme="dark">
    {children}
  </div>
);

const NAMES = [
  'HOME_16',
  'BRIEFCASE_16',
  'CODE_16',
  'FILE_16',
  'CALENDAR_16',
  'LOCATION_16',
  'MAIL_16',
  'MARK_GITHUB_16',
  'LINKEDIN_16',
  'SUN_16',
  'MOON_16',
  'CHECK_16',
  'SEARCH_16',
  'DOWNLOAD_16',
  'ROCKET_16',
  'TROPHY_16',
] as const;

export function Sweep() {
  return (
    <Theme>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
        {NAMES.map((name) => (
          <span
            key={name}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.25rem',
              fontSize: '0.75rem',
            }}
          >
            <Icon name={name} />
            <code>{name}</code>
          </span>
        ))}
      </div>
    </Theme>
  );
}

export function InlineWithText() {
  return (
    <Theme>
      <a href="#" className="card-btn btn-detail">
        <Icon name="INFO_16" /> Details
      </a>
    </Theme>
  );
}
