const cacheName = "Stakcos-Stakco-1.0.5";
const contentToCache = [
    "Build/risis.loader.js",
    "Build/2d6283d868ac1050cf760a3ec18097af.js",
    "Build/4164a954c5cc85f61b40c9e9f76d328a.data",
    "Build/e9a5432fa4a09665f86af902ab9bb8e8.wasm",
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
