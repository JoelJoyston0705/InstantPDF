import React, { useState } from 'react';
import { Upload, Hash, CheckCircle, AlertCircle, Download, File, Grid, LayoutTemplate } from 'lucide-react';
import { Link } from 'react-router-dom';
import Confetti from './Confetti';

export default function PageNumbersPdfPage() {
    const [file, setFile] = useState(null);
    const [status, setStatus] = useState('idle'); // idle, converting, done, error
    const [downloadUrl, setDownloadUrl] = useState(null);
    const [error, setError] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);

    // Options
    const [position, setPosition] = useState('bottom-center');
    const [startPage, setStartPage] = useState(1);
    const [endPage, setEndPage] = useState('');

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

    const handleSubmit = async () => {
        if (!file) return;

        setStatus('converting');
        const formData = new FormData();
        formData.append('file', file);

        // Build query string
        const query = new URLSearchParams({
            t: Date.now(),
            position: position,
            start_from: startPage,
        });
        if (endPage) query.append('end_at', endPage);

        try {
            const API_URL = import.meta.env.VITE_API_URL || 'https://instantpdf-production.up.railway.app';
            const response = await fetch(`${API_URL}/edit/page-numbers-pdf?${query.toString()}`, {
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

    // Helper for grid selection
    const positions = [
        'top-left', 'top-center', 'top-right',
        'bottom-left', 'bottom-center', 'bottom-right'
    ];

    const isTop = position.startsWith('top');
    const isCenter = position.includes('center');
    const isLeft = position.includes('left');
    const isRight = position.includes('right');

    const getPreviewStyle = () => {
        let style = { position: 'absolute' };
        if (isTop) style.top = '10%';
        else style.bottom = '10%';

        if (isLeft) style.left = '10%';
        else if (isRight) style.right = '10%';
        else style.left = '50%', style.transform = 'translateX(-50%)';

        return style;
    }

    return (
        <div className="min-h-screen pt-24 pb-16 px-6 page-transition">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12 animate-fade-in-up">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-to-br from-fuchsia-500 to-pink-500 shadow-2xl mb-6 text-white">
                        <Hash size={32} strokeWidth={2} />
                    </div>
                    <h1 className="text-3xl font-bold mb-2">Page Numbers</h1>
                    <p className="text-gray-500">Add numbers to your PDF pages.</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 items-start">

                    {/* Left: Preview & File Info */}
                    <div className="w-full lg:w-2/3 space-y-6">
                        {status === 'idle' && (
                            <div className="tool-card shadow-premium p-8">
                                {!file ? (
                                    <div
                                        className={`drop-zone ${isDragging ? 'dragging' : ''}`}
                                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                                        onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
                                        onDrop={handleDrop}
                                    >
                                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Upload size={32} className="text-gray-400" />
                                        </div>
                                        <label className="btn-primary cursor-pointer inline-block">
                                            <span>Select PDF</span>
                                            <input type="file" className="hidden" accept=".pdf" onChange={handleFileChange} />
                                        </label>
                                        <p className="mt-4 text-gray-400 text-sm">Drop PDF here</p>
                                    </div>
                                ) : (
                                    <div className="animate-fade-in flex flex-col items-center">
                                        <div className="relative w-48 h-64 bg-white border border-gray-200 shadow-lg rounded-sm mb-6 flex items-center justify-center">
                                            {/* Simulated Page Content */}
                                            <div className="space-y-2 w-3/4 opacity-20">
                                                <div className="h-2 bg-gray-800 rounded w-full"></div>
                                                <div className="h-2 bg-gray-800 rounded w-5/6"></div>
                                                <div className="h-2 bg-gray-800 rounded w-full"></div>
                                                <div className="h-2 bg-gray-800 rounded w-4/5"></div>
                                            </div>

                                            {/* Live Preview Dot/Number */}
                                            <div
                                                className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm transition-all duration-300"
                                                style={getPreviewStyle()}
                                            >
                                                1
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 bg-blue-50 px-4 py-2 rounded-lg text-blue-700 mb-6">
                                            <File size={16} />
                                            <span className="font-medium truncate max-w-[200px]">{file.name}</span>
                                            <button onClick={() => setFile(null)} className="text-blue-400 hover:text-blue-600 ml-2"> Change</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {status === 'converting' && (
                            <div className="tool-card shadow-premium p-12 text-center">
                                <div className="spinner mx-auto mb-6"></div>
                                <h3 className="text-xl font-semibold">Adding Page Numbers...</h3>
                            </div>
                        )}

                        {status === 'done' && (
                            <div className="tool-card shadow-premium p-12 text-center animate-scale-in">
                                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle size={32} />
                                </div>
                                <h3 className="text-2xl font-bold mb-2">Success!</h3>
                                <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
                                    <a href={downloadUrl} download={`${file.name.split('.')[0]}_numbered.pdf`} className="btn-primary flex items-center gap-2">
                                        <Download size={18} /> Download
                                    </a>
                                    <button onClick={() => { setFile(null); setStatus('idle'); }} className="px-6 py-3 rounded-xl border border-gray-200 hover:bg-gray-50">
                                        Start Over
                                    </button>
                                </div>
                            </div>
                        )}

                        {status === 'error' && (
                            <div className="tool-card shadow-premium p-8 text-center">
                                <AlertCircle size={40} className="text-red-500 mx-auto mb-4" />
                                <p className="text-red-600 mb-4">{error}</p>
                                <button onClick={() => { setFile(null); setStatus('idle'); }} className="btn-primary">Try Again</button>
                            </div>
                        )}
                    </div>

                    {/* Right: Options Sidebar (Only show if file selected & idle) */}
                    {file && status === 'idle' && (
                        <div className="w-full lg:w-1/3 space-y-6 animate-slide-in-right">
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                    <LayoutTemplate size={18} /> Position
                                </h3>

                                {/* 3x3 Grid Selection */}
                                <div className="grid grid-cols-3 gap-2 w-32 mx-auto mb-6">
                                    {/* Top Row */}
                                    {['top-left', 'top-center', 'top-right'].map(pos => (
                                        <button
                                            key={pos}
                                            onClick={() => setPosition(pos)}
                                            className={`w-8 h-8 rounded border transition-all ${position === pos ? 'bg-red-500 border-red-500' : 'bg-gray-100 border-gray-200 hover:bg-gray-200'}`}
                                            title={pos.replace('-', ' ')}
                                        />
                                    ))}
                                    {/* Middle Row (Placeholders) */}
                                    <div className="w-8 h-8 opacity-0"></div>
                                    <div className="w-8 h-8 opacity-0"></div>
                                    <div className="w-8 h-8 opacity-0"></div>
                                    {/* Bottom Row */}
                                    {['bottom-left', 'bottom-center', 'bottom-right'].map(pos => (
                                        <button
                                            key={pos}
                                            onClick={() => setPosition(pos)}
                                            className={`w-8 h-8 rounded border transition-all ${position === pos ? 'bg-red-500 border-red-500' : 'bg-gray-100 border-gray-200 hover:bg-gray-200'}`}
                                            title={pos.replace('-', ' ')}
                                        />
                                    ))}
                                </div>

                                <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2 mt-8">
                                    <Hash size={18} /> Page Range
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs text-gray-500 block mb-1">From Page</label>
                                        <input
                                            type="number"
                                            value={startPage}
                                            onChange={(e) => setStartPage(e.target.value)}
                                            min="1"
                                            className="w-full p-2 border rounded-lg"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500 block mb-1">To Page (Opt)</label>
                                        <input
                                            type="number"
                                            value={endPage}
                                            onChange={(e) => setEndPage(e.target.value)}
                                            min="1"
                                            placeholder="End"
                                            className="w-full p-2 border rounded-lg"
                                        />
                                    </div>
                                </div>
                            </div>

                            <button onClick={handleSubmit} className="w-full btn-primary py-4 text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all">
                                Add Page Numbers
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <Confetti trigger={showConfetti} />
        </div>
    );
}
