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

  var orgFilter = document.getElementById('orgFilter');
  var yearFilter = document.getElementById('yearFilter');

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
    if (lower.indexOf('gpsc') !== -1 || lower.indexOf('student council') !== -1) return 'GPSC';
    if (lower.indexOf('umang') !== -1) return 'Umang';
    if (lower.indexOf('hackwashu') !== -1) return 'HackWashU';
    if (lower.indexOf('hindu student') !== -1) return 'HSC';
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

  // ---------------------------------------------------------------------------
  // Card renderer
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

    var orgShort = getOrgShort(exp.organization);
    var venueText = orgShort ? orgShort + ' \u2022 ' + dateRange : dateRange;

    var subtitleHtml = '';
    if (org) {
      subtitleHtml =
        '<div class="card-org-context" style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 0.6rem; font-family: var(--font-body); font-weight: 500;">' +
        org +
        (exp.role_context ? ' \u2022 ' + escapeHtml(exp.role_context) : '') +
        '</div>';
    } else if (exp.role_context) {
      subtitleHtml =
        '<div class="card-org-context" style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 0.6rem; font-family: var(--font-body); font-weight: 500;">' +
        escapeHtml(exp.role_context) +
        '</div>';
    }

    var cardHtml =
      '<div class="project-card spotlight-card timeline-card experience-card" id="exp-' +
      escapeHtml(id) +
      '" data-category="' +
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
      subtitleHtml +
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
      renderToc([]);
      return;
    }
    if (emptyState) emptyState.hidden = true;

    // 4. Paint cards
    var html = '';
    var lastYear = null;
    filtered.forEach(function (exp) {
      var year = exp.start_date ? parseInt(exp.start_date.split('-')[0], 10) : null;
      if (year && year !== lastYear) {
        html += '<div class="timeline-year" id="year-' + year + '">' + year + '</div>';
        lastYear = year;
      }
      html += createExperienceCard(exp);
    });
    grid.innerHTML = html;

    // Render Table of Contents
    renderToc(filtered);

    // 5. Re-attach spotlight effect to new cards
    setupSpotlight();
  }

  // ---------------------------------------------------------------------------
  // Spotlight cursor effect
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

      card.addEventListener('click', function (e) {
        if (e.target.closest('.card-btn') || e.target.closest('a') || e.target.closest('button')) {
          return;
        }
        var mainLink = card.querySelector('h3.project-title a');
        if (mainLink) {
          mainLink.click();
        }
      });
    });
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
      experiences.forEach(function (exp) {
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
      var years = Array.from(yearsSet).sort(function (a, b) {
        return b - a;
      });

      var yearOptions = '<option value="all">All Years</option>';
      years.forEach(function (yr) {
        yearOptions += '<option value="' + yr + '">' + yr + '</option>';
      });
      yearFilter.innerHTML = yearOptions;
    }
  }

  // ---------------------------------------------------------------------------
  // Event listeners
  // ---------------------------------------------------------------------------
  if (orgFilter) {
    orgFilter.addEventListener('change', function (e) {
      activeOrg = e.target.value;
      renderExperiences();
    });
  }

  if (yearFilter) {
    yearFilter.addEventListener('change', function (e) {
      activeYear = e.target.value;
      renderExperiences();
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', function (e) {
      searchQuery = e.target.value;
      renderExperiences();
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener('change', function (e) {
      activeSort = e.target.value;
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

  // ---------------------------------------------------------------------------
  // Table of Contents generator
  // ---------------------------------------------------------------------------
  function setupTocScrollListeners(tocListElement) {
    var links = tocListElement.querySelectorAll('a[href^="#"]');
    links.forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        var targetId = this.getAttribute('href').substring(1);
        var targetElement = document.getElementById(targetId);
        if (targetElement) {
          var headerOffset = 90; // height of sticky top header + some padding
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

    var html = '';

    if (activeSort === 'title-asc') {
      filtered.forEach(function (exp) {
        var id = exp.id || '';
        var title = exp.title || '';
        if (title.length > 32) {
          title = title.substring(0, 32) + '...';
        }
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

      filtered.forEach(function (exp) {
        var year = exp.start_date ? parseInt(exp.start_date.split('-')[0], 10) : null;
        var id = exp.id || '';
        var title = exp.title || '';
        if (title.length > 32) {
          title = title.substring(0, 32) + '...';
        }

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
  populateFilters();
  renderExperiences();
});
