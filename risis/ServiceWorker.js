const cacheName = "Stakcos-Stakco-1.0.11";
const contentToCache = [
    "Build/risis.loader.js",
    "Build/eaf09d6d9847bbbd6bdde4af95ec2aa1.js",
    "Build/1e47263d61cbbb8de01ef170e930d2fc.data",
    "Build/96db609cec50539e4155e38d31127899.wasm",
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
