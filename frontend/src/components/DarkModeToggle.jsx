import React, { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';

export default function DarkModeToggle() {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        // Check saved preference
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        const theme = savedTheme || (prefersDark ? 'dark' : 'light');
        setIsDark(theme === 'dark');
        document.documentElement.setAttribute('data-theme', theme);
    }, []);

    const toggleTheme = () => {
        const newTheme = isDark ? 'light' : 'dark';
        setIsDark(!isDark);
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    };

    return (
        <button
            onClick={toggleTheme}
            className="relative w-14 h-7 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            style={{
                backgroundColor: isDark ? '#3c4043' : '#e8eaed'
            }}
            aria-label="Toggle dark mode"
        >
            <div
                className="absolute top-0.5 flex items-center justify-center w-6 h-6 rounded-full bg-white shadow-md transition-transform duration-300"
                style={{
                    transform: isDark ? 'translateX(28px)' : 'translateX(2px)'
                }}
            >
                {isDark ? (
                    <Moon size={14} className="text-gray-700" />
                ) : (
                    <Sun size={14} className="text-yellow-500" />
                )}
            </div>
        </button>
    );
}
