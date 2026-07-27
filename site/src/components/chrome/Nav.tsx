import { Icon, type IconName } from "../common/Icon";

const NAV_ITEMS: Array<{ key: string; href: string; label: string; icon: IconName }> = [
  { key: "home", href: "/", label: "Home", icon: "HOME_16" },
  { key: "experience", href: "/experience/", label: "Experience", icon: "BRIEFCASE_16" },
  { key: "projects", href: "/projects/", label: "Projects", icon: "CODE_16" },
  { key: "cv", href: "/cv/", label: "CV/Resume", icon: "FILE_16" },
  { key: "availability", href: "/availability/", label: "Availability", icon: "CALENDAR_16" },
];

export type ActivePage = (typeof NAV_ITEMS)[number]["key"];

/** Ported from scripts/chrome.py's render_nav(). */
export function Nav({ activePage }: { activePage?: ActivePage }) {
  return (
    <header className="top-header">
      <div className="top-bar container">
        <nav className="nav-links" aria-label="Primary Navigation">
          {NAV_ITEMS.map(({ key, href, label, icon }) => {
            const isActive = key === activePage;
            return (
              <a
                key={key}
                href={href}
                className={isActive ? "nav-link active" : "nav-link"}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon name={icon} />
                <span>{label}</span>
              </a>
            );
          })}
        </nav>
        {/* Hydration mount point for the ThemePicker island (T014/T016) */}
        <div id="theme-toggle" />
      </div>
    </header>
  );
}
