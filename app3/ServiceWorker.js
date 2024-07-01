const cacheName = "Stakcos-Stakco-1.0.14";
const contentToCache = [
    "Build/APP_WebGL.loader.js",
    "Build/747d4247f8563958132baaa6e8959003.js",
    "Build/05a7441ddf51846fc32349d86b62ebd4.data",
    "Build/0a71cd99c669daec6402b7468852ad77.wasm",
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
