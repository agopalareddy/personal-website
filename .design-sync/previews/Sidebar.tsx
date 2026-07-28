import { Sidebar, CatalogFilter } from 'personal-website';

const Theme = ({ children }) => (
  <div data-color-mode="auto" data-light-theme="light" data-dark-theme="dark">
    {children}
  </div>
);

export function Default() {
  return (
    <Theme>
      <Sidebar />
    </Theme>
  );
}

export function WithExtra() {
  return (
    <Theme>
      <Sidebar>
        <CatalogFilter
          categories={[
            { value: 'all', label: 'All' },
            { value: 'Research & ML', label: 'Research & ML' },
            { value: 'Software & Tools', label: 'Software & Tools' },
          ]}
          categoryGroupAriaLabel="Category Filters"
          searchId="projectSearch"
          searchPlaceholder="Search projects, tags, venues..."
          searchAriaLabel="Search projects by title, tags, or venues"
          groupSelectId="venueFilter"
          groupAriaLabel="Filter projects by institution or venue"
          groupOptions={[
            { value: 'all', label: 'All Institutions/Venues' },
            { value: 'WashU', label: 'Washington University in St. Louis' },
          ]}
          yearSelectId="yearFilter"
          yearAriaLabel="Filter projects by year range"
          years={[2026, 2025, 2024]}
          sortSelectId="projectSort"
          sortAriaLabel="Sort projects chronologically or alphabetically"
        />
      </Sidebar>
    </Theme>
  );
}
