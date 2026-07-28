/**
 * catalog-filter.ts
 *
 * One generic engine shared by /projects/ and /experience/ — ported from
 * assets/js/projects-catalog.js and assets/js/experience-catalog.js's
 * filter/search/sort/TOC logic (they were near-duplicates apart from field
 * names). Unlike the legacy version, this does NOT rebuild card markup from
 * a JSON blob: the cards are already server-rendered (ProjectCard /
 * ExperienceEntryCard), tagged with data-category/data-group/data-year/
 * data-date/data-title/data-search. This island only shows/hides/reorders
 * those existing nodes — no duplicate template logic between JSX and JS.
 *
 * A plain-DOM island (not a React hook/component) for the same reason as
 * cv-modal.ts/email-protection.ts: the behavior is imperative DOM filtering
 * over server-rendered content, not client-owned state.
 */
import { bindExpandToggle } from './toggle';

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

    // Non-matching cards are detached (not just hidden) — the old renderer
    // rebuilt the grid's innerHTML from scratch each time, so a card that
    // doesn't match was never in the DOM at all. Tests assert against
    // .experience-card/.project-card element counts, which a `hidden`
    // attribute wouldn't satisfy.
    grid.querySelectorAll('.timeline-year').forEach((h) => h.remove());
    cards.forEach((c) => c.remove());

    if (filtered.length === 0) {
      if (emptyState) emptyState.hidden = false;
      if (resultsCount) resultsCount.textContent = `Showing 0 ${nounPlural}.`;
      renderToc([]);
      return;
    }
    if (emptyState) emptyState.hidden = true;

    const frag = document.createDocumentFragment();
    let lastYear: string | undefined;
    for (const card of filtered) {
      if (sort !== 'title-asc' && card.dataset.year && card.dataset.year !== lastYear) {
        const heading = document.createElement('h2');
        heading.className = 'timeline-year';
        heading.id = `year-${card.dataset.year}`;
        heading.textContent = card.dataset.year;
        frag.append(heading);
        lastYear = card.dataset.year;
      }
      frag.append(card);
    }
    grid.append(frag);

    if (resultsCount) {
      resultsCount.textContent = `Showing ${filtered.length} ${filtered.length === 1 ? noun : nounPlural}.`;
    }
    renderToc(filtered);
  }

  function renderToc(filtered: HTMLElement[]) {
    if (!tocContainer || !tocList) return;

    if (filtered.length <= 1) {
      tocContainer.hidden = true;
      tocList.replaceChildren();
      return;
    }
    tocContainer.hidden = false;
    positionTocResponsive();

    const tocToggleBtn = document.getElementById('tocToggleBtn');
    if (tocToggleBtn && !tocToggleBtn.hasAttribute('data-initialized')) {
      const isMobile = window.innerWidth < 768;
      tocToggleBtn.setAttribute('aria-expanded', isMobile ? 'false' : 'true');
      tocToggleBtn.setAttribute('data-initialized', 'true');
    }

    const sort = sortSelect?.value ?? 'date-desc';
    const frag = document.createDocumentFragment();

    if (sort === 'title-asc') {
      for (const card of filtered) {
        frag.append(tocLink(card));
      }
    } else {
      let currentYear: string | undefined;
      let nested: HTMLUListElement | null = null;
      for (const card of filtered) {
        const year = card.dataset.year;
        if (year && year !== currentYear) {
          const li = document.createElement('li');
          li.className = 'toc-item';
          const a = document.createElement('a');
          a.href = `#year-${year}`;
          a.className = 'toc-year-header';
          a.textContent = year;
          nested = document.createElement('ul');
          nested.className = 'toc-nested-list';
          li.append(a, nested);
          frag.append(li);
          currentYear = year;
        }
        nested?.append(tocLink(card));
      }
    }

    tocList.replaceChildren(frag);
    tocList.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href')?.slice(1);
        const target = targetId ? document.getElementById(targetId) : null;
        if (!target) return;

        const isMobile = window.innerWidth < 768;
        const tocToggle = document.getElementById('tocToggleBtn');
        if (isMobile && tocToggle?.getAttribute('aria-expanded') === 'true') {
          tocToggle.setAttribute('aria-expanded', 'false');
        }

        const headerOffset = isMobile ? 120 : 90;
        const top = target.getBoundingClientRect().top + window.scrollY - headerOffset;
        window.scrollTo({ top, behavior: 'smooth' });
        history.pushState(null, '', `#${targetId}`);
      });
    });
  }

  function tocLink(card: HTMLElement): HTMLLIElement {
    const li = document.createElement('li');
    li.className = 'toc-item';
    const a = document.createElement('a');
    a.href = `#${card.id}`;
    a.className = 'toc-link';
    a.textContent = card.dataset.title ?? '';
    li.append(a);
    return li;
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

  // ---------------------------------------------------------------------
  // Responsive placement — ported near-verbatim from experience-catalog.js.
  // The filter/TOC panels live in .academic-sidebar on desktop but must sit
  // inline (in a sticky wrapper, right after the intro paragraph) on mobile.
  // ---------------------------------------------------------------------
  function positionFilterControlsResponsive() {
    if (!filterControls) return;
    const isMobile = window.innerWidth < 768;
    const sidebar = document.querySelector('.academic-sidebar');
    const subtitle = document.querySelector('.academic-content > p');
    const stickyWrapper = document.querySelector('.mobile-sticky-wrapper');

    if (isMobile && subtitle) {
      const layoutBlock = stickyWrapper ?? filterControls;
      if (
        layoutBlock.parentNode !== subtitle.parentNode ||
        layoutBlock.previousElementSibling !== subtitle
      ) {
        subtitle.parentNode?.insertBefore(layoutBlock, subtitle.nextSibling);
      }
    } else if (!isMobile && sidebar && filterControls.parentNode !== sidebar) {
      sidebar.append(filterControls);
    }
  }

  function positionTocResponsive() {
    if (!tocContainer) return;
    const isMobile = window.innerWidth < 768;
    const sidebar = document.querySelector('.academic-sidebar');

    if (isMobile && filterControls) {
      if (
        tocContainer.parentNode !== filterControls.parentNode ||
        tocContainer.previousElementSibling !== filterControls
      ) {
        filterControls.parentNode?.insertBefore(tocContainer, filterControls.nextSibling);
      }
    } else if (!isMobile && sidebar && tocContainer.parentNode !== sidebar) {
      sidebar.append(tocContainer);
    }
  }

  function wrapMobileStickyPanels() {
    const isMobile = window.innerWidth < 768;
    const existingWrapper = document.querySelector('.mobile-sticky-wrapper');

    if (isMobile) {
      if (!filterControls || !tocContainer) return;
      if (existingWrapper?.contains(filterControls) && existingWrapper?.contains(tocContainer)) {
        return;
      }
      if (existingWrapper) {
        const parent = existingWrapper.parentNode;
        while (existingWrapper.firstChild)
          parent?.insertBefore(existingWrapper.firstChild, existingWrapper);
        parent?.removeChild(existingWrapper);
      }
      if (filterControls.parentNode === tocContainer.parentNode) {
        const wrapper = document.createElement('div');
        wrapper.className = 'mobile-sticky-wrapper';
        filterControls.parentNode?.insertBefore(wrapper, filterControls);
        wrapper.append(filterControls, tocContainer);
      }
    } else if (existingWrapper) {
      const parent = existingWrapper.parentNode;
      while (existingWrapper.firstChild)
        parent?.insertBefore(existingWrapper.firstChild, existingWrapper);
      parent?.removeChild(existingWrapper);
    }
  }

  function repositionCatalogLayout() {
    positionFilterControlsResponsive();
    positionTocResponsive();
    wrapMobileStickyPanels();
  }

  // ponytail: breakpoint-only — a plain resize listener also fires when the
  // mobile keyboard opens/closes, which would blur the search input mid-type.
  window.matchMedia('(max-width: 767px)').addEventListener('change', repositionCatalogLayout);

  const filterToggleBtn = document.getElementById('filterToggleBtn');
  if (filterToggleBtn) {
    if (!filterToggleBtn.hasAttribute('data-initialized')) {
      const isMobile = window.innerWidth < 768;
      filterToggleBtn.setAttribute('aria-expanded', isMobile ? 'false' : 'true');
      filterToggleBtn.setAttribute('data-initialized', 'true');
    }
    bindExpandToggle(filterToggleBtn);
  }

  // tocToggleBtn's initial aria-expanded/data-initialized is set inside
  // renderToc() instead — matches experience-catalog.js's timing, since the
  // TOC only exists once the first render() produces >1 visible card.
  bindExpandToggle(document.getElementById('tocToggleBtn'));

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

  positionFilterControlsResponsive();
  wrapMobileStickyPanels();
  render();
});
