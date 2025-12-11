import React, { useState } from 'react';
import { Upload, X, CheckCircle, Loader, Download, Folder } from 'lucide-react';

export default function BatchUpload({ endpoint, accept, title }) {
    const [files, setFiles] = useState([]);
    const [processing, setProcessing] = useState(false);

    const handleFileSelect = (e) => {
        const selectedFiles = Array.from(e.target.files);
        const filesWithStatus = selectedFiles.map(file => ({
            file,
            id: Math.random().toString(36).substr(2, 9),
            status: 'pending', // pending, processing, completed, error
            progress: 0,
            downloadUrl: null,
            error: null
        }));
        setFiles(prev => [...prev, ...filesWithStatus]);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const droppedFiles = Array.from(e.dataTransfer.files);
        const filesWithStatus = droppedFiles.map(file => ({
            file,
            id: Math.random().toString(36).substr(2, 9),
            status: 'pending',
            progress: 0,
            downloadUrl: null,
            error: null
        }));
        setFiles(prev => [...prev, ...filesWithStatus]);
    };

    const removeFile = (id) => {
        setFiles(files.filter(f => f.id !== id));
    };

    const processFiles = async () => {
        setProcessing(true);

        for (let i = 0; i < files.length; i++) {
            const fileItem = files[i];

            if (fileItem.status === 'completed') continue;

            // Update status to processing
            setFiles(prev => prev.map(f =>
                f.id === fileItem.id ? { ...f, status: 'processing' } : f
            ));

            try {
                const formData = new FormData();
                formData.append('file', fileItem.file);

                const response = await fetch(`${import.meta.env.VITE_API_URL}${endpoint}`, {
                    method: 'POST',
                    body: formData,
                });

                if (!response.ok) throw new Error('Conversion failed');

                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const filename = response.headers.get('content-disposition')
                    ?.split('filename=')[1]
                    ?.replace(/"/g, '') || `converted_${fileItem.file.name}.pdf`;

                // Update status to completed
                setFiles(prev => prev.map(f =>
                    f.id === fileItem.id
                        ? { ...f, status: 'completed', progress: 100, downloadUrl: url, downloadFilename: filename }
                        : f
                ));

            } catch (error) {
                setFiles(prev => prev.map(f =>
                    f.id === fileItem.id
                        ? { ...f, status: 'error', error: error.message }
                        : f
                ));
            }
        }

        setProcessing(false);
    };

    const downloadAll = () => {
        files.filter(f => f.status === 'completed').forEach(fileItem => {
            const link = document.createElement('a');
            link.href = fileItem.downloadUrl;
            link.download = fileItem.downloadFilename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    };

    const completedCount = files.filter(f => f.status === 'completed').length;
    const errorCount = files.filter(f => f.status === 'error').length;

    return (
        <div className="max-w-4xl mx-auto p-6">
            {/* Header */}
            <div className="text-center mb-8">
                <h2 className="text-4xl font-bold mb-3">{title}</h2>
                <p className="text-gray-600 dark:text-gray-400">
                    Upload multiple files and convert them all at once!
                </p>
            </div>

            {/* Drop Zone */}
            <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-12 text-center hover:border-blue-500 transition-all mb-6 bg-gray-50 dark:bg-gray-800"
            >
                <Upload size={48} className="mx-auto mb-4 text-gray-400" />
                <p className="text-lg font-medium mb-2">Drop files here or click to browse</p>
                <p className="text-sm text-gray-500 mb-4">
                    Accepts: {accept} | Upload multiple files at once!
                </p>
                <input
                    type="file"
                    accept={accept}
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                    id="batch-file-input"
                />
                <label
                    htmlFor="batch-file-input"
                    className="btn-primary inline-block cursor-pointer"
                >
                    <Folder className="inline mr-2" size={18} />
                    Select Files
                </label>
            </div>

            {/* File List */}
            {files.length > 0 && (
                <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-semibold">
                            Files ({files.length})
                            {completedCount > 0 && ` • ${completedCount} completed`}
                            {errorCount > 0 && ` • ${errorCount} failed`}
                        </h3>
                        {completedCount > 0 && !processing && (
                            <button
                                onClick={downloadAll}
                                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                            >
                                <Download size={18} />
                                Download All ({completedCount})
                            </button>
                        )}
                    </div>

                    <div className="space-y-2">
                        {files.map(fileItem => (
                            <div
                                key={fileItem.id}
                                className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                            >
                                {/* Status Icon */}
                                <div className="flex-shrink-0">
                                    {fileItem.status === 'pending' && (
                                        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                            <Upload size={16} className="text-gray-500" />
                                        </div>
                                    )}
                                    {fileItem.status === 'processing' && (
                                        <Loader size={24} className="text-blue-500 animate-spin" />
                                    )}
                                    {fileItem.status === 'completed' && (
                                        <CheckCircle size={24} className="text-green-500" />
                                    )}
                                    {fileItem.status === 'error' && (
                                        <X size={24} className="text-red-500" />
                                    )}
                                </div>

                                {/* File Info */}
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium truncate">{fileItem.file.name}</p>
                                    <p className="text-sm text-gray-500">
                                        {(fileItem.file.size / 1024 / 1024).toFixed(2)} MB
                                        {fileItem.status === 'error' && ` • ${fileItem.error}`}
                                    </p>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2">
                                    {fileItem.status === 'completed' && (
                                        <a
                                            href={fileItem.downloadUrl}
                                            download={fileItem.downloadFilename}
                                            className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
                                        >
                                            Download
                                        </a>
                                    )}
                                    {fileItem.status === 'pending' && (
                                        <button
                                            onClick={() => removeFile(fileItem.id)}
                                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                                        >
                                            <X size={18} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Convert Button */}
            {files.length > 0 && files.some(f => f.status === 'pending') && (
                <button
                    onClick={processFiles}
                    disabled={processing}
                    className="w-full btn-primary py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {processing ? (
                        <>
                            <Loader className="inline mr-2 animate-spin" size={20} />
                            Converting {files.filter(f => f.status === 'processing').length} of {files.length}...
                        </>
                    ) : (
                        <>Convert All Files ({files.filter(f => f.status === 'pending').length})</>
                    )}
                </button>
            )}
        </div>
    );
}
