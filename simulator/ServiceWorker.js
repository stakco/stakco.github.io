const cacheName = "Stakcos-Stakco-3.0.1";
const contentToCache = [
    "Build/simulator.loader.js",
    "Build/d91db952a730808eaf3c819fa85d815e.js",
    "Build/80981c5a74b7626b307a1be53de4e66e.data",
    "Build/b6ad5c5c5cf946f7afc06c71440b8226.wasm",
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
