// Cursor-following spotlight for .card-surface and .card-glow elements.
// Also spawns a Material-You-style click ripple on any element that
// matches the SELECTOR.
//
// Performance budget:
//   - One document-level mousemove listener (not one per card).
//   - rAF-throttled: at most one update per animation frame.
//   - IntersectionObserver: only cards in/near the viewport are updated.
//   - Distance gate: cards whose center is > 700px from the cursor are
//     skipped — the 500px halo + 120px border gradient can't reach them.
//   - Cached rects via WeakMap, refreshed on scroll/resize (rAF-batched).
//     Also refreshed when a scrollable ancestor (e.g. academic-sidebar
//     with overflow-y: auto) scrolls, not just the window.
//   - CSS variables are only written when the value actually changes,
//     so the browser doesn't invalidate styles for no-op updates.
//   - Ripple is a single short-lived <span> per click; removes itself
//     on animationend. No layout cost outside the animation window.

(() => {
  'use strict';

  var SELECTOR = '.card-surface, .card-glow';
  var MAX_DIST_SQ = 700 * 700; // skip cards > 700px from the cursor
  var OFFSCREEN = '-9999px'; // parks the gradient well off the card

  var allCards = []; // static list, grows via MutationObserver
  var visibleCards = new Set();
  var rectCache = new WeakMap();

  var pendingFrame = false;
  var pendingRectRefresh = false;
  var cursorSeen = false; // true once the first mousemove has arrived
  var lastX = 0;
  var lastY = 0;

  function refreshRects() {
    for (var i = 0; i < allCards.length; i++) {
      var c = allCards[i];
      if (c.isConnected) rectCache.set(c, c.getBoundingClientRect());
    }
  }

  function setVar(el, name, value) {
    // Only write when changed — avoids redundant style invalidations.
    if (el.style.getPropertyValue(name) !== value) {
      el.style.setProperty(name, value);
    }
  }

  function tick() {
    pendingFrame = false;
    pendingRectRefresh = false;
    var x = lastX;
    var y = lastY;
    for (var i = 0; i < allCards.length; i++) {
      var card = allCards[i];
      if (!visibleCards.has(card)) continue;
      var rect = rectCache.get(card);
      if (!rect) continue;
      var cx = rect.left + rect.width * 0.5;
      var cy = rect.top + rect.height * 0.5;
      var dx = x - cx;
      var dy = y - cy;
      if (dx * dx + dy * dy > MAX_DIST_SQ) continue;
      setVar(card, '--mouse-x', x - rect.left + 'px');
      setVar(card, '--mouse-y', y - rect.top + 'px');
    }
  }

  function scheduleFrame() {
    if (pendingFrame) return;
    pendingFrame = true;
    requestAnimationFrame(tick);
  }

  function onMove(e) {
    lastX = e.clientX;
    lastY = e.clientY;
    cursorSeen = true;
    scheduleFrame();
  }

  function onScrollOrResize() {
    // Batch refresh + tick into the next animation frame. Without this,
    // the CSS vars stay at the pre-scroll position until the mouse next
    // moves — which is what made the glow look "stuck above the cursor"
    // after scrolling.
    if (!pendingRectRefresh) {
      pendingRectRefresh = true;
      requestAnimationFrame(() => {
        pendingRectRefresh = false;
        refreshRects();
        if (cursorSeen) scheduleFrame();
      });
    }
  }

  function addCard(card) {
    if (allCards.indexOf(card) !== -1) return;
    allCards.push(card);
    rectCache.set(card, card.getBoundingClientRect());
    // Park the gradient off-card so nothing flashes on load.
    setVar(card, '--mouse-x', OFFSCREEN);
    setVar(card, '--mouse-y', OFFSCREEN);
    if (io) io.observe(card);
  }

  function scan(root) {
    if (!root || !root.querySelectorAll) return;
    var nodes = root.querySelectorAll(SELECTOR);
    for (var i = 0; i < nodes.length; i++) addCard(nodes[i]);
  }

  // A card can live inside a scrollable container (e.g. the academic
  // sidebar with overflow-y: auto). Window scroll events don't fire when
  // such a container scrolls, so walk up the parent chain to find the
  // nearest scrollable ancestor and listen on it.
  function isScrollable(el) {
    return el && el.scrollHeight > el.clientHeight + 1;
  }
  function nearestScrollableAncestor(el) {
    var p = el.parentElement;
    while (p) {
      if (isScrollable(p)) return p;
      p = p.parentElement;
    }
    return null;
  }

  // Scroll listeners registered on internal scroll containers. Deduped.
  var scrollListeners = new WeakSet();
  function attachScrollListener(el) {
    if (!el || scrollListeners.has(el)) return;
    scrollListeners.add(el);
    el.addEventListener('scroll', onScrollOrResize, { passive: true });
  }

  function watchScrollAncestors() {
    for (var i = 0; i < allCards.length; i++) {
      var ancestor = nearestScrollableAncestor(allCards[i]);
      if (ancestor) attachScrollListener(ancestor);
    }
  }

  // Click ripple — Material-You-style expanding ring at the click point.
  // One delegate listener, short-lived DOM nodes, GPU-accelerated transform.
  function spawnRipple(target, x, y) {
    var rect = target.getBoundingClientRect();
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      return; // click was outside the element's visible box
    }
    var size = Math.max(rect.width, rect.height) * 0.7;
    var ripple = document.createElement('span');
    ripple.className = 'click-ripple';
    ripple.style.width = size + 'px';
    ripple.style.height = size + 'px';
    ripple.style.left = x - rect.left - size / 2 + 'px';
    ripple.style.top = y - rect.top - size / 2 + 'px';
    target.appendChild(ripple);
    ripple.addEventListener(
      'animationend',
      () => {
        if (ripple.parentNode) ripple.parentNode.removeChild(ripple);
      },
      { once: true }
    );
  }

  function onClick(e) {
    var card = e.target.closest(SELECTOR);
    if (!card) return;
    spawnRipple(card, e.clientX, e.clientY);
  }

  // Press state — subtle scale + brighter halo while the pointer is held
  // down. Released on pointerup/pointercancel anywhere on the document, so
  // dragging off the card and releasing still cleans up properly.
  var pressedCard = null;
  function onPointerDown(e) {
    var card = e.target.closest(SELECTOR);
    if (!card) return;
    if (pressedCard && pressedCard !== card) pressedCard.classList.remove('is-pressed');
    card.classList.add('is-pressed');
    pressedCard = card;
  }
  function releasePressed() {
    if (pressedCard) {
      pressedCard.classList.remove('is-pressed');
      pressedCard = null;
    }
  }

  var io = null;
  function init() {
    scan(document);

    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver(
        (entries) => {
          for (var i = 0; i < entries.length; i++) {
            var e = entries[i];
            if (e.isIntersecting) visibleCards.add(e.target);
            else visibleCards.delete(e.target);
          }
        },
        { rootMargin: '120px 0px' }
      );
      for (var i = 0; i < allCards.length; i++) io.observe(allCards[i]);
    } else {
      // No IO support — treat all cards as visible.
      for (var i = 0; i < allCards.length; i++) visibleCards.add(allCards[i]);
    }

    document.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('click', onClick, { passive: true });
    document.addEventListener('pointerdown', onPointerDown, { passive: true });
    document.addEventListener('pointerup', releasePressed, { passive: true });
    document.addEventListener('pointercancel', releasePressed, { passive: true });
    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize, { passive: true });
    watchScrollAncestors();

    // Cards rendered after init (catalog scripts) get picked up by the
    // MutationObserver below.
    if ('MutationObserver' in window) {
      var mo = new MutationObserver((mutations) => {
        var addedAny = false;
        for (var m = 0; m < mutations.length; m++) {
          var added = mutations[m].addedNodes;
          for (var k = 0; k < added.length; k++) {
            var n = added[k];
            if (n.nodeType !== 1) continue;
            if (n.matches && n.matches(SELECTOR)) {
              addCard(n);
              addedAny = true;
            }
            scan(n);
          }
        }
        // If new cards appeared, check whether they live inside a
        // scrollable container that we haven't subscribed to yet.
        if (addedAny) watchScrollAncestors();
      });
      mo.observe(document.body, { childList: true, subtree: true });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
