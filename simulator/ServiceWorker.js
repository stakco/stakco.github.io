const cacheName = "Stakcos-Stakco-3.0.1";
const contentToCache = [
    "Build/simulator.loader.js",
    "Build/d91db952a730808eaf3c819fa85d815e.js",
    "Build/40b23b45d4ed201d9dba40e1cbd87bcf.data",
    "Build/0e2fed43ca3a7e216da12b7b4552c060.wasm",
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
