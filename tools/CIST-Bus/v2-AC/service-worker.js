const CACHE_NAME = "cist-bus-v2";
const urlsToCache = [
  "./",
  "./index.html",
  "./style.css",
  "./radio.css",
  "./timeline.css",
  "./buscard.css",
  "./main.js",
  "./timeline.js",
  "./manifest.json"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
