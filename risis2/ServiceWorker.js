const cacheName = "Stakcos-Stakco-1.0.12";
const contentToCache = [
    "Build/RISIS_WebGL.loader.js",
    "Build/eaf09d6d9847bbbd6bdde4af95ec2aa1.js",
    "Build/ef61974ebedaf3768ee20b91aed1c55c.data",
    "Build/738ee4e8a0b6962b3c6dea7a1b171faa.wasm",
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
