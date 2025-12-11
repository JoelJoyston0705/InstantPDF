// SERVICE WORKER KILLER
// This version intentionally removes the 'fetch' listener to stop intercepting requests.
// It effectively disables PWA offline capabilities to fix the critical CORS/POST error.

const CACHE_NAME = 'instantpdf-v1-cleanup';

self.addEventListener('install', (event) => {
    // Force immediate takeover
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    // Claim any clients immediately, replacing the old buggy SW
    event.waitUntil(self.clients.claim());

    // Delete old caches to be safe
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => caches.delete(cacheName))
            );
        })
    );
});

// NO FETCH LISTENER
// This prevents the Service Worker from touching network requests at all.
