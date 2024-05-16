const cacheName = "Stakcos-Stakco-1.0.13";
const contentToCache = [
    "Build/APP_WebGL.loader.js",
    "Build/43e737474225b5036f41a4d39ca62511.js",
    "Build/b0bf2b8f0fe3d7b89f46473318579853.data",
    "Build/435ce759fc36d42e6451d007a597eb22.wasm",
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
