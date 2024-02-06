const cacheName = "Stakcos-Stakco-1.0.5";
const contentToCache = [
    "Build/app.loader.js",
    "Build/f43af5cca355ad8823ac8a4d2e30a16f.js",
    "Build/18b1b97495abe8ab36a89fbb0e3796bc.data",
    "Build/dc6df6d8e1abef3968069cae055362cb.wasm",
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
