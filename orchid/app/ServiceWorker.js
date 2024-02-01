const cacheName = "Stakcos-Stakco-1.0.5";
const contentToCache = [
    "Build/app.loader.js",
    "Build/7531d536e574edb8f0a6a8a19714c5c2.js",
    "Build/b3ac75447c4e3d6a38be895408e1b0df.data",
    "Build/b8967dc02075e898ec4fa4108d1acb1d.wasm",
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
