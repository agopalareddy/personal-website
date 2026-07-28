import { CatalogFilter } from 'personal-website';

const Theme = ({ children }) => (
  <div data-color-mode="auto" data-light-theme="light" data-dark-theme="dark">
    {children}
  </div>
);

const CATEGORIES = [
  { value: 'all', label: 'All' },
  { value: 'Research & ML', label: 'Research & ML' },
  { value: 'Software & Tools', label: 'Software & Tools' },
  { value: 'Web Apps', label: 'Web Apps' },
];

const VENUE_OPTIONS = [
  { value: 'all', label: 'All Institutions/Venues' },
  { value: 'WashU', label: 'Washington University in St. Louis' },
  { value: 'OWU', label: 'Ohio Wesleyan University' },
  { value: 'MITxSureStart', label: 'MITxSureStart' },
  { value: 'Personal', label: 'Personal Projects' },
];

export function Projects() {
  return (
    <Theme>
      <CatalogFilter
        categories={CATEGORIES}
        categoryGroupAriaLabel="Category Filters"
        searchId="projectSearch"
        searchPlaceholder="Search projects, tags, venues..."
        searchAriaLabel="Search projects by title, tags, or venues"
        groupSelectId="venueFilter"
        groupAriaLabel="Filter projects by institution or venue"
        groupOptions={VENUE_OPTIONS}
        yearSelectId="yearFilter"
        yearAriaLabel="Filter projects by year range"
        years={[2026, 2025, 2024, 2023, 2022]}
        sortSelectId="projectSort"
        sortAriaLabel="Sort projects chronologically or alphabetically"
      />
    </Theme>
  );
}
