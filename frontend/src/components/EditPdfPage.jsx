import React, { useState, useRef, useEffect } from 'react';
import { Upload, File, CheckCircle, AlertCircle, Download, Type, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import Confetti from './Confetti';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// Set up worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function EditPdfPage() {
    const [file, setFile] = useState(null);
    const [numPages, setNumPages] = useState(null);
    const [status, setStatus] = useState('idle'); // idle, editing, converting, done, error
    const [downloadUrl, setDownloadUrl] = useState(null);
    const [error, setError] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);

    // Edit state
    const [text, setText] = useState("Added Text");
    const [position, setPosition] = useState({ x: 100, y: 100 });
    const pdfContainerRef = useRef(null);

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
        setStatus('editing');
    }

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setStatus('preview_loading');
            setError(null);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
            setStatus('preview_loading');
            setError(null);
        }
    };

    const handleSubmit = async () => {
        if (!file) return;

        setStatus('converting');
        const formData = new FormData();
        formData.append('file', file);
        formData.append('text', text);
        formData.append('x', Math.round(position.x));
        formData.append('y', Math.round(position.y));

        try {
            const API_URL = import.meta.env.VITE_API_URL || 'https://instantpdf-production.up.railway.app';
            // Add timestamp to bypass Service Worker cache
            const response = await fetch(`${API_URL}/edit/add-text-pdf?t=${Date.now()}`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.detail || 'Editing failed');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            setDownloadUrl(url);
            setStatus('done');
            setShowConfetti(true);
        } catch (err) {
            console.error("Conversion Error:", err);

            // Auto-heal: If it's a network/SW error, kill the Service Worker
            if (err.message === 'Failed to fetch' || err.name === 'TypeError') {
                if ('serviceWorker' in navigator) {
                    navigator.serviceWorker.getRegistrations().then(registrations => {
                        for (let registration of registrations) { registration.unregister(); }
                    });
                    console.log("Attempted to unregister SW due to network error.");
                }
            }

            setError(err.message === 'Failed to fetch' ? "Network error. Please try again." : err.message);
            setStatus('error');
        }
    };

    // Simple drag to move Logic
    const handleDragEnd = (e) => {
        // e.clientX is relative to viewport, we need relative to PDF container
        if (pdfContainerRef.current) {
            const rect = pdfContainerRef.current.getBoundingClientRect();
            // Simple fallback text positioning logic
            // Ideally we implement proper React DnD, but for now we use sliders or reliable inputs
            // because calculating PDF coordinates from DOM coordinates matches requires scaling logic.
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-16 px-6 page-transition">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16 animate-fade-in-up">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-2xl mb-8 text-white transform hover:scale-110 transition-transform">
                        <Type size={40} strokeWidth={2} />
                    </div>
                    <h1 className="mb-4" style={{ letterSpacing: '-0.022em' }}>Edit PDF</h1>
                    <p className="subtitle max-w-xl mx-auto">Add text and annotations to your PDF documents.</p>
                </div>

                <div className="tool-card shadow-premium animate-scale-in max-w-5xl mx-auto bg-white p-6 rounded-3xl min-h-[400px]">

                    {/* Upload View */}
                    {!file && (
                        <div
                            className={`drop-zone ${isDragging ? 'dragging' : ''} h-96 flex flex-col justify-center items-center`}
                            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                            onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
                            onDrop={handleDrop}
                        >
                            <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                                <Upload size={40} className="text-gray-400" strokeWidth={2} />
                            </div>
                            <label className="btn-primary cursor-pointer">
                                <span>Choose PDF</span>
                                <input type="file" className="hidden" accept=".pdf" onChange={handleFileChange} />
                            </label>
                            <p className="mt-6 text-gray-400 text-sm">or drag and drop your PDF here</p>
                        </div>
                    )}

                    {/* Editor View */}
                    {(status === 'preview_loading' || status === 'editing') && file && (
                        <div className="flex flex-col md:flex-row gap-8">
                            {/* Controls */}
                            <div className="md:w-1/3 bg-gray-50 p-6 rounded-2xl h-fit border border-gray-100 sticky top-24">
                                <h3 className="font-semibold text-lg mb-4 text-gray-800">Add Text</h3>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-1">Text Content</label>
                                        <input
                                            type="text"
                                            value={text}
                                            onChange={(e) => setText(e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-1">X Position (px)</label>
                                        <input
                                            type="number"
                                            value={position.x}
                                            onChange={(e) => setPosition({ ...position, x: parseInt(e.target.value) || 0 })}
                                            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                                        />
                                        <input
                                            type="range" min="0" max="600" value={position.x}
                                            onChange={(e) => setPosition({ ...position, x: parseInt(e.target.value) })}
                                            className="w-full mt-2 accent-purple-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-1">Y Position (px)</label>
                                        <input
                                            type="number"
                                            value={position.y}
                                            onChange={(e) => setPosition({ ...position, y: parseInt(e.target.value) || 0 })}
                                            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                                        />
                                        <input
                                            type="range" min="0" max="800" value={position.y}
                                            onChange={(e) => setPosition({ ...position, y: parseInt(e.target.value) })}
                                            className="w-full mt-2 accent-purple-500"
                                        />
                                    </div>

                                    <button onClick={handleSubmit} className="btn-primary w-full mt-4 flex items-center justify-center gap-2">
                                        <Download size={18} /> Process & Download
                                    </button>

                                    <button
                                        onClick={() => { setFile(null); setStatus('idle'); }}
                                        className="w-full py-2 text-gray-500 hover:text-red-500 text-sm font-medium transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>

                            {/* PDF Preview */}
                            <div className="md:w-2/3 bg-gray-200 rounded-xl p-4 overflow-auto max-h-[800px] flex justify-center relative min-h-[500px]" ref={pdfContainerRef}>
                                <div className="relative shadow-2xl">
                                    <Document
                                        file={file}
                                        onLoadSuccess={onDocumentLoadSuccess}
                                        loading={<div className="spinner my-20"></div>}
                                        error={<div className="text-red-500 p-4">Failed to load PDF preview. Please try again.</div>}
                                        className="max-w-full"
                                    >
                                        <Page
                                            pageNumber={1}
                                            width={600}
                                            renderTextLayer={false}
                                            renderAnnotationLayer={false}
                                        />
                                    </Document>

                                    {/* Edit Overlay Visualizer */}
                                    {status === 'editing' && (
                                        <div
                                            className="absolute pointer-events-none text-black font-sans text-lg border border-dashed border-blue-500 bg-blue-50/50 px-2 py-1"
                                            style={{
                                                top: position.y,
                                                left: position.x,
                                                transform: 'translateY(-50%)' // Center vertically on the point, roughly
                                            }}
                                        >
                                            {text}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Converting / Done States (similar to ToolPage) */}
                    {(status === 'converting' || status === 'done' || status === 'error') && (
                        <div className="p-20 text-center animate-fade-in">
                            {status === 'converting' && (
                                <>
                                    <div className="spinner mx-auto mb-8"></div>
                                    <h3 className="text-3xl font-semibold mb-3">Processing PDF...</h3>
                                    <p className="text-gray-500">Adding your edits...</p>
                                </>
                            )}
                            {status === 'done' && (
                                <>
                                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8 text-green-500">
                                        <CheckCircle size={48} />
                                    </div>
                                    <h3 className="text-3xl font-semibold mb-3">Success!</h3>
                                    <a href={downloadUrl} download="edited_document.pdf" className="btn-primary inline-flex gap-2 items-center">
                                        <Download size={20} /> Download PDF
                                    </a>
                                    <button
                                        onClick={() => { setFile(null); setStatus('idle'); }}
                                        className="block mx-auto mt-6 text-gray-500 hover:text-gray-700"
                                    >
                                        Edit Another
                                    </button>
                                </>
                            )}
                            {status === 'error' && (
                                <>
                                    <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-8 text-red-500">
                                        <AlertCircle size={48} />
                                    </div>
                                    <h3 className="text-3xl font-semibold mb-3">Error</h3>
                                    <p className="text-red-500 mb-6">{error}</p>
                                    <button
                                        onClick={() => { setFile(null); setStatus('idle'); }}
                                        className="btn-primary"
                                    >
                                        Try Again
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                </div>
                {/* Confetti Animation */}
                <Confetti trigger={showConfetti} />
            </div>
        </div>
    );
}
