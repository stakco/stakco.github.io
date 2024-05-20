const cacheName = "Stakcos-Stakco-1.0.12";
const contentToCache = [
    "Build/RISIS_WebGL.loader.js",
    "Build/fc347aa861eb95ada3c671c0b1f05c20.js",
    "Build/20a4b3a1c4dbddadbaaad072b40df585.data",
    "Build/897e5663f32af929ab3425bbb9728938.wasm",
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
