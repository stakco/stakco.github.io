const cacheName = "Stakcos-Stakco-3.0.1";
const contentToCache = [
    "Build/simulator.loader.js",
    "Build/d91db952a730808eaf3c819fa85d815e.js",
    "Build/9f170fd19b67b1d1b708968931a94d8f.data",
    "Build/22091fb65b30f824d1a3c2a34cd38bbb.wasm",
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
