const cacheName = "Stakcos-Stakco-3.0.1";
const contentToCache = [
    "Build/simulator.loader.js",
    "Build/d91db952a730808eaf3c819fa85d815e.js",
    "Build/3decb9ebec675b709e6e0a74a1cc75ac.data",
    "Build/42f109f75bac613e220d7f2381cf074e.wasm",
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
