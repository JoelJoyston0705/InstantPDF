import React, { useState } from 'react';
import { X, Mail, Lock, User, CheckCircle, ArrowLeft } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, initialMode = 'login' }) {
    const [mode, setMode] = useState(initialMode); // 'login', 'signup', or 'forgot'
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            let endpoint = '/auth/login';
            let payload = { email: formData.email, password: formData.password };

            if (mode === 'signup') {
                endpoint = '/auth/signup';
                payload = formData;
            } else if (mode === 'forgot') {
                endpoint = '/auth/forgot-password';
                payload = { email: formData.email };
            }

            const API_URL = import.meta.env.VITE_API_URL || 'https://instantpdf-production.up.railway.app';
            const response = await fetch(`${API_URL}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || 'Request failed');
            }

            if (mode === 'forgot') {
                setSuccess(true);
                setSuccessMessage('Check your email for a password reset link.');
            } else {
                // Store token for login/signup
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));

                setSuccess(true);
                setSuccessMessage(mode === 'signup' ? 'Your account has been created successfully.' : 'You have been logged in successfully.');
                setTimeout(() => {
                    onClose();
                    window.location.reload();
                }, 1500);
            }

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({ name: '', email: '', password: '' });
        setError('');
        setSuccess(false);
        setSuccessMessage('');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={onClose}
            ></div>

            {/* Modal */}
            <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full animate-scale-in overflow-hidden">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors z-10"
                >
                    <X size={20} className="text-gray-600" />
                </button>

                {success ? (
                    // Success State
                    <div className="p-12 text-center">
                        <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                            <CheckCircle size={40} className="text-white" strokeWidth={2} />
                        </div>
                        <h2 className="text-3xl font-semibold mb-3" style={{ letterSpacing: '-0.022em' }}>
                            {mode === 'forgot' ? 'Email Sent!' : mode === 'signup' ? 'Welcome!' : 'Welcome Back!'}
                        </h2>
                        <p className="text-gray-500">
                            {successMessage}
                        </p>
                        {mode === 'forgot' && (
                            <button
                                onClick={() => { resetForm(); setMode('login'); }}
                                className="mt-6 text-sm text-blue-600 hover:text-blue-700 font-medium"
                            >
                                Back to Login
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="p-8">
                        {/* Logo */}
                        <div className="text-center mb-8">
                            <img
                                src="/logo.png"
                                alt="InstantPDF"
                                className="w-16 h-16 mx-auto mb-4"
                            />
                            <h2 className="text-3xl font-semibold mb-2" style={{ letterSpacing: '-0.022em' }}>
                                {mode === 'forgot' ? 'Reset Password' : mode === 'login' ? 'Welcome Back' : 'Create Account'}
                            </h2>
                            <p className="text-gray-500">
                                {mode === 'forgot'
                                    ? 'Enter your email to receive a reset link'
                                    : mode === 'login'
                                        ? 'Sign in to your account'
                                        : 'Start converting documents for free'}
                            </p>
                        </div>

                        {/* Tab Switcher (hidden in forgot mode) */}
                        {mode !== 'forgot' && (
                            <div className="flex bg-gray-100 rounded-2xl p-1 mb-8">
                                <button
                                    onClick={() => {
                                        setMode('login');
                                        setError('');
                                    }}
                                    className={`flex-1 py-3 rounded-xl font-medium transition-all ${mode === 'login'
                                        ? 'bg-white text-gray-900 shadow-sm'
                                        : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    Login
                                </button>
                                <button
                                    onClick={() => {
                                        setMode('signup');
                                        setError('');
                                    }}
                                    className={`flex-1 py-3 rounded-xl font-medium transition-all ${mode === 'signup'
                                        ? 'bg-white text-gray-900 shadow-sm'
                                        : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    Sign Up
                                </button>
                            </div>
                        )}

                        {/* Back button for forgot mode */}
                        {mode === 'forgot' && (
                            <button
                                onClick={() => { setMode('login'); setError(''); }}
                                className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6 text-sm"
                            >
                                <ArrowLeft size={16} /> Back to Login
                            </button>
                        )}

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {mode === 'signup' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Full Name
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="John Doe"
                                            required={mode === 'signup'}
                                            className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                                        />
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="you@example.com"
                                        required
                                        className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                                    />
                                </div>
                            </div>

                            {mode !== 'forgot' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                        <input
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder="••••••••"
                                            required
                                            minLength={6}
                                            className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                                        />
                                    </div>
                                </div>
                            )}

                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full btn-primary py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <div className="spinner mx-auto" style={{ width: '20px', height: '20px', borderWidth: '2px' }}></div>
                                ) : (
                                    mode === 'forgot' ? 'Send Reset Link' : mode === 'login' ? 'Sign In' : 'Create Account'
                                )}
                            </button>
                        </form>

                        {mode === 'login' && (
                            <div className="mt-6 text-center">
                                <button
                                    onClick={() => { setMode('forgot'); setError(''); }}
                                    className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                                >
                                    Forgot password?
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
