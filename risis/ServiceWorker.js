const cacheName = "Stakcos-Stakco-1.0.9";
const contentToCache = [
    "Build/risis.loader.js",
    "Build/ed06b3d9f680e4b84cb0842f5469eb8d.js",
    "Build/badec74ca303aaf4df28d61f4205f934.data",
    "Build/bb9049f1a11b1126c7f524b6793c0a58.wasm",
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
