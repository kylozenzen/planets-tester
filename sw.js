// Planet Strength — Service Worker
// Caches all app assets on first load for full offline support

const CACHE_NAME = 'planet-strength-v2';

const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/style.css',
  '/nobody-theme.css',
  '/script.js',
  '/manifest.json',
  '/data/constants.js',
  '/data/copy.js',
  '/data/equipment.js',
  '/data/workoutPlans.js',
  '/hooks/SettingsContext.jsx',
  '/hooks/storage.js',
  '/hooks/useToast.js',
  '/hooks/useModal.js',
  '/hooks/useDebounce.js',
  '/hooks/usePersistedState.js',
  '/components/Icon.jsx',
  '/icons/icon-16.png',
  '/icons/icon-32.png',
  '/icons/icon-48.png',
  '/icons/icon-72.png',
  '/icons/icon-96.png',
  '/icons/icon-128.png',
  '/icons/icon-144.png',
  '/icons/icon-152.png',
  '/icons/icon-180.png',
  '/icons/icon-192.png',
  '/icons/icon-256.png',
  '/icons/icon-384.png',
  '/icons/icon-512.png',
  // External dependencies — cache on first fetch
  'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Cormorant+Garamond:ital,wght@1,600;1,700&display=swap',
  'https://cdn.tailwindcss.com',
  'https://unpkg.com/react@17/umd/react.production.min.js',
  'https://unpkg.com/react-dom@17/umd/react-dom.production.min.js',
  'https://unpkg.com/@babel/standalone/babel.min.js',
];

// Install: cache all core assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Cache local assets immediately, external ones best-effort
      const localAssets = ASSETS_TO_CACHE.filter(url => !url.startsWith('http'));
      const externalAssets = ASSETS_TO_CACHE.filter(url => url.startsWith('http'));

      return cache.addAll(localAssets).then(() => {
        // External assets — add individually, don't fail install if one misses
        return Promise.allSettled(
          externalAssets.map(url =>
            fetch(url, { mode: 'cors' })
              .then(res => cache.put(url, res))
              .catch(() => {})
          )
        );
      });
    }).then(() => self.skipWaiting())
  );
});

// Activate: clear old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

// Fetch: cache-first for app shell, network-first for data
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;

  // Skip chrome-extension and other non-http requests
  if (!event.request.url.startsWith('http')) return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;

      return fetch(event.request).then((response) => {
        // Cache successful responses for future offline use
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => {
        // If fetch fails and no cache — return offline fallback for navigation
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
      });
    })
  );
});
