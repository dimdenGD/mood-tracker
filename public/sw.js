const cacheName = 'mood-cache';
const filesToCache = [
    '/',
    '/moonclouds.webp',
    '/reddot.png',
    '/echarts.min.js',
    '/moods.svg'
];

// the event handler for the activate event
self.addEventListener('activate', e => self.clients.claim());

// the event handler for the install event 
// typically used to cache assets
self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(cacheName)
            .then(cache => cache.addAll(filesToCache))
    );
});

self.addEventListener("fetch", function (e) {
    e.respondWith(function () {
        if (!e.request.referrer.includes('/mood') && !e.request.url.includes('/mood')) return fetch(e.request);

        let url = new URL(e.request.url);

        if (!filesToCache.includes(url.pathname) && !url.pathname.includes('fbemoji/')) {
            return fetch(e.request);
        }

        return caches.match(e.request).then(function (response) {
            if (response) {
                return response;
            }
            if(filesToCache.includes(url.pathname)) {
                caches.add(e.request);
            }
            return fetch(e.request);
        });
    }());
});