const cacheName = "Stakcos-Stakco-1.0.10";
const contentToCache = [
    "Build/risis.loader.js",
    "Build/eaf09d6d9847bbbd6bdde4af95ec2aa1.js",
    "Build/019461da51492771d6cd31e4b52eeb4e.data",
    "Build/1dd35284da3d2f3f90ef3b077a4fdf60.wasm",
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
