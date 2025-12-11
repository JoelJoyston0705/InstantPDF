// Register Service Worker for PWA
// TEMPORARILY DISABLED due to CORS/FetchEvent issues on POST requests.
/*
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Force update SW by adding version param
        navigator.serviceWorker.register('/sw.js?v=2')
            .then((registration) => {
                console.log('✅ PWA: Service Worker registered!', registration.scope);
            })
            .catch((error) => {
                console.log('❌ PWA: Service Worker registration failed:', error);
            });
    });
}
*/
// AGGRESSIVE UNREGISTER to clean up old clients
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(function (registrations) {
        for (let registration of registrations) {
            registration.unregister();
            console.log('Service Worker Unregistered');
        }
    });
}

// Detect if app is running as installed PWA
if (window.matchMedia('(display-mode: standalone)').matches) {
    console.log('📱 Running as installed PWA!');
}
