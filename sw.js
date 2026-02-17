const CACHE_VERSION = 'ps-v1';
const PRECACHE = `${CACHE_VERSION}-precache`;
const RUNTIME = `${CACHE_VERSION}-runtime`;

// Local files to precache (these paths are relative to index.html at project root)
const PRECACHE_URLS = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './manifest.json',

  './components/Icon.jsx',

  './data/constants.js',
  './data/equipment.js',
  './data/workoutPlans.js',

  './hooks/SettingsContext.jsx',
  './hooks/storage.js',
  './hooks/useDebounce.js',
  './hooks/useModal.js',
  './hooks/usePersistedState.js',
  './hooks/useToast.js',
];

// CDN assets to cache for offline-after-first-load
// NOTE: keep these EXACT to match the URLs used in index.html.
const CDN_URLS = [
  'https://cdn.tailwindcss.com',
  'https://unpkg.com/react@17/umd/react.production.min.js',
  'https://unpkg.com/react-dom@17/umd/react-dom.production.min.js',
  'https://unpkg.com/@babel/standalone/babel.min.js',
];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(PRECACHE);
    await cache.addAll(PRECACHE_URLS);
    // Best-effort cache CDN assets (won’t break install if a CDN request fails)
    try { await cache.addAll(CDN_URLS); } catch (e) {}
    self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map((key) => {
      if (!key.startsWith(CACHE_VERSION)) return caches.delete(key);
    }));
    self.clients.claim();
  })());
});

// Helper: identify navigation requests (SPA route loads)
const isNavigationRequest = (req) =>
  req.mode === 'navigate' ||
  (req.method === 'GET' && req.headers.get('accept')?.includes('text/html'));

self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Always serve index.html for navigation when offline (SPA support)
  if (isNavigationRequest(req)) {
    event.respondWith((async () => {
      const cache = await caches.open(PRECACHE);
      const cached = await cache.match('./index.html');
      if (cached) return cached;

      // fallback: try network
      try {
        const fresh = await fetch(req);
        cache.put('./index.html', fresh.clone());
        return fresh;
      } catch (e) {
        // last resort: a minimal response
        return new Response('<!doctype html><title>Offline</title><h1>Offline</h1>', {
          headers: { 'Content-Type': 'text/html' }
        });
      }
    })());
    return;
  }

  // For same-origin local assets: cache-first
  if (url.origin === self.location.origin) {
    event.respondWith((async () => {
      const cache = await caches.open(RUNTIME);
      const cached = await cache.match(req);
      if (cached) return cached;

      try {
        const fresh = await fetch(req);
        cache.put(req, fresh.clone());
        return fresh;
      } catch (e) {
        // If fetch fails, try precache
        const precache = await caches.open(PRECACHE);
        return (await precache.match(req)) || new Response('', { status: 503 });
      }
    })());
    return;
  }

  // For CDN assets: stale-while-revalidate
  if (CDN_URLS.includes(req.url)) {
    event.respondWith((async () => {
      const cache = await caches.open(RUNTIME);
      const cached = await cache.match(req);
      const fetchPromise = fetch(req).then((fresh) => {
        cache.put(req, fresh.clone());
        return fresh;
      }).catch(() => null);

      return cached || (await fetchPromise) || new Response('', { status: 503 });
    })());
    return;
  }

  // Default: try network, fallback to cache
  event.respondWith((async () => {
    const cache = await caches.open(RUNTIME);
    try {
      const fresh = await fetch(req);
      cache.put(req, fresh.clone());
      return fresh;
    } catch (e) {
      const cached = await cache.match(req);
      return cached || new Response('', { status: 503 });
    }
  })());
});
