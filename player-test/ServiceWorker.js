const cacheName = "Stakcos-Stakco-3.0.4";
const contentToCache = [
    "Build/player.loader.js",
    "Build/8929f88963bf40fb9395a3260307578b.js.unityweb",
    "Build/9957f5bbf6121818df7dd9fdbd344c17.data.unityweb",
    "Build/5a757b3c71637342c3ec6872ce9188b4.wasm.unityweb",
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
