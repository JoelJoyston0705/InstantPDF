if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Force update to v3 (Killer SW)
        navigator.serviceWorker.register('/sw.js?v=3')
            .then((registration) => {
                console.log('✅ PWA: Service Worker updated to safe version!', registration.scope);
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
