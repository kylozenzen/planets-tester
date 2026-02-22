/*
// Planet Strength — Service Worker
// Full offline support with proper cache versioning
// Updated to remove old SVG icon caching and force icon refresh
*/

const CACHE_NAME = 'planet-strength-v3'; // bump when icons/manifest change

const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/style.css',
  '/nobody-theme.css',
  '/script.js',

  // Manifest (versioned for cache-busting)
  '/manifest.json?v=3',

  // Data files
  '/data/constants.js',
  '/data/copy.js',
  '/data/equipment.js',
  '/data/workoutPlans.js',

  // Hooks
  '/hooks/SettingsContext.jsx',
  '/hooks/storage.js',
  '/hooks/useToast.js',
  '/hooks/useModal.js',
  '/hooks/useDebounce.js',
  '/hooks/usePersistedState.js',

  // Components
  '/components/Icon.jsx',

  // Correct PNG icons (no SVGs)
  '/icons/icon-32.png',
  '/icons/icon-180.png',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

// Install: cache app shell
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS_TO_CACHE))
  );
  self.skipWaiting();
});

// Activate: clear old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch: cache-first strategy with navigation fallback
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;

      return fetch(event.request).catch(() => {
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
      });
    })
  );
});
