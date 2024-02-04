const cacheName = "Stakcos-Stakco-1.0.5";
const contentToCache = [
    "Build/risis.loader.js",
    "Build/2d02945fa3bf3ca6e807b660abe53388.js",
    "Build/d095b6f86f4fe42a241a641f2a7015f8.data",
    "Build/3fd77fabd8c50701c259699e160511f2.wasm",
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
