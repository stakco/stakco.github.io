const cacheName = "Stakcos-Stakco-1.0.12";
const contentToCache = [
    "Build/APP_WebGL.loader.js",
    "Build/86d19f814749cb40fe725857947162c1.js",
    "Build/bec8966d6055599a5948af14f8aae83e.data",
    "Build/e6f5e3c39a970371927bf1c19b8685f1.wasm",
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
