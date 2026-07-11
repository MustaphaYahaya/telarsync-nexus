const CACHE_NAME = 'telarsync-v1';
const urlsToCache = [
  '/',
  '/static/style.css',
  '/static/script.js',
  'https://storage.googleapis.com/dala-prod-public-storage/generated-images/4c1a90be-789a-4895-9ab4-da22cb7d0b98/telarsync-logo-39d9f5b8-1783646069709.webp'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});
