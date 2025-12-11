import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function CookieConsent() {
    const [showBanner, setShowBanner] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('cookieConsent');
        if (!consent) {
            setShowBanner(true);
        }
    }, []);

    const acceptCookies = () => {
        localStorage.setItem('cookieConsent', 'accepted');
        setShowBanner(false);
    };

    const declineCookies = () => {
        localStorage.setItem('cookieConsent', 'declined');
        setShowBanner(false);
    };

    if (!showBanner) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white border-t border-gray-200 shadow-2xl animate-fade-in">
            <div className="container mx-auto max-w-6xl">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex-1">
                        <h3 className="font-semibold mb-2">🍪 We Value Your Privacy</h3>
                        <p className="text-sm text-gray-600">
                            We use essential cookies for authentication and security. Optional cookies help us improve our service.
                            We never sell your data. Read our{' '}
                            <a href="/privacy" target="_blank" className="text-blue-600 hover:underline">Privacy Policy</a>
                            {' '}and{' '}
                            <a href="/terms" target="_blank" className="text-blue-600 hover:underline">Terms of Service</a>.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={declineCookies}
                            className="px-6 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            Decline Optional
                        </button>
                        <button
                            onClick={acceptCookies}
                            className="px-6 py-2 text-sm font-medium bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all"
                        >
                            Accept All
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
