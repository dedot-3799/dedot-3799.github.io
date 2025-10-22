const CACHE_NAME = "cist-bus-v2.36.1";
const urlsToCache = [
  "./",
  "./index.html",
  "./style.css",
  "./style2.css",
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

// 新しいService Workerファイル内
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME]; // 現在使用するキャッシュ名

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // ホワイトリストにない（＝古い）キャッシュを削除
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
    // Service Workerの即時制御を有効にする（オプション）
    .then(() => self.clients.claim()) 
  );
});