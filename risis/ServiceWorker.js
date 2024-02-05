const cacheName = "Stakcos-Stakco-1.0.5";
const contentToCache = [
    "Build/risis.loader.js",
    "Build/2d02945fa3bf3ca6e807b660abe53388.js",
    "Build/86d6a735f7d45fb72bcb41561c5c52dc.data",
    "Build/6bdf3dc67ee4a819cd4cb0ab174888b4.wasm",
    "TemplateData/style.css"

];

self.addEventListener('install', function (e) {
    console.log('[Service Worker] Install');
    
    e.waitUntil((async function () {
      const cache = await caches.open(cacheName);
      console.log('[Service Worker] Caching all: app shell and content');
      await cache.addAll(contentToCache);
    })());
});

self.addEventListener('fetch', function (e) {
    e.respondWith((async function () {
      let response = await caches.match(e.request);
      console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
      if (response) { return response; }

      response = await fetch(e.request);
      const cache = await caches.open(cacheName);
      console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
      cache.put(e.request, response.clone());
      return response;
    })());
});
