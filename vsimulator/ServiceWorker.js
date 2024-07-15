const cacheName = "Stakcos-Stakco-1.0.14";
const contentToCache = [
    "Build/simulator.loader.js",
    "Build/8980ff3d494656bc27ed0d62dbab0849.js",
    "Build/88ce3356d1c66140c0ad483ec04295d6.data",
    "Build/39b2493c22b891b6a8f19d727f48be97.wasm",
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
