const cacheName = "Stakcos-Stakco-1.0.13";
const contentToCache = [
    "Build/APP_WebGL.loader.js",
    "Build/86d19f814749cb40fe725857947162c1.js",
    "Build/e11c0283b9bdc205a812a283ad49ad4c.data",
    "Build/1c881c0cb95f95ae75b5c3077b5eaf71.wasm",
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
