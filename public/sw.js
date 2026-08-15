const CACHE_NAME = "pronoapp-v3";
const OFFLINE_URL = "/offline.html";

// 1. Met en cache offline.html dès l'installation
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.add(OFFLINE_URL))
  );
  self.skipWaiting();
});

// 2. Pour les NAVIGATIONS (ouvrir l'app) : réseau d'abord, sinon offline.html IMMÉDIATEMENT
self.addEventListener("fetch", (event) => {
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(OFFLINE_URL))
    );
    return;
  }

  // 3. Pour le reste (images, CSS) : cache d'abord
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request);
    })
  );
});
