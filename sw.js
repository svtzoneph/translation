const CACHE_NAME = "1"; // You can leave this name alone forever
const ASSETS_TO_CACHE = [
  "/",
  "/index.html",
  "/style.css",
  "/app.js",
  "/icon-192.png",
  "/icon-512.png"
];

// 1. Install Event: Cache assets immediately
self.addEventListener("install", (event) => {
  self.skipWaiting(); // Force this new worker to become active immediately
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// 2. Activate Event: Clean up old caches (optional but good practice)
self.addEventListener("activate", (event) => {
  event.waitUntil(
    self.clients.claim() // Take control of all pages immediately
  );
});

// 3. Fetch Event: NETWORK FIRST, then CACHE
self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // If the network works, return the fresh data
        // AND save it to the cache for next time
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(() => {
        // If the network fails (offline), return the cached version
        return caches.match(event.request);
      })
  );
});
