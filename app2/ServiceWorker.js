const cacheName = "Stakcos-Stakco-1.0.13";
const contentToCache = [
    "Build/APP_WebGL.loader.js",
    "Build/56ed9a9aba4603df3e63864e9487313b.js",
    "Build/8638fc6fee8bfcebf4d3693e65996ebe.data",
    "Build/6e44ace94ca103372895b5c7d43dcc8c.wasm",
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
