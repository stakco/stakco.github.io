const cacheName = "Stakcos-Stakco-1.0.12";
const contentToCache = [
    "Build/RISIS_WebGL.loader.js",
    "Build/6f39814a1033310f9ea3a9e4372fc4fe.js",
    "Build/de4385b2a2b8bb8e60615f6f20faa8ba.data",
    "Build/75c9d476ab01b2fdda9e9190c0f0c5c5.wasm",
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
