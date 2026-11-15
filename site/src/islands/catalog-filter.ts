/**
 * catalog-filter.ts
 *
 * One generic engine shared by /projects/ and /experience/: search, the
 * organization/year/sort dropdowns, the category tabs, and the "Jump to
 * year" links. The rows are already server-rendered (ProjectCard /
 * ExperienceEntryCard), tagged with data-category/data-group/data-year/
 * data-date/data-title/data-search — this island only shows/hides/reorders
 * those existing nodes, so there is no template logic duplicated in JS.
 *
 * A plain-DOM island (not a React hook/component) for the same reason as
 * cv-modal.ts/email-protection.ts: the behavior is imperative DOM filtering
 * over server-rendered content, not client-owned state.
 */
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
  const yearSelect =
    filterControls?.querySelector<HTMLSelectElement>('[data-role="year-filter"]') ?? null;
  const sortSelect = filterControls?.querySelector<HTMLSelectElement>('[data-role="sort"]') ?? null;
  const filterButtons = Array.from(
    filterControls?.querySelectorAll<HTMLButtonElement>('.filter-btn') ?? []
  );
  const noun = grid.id === 'experienceGrid' ? 'entry' : 'project';
  const nounPlural = grid.id === 'experienceGrid' ? 'entries' : 'projects';

  const cards = Array.from(grid.querySelectorAll<HTMLElement>('.timeline-card'));

  function activeFilter(): string {
    return filterButtons.find((b) => b.classList.contains('active'))?.dataset.filter ?? 'all';
  }

  function render() {
    const filter = activeFilter();
    const group = groupSelect?.value ?? 'all';
    const year = yearSelect?.value ?? 'all';
    const q = (searchInput?.value ?? '').trim().toLowerCase();

    const filtered = cards.filter((card) => {
      const matchesCategory = filter === 'all' || card.dataset.category === filter;
      const matchesGroup = group === 'all' || card.dataset.group === group;
      const matchesYear = year === 'all' || card.dataset.year === year;
      const matchesSearch = !q || (card.dataset.search ?? '').includes(q);
      return matchesCategory && matchesGroup && matchesYear && matchesSearch;
    });

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
  // URL param sync — makes a filtered view shareable/bookmarkable.
  // replaceState (not pushState) keeps every keystroke off the back button.
  // ---------------------------------------------------------------------
  function updateUrlParams() {
    const params = new URLSearchParams();
    const filter = activeFilter();
    if (filter !== 'all') params.set('category', filter);
    if (groupSelect && groupSelect.value !== 'all') params.set('group', groupSelect.value);
    if (yearSelect && yearSelect.value !== 'all') params.set('year', yearSelect.value);
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
    filterButtons.forEach((b) => {
      const isAll = b.dataset.filter === 'all';
      b.classList.toggle('active', isAll);
      b.setAttribute('aria-pressed', String(isAll));
    });
    if (groupSelect) groupSelect.value = 'all';
    if (yearSelect) yearSelect.value = 'all';
    if (sortSelect) sortSelect.value = 'date-desc';
    if (searchInput) searchInput.value = '';
    updateUrlParams();
    render();
  }

  searchInput?.addEventListener('input', () => {
    updateUrlParams();
    render();
  });
  groupSelect?.addEventListener('change', () => {
    updateUrlParams();
    render();
  });
  yearSelect?.addEventListener('change', () => {
    updateUrlParams();
    render();
  });
  sortSelect?.addEventListener('change', () => {
    updateUrlParams();
    render();
  });
  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterButtons.forEach((b) => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      updateUrlParams();
      render();
    });
  });
  clearFiltersBtn?.addEventListener('click', clearAllFilters);

  // Read initial filter state from the URL so filtered views are
  // shareable/bookmarkable.
  const initParams = new URLSearchParams(window.location.search);
  const categoryParam = initParams.get('category');
  if (categoryParam) {
    const matchBtn = filterButtons.find((b) => b.dataset.filter === categoryParam);
    if (matchBtn) {
      filterButtons.forEach((b) => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      matchBtn.classList.add('active');
      matchBtn.setAttribute('aria-pressed', 'true');
    }
  }
  const groupParam = initParams.get('group');
  if (groupParam && groupSelect) groupSelect.value = groupParam;
  const yearParam = initParams.get('year');
  if (yearParam && yearSelect) yearSelect.value = yearParam;
  const sortParam = initParams.get('sort');
  if (sortParam && sortSelect) sortSelect.value = sortParam;
  const qParam = initParams.get('q');
  if (qParam && searchInput) searchInput.value = qParam;

  render();
});
