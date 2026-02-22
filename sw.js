// Planet Strength — Service Worker
// Full offline support with proper cache versioning
// Updated to remove old SVG icon caching and force icon refresh

const CACHE_NAME = 'planet-strength-v3'; // bump version anytime icons or manifest change

const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/style.css',
  '/nobody-theme.css',
  '/script.js',
  '/manifest.json',

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

  // Correct PNG icons (removes old SVG references)
  '/icons/icon-32.png',
  '/icons/icon-180.png',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

// Install Event
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate Event — clears old caches
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

// Fetch Event — cache first strategy
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
