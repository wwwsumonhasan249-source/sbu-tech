const CACHE_NAME = 'sbu-tv-v1.0.0';
const urlsToCache = [
    './',
    './index.html',
    './style.css',
    './app.js',
    './manifest.json',
    './icons/favicon.ico',
    './icons/favicon-16x16.png',
    './icons/favicon-32x32.png',
    './icons/apple-touch-icon.png',
    './icons/android-chrome-192x192.png',
    './icons/android-chrome-512x512.png'
];

// ইনস্টল হলে cache-এ সেভ
self.addEventListener('install', event => {
    console.log('📦 Service Worker installing...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('✅ Caching app shell');
                return cache.addAll(urlsToCache);
            })
            .then(() => self.skipWaiting())
    );
});

// অ্যাক্টিভ হলে পুরনো cache মুছবে
self.addEventListener('activate', event => {
    console.log('🚀 Service Worker activating...');
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('🗑️ Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// ফেচ ইভেন্ট — offline support
self.addEventListener('fetch', event => {
    // শুধু GET request handle করবে
    if (event.request.method !== 'GET') return;
    
    // JW Player / m3u8 স্ট্রিম বাদ দেবে (এগুলো cache হবে না)
    const url = event.request.url;
    if (url.includes('.m3u8') || url.includes('.ts') || url.includes('jwplayer')) {
        return;
    }
    
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response;
                }
                return fetch(event.request).then(response => {
                    // শুধু সফল response cache করবে
                    if (!response || response.status !== 200 || response.type === 'opaque') {
                        return response;
                    }
                    const responseToCache = response.clone();
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, responseToCache);
                    });
                    return response;
                });
            })
            .catch(() => {
                // Offline হলে index.html দেখাবে
                if (event.request.mode === 'navigate') {
                    return caches.match('./index.html');
                }
            })
    );
});

console.log('✦ SBU TV Service Worker loaded ✦');