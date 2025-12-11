// Register Service Worker for PWA
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

// Detect if app is running as installed PWA
if (window.matchMedia('(display-mode: standalone)').matches) {
    console.log('📱 Running as installed PWA!');
}
