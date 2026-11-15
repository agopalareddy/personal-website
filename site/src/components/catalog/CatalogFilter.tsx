import { Icon } from '../common/Icon';

interface Option {
  value: string;
  label: string;
}

export interface CatalogFilterProps {
  categories: Option[];
  /** Entry count per category value (including `all`), shown beside each tab. */
  categoryCounts: Record<string, number>;
  categoryGroupAriaLabel: string;
  searchId: string;
  searchPlaceholder: string;
  searchAriaLabel: string;
  groupSelectId: string;
  groupAriaLabel: string;
  groupOptions: Option[];
  yearSelectId: string;
  yearAriaLabel: string;
  years: number[];
  sortSelectId: string;
  sortAriaLabel: string;
  /** Server-rendered text for #resultsCount (the island rewrites it on filter). */
  initialResultsText: string;
}

/**
 * Toolbar above a catalog list — one shared shape for /projects/ and
 * /experience/. Three rows: search + dropdowns, category tabs with counts,
 * then a "Jump to <year>" row beside the live results count.
 *
 * Hydrated by site/src/islands/catalog-filter.ts; this component renders the
 * static shell only (the behavior is DOM filtering/reordering of the already
 * server-rendered rows, not something React's render cycle should own). The
 * jump links are rendered here too, so they work without JavaScript.
 *
 * Legacy ids/classes (#filterControls, .filter-btn, #tocContainer, #tocList,
 * .toc-year-header) are kept — the island and e2e specs select on them.
 */
export function CatalogFilter({
  categories,
  categoryCounts,
  categoryGroupAriaLabel,
  searchId,
  searchPlaceholder,
  searchAriaLabel,
  groupSelectId,
  groupAriaLabel,
  groupOptions,
  yearSelectId,
  yearAriaLabel,
  years,
  sortSelectId,
  sortAriaLabel,
  initialResultsText,
}: CatalogFilterProps) {
  return (
    <div className="catalog-toolbar" id="filterControls">
      <search className="catalog-toolbar-controls">
        <div className="catalog-toolbar-row">
          <div className="search-wrapper">
            <span className="search-icon">
              <Icon name="SEARCH_16" />
            </span>
            <input
              type="search"
              className="search-input"
              id={searchId}
              aria-label={searchAriaLabel}
              placeholder={searchPlaceholder}
            />
          </div>

          <div className="select-wrapper">
            <select
              className="custom-select"
              id={groupSelectId}
              data-role="group-filter"
              aria-label={groupAriaLabel}
            >
              {groupOptions.map((o) => (
                <option value={o.value} key={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <span className="select-icon">
              <Icon name="CHEVRON_DOWN_16" />
            </span>
          </div>

          <div className="select-wrapper">
            <select
              className="custom-select"
              id={yearSelectId}
              data-role="year-filter"
              aria-label={yearAriaLabel}
            >
              <option value="all">All years</option>
              {years.map((y) => (
                <option value={String(y)} key={y}>
                  {y}
                </option>
              ))}
            </select>
            <span className="select-icon">
              <Icon name="CHEVRON_DOWN_16" />
            </span>
          </div>

          <div className="select-wrapper">
            <select
              className="custom-select"
              id={sortSelectId}
              data-role="sort"
              aria-label={sortAriaLabel}
            >
              <option value="date-desc">Newest first</option>
              <option value="date-asc">Oldest first</option>
              <option value="title-asc">Alphabetical (A–Z)</option>
            </select>
            <span className="select-icon">
              <Icon name="CHEVRON_DOWN_16" />
            </span>
          </div>
        </div>

        <div className="filter-pills catalog-tabs" role="group" aria-label={categoryGroupAriaLabel}>
          {categories.map((c, i) => (
            <button
              key={c.value}
              type="button"
              className={`filter-btn${i === 0 ? ' active' : ''}`}
              data-filter={c.value}
              aria-pressed={i === 0 ? 'true' : 'false'}
            >
              {c.label}
              <span className="filter-count">{categoryCounts[c.value] ?? 0}</span>
            </button>
          ))}
        </div>
      </search>

      <div className="catalog-subbar">
        <nav className="catalog-jump" id="tocContainer" aria-label="Jump to year">
          <span className="catalog-jump-label" aria-hidden="true">
            Jump to
          </span>
          <ul className="toc-list" id="tocList">
            {years.map((y) => (
              <li className="toc-item" key={y}>
                <a className="toc-year-header" href={`#year-${y}`}>
                  {y}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <p id="resultsCount" className="results-count" aria-live="polite">
          {initialResultsText}
        </p>
      </div>
    </div>
  );
}
