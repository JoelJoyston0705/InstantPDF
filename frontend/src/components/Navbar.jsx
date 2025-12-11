import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LogOut, Menu, X } from 'lucide-react';
import AuthModal from './AuthModal';
import DarkModeToggle from './DarkModeToggle';

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [authMode, setAuthMode] = useState('login');
    const [user, setUser] = useState(null);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);

        // Check if user is logged in
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        window.location.reload();
    };

    const openAuthModal = (mode) => {
        setAuthMode(mode);
        setIsAuthModalOpen(true);
    };

    const smoothScroll = (e, targetId) => {
        e.preventDefault();
        const element = document.getElementById(targetId);
        if (element) {
            const offset = 80; // Account for fixed navbar
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    return (
        <>
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'scrolled' : ''}`}>
                <div className="container px-6 h-24 flex items-center justify-between max-w-7xl mx-auto">
                    <Link to="/" className="flex items-center gap-4 group">
                        <img
                            src="/logo.png"
                            alt="InstantPDF"
                            className="w-24 h-24 transform group-hover:scale-110 transition-transform duration-300"
                        />
                        <span className="text-3xl font-bold tracking-tight" style={{ letterSpacing: '-0.022em' }}>
                            InstantPDF
                        </span>
                    </Link>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center gap-4">
                        <DarkModeToggle />
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2 text-gray-600 dark:text-gray-300"
                            aria-label="Toggle menu"
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-8 text-sm font-medium" style={{ letterSpacing: '-0.008em' }}>
                        <a href="/#tools" onClick={(e) => smoothScroll(e, 'tools')} className="hover:opacity-70 transition-opacity cursor-pointer">All Tools</a>
                        <a href="/#features" onClick={(e) => smoothScroll(e, 'features')} className="hover:opacity-70 transition-opacity cursor-pointer">Features</a>
                        <a href="/#about" onClick={(e) => smoothScroll(e, 'about')} className="hover:opacity-70 transition-opacity cursor-pointer">About</a>

                        <DarkModeToggle />

                        {user ? (
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 via-red-500 to-yellow-500 flex items-center justify-center text-white font-semibold text-sm">
                                        {user.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="text-sm font-medium">{user.name}</span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors"
                                    title="Logout"
                                >
                                    <LogOut size={18} />
                                </button>
                            </div>
                        ) : (
                            <>
                                <button
                                    onClick={() => openAuthModal('login')}
                                    className="hover:opacity-70 transition-opacity"
                                >
                                    Login
                                </button>
                                <button
                                    onClick={() => openAuthModal('signup')}
                                    className="btn-primary text-sm px-6 py-2.5"
                                >
                                    Sign Up
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Mobile Dropdown Menu */}
                {isMenuOpen && (
                    <div className="md:hidden absolute top-24 left-0 right-0 bg-white dark:bg-[#1a1a1a] border-t border-gray-100 dark:border-gray-800 shadow-xl p-6 flex flex-col gap-4 z-40">
                        <a href="/#tools" onClick={(e) => { smoothScroll(e, 'tools'); setIsMenuOpen(false) }} className="py-2 text-lg font-medium">All Tools</a>
                        <a href="/#features" onClick={(e) => { smoothScroll(e, 'features'); setIsMenuOpen(false) }} className="py-2 text-lg font-medium">Features</a>
                        <a href="/#about" onClick={(e) => { smoothScroll(e, 'about'); setIsMenuOpen(false) }} className="py-2 text-lg font-medium">About</a>

                        <div className="h-px bg-gray-100 dark:bg-gray-800 my-2"></div>

                        {user ? (
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 via-red-500 to-yellow-500 flex items-center justify-center text-white font-semibold text-sm">
                                        {user.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="font-medium">{user.name}</span>
                                </div>
                                <button onClick={() => { handleLogout(); setIsMenuOpen(false) }} className="text-left text-red-500 py-2 flex items-center gap-2">
                                    <LogOut size={18} /> Logout
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={() => { openAuthModal('login'); setIsMenuOpen(false) }}
                                    className="w-full py-3 rounded-xl border border-gray-200 dark:border-gray-700 font-medium"
                                >
                                    Login
                                </button>
                                <button
                                    onClick={() => { openAuthModal('signup'); setIsMenuOpen(false) }}
                                    className="w-full py-3 rounded-xl btn-primary text-white font-medium"
                                >
                                    Sign Up
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </nav>

            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                initialMode={authMode}
            />
        </>
    );
}
