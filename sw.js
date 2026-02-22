// Planet Strength — Service Worker
// Hosted at: kylozenzen.github.io/planets-tester/

const CACHE_NAME = ‘planet-strength-v3’;
const BASE = ‘/planets-tester’;

const ASSETS_TO_CACHE = [
`${BASE}/`,
`${BASE}/index.html`,
`${BASE}/style.css`,
`${BASE}/nobody-theme.css`,
`${BASE}/script.js`,
`${BASE}/manifest.json`,
`${BASE}/sw.js`,
`${BASE}/data/constants.js`,
`${BASE}/data/copy.js`,
`${BASE}/data/equipment.js`,
`${BASE}/data/workoutPlans.js`,
`${BASE}/hooks/SettingsContext.jsx`,
`${BASE}/hooks/storage.js`,
`${BASE}/hooks/useToast.js`,
`${BASE}/hooks/useModal.js`,
`${BASE}/hooks/useDebounce.js`,
`${BASE}/hooks/usePersistedState.js`,
`${BASE}/components/Icon.jsx`,
`${BASE}/icons/icon-16.png`,
`${BASE}/icons/icon-32.png`,
`${BASE}/icons/icon-48.png`,
`${BASE}/icons/icon-72.png`,
`${BASE}/icons/icon-96.png`,
`${BASE}/icons/icon-128.png`,
`${BASE}/icons/icon-144.png`,
`${BASE}/icons/icon-152.png`,
`${BASE}/icons/icon-180.png`,
`${BASE}/icons/icon-192.png`,
`${BASE}/icons/icon-256.png`,
`${BASE}/icons/icon-384.png`,
`${BASE}/icons/icon-512.png`,
];

const EXTERNAL_ASSETS = [
‘https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Cormorant+Garamond:ital,wght@1,600;1,700&display=swap’,
‘https://cdn.tailwindcss.com’,
‘https://unpkg.com/react@17/umd/react.production.min.js’,
‘https://unpkg.com/react-dom@17/umd/react-dom.production.min.js’,
‘https://unpkg.com/@babel/standalone/babel.min.js’,
];

self.addEventListener(‘install’, (event) => {
event.waitUntil(
caches.open(CACHE_NAME).then((cache) => {
return cache.addAll(ASSETS_TO_CACHE).then(() => {
return Promise.allSettled(
EXTERNAL_ASSETS.map(url =>
fetch(url, { mode: ‘cors’ })
.then(res => { if (res.ok) cache.put(url, res); })
.catch(() => {})
)
);
});
}).then(() => self.skipWaiting())
);
});

self.addEventListener(‘activate’, (event) => {
event.waitUntil(
caches.keys().then((keys) =>
Promise.all(
keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
)
).then(() => self.clients.claim())
);
});

self.addEventListener(‘fetch’, (event) => {
if (event.request.method !== ‘GET’) return;
if (!event.request.url.startsWith(‘http’)) return;

event.respondWith(
caches.match(event.request).then((cached) => {
if (cached) return cached;
return fetch(event.request).then((response) => {
if (response && response.status === 200) {
const clone = response.clone();
caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
}
return response;
}).catch(() => {
if (event.request.mode === ‘navigate’) {
return caches.match(`${BASE}/index.html`);
}
});
})
);
});