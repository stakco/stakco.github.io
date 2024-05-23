const cacheName = "Stakcos-Stakco-1.0.12";
const contentToCache = [
    "Build/RISIS_WebGL.loader.js",
    "Build/2ae142b3bae7d128c813f0a9ff780caa.js",
    "Build/28bd0dea0fe0de13b567e6a247ddbe49.data",
    "Build/fd8e9b86bbda7719957cfb355bb07bab.wasm",
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
