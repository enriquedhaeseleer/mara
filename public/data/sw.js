const CACHE_NAME = 'mara-stats-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/stats.html',
    '/news.html',
    '/blog.html',
    '/about.html',
    '/contact.html',
    '/styles.css',
    '/scripts.js'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});