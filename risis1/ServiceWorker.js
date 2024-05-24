const cacheName = "Stakcos-Stakco-1.0.13";
const contentToCache = [
    "Build/RISIS_WebGL.loader.js",
    "Build/5eee860963805efd7f752dcec57067c3.js",
    "Build/4a8481af20ec66bb40b26c83c3bf52a8.data",
    "Build/0014076c14ae431d3338ac902f18b3d0.wasm",
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
