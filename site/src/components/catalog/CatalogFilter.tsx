import { Icon } from '../common/Icon';

interface Option {
  value: string;
  label: string;
}

export interface CatalogFilterProps {
  categories: Option[];
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
}

/**
 * Ported from projects/index.html + experience/index.html's #filterControls
 * and #tocContainer markup — one shared shape for both catalogs (the two
 * pages' filter panels differed only in labels/options, never structure).
 * Hydrated by site/src/islands/catalog-filter.ts (T039/T042); this component
 * renders the static shell only, matching the plain-DOM-island precedent set
 * by cv-modal.ts/email-protection.ts (single generic engine, not per-catalog
 * React state — the behavior is DOM filtering/reordering of the already
 * server-rendered cards, not something React's render cycle should own).
 */
export function CatalogFilter({
  categories,
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
}: CatalogFilterProps) {
  return (
    <>
      <div className="toc-container card-surface" id="filterControls">
        <button
          className="toc-toggle-btn"
          id="filterToggleBtn"
          aria-expanded="true"
          aria-controls="filterNav"
        >
          <h3 className="toc-title">Filters &amp; Search</h3>
          <span className="toc-toggle-icon" aria-hidden="true" />
        </button>
        <div id="filterNav">
          <search>
            <div className="projects-controls projects-controls--stacked">
              <div className="controls-row">
                <div className="filter-pills" role="group" aria-label={categoryGroupAriaLabel}>
                  {categories.map((c, i) => (
                    <button
                      key={c.value}
                      className={`filter-btn${i === 0 ? ' active' : ''}`}
                      data-filter={c.value}
                      aria-pressed={i === 0 ? 'true' : 'false'}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
                <div className="search-wrapper">
                  <span className="search-icon">
                    <Icon name="SEARCH_16" />
                  </span>
                  <input
                    type="text"
                    className="search-input"
                    id={searchId}
                    aria-label={searchAriaLabel}
                    placeholder={searchPlaceholder}
                  />
                </div>
              </div>

              <div className="controls-row controls-row--bordered">
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
                    <option value="all">All Years</option>
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
                    <option value="date-desc">Newest First</option>
                    <option value="date-asc">Oldest First</option>
                    <option value="title-asc">Alphabetical (A-Z)</option>
                  </select>
                  <span className="select-icon">
                    <Icon name="CHEVRON_DOWN_16" />
                  </span>
                </div>
              </div>
            </div>
          </search>
        </div>
      </div>

      <div className="toc-container card-surface" id="tocContainer" hidden>
        <button
          className="toc-toggle-btn"
          id="tocToggleBtn"
          aria-expanded="true"
          aria-controls="tocNav"
        >
          <h3 className="toc-title">On this page</h3>
          <span className="toc-toggle-icon" aria-hidden="true" />
        </button>
        <nav aria-label="Table of contents" id="tocNav">
          <ul className="toc-list" id="tocList" />
        </nav>
      </div>
    </>
  );
}
