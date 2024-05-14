const CACHE_PREFIX = 'PrimalityTestTool-PWA-VERSION-';
let currentVersion = '10.0.0'; // 初期バージョン

// manifest.json からバージョン情報を取得
fetch('/manifest.json')
    .then(response => response.json())
    .then(data => {
        currentVersion = data.version;
    })
    .catch(error => {
        console.error('Failed to fetch version from manifest:', error);
    });

const CACHE_NAME = CACHE_PREFIX + currentVersion;
const urlsToCache = [
    '/',
    '/index.html',
    '/main.css',
    '/main.js',
    '/theme.js',
    '/Load.css',
    '/func.js',
    '/countainers.js'
];

self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function (cache) {
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('activate', function (event) {
    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.map(function (cacheName) {
                    if (cacheName.startsWith(CACHE_PREFIX) && cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.match(event.request)
            .then(function (response) {
                return response || fetch(event.request);
            })
    );
});

// バージョンチェックと更新
self.addEventListener('message', function (event) {
    if (event.data && event.data.type === 'CHECK_VERSION') {
        if (isNewVersion(event.data.version, currentVersion)) {
            self.skipWaiting(); // 新しいバージョンをインストール
        }
    }
});

function isNewVersion(newV, oldV) {
    var [pNW, pOW] = [newV.split("."), oldV.split(".")];
    if (pNW[0] > pOW[0]) {
        return true;
    } else if (pNW[0] == pOW[0]) {
        if (pNW[1] > pOW[1]) {
            return true;
        } else if (pNW[1] == pOW[1]) {
            if (pNW[2] > pOW[2]) {
                return true;
            }
        }
    }
    return false;
}

function checkVersion() {
    fetch('/manifest.json')
        .then(response => response.json())
        .then(data => {
            navigator.serviceWorker.controller.postMessage({
                type: 'CHECK_VERSION',
                version: data.version
            });
        })
        .catch(error => {
            console.error('Version check failed:', error);
        });
}

setInterval(checkVersion, 86400000); // 1日ごとにバージョンをチェック

