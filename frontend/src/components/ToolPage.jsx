import React, { useState } from 'react';
import { Upload, File, CheckCircle, AlertCircle, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import Confetti from './Confetti';

export default function ToolPage({ title, description, endpoint, accept, icon: Icon }) {
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
            // Use Env Var OR fallback to Railway Production URL (Safety Net)
            const API_URL = import.meta.env.VITE_API_URL || 'https://instantpdf-production.up.railway.app';
            // Cache Busted URL
            const response = await fetch(`${API_URL}${endpoint}?t=${Date.now()}`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.detail || 'Conversion failed');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            setDownloadUrl(url);
            setStatus('done');
            setShowConfetti(true); // 🎉 Trigger confetti!
        } catch (err) {
            console.error("ToolPage Error:", err);

            // Auto-heal: If it's a network/SW error, kill the Service Worker
            if (err.message === 'Failed to fetch' || err.name === 'TypeError') {
                if ('serviceWorker' in navigator) {
                    navigator.serviceWorker.getRegistrations().then(registrations => {
                        for (let registration of registrations) { registration.unregister(); }
                    });
                    console.log("Attempted to unregister SW from ToolPage.");
                }
            }

            setError(err.message === 'Failed to fetch' ? "Network error. Please try again." : err.message);
            setStatus('error');
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-16 px-6 page-transition">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16 animate-fade-in-up">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-red-500 to-pink-600 shadow-2xl mb-8 text-white transform hover:scale-110 transition-transform">
                        <Icon size={40} strokeWidth={2} />
                    </div>
                    <h1 className="mb-4" style={{ letterSpacing: '-0.022em' }}>{title}</h1>
                    <p className="subtitle max-w-xl mx-auto">{description}</p>
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
                                        <span>Choose File</span>
                                        <input type="file" className="hidden" accept={accept} onChange={handleFileChange} />
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
                                    <p className="text-gray-500 mb-10">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                    <button onClick={handleSubmit} className="btn-primary mb-4">
                                        {/* Dynamic Button Text based on Title */}
                                        {
                                            title.startsWith('PDF to') ? `Convert to ${title.replace('PDF to ', '')}` :
                                                title.startsWith('Edit') ? 'Edit PDF' :
                                                    title.startsWith('Watermark') ? 'Add Watermark' :
                                                        title.startsWith('Rotate') ? 'Rotate PDF' :
                                                            title.startsWith('Crop') ? 'Crop PDF' :
                                                                title.startsWith('Page') ? 'Add Numbers' :
                                                                    'Convert to PDF'
                                        }
                                    </button>
                                    <button onClick={() => setFile(null)} className="block mx-auto text-gray-400 hover:text-gray-600 font-medium transition-colors text-sm">
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
                                Converting...
                            </h3>
                            <p className="text-gray-500">Please wait while we process your file.</p>
                        </div>
                    )}

                    {status === 'done' && (
                        <div className="p-20 text-center animate-scale-in">
                            <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
                                <CheckCircle size={48} className="text-white" strokeWidth={2} />
                            </div>
                            <h3 className="text-3xl font-semibold mb-3" style={{ letterSpacing: '-0.022em' }}>
                                All Done!
                            </h3>
                            <p className="text-gray-500 mb-10">Your file is ready to download.</p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <a
                                    href={downloadUrl}
                                    download={
                                        // Dynamic Filename Extension
                                        endpoint.includes('pdf-to-word') ? `${file.name.split('.')[0]}.docx` :
                                            endpoint.includes('pdf-to-excel') ? `${file.name.split('.')[0]}.xlsx` :
                                                (endpoint.includes('pdf-to-powerpoint') || endpoint.includes('pdf-to-ppt')) ? `${file.name.split('.')[0]}.pptx` :
                                                    endpoint.includes('pdf-to-jpg') ? `${file.name.split('.')[0]}.jpg` :
                                                        `${file.name.split('.')[0]}.pdf`
                                    }
                                    className="btn-primary inline-flex items-center justify-center gap-2"
                                >
                                    <Download size={20} /> Download
                                </a>
                                <button
                                    onClick={() => { setFile(null); setStatus('idle'); }}
                                    className="px-8 py-4 rounded-full font-medium text-gray-600 hover:bg-gray-100 transition-all"
                                >
                                    Convert Another
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
