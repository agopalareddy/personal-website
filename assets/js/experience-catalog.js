/**
 * experience-catalog.js
 *
 * Client-side rendering engine for the /experience/ listing page.
 * Reads the `experiences` array from the inline <script> embedded by
 * the static-site generator, then renders interactive cards with
 * category filtering, keyword search, chronological sort, and a
 * spotlight cursor effect.
 *
 * Scoped inside DOMContentLoaded — no globals are leaked.
 */
document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ---------------------------------------------------------------------------
  // Guard: the inline <script> must have defined `experiences` before this file.
  // ---------------------------------------------------------------------------
  if (typeof experiences === 'undefined' || !Array.isArray(experiences)) {
    return;
  }

  // ---------------------------------------------------------------------------
  // DOM references
  // ---------------------------------------------------------------------------
  var grid = document.getElementById('experienceGrid');
  if (!grid) return;

  var searchInput = document.getElementById('experienceSearch');
  var sortSelect = document.getElementById('experienceSort');
  var filterButtons = document.querySelectorAll('.filter-btn');
  var emptyState = document.getElementById('emptyState');
  var a11yAnnouncer = document.getElementById('a11y-announcer');

  var orgFilter = document.getElementById('orgFilter');
  var yearFilter = document.getElementById('yearFilter');
  var clearFiltersBtn = document.getElementById('clearFiltersBtn');

  // ---------------------------------------------------------------------------
  // Remove SSR fallback (noscript + JSON blob) if present.
  // ---------------------------------------------------------------------------
  var ssrJson = grid.querySelector('script.experiences-data');
  if (ssrJson) ssrJson.remove();

  var ssrNoscript = grid.querySelector('noscript');
  if (ssrNoscript) ssrNoscript.remove();

  // ---------------------------------------------------------------------------
  // State
  // ---------------------------------------------------------------------------
  var activeFilter = 'all';
  var activeSort = 'date-desc';
  var searchQuery = '';
  var activeOrg = 'all';
  var activeYear = 'all';

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------

  /** Escape HTML special characters to prevent XSS. */
  function escapeHtml(str) {
    if (!str) return '';
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  /** Capitalise first letter of a category slug. */
  function formatCategory(slug) {
    if (!slug) return '';
    return slug.charAt(0).toUpperCase() + slug.slice(1);
  }

  /** Get shortened organisation tag for clean layout. */
  function getOrgShort(org) {
    if (!org) return '';
    var lower = org.toLowerCase();
    if (lower.indexOf('washington university') !== -1) {
      if (lower.indexOf('drives') !== -1) return 'Washington University (DRIVES)';
      return 'Washington University in St. Louis';
    }
    if (lower.indexOf('ohio wesleyan') !== -1) return 'Ohio Wesleyan University';
    if (lower.indexOf('crittero') !== -1) return 'Crittero';
    if (lower.indexOf('lab714') !== -1) return 'Lab714';
    if (lower.indexOf('mitxsurestart') !== -1 || lower.indexOf('mitx') !== -1)
      return 'MITxSureStart';
    if (lower.indexOf('denison') !== -1) return 'Denison University';
    if (lower.indexOf('next genius') !== -1) return 'Next Genius';
    if (lower.indexOf('ages & science coach') !== -1) return 'Science Coach';
    if (lower.indexOf('spring student symposium') !== -1) return 'OWU Symposium';
    if (lower.indexOf('patricia belt conrades') !== -1) return 'OWU Symposium';
    if (lower.indexOf('graduate student affairs') !== -1 || lower.indexOf('gsaab') !== -1)
      return 'GSAAB';
    if (lower.indexOf('career engagement') !== -1 || lower.indexOf('cce') !== -1)
      return 'CCE Board';
    if (lower.indexOf('umang') !== -1) return 'Umang';
    if (lower.indexOf('hackwashu') !== -1) return 'HackWashU';
    if (lower.indexOf('hindu student') !== -1) return 'HSC';
    if (lower.indexOf('gpsc') !== -1 || lower.indexOf('student council') !== -1) return 'GPSC';
    if (lower.indexOf('wesleyan council') !== -1 || lower.indexOf('wcsa') !== -1) return 'WCSA';
    if (lower.indexOf('neurds') !== -1) return 'The Neurds';
    if (lower.indexOf('programming board') !== -1) return 'CPB';
    if (lower.indexOf('mathematics, computer science') !== -1) return 'Math/CS Board';

    var parts = org.split(',');
    return parts[0].trim();
  }

  /**
   * Format a date range for display.
   */
  function formatDateRange(startISO, endISO) {
    var monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    if (!startISO) return '';

    var startDate = new Date(startISO + 'T00:00:00');
    if (isNaN(startDate.getTime())) return escapeHtml(startISO);

    var startStr = monthNames[startDate.getMonth()] + ' ' + startDate.getFullYear();

    if (!endISO) return startStr;

    var endDate = new Date(endISO + 'T00:00:00');
    if (isNaN(endDate.getTime())) return startStr;

    var now = new Date();
    if (endDate > now) return startStr + ' \u2013 Present';

    if (
      startDate.getFullYear() === endDate.getFullYear() &&
      startDate.getMonth() === endDate.getMonth()
    ) {
      return startStr;
    }

    var endStr = monthNames[endDate.getMonth()] + ' ' + endDate.getFullYear();
    return startStr + ' \u2013 ' + endStr;
  }

  /**
   * Date used for chronological ordering and timeline grouping.
   * Completed entries should appear by completion/receipt date, not by start date.
   */
  function getOrderDate(exp) {
    return exp.end_date || exp.start_date || '1970-01-01';
  }

  function getOrderYear(exp) {
    var orderDate = getOrderDate(exp);
    return orderDate ? parseInt(orderDate.split('-')[0], 10) : null;
  }

  function getExperienceDisplayTitle(exp) {
    var title = (exp.title || '').trim();
    if (!title || exp.category !== 'leadership') return title;

    var org = (exp.organization || '').trim();
    var orgShort = getOrgShort(org);
    if (!orgShort) return title;
    if (orgShort === 'Science Coach' || orgShort === 'OWU Symposium') return title;

    var titleLower = title.toLowerCase();
    if (titleLower.indexOf(orgShort.toLowerCase()) !== -1) return title;
    if (org && titleLower.indexOf(org.toLowerCase()) !== -1) return title;

    return title + ' - ' + orgShort;
  }

  // ---------------------------------------------------------------------------
  // Card renderer
  // ---------------------------------------------------------------------------
  function createExperienceCard(exp) {
    var category = exp.category || '';
    var catClass = 'cat-' + category;
    var catLabel = formatCategory(category);
    var title = escapeHtml(getExperienceDisplayTitle(exp));
    var org = escapeHtml(exp.organization || '');
    var dateRange = formatDateRange(exp.start_date, exp.end_date);
    var excerpt = escapeHtml(exp.excerpt || '');
    var id = exp.id || '';
    var detailUrl = '/experience/' + category + '/' + id + '.html';

    var venueText = dateRange;

    var subtitleHtml = '';
    var subtitleParts = [];
    if (org) {
      subtitleParts.push(org);
    }
    if (exp.role_context) {
      subtitleParts.push(escapeHtml(exp.role_context));
    }
    if (exp.location) {
      subtitleParts.push(escapeHtml(exp.location));
    }

    if (subtitleParts.length > 0) {
      subtitleHtml = '<div class="card-org-context">' + subtitleParts.join(' \u2022 ') + '</div>';
    }

    var cardHtml =
      '<div class="project-card card-surface timeline-card experience-card" id="exp-' +
      escapeHtml(id) +
      '" data-category="' +
      escapeHtml(category) +
      '"><span class="timeline-marker"></span>' +
      '<div class="card-meta">' +
      '<span class="card-category ' +
      catClass +
      '">' +
      catLabel +
      '</span>' +
      '<span class="card-venue">' +
      venueText +
      '</span>' +
      '</div>' +
      '<h3 class="project-title">' +
      '<a href="' +
      detailUrl +
      '" aria-label="Explore dedicated detail page for ' +
      title +
      '">' +
      title +
      '</a>' +
      '</h3>' +
      subtitleHtml +
      '<p class="project-excerpt">' +
      excerpt +
      '</p>' +
      '<div class="card-actions">' +
      '<a href="' +
      detailUrl +
      '" class="card-btn btn-detail" aria-label="Explore dedicated detail page for ' +
      title +
      '">' +
      (typeof OCTICONS !== 'undefined' && OCTICONS['INFO_16'] ? OCTICONS['INFO_16'] : '') +
      ' Details</a>' +
      '</div>' +
      '</div>';

    return cardHtml;
  }

  // ---------------------------------------------------------------------------
  // Render pipeline: filter → sort → paint
  // ---------------------------------------------------------------------------
  function renderExperiences() {
    // 1. Filter
    var filtered = experiences.filter((exp) => {
      var matchesCategory = activeFilter === 'all' || exp.category === activeFilter;

      var matchesOrg = true;
      if (activeOrg !== 'all') {
        var orgText = (exp.organization || '').toLowerCase();
        if (activeOrg === 'WashU') {
          matchesOrg = orgText.indexOf('washington university') !== -1;
        } else if (activeOrg === 'OWU') {
          matchesOrg = orgText.indexOf('ohio wesleyan') !== -1;
        } else if (activeOrg === 'Corporate') {
          matchesOrg = orgText.indexOf('crittero') !== -1 || orgText.indexOf('lab714') !== -1;
        } else if (activeOrg === 'MITxSureStart') {
          matchesOrg = orgText.indexOf('mitx') !== -1 || orgText.indexOf('surestart') !== -1;
        } else if (activeOrg === 'Personal') {
          matchesOrg =
            orgText.indexOf('washington university') === -1 &&
            orgText.indexOf('ohio wesleyan') === -1 &&
            orgText.indexOf('crittero') === -1 &&
            orgText.indexOf('lab714') === -1 &&
            orgText.indexOf('mitx') === -1 &&
            orgText.indexOf('surestart') === -1;
        }
      }

      var matchesYear = true;
      if (activeYear !== 'all') {
        var selYear = parseInt(activeYear, 10);
        var startYear = exp.start_date ? parseInt(exp.start_date.split('-')[0], 10) : 0;
        var endYear = exp.end_date
          ? parseInt(exp.end_date.split('-')[0], 10)
          : new Date().getFullYear();
        matchesYear = selYear >= startYear && selYear <= endYear;
      }

      var q = searchQuery.toLowerCase();
      var matchesSearch =
        !q ||
        (exp.title && exp.title.toLowerCase().indexOf(q) !== -1) ||
        (exp.organization && exp.organization.toLowerCase().indexOf(q) !== -1) ||
        (exp.organization &&
          q === 'washu' &&
          exp.organization.toLowerCase().indexOf('washington university') !== -1) ||
        (exp.organization &&
          q === 'owu' &&
          exp.organization.toLowerCase().indexOf('ohio wesleyan') !== -1) ||
        (exp.excerpt && exp.excerpt.toLowerCase().indexOf(q) !== -1);

      return matchesCategory && matchesOrg && matchesYear && matchesSearch;
    });

    // 2. Sort
    filtered.sort((a, b) => {
      if (activeSort === 'date-desc') {
        return new Date(getOrderDate(b) + 'T00:00:00') - new Date(getOrderDate(a) + 'T00:00:00');
      }
      if (activeSort === 'date-asc') {
        return new Date(getOrderDate(a) + 'T00:00:00') - new Date(getOrderDate(b) + 'T00:00:00');
      }
      if (activeSort === 'title-asc') {
        return (a.title || '').localeCompare(b.title || '');
      }
      return 0;
    });

    // 3. Empty state
    if (filtered.length === 0) {
      grid.innerHTML = '';
      if (emptyState) emptyState.hidden = false;
      renderToc([]);
      if (a11yAnnouncer) a11yAnnouncer.textContent = 'Showing 0 entries.';
      return;
    }
    if (emptyState) emptyState.hidden = true;

    // 4. Paint cards
    var html = '';
    var lastYear = null;
    filtered.forEach((exp) => {
      var year = getOrderYear(exp);
      if (year && year !== lastYear) {
        html += '<h2 class="timeline-year" id="year-' + year + '">' + year + '</h2>';
        lastYear = year;
      }
      html += createExperienceCard(exp);
    });
    grid.innerHTML = html;

    // Render Table of Contents
    renderToc(filtered);
    if (a11yAnnouncer) {
      a11yAnnouncer.textContent =
        'Showing ' + filtered.length + (filtered.length === 1 ? ' entry.' : ' entries.');
    }
  }

  // ---------------------------------------------------------------------------
  // Dynamic filter dropdown generation
  // ---------------------------------------------------------------------------
  function populateFilters() {
    if (orgFilter) {
      orgFilter.innerHTML =
        '<option value="all">All Organizations</option>' +
        '<option value="WashU">Washington University in St. Louis</option>' +
        '<option value="OWU">Ohio Wesleyan University</option>' +
        '<option value="Corporate">Corporate / Industry (Crittero, Lab714)</option>' +
        '<option value="MITxSureStart">MITxSureStart</option>' +
        '<option value="Personal">Other / Personal Boards</option>';
    }

    if (yearFilter) {
      var yearsSet = new Set();
      experiences.forEach((exp) => {
        if (exp.start_date) {
          var startYear = parseInt(exp.start_date.split('-')[0], 10);
          var endYear = exp.end_date
            ? parseInt(exp.end_date.split('-')[0], 10)
            : new Date().getFullYear();
          for (var y = startYear; y <= endYear; y++) {
            yearsSet.add(y);
          }
        }
      });
      var years = Array.from(yearsSet).sort((a, b) => b - a);

      var yearOptions = '<option value="all">All Years</option>';
      years.forEach((yr) => {
        yearOptions += '<option value="' + yr + '">' + yr + '</option>';
      });
      yearFilter.innerHTML = yearOptions;
    }
  }

  // ---------------------------------------------------------------------------
  // URL param sync — makes a filtered view shareable/bookmarkable.
  // replaceState (not pushState) keeps every keystroke off the back-button history.
  // ---------------------------------------------------------------------------
  function updateUrlParams() {
    var params = new URLSearchParams();
    if (activeFilter !== 'all') params.set('category', activeFilter);
    if (activeOrg !== 'all') params.set('org', activeOrg);
    if (activeYear !== 'all') params.set('year', activeYear);
    if (activeSort !== 'date-desc') params.set('sort', activeSort);
    if (searchQuery) params.set('q', searchQuery);
    var qs = params.toString();
    history.replaceState(
      null,
      '',
      qs ? '?' + qs + location.hash : location.pathname + location.hash
    );
  }

  function clearAllFilters() {
    activeFilter = 'all';
    activeOrg = 'all';
    activeYear = 'all';
    activeSort = 'date-desc';
    searchQuery = '';

    filterButtons.forEach((b) => {
      var isAll = b.getAttribute('data-filter') === 'all';
      b.classList.toggle('active', isAll);
      b.setAttribute('aria-pressed', String(isAll));
    });
    if (orgFilter) orgFilter.value = 'all';
    if (yearFilter) yearFilter.value = 'all';
    if (sortSelect) sortSelect.value = 'date-desc';
    if (searchInput) searchInput.value = '';

    updateUrlParams();
    renderExperiences();
  }

  // ---------------------------------------------------------------------------
  // Event listeners
  // ---------------------------------------------------------------------------
  if (orgFilter) {
    orgFilter.addEventListener('change', (e) => {
      activeOrg = e.target.value;
      updateUrlParams();
      renderExperiences();
    });
  }

  if (yearFilter) {
    yearFilter.addEventListener('change', (e) => {
      activeYear = e.target.value;
      updateUrlParams();
      renderExperiences();
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      updateUrlParams();
      renderExperiences();
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      activeSort = e.target.value;
      updateUrlParams();
      renderExperiences();
    });
  }

  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterButtons.forEach((b) => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      activeFilter = btn.getAttribute('data-filter') || 'all';
      updateUrlParams();
      renderExperiences();
    });
  });

  if (clearFiltersBtn) {
    clearFiltersBtn.addEventListener('click', clearAllFilters);
  }

  // ---------------------------------------------------------------------------
  // Table of Contents generator
  // ---------------------------------------------------------------------------
  function positionFilterControlsResponsive() {
    var filterControls = document.getElementById('filterControls');
    if (!filterControls) return;

    var isMobile = window.innerWidth < 768;
    var sidebar = document.querySelector('.academic-sidebar');
    var subtitle = document.querySelector('.academic-content > p');
    var stickyWrapper = document.querySelector('.mobile-sticky-wrapper');

    if (isMobile && subtitle) {
      var layoutBlock = stickyWrapper || filterControls;
      if (
        layoutBlock.parentNode !== subtitle.parentNode ||
        layoutBlock.previousElementSibling !== subtitle
      ) {
        subtitle.parentNode.insertBefore(layoutBlock, subtitle.nextSibling);
      }
    } else if (!isMobile && sidebar) {
      if (filterControls.parentNode !== sidebar) {
        sidebar.appendChild(filterControls);
      }
    }
  }

  function positionTocResponsive() {
    var tocContainer = document.getElementById('tocContainer');
    if (!tocContainer) return;

    var isMobile = window.innerWidth < 768;
    var filterControls = document.getElementById('filterControls');
    var sidebar = document.querySelector('.academic-sidebar');

    if (isMobile && filterControls) {
      if (
        tocContainer.parentNode !== filterControls.parentNode ||
        tocContainer.previousElementSibling !== filterControls
      ) {
        filterControls.parentNode.insertBefore(tocContainer, filterControls.nextSibling);
      }
    } else if (!isMobile && sidebar) {
      if (tocContainer.parentNode !== sidebar) {
        sidebar.appendChild(tocContainer);
      }
    }
  }

  function wrapMobileStickyPanels() {
    var isMobile = window.innerWidth < 768;
    var filterControls = document.getElementById('filterControls');
    var tocContainer = document.getElementById('tocContainer');
    var existingWrapper = document.querySelector('.mobile-sticky-wrapper');

    if (isMobile) {
      if (!filterControls || !tocContainer) return;
      // Already wrapped correctly — skip
      if (
        existingWrapper &&
        existingWrapper.contains(filterControls) &&
        existingWrapper.contains(tocContainer)
      )
        return;

      // Remove stale wrapper if it exists but doesn't contain both panels
      if (existingWrapper) {
        var parent = existingWrapper.parentNode;
        while (existingWrapper.firstChild) {
          parent.insertBefore(existingWrapper.firstChild, existingWrapper);
        }
        parent.removeChild(existingWrapper);
      }

      // Both panels should be adjacent siblings in academic-content
      if (filterControls.parentNode === tocContainer.parentNode) {
        var wrapper = document.createElement('div');
        wrapper.className = 'mobile-sticky-wrapper';
        filterControls.parentNode.insertBefore(wrapper, filterControls);
        wrapper.appendChild(filterControls);
        wrapper.appendChild(tocContainer);
      }
    } else {
      if (existingWrapper) {
        var parent = existingWrapper.parentNode;
        while (existingWrapper.firstChild) {
          parent.insertBefore(existingWrapper.firstChild, existingWrapper);
        }
        parent.removeChild(existingWrapper);
      }
    }
  }

  function setupTocScrollListeners(tocListElement) {
    var links = tocListElement.querySelectorAll('a[href^="#"]');
    links.forEach((link) => {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        var targetId = this.getAttribute('href').substring(1);
        var targetElement = document.getElementById(targetId);
        if (targetElement) {
          // Collapse the TOC on mobile first so the height calculation is accurate for the final scroll position
          var toggleBtn = document.getElementById('tocToggleBtn');
          var isMobile = window.innerWidth < 768;
          if (isMobile && toggleBtn && toggleBtn.getAttribute('aria-expanded') === 'true') {
            toggleBtn.setAttribute('aria-expanded', 'false');
          }

          var headerOffset = isMobile ? 120 : 90;
          var elementPosition = targetElement.getBoundingClientRect().top;
          var offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth',
          });

          // Update URL hash without jump
          history.pushState(null, null, '#' + targetId);
        }
      });
    });
  }

  function renderToc(filtered) {
    var tocContainer = document.getElementById('tocContainer');
    var tocList = document.getElementById('tocList');
    if (!tocContainer || !tocList) return;

    if (filtered.length <= 1) {
      tocContainer.hidden = true;
      tocList.innerHTML = '';
      return;
    }

    // Move TOC element to its correct container depending on viewport width
    positionTocResponsive();

    var toggleBtn = document.getElementById('tocToggleBtn');
    if (toggleBtn && !toggleBtn.hasAttribute('data-initialized')) {
      var isMobile = window.innerWidth < 768;
      toggleBtn.setAttribute('aria-expanded', isMobile ? 'false' : 'true');
      toggleBtn.setAttribute('data-initialized', 'true');
    }

    var html = '';

    if (activeSort === 'title-asc') {
      filtered.forEach((exp) => {
        var id = exp.id || '';
        var title = getExperienceDisplayTitle(exp);
        html +=
          '<li class="toc-item">' +
          '<a href="#exp-' +
          escapeHtml(id) +
          '" class="toc-link">' +
          escapeHtml(title) +
          '</a>' +
          '</li>';
      });
    } else {
      var currentYear = null;
      var yearItemsHtml = '';

      filtered.forEach((exp) => {
        var year = getOrderYear(exp);
        var id = exp.id || '';
        var title = getExperienceDisplayTitle(exp);

        if (year && year !== currentYear) {
          if (currentYear !== null) {
            html +=
              '<li class="toc-item">' +
              '<a href="#year-' +
              currentYear +
              '" class="toc-year-header">' +
              currentYear +
              '</a>' +
              '<ul class="toc-nested-list">' +
              yearItemsHtml +
              '</ul>' +
              '</li>';
          }
          currentYear = year;
          yearItemsHtml = '';
        }

        yearItemsHtml +=
          '<li class="toc-item">' +
          '<a href="#exp-' +
          escapeHtml(id) +
          '" class="toc-link">' +
          escapeHtml(title) +
          '</a>' +
          '</li>';
      });

      if (currentYear !== null) {
        html +=
          '<li class="toc-item">' +
          '<a href="#year-' +
          currentYear +
          '" class="toc-year-header">' +
          currentYear +
          '</a>' +
          '<ul class="toc-nested-list">' +
          yearItemsHtml +
          '</ul>' +
          '</li>';
      } else {
        html = yearItemsHtml;
      }
    }

    tocList.innerHTML = html;
    tocContainer.hidden = false;

    setupTocScrollListeners(tocList);
  }

  // ---------------------------------------------------------------------------
  // Initialization
  // ---------------------------------------------------------------------------
  var toggleBtn = document.getElementById('tocToggleBtn');
  if (toggleBtn) {
    toggleBtn.setAttribute('data-toggle-bound', 'true');
    toggleBtn.addEventListener('click', function () {
      var expanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', !expanded);
    });
  }

  var filterToggleBtn = document.getElementById('filterToggleBtn');
  if (filterToggleBtn) {
    if (!filterToggleBtn.hasAttribute('data-initialized')) {
      var isMobile = window.innerWidth < 768;
      filterToggleBtn.setAttribute('aria-expanded', isMobile ? 'false' : 'true');
      filterToggleBtn.setAttribute('data-initialized', 'true');
    }
    filterToggleBtn.setAttribute('data-toggle-bound', 'true');
    filterToggleBtn.addEventListener('click', function () {
      var expanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', !expanded);
    });
  }

  function repositionCatalogLayout() {
    positionFilterControlsResponsive();
    positionTocResponsive();
    wrapMobileStickyPanels();
  }

  // ponytail: breakpoint-only — window resize also fires when the mobile keyboard
  // opens and must not reparent filter controls (that blurs the search input).
  window.matchMedia('(max-width: 767px)').addEventListener('change', repositionCatalogLayout);

  // Read initial filter state from the URL so filtered views are shareable/bookmarkable.
  positionFilterControlsResponsive();
  populateFilters();

  var initParams = new URLSearchParams(window.location.search);
  var categoryParam = initParams.get('category');
  if (categoryParam) {
    var matchBtn = Array.prototype.find.call(
      filterButtons,
      (b) => b.getAttribute('data-filter') === categoryParam
    );
    if (matchBtn) {
      filterButtons.forEach((b) => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      matchBtn.classList.add('active');
      matchBtn.setAttribute('aria-pressed', 'true');
      activeFilter = categoryParam;
    }
  }
  var orgParam = initParams.get('org');
  if (orgParam && orgFilter) {
    activeOrg = orgParam;
    orgFilter.value = orgParam;
  }
  var yearParam = initParams.get('year');
  if (yearParam && yearFilter) {
    activeYear = yearParam;
    yearFilter.value = yearParam;
  }
  var sortParam = initParams.get('sort');
  if (sortParam && sortSelect) {
    activeSort = sortParam;
    sortSelect.value = sortParam;
  }
  var qParam = initParams.get('q');
  if (qParam && searchInput) {
    searchQuery = qParam;
    searchInput.value = qParam;
  }

  renderExperiences();
  wrapMobileStickyPanels();
});
