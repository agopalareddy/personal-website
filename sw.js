// Application-shell cache: CSS, JS, fonts, and images only, populated at
// runtime as they're requested (asset URLs carry a ?v= cache-busting
// query string, so there's no fixed precache list to keep in sync).
// HTML is never cached here, so deploys always show fresh content.
const CACHE_NAME = 'shell-v1';

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
      )
  );
  self.clients.claim();
});

function isShellAsset(url) {
  return (
    url.origin === self.location.origin && /\.(css|js|woff2?|png|jpe?g|svg)$/.test(url.pathname)
  );
}

// Stale-while-revalidate: serve from cache instantly, refresh in background.
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET' || !isShellAsset(url)) return;

  event.respondWith(
    caches.open(CACHE_NAME).then((cache) =>
      cache.match(event.request).then((cached) => {
        const network = fetch(event.request)
          .then((response) => {
            cache.put(event.request, response.clone());
            return response;
          })
          .catch(() => cached);
        return cached || network;
      })
    )
  );
});
