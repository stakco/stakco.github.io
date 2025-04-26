const cacheName = "Stakcos-Stakco2Day-3.0.5";
const contentToCache = [
    "Build/player-dev.loader.js",
    "Build/a1481a133ea8c0cc3b43ce354113e129.js.unityweb",
    "Build/847e337d84e988807fd33894967f9290.data.unityweb",
    "Build/9a473d782930f4cb1c1f5c18ce4d55e0.wasm.unityweb",
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
