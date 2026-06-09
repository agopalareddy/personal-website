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
document.addEventListener('DOMContentLoaded', function () {
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

  // ---------------------------------------------------------------------------
  // Remove SSR fallback (noscript + JSON blob) if present.  Modern browsers
  // re-execute <noscript> contents as DOM nodes when JS is enabled, so we
  // must clear them before the first render to avoid double-display.
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

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------

  /** Escape HTML special characters to prevent XSS in user-provided text. */
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

  /**
   * Format a date range for display.
   *  - Same month & year: "Aug 2024"
   *  - Different months:  "Aug 2024 – May 2026"
   *  - End date in the future or missing → "Aug 2024 – Present"
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

    // If end date is in the future, show "Present"
    var now = new Date();
    if (endDate > now) return startStr + ' \u2013 Present';

    // Same month & year → single date
    if (
      startDate.getFullYear() === endDate.getFullYear() &&
      startDate.getMonth() === endDate.getMonth()
    ) {
      return startStr;
    }

    var endStr = monthNames[endDate.getMonth()] + ' ' + endDate.getFullYear();
    return startStr + ' \u2013 ' + endStr;
  }

  // ---------------------------------------------------------------------------
  // Card renderer — must match the <noscript> fallback structure exactly
  // ---------------------------------------------------------------------------
  function createExperienceCard(exp) {
    var category = exp.category || '';
    var catClass = 'cat-' + category;
    var catLabel = formatCategory(category);
    var title = escapeHtml(exp.title || '');
    var org = escapeHtml(exp.organization || '');
    var dateRange = formatDateRange(exp.start_date, exp.end_date);
    var excerpt = escapeHtml(exp.excerpt || '');
    var id = exp.id || '';
    var detailUrl = '/experience/' + category + '/' + id + '.html';
    var venueText = org ? org + ' • ' + dateRange : dateRange;

    var cardHtml =
      '<div class="project-card spotlight-card timeline-card" data-category="' +
      escapeHtml(category) +
      '">' +
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
      '<p class="project-excerpt">' +
      excerpt +
      '</p>' +
      '<div class="card-actions">' +
      '<a href="' +
      detailUrl +
      '" class="card-btn btn-detail" aria-label="Explore dedicated detail page for ' +
      title +
      '"><i class="fas fa-info-circle" aria-hidden="true"></i> Details</a>' +
      '</div>' +
      '</div>';

    return cardHtml;
  }

  // ---------------------------------------------------------------------------
  // Render pipeline: filter → sort → paint
  // ---------------------------------------------------------------------------
  function renderExperiences() {
    // 1. Filter
    var filtered = experiences.filter(function (exp) {
      var matchesCategory = activeFilter === 'all' || exp.category === activeFilter;

      var q = searchQuery.toLowerCase();
      var matchesSearch =
        !q ||
        (exp.title && exp.title.toLowerCase().indexOf(q) !== -1) ||
        (exp.organization && exp.organization.toLowerCase().indexOf(q) !== -1) ||
        (exp.excerpt && exp.excerpt.toLowerCase().indexOf(q) !== -1);

      return matchesCategory && matchesSearch;
    });

    // 2. Sort
    filtered.sort(function (a, b) {
      if (activeSort === 'date-desc') {
        return (
          new Date((b.start_date || '1970-01-01') + 'T00:00:00') -
          new Date((a.start_date || '1970-01-01') + 'T00:00:00')
        );
      }
      if (activeSort === 'date-asc') {
        return (
          new Date((a.start_date || '1970-01-01') + 'T00:00:00') -
          new Date((b.start_date || '1970-01-01') + 'T00:00:00')
        );
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
      return;
    }
    if (emptyState) emptyState.hidden = true;

    // 4. Paint cards
    grid.innerHTML = filtered.map(createExperienceCard).join('');

    // 5. Re-attach spotlight effect to new cards
    setupSpotlight();
  }

  // ---------------------------------------------------------------------------
  // Spotlight cursor effect (same approach as projects-catalog.js)
  // ---------------------------------------------------------------------------
  function setupSpotlight() {
    var cards = grid.querySelectorAll('.spotlight-card');
    cards.forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', x + 'px');
        card.style.setProperty('--mouse-y', y + 'px');
      });
    });
  }

  // ---------------------------------------------------------------------------
  // Event listeners
  // ---------------------------------------------------------------------------
  if (searchInput) {
    searchInput.addEventListener('input', function (e) {
      searchQuery = e.target.value;
      renderExperiences();
    });
  }

  filterButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filterButtons.forEach(function (b) {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      activeFilter = btn.getAttribute('data-filter') || 'all';
      renderExperiences();
    });
  });

  if (sortSelect) {
    sortSelect.addEventListener('change', function (e) {
      activeSort = e.target.value;
      renderExperiences();
    });
  }

  // ---------------------------------------------------------------------------
  // Initial render
  // ---------------------------------------------------------------------------
  renderExperiences();
});
