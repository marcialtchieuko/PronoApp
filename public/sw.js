const CACHE_NAME = "pronoapp-v2";
const OFFLINE_URL = "/offline.html";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.add(OFFLINE_URL))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request)
      .then((res) => {
        const contentType = res.headers.get("content-type") || "";
        const isAsset = contentType.includes("image") || 
                        contentType.includes("css") || 
                        contentType.includes("javascript") ||
                        event.request.url.includes(".png") ||
                        event.request.url.includes(".jpg") ||
                        event.request.url.includes(".css") ||
                        event.request.url.includes(".js");

        if (isAsset && res.status === 200) {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        }
        return res;
      })
      .catch(async () => {
        if (event.request.mode === "navigate") {
          return caches.match(OFFLINE_URL);
        }
        
        const cached = await caches.match(event.request);
        if (cached) return cached;
        
        return new Response("", { status: 504 });
      })
  );
});
