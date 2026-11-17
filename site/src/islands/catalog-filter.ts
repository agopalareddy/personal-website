/**
 * catalog-filter.ts
 *
 * One generic engine shared by /projects/ and /experience/: search, the
 * organization and sort dropdowns, the category tabs, and the "Jump to
 * year" links. The rows are already server-rendered (ProjectCard /
 * ExperienceEntryCard), tagged with data-category/data-group/data-year/
 * data-date/data-title/data-search — this island only shows/hides/reorders
 * those existing nodes, so there is no template logic duplicated in JS.
 *
 * A plain-DOM island (not a React hook/component) for the same reason as
 * cv-modal.ts/email-protection.ts: the behavior is imperative DOM filtering
 * over server-rendered content, not client-owned state.
 */
import { matchesQuery } from '../content/search';

document.addEventListener('DOMContentLoaded', () => {
  const gridEl =
    document.getElementById('projectGrid') || document.getElementById('experienceGrid');
  if (!gridEl) return;
  const grid = gridEl;

  const filterControls = document.getElementById('filterControls');
  const tocContainer = document.getElementById('tocContainer');
  const tocList = document.getElementById('tocList');
  const emptyState = document.getElementById('emptyState');
  const resultsCount = document.getElementById('resultsCount');
  const clearFiltersBtn = document.getElementById('clearFiltersBtn');
  const searchInput = filterControls?.querySelector<HTMLInputElement>('.search-input') ?? null;
  const groupSelect =
    filterControls?.querySelector<HTMLSelectElement>('[data-role="group-filter"]') ?? null;
  const sortSelect = filterControls?.querySelector<HTMLSelectElement>('[data-role="sort"]') ?? null;
  const tabStrip = filterControls?.querySelector<HTMLElement>('.catalog-tabs') ?? null;
  const filterButtons = Array.from(
    filterControls?.querySelectorAll<HTMLButtonElement>('.filter-btn') ?? []
  );
  const noun = grid.id === 'experienceGrid' ? 'entry' : 'project';
  const nounPlural = grid.id === 'experienceGrid' ? 'entries' : 'projects';

  const cards = Array.from(grid.querySelectorAll<HTMLElement>('.timeline-card'));

  function activeFilter(): string {
    return filterButtons.find((b) => b.classList.contains('active'))?.dataset.filter ?? 'all';
  }

  function setActiveFilter(value: string) {
    filterButtons.forEach((b) => {
      const isActive = b.dataset.filter === value;
      b.classList.toggle('active', isActive);
      b.setAttribute('aria-pressed', String(isActive));
    });
  }

  function render() {
    const filter = activeFilter();
    const group = groupSelect?.value ?? 'all';
    const q = searchInput?.value ?? '';

    // Everything except the category: what each tab would show if picked.
    const pool = cards.filter((card) => {
      const matchesGroup = group === 'all' || card.dataset.group === group;
      const matchesSearch = matchesQuery(card.dataset.search ?? '', q);
      return matchesGroup && matchesSearch;
    });
    for (const btn of filterButtons) {
      const count = btn.querySelector('.filter-count');
      if (!count) continue;
      const value = btn.dataset.filter;
      const n =
        value === 'all' ? pool.length : pool.filter((c) => c.dataset.category === value).length;
      count.textContent = String(n);
    }

    const filtered = pool.filter((card) => filter === 'all' || card.dataset.category === filter);

    const sort = sortSelect?.value ?? 'date-desc';
    filtered.sort((a, b) => {
      if (sort === 'title-asc') {
        return (a.dataset.title ?? '').localeCompare(b.dataset.title ?? '');
      }
      const da = a.dataset.date ?? '';
      const db = b.dataset.date ?? '';
      return sort === 'date-asc' ? da.localeCompare(db) : db.localeCompare(da);
    });

    // Non-matching rows are detached (not just hidden) — e2e specs assert
    // against .experience-card/.project-card element counts, which a
    // `hidden` attribute wouldn't satisfy.
    grid.querySelectorAll('.timeline-year').forEach((h) => h.remove());
    cards.forEach((c) => c.remove());

    if (filtered.length === 0) {
      if (emptyState) emptyState.hidden = false;
      if (resultsCount) resultsCount.textContent = `Showing 0 ${nounPlural}.`;
      renderJump([]);
      return;
    }
    if (emptyState) emptyState.hidden = true;

    // Alphabetical order has no year grouping, so no headers or jump links.
    const yearCounts = new Map<string, number>();
    if (sort !== 'title-asc') {
      for (const card of filtered) {
        const y = card.dataset.year;
        if (y) yearCounts.set(y, (yearCounts.get(y) ?? 0) + 1);
      }
    }

    const frag = document.createDocumentFragment();
    let lastYear: string | undefined;
    for (const card of filtered) {
      const y = card.dataset.year;
      if (y && yearCounts.has(y) && y !== lastYear) {
        const n = yearCounts.get(y) ?? 0;
        const heading = document.createElement('h2');
        heading.className = 'timeline-year';
        heading.id = `year-${y}`;
        heading.textContent = y;
        // Printed by CSS (::after) so the heading's own text stays the year.
        heading.dataset.count = `${n} ${n === 1 ? noun : nounPlural}`;
        frag.append(heading);
        lastYear = y;
      }
      frag.append(card);
    }
    grid.append(frag);

    if (resultsCount) {
      resultsCount.textContent = `Showing ${filtered.length} ${filtered.length === 1 ? noun : nounPlural}.`;
    }
    renderJump([...yearCounts.keys()]);
  }

  /** "Jump to 2026 2025 …" — one link per year header currently in the list. */
  function renderJump(years: string[]) {
    if (!tocContainer || !tocList) return;

    // A single group has nowhere to jump to.
    if (years.length < 2) {
      tocContainer.hidden = true;
      tocList.replaceChildren();
      return;
    }
    tocContainer.hidden = false;

    const frag = document.createDocumentFragment();
    for (const year of years) {
      const li = document.createElement('li');
      li.className = 'toc-item';
      const a = document.createElement('a');
      a.href = `#year-${year}`;
      a.className = 'toc-year-header';
      a.textContent = year;
      li.append(a);
      frag.append(li);
    }
    tocList.replaceChildren(frag);
  }

  // ---------------------------------------------------------------------
  // Category tabs scroll sideways on a phone. Mark which edges have more
  // tabs beyond them so CSS can fade those edges (style.css, .catalog-tabs).
  // ---------------------------------------------------------------------
  function updateTabFade() {
    if (!tabStrip) return;
    const max = tabStrip.scrollWidth - tabStrip.clientWidth;
    const atStart = tabStrip.scrollLeft <= 1;
    const atEnd = tabStrip.scrollLeft >= max - 1;
    if (max <= 1) delete tabStrip.dataset.fade;
    else tabStrip.dataset.fade = atStart ? 'end' : atEnd ? 'start' : 'both';
  }
  if (tabStrip) {
    tabStrip.addEventListener('scroll', updateTabFade, { passive: true });
    new ResizeObserver(updateTabFade).observe(tabStrip);
  }

  /** Scrolls the strip (never the page) so a tab is fully in view. */
  function revealTab(btn: HTMLElement | undefined) {
    if (!tabStrip || !btn) return;
    const strip = tabStrip.getBoundingClientRect();
    const tab = btn.getBoundingClientRect();
    const margin = 40; // clear of the faded edge
    if (tab.left < strip.left) tabStrip.scrollLeft -= strip.left - tab.left + margin;
    else if (tab.right > strip.right) tabStrip.scrollLeft += tab.right - strip.right + margin;
  }

  // ---------------------------------------------------------------------
  // URL param sync — makes a filtered view shareable/bookmarkable.
  // replaceState (not pushState) keeps every keystroke off the back button.
  // ---------------------------------------------------------------------
  function updateUrlParams() {
    const params = new URLSearchParams();
    const filter = activeFilter();
    if (filter !== 'all') params.set('category', filter);
    if (groupSelect && groupSelect.value !== 'all') params.set('group', groupSelect.value);
    if (sortSelect && sortSelect.value !== 'date-desc') params.set('sort', sortSelect.value);
    if (searchInput?.value) params.set('q', searchInput.value);
    const qs = params.toString();
    history.replaceState(
      null,
      '',
      qs ? `?${qs}${location.hash}` : location.pathname + location.hash
    );
  }

  function clearAllFilters() {
    setActiveFilter('all');
    if (groupSelect) groupSelect.value = 'all';
    if (sortSelect) sortSelect.value = 'date-desc';
    if (searchInput) searchInput.value = '';
    updateUrlParams();
    render();
  }

  function onChange() {
    updateUrlParams();
    render();
  }

  searchInput?.addEventListener('input', onChange);
  groupSelect?.addEventListener('change', onChange);
  sortSelect?.addEventListener('change', onChange);
  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      setActiveFilter(btn.dataset.filter ?? 'all');
      revealTab(btn);
      onChange();
    });
  });
  clearFiltersBtn?.addEventListener('click', clearAllFilters);

  // Read initial filter state from the URL so filtered views are
  // shareable/bookmarkable. A value this page doesn't offer (an old link, a
  // typo) is ignored and dropped from the address rather than applied — a
  // select set to an unknown value would otherwise match nothing.
  const initParams = new URLSearchParams(window.location.search);
  const hasOption = (select: HTMLSelectElement, value: string) =>
    Array.from(select.options).some((o) => o.value === value);

  const categoryParam = initParams.get('category');
  if (categoryParam && filterButtons.some((b) => b.dataset.filter === categoryParam)) {
    setActiveFilter(categoryParam);
  }
  const groupParam = initParams.get('group');
  if (groupParam && groupSelect && hasOption(groupSelect, groupParam)) {
    groupSelect.value = groupParam;
  }
  const sortParam = initParams.get('sort');
  if (sortParam && sortSelect && hasOption(sortSelect, sortParam)) sortSelect.value = sortParam;
  const qParam = initParams.get('q');
  if (qParam && searchInput) searchInput.value = qParam;

  if (window.location.search) updateUrlParams();
  render();
  revealTab(filterButtons.find((b) => b.classList.contains('active')));
  updateTabFade();
});
