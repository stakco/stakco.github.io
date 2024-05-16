const cacheName = "Stakcos-Stakco-1.0.13";
const contentToCache = [
    "Build/APP_WebGL.loader.js",
    "Build/43e737474225b5036f41a4d39ca62511.js",
    "Build/5303b80c3503c74d126cd24ca285f1f3.data",
    "Build/6ab92b524d19af7249f21eb427eac4ed.wasm",
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
