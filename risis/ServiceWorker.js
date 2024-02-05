const cacheName = "Stakcos-Stakco-1.0.5";
const contentToCache = [
    "Build/risis.loader.js",
    "Build/a0965ca0739dafeacfcea1a3233dc7ff.js",
    "Build/fa0c39fd379c592284c79d5d34acf552.data",
    "Build/67ed578b46b02ebfe966928096ba9a25.wasm",
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
