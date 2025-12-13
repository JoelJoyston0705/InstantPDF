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
    const [progress, setProgress] = useState(0);
    const [showConfetti, setShowConfetti] = useState(false);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setStatus('idle');
            setError(null);
            setProgress(0);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
            setStatus('idle');
            setError(null);
            setProgress(0);
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
        setProgress(0);
        setShowConfetti(false);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const API_URL = import.meta.env.VITE_API_URL || 'https://instantpdf-production.up.railway.app';

            // Use XMLHttpRequest for progress tracking
            const xhr = new XMLHttpRequest();

            const promise = new Promise((resolve, reject) => {
                xhr.upload.addEventListener('progress', (event) => {
                    if (event.lengthComputable) {
                        // Upload progress (0-50%)
                        const uploadProgress = Math.round((event.loaded / event.total) * 50);
                        setProgress(uploadProgress);
                    }
                });

                xhr.addEventListener('load', () => {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        resolve(xhr.response);
                    } else {
                        try {
                            const errData = JSON.parse(xhr.responseText);
                            reject(new Error(errData.detail || 'Conversion failed'));
                        } catch {
                            reject(new Error('Conversion failed'));
                        }
                    }
                });

                xhr.addEventListener('error', () => {
                    reject(new Error('Network error. Please try again.'));
                });

                xhr.addEventListener('loadstart', () => {
                    // Simulate processing progress (50-90%)
                    let processingProgress = 50;
                    const interval = setInterval(() => {
                        if (processingProgress < 90) {
                            processingProgress += Math.random() * 10;
                            setProgress(Math.min(Math.round(processingProgress), 90));
                        }
                    }, 300);

                    xhr.addEventListener('load', () => clearInterval(interval));
                    xhr.addEventListener('error', () => clearInterval(interval));
                });
            });

            xhr.open('POST', `${API_URL}${endpoint}?t=${Date.now()}`);
            xhr.responseType = 'blob';
            xhr.send(formData);

            const blob = await promise;
            setProgress(100);

            const url = window.URL.createObjectURL(blob);
            setDownloadUrl(url);
            setStatus('done');
            setShowConfetti(true); // 🎉 Trigger confetti!

        } catch (err) {
            console.error("ToolPage Error:", err);

            if (err.message === 'Failed to fetch' || err.name === 'TypeError') {
                if ('serviceWorker' in navigator) {
                    navigator.serviceWorker.getRegistrations().then(registrations => {
                        for (let registration of registrations) { registration.unregister(); }
                    });
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
                                        {
                                            title.startsWith('PDF to') ? `Convert to ${title.replace('PDF to ', '')}` :
                                                title.startsWith('Compress') ? 'Compress PDF' :
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
                            {/* Progress Circle */}
                            <div className="relative w-32 h-32 mx-auto mb-8">
                                <svg className="w-32 h-32 transform -rotate-90">
                                    <circle
                                        cx="64"
                                        cy="64"
                                        r="56"
                                        stroke="currentColor"
                                        strokeWidth="8"
                                        fill="none"
                                        className="text-gray-200"
                                    />
                                    <circle
                                        cx="64"
                                        cy="64"
                                        r="56"
                                        stroke="url(#gradient)"
                                        strokeWidth="8"
                                        fill="none"
                                        strokeLinecap="round"
                                        strokeDasharray={`${2 * Math.PI * 56}`}
                                        strokeDashoffset={`${2 * Math.PI * 56 * (1 - progress / 100)}`}
                                        className="transition-all duration-300"
                                    />
                                    <defs>
                                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="#ef4444" />
                                            <stop offset="100%" stopColor="#f97316" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-3xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                                        {progress}%
                                    </span>
                                </div>
                            </div>
                            <h3 className="text-3xl font-semibold mb-3" style={{ letterSpacing: '-0.022em' }}>
                                {progress < 50 ? 'Uploading...' : progress < 90 ? 'Processing...' : 'Almost done...'}
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
                                🎉 All Done!
                            </h3>
                            <p className="text-gray-500 mb-10">Your file is ready to download.</p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <a
                                    href={downloadUrl}
                                    download={
                                        endpoint.includes('pdf-to-word') ? `${file.name.split('.')[0]}.docx` :
                                            endpoint.includes('pdf-to-excel') ? `${file.name.split('.')[0]}.xlsx` :
                                                (endpoint.includes('pdf-to-powerpoint') || endpoint.includes('pdf-to-ppt')) ? `${file.name.split('.')[0]}.pptx` :
                                                    endpoint.includes('pdf-to-jpg') ? `${file.name.split('.')[0]}.jpg` :
                                                        endpoint.includes('compress/pdf') ? `${file.name.split('.')[0]}_compressed.pdf` :
                                                            `${file.name.split('.')[0]}.pdf`
                                    }
                                    className="btn-primary inline-flex items-center justify-center gap-2"
                                >
                                    <Download size={20} /> Download
                                </a>
                                <button
                                    onClick={() => { setFile(null); setStatus('idle'); setShowConfetti(false); }}
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
