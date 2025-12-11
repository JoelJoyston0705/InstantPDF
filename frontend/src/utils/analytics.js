import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Google Analytics Tracking
export function usePageTracking() {
    const location = useLocation();

    useEffect(() => {
        // Track page views
        if (window.gtag) {
            window.gtag('config', 'G-XXXXXXXXXX', {
                page_path: location.pathname + location.search,
            });
        }
    }, [location]);
}

// Track conversions
export function trackConversion(toolName, success = true) {
    if (window.gtag) {
        window.gtag('event', 'conversion', {
            tool: toolName,
            success: success,
            value: 1
        });
    }
}
