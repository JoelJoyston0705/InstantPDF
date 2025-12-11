import React, { useState } from 'react';
import { Upload, Hash, CheckCircle, AlertCircle, Download, File } from 'lucide-react';
import { Link } from 'react-router-dom';
import Confetti from './Confetti';

export default function PageNumbersPdfPage() {
    const [file, setFile] = useState(null);
    const [status, setStatus] = useState('idle'); // idle, converting, done, error
    const [downloadUrl, setDownloadUrl] = useState(null);
    const [error, setError] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setStatus('idle');
            setError(null);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
            setStatus('idle');
            setError(null);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleSubmit = async () => {
        if (!file) return;

        setStatus('converting');
        const formData = new FormData();
        formData.append('file', file);

        try {
            const API_URL = import.meta.env.VITE_API_URL || 'https://instantpdf-production.up.railway.app';
            const response = await fetch(`${API_URL}/edit/page-numbers-pdf?t=${Date.now()}`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.detail || 'Adding page numbers failed');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            setDownloadUrl(url);
            setStatus('done');
            setShowConfetti(true);
        } catch (err) {
            console.error("Page Numbers Error:", err);

            // Auto-heal SW
            if (err.message === 'Failed to fetch' || err.name === 'TypeError') {
                if ('serviceWorker' in navigator) {
                    navigator.serviceWorker.getRegistrations().then(registrations => {
                        for (let registration of registrations) { registration.unregister(); }
                    });
                }
            }

            setError(err.message);
            setStatus('error');
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-16 px-6 page-transition">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16 animate-fade-in-up">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-fuchsia-500 to-pink-500 shadow-2xl mb-8 text-white transform hover:scale-110 transition-transform">
                        <Hash size={40} strokeWidth={2} />
                    </div>
                    <h1 className="mb-4" style={{ letterSpacing: '-0.022em' }}>Page Numbers</h1>
                    <p className="subtitle max-w-xl mx-auto">
                        Automatically add page numbers to the bottom of your PDF pages.
                    </p>
                </div>

                {/* Main Card */}
                <div className="tool-card shadow-premium animate-scale-in max-w-2xl mx-auto">
                    {status === 'idle' && (
                        <div
                            className={`drop-zone ${isDragging ? 'dragging' : ''}`}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                        >
                            {!file ? (
                                <>
                                    <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                                        <Upload size={40} className="text-gray-400" strokeWidth={2} />
                                    </div>
                                    <label className="btn-primary cursor-pointer">
                                        <span>Choose PDF File</span>
                                        <input type="file" className="hidden" accept=".pdf" onChange={handleFileChange} />
                                    </label>
                                    <p className="mt-6 text-gray-400 text-sm">or drag and drop your file here</p>
                                </>
                            ) : (
                                <div className="animate-fade-in">
                                    <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                                        <File size={40} className="text-blue-600" strokeWidth={2} />
                                    </div>
                                    <h3 className="text-2xl font-semibold mb-2 truncate max-w-md mx-auto" style={{ letterSpacing: '-0.022em' }}>
                                        {file.name}
                                    </h3>
                                    <p className="text-gray-500 mb-8">{(file.size / 1024 / 1024).toFixed(2)} MB</p>

                                    <button onClick={handleSubmit} className="btn-primary mb-4 w-full max-w-xs">
                                        Add Page Numbers
                                    </button>
                                    <button onClick={() => setFile(null)} className="block mx-auto text-gray-400 hover:text-gray-600 font-medium transition-colors text-sm mt-4">
                                        Remove file
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {status === 'converting' && (
                        <div className="p-20 text-center animate-fade-in">
                            <div className="spinner mx-auto mb-8"></div>
                            <h3 className="text-3xl font-semibold mb-3" style={{ letterSpacing: '-0.022em' }}>
                                Processing...
                            </h3>
                            <p className="text-gray-500">Numbering your pages.</p>
                        </div>
                    )}

                    {status === 'done' && (
                        <div className="p-20 text-center animate-scale-in">
                            <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
                                <CheckCircle size={48} className="text-white" strokeWidth={2} />
                            </div>
                            <h3 className="text-3xl font-semibold mb-3" style={{ letterSpacing: '-0.022em' }}>
                                Done!
                            </h3>
                            <p className="text-gray-500 mb-10">Your document is ready.</p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <a
                                    href={downloadUrl}
                                    download={`${file.name.split('.')[0]}_numbered.pdf`}
                                    className="btn-primary inline-flex items-center justify-center gap-2"
                                >
                                    <Download size={20} /> Download PDF
                                </a>
                                <button
                                    onClick={() => { setFile(null); setStatus('idle'); }}
                                    className="px-8 py-4 rounded-full font-medium text-gray-600 hover:bg-gray-100 transition-all"
                                >
                                    Start Over
                                </button>
                            </div>
                        </div>
                    )}

                    {status === 'error' && (
                        <div className="p-20 text-center animate-fade-in">
                            <div className="w-24 h-24 bg-gradient-to-br from-red-500 to-rose-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
                                <AlertCircle size={48} className="text-white" strokeWidth={2} />
                            </div>
                            <h3 className="text-3xl font-semibold mb-3" style={{ letterSpacing: '-0.022em' }}>
                                Something went wrong
                            </h3>
                            <p className="text-red-500 mb-10 max-w-md mx-auto">{error}</p>
                            <button
                                onClick={() => { setFile(null); setStatus('idle'); setError(null); }}
                                className="btn-primary"
                            >
                                Try Again
                            </button>
                        </div>
                    )}
                </div>

                {/* Back Link */}
                <div className="text-center mt-12">
                    <Link to="/" className="text-gray-500 hover:text-gray-700 transition-colors inline-flex items-center gap-2">
                        ← Back to all tools
                    </Link>
                </div>
            </div>

            {/* Confetti Animation */}
            <Confetti trigger={showConfetti} />
        </div>
    );
}
