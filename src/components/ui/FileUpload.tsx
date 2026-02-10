
'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, X, File, Loader2 } from 'lucide-react';
import { clsx } from 'clsx';
import Image from 'next/image';

interface FileUploadProps {
    onUpload: (url: string) => void;
    defaultValue?: string;
    label?: string;
}

export default function FileUpload({ onUpload, defaultValue, label = "Upload Image" }: FileUploadProps) {
    const [preview, setPreview] = useState<string>(defaultValue || '');
    const [loading, setLoading] = useState(false);

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (!file) return;

        setLoading(true);
        // Create local preview immediately
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);

        // Upload to API
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) throw new Error('Upload failed');

            const data = await res.json();
            onUpload(data.url);
            setPreview(data.url); // Use server URL
        } catch (error) {
            console.error(error);
            alert('Upload failed. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [onUpload]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': [] },
        maxFiles: 1,
    });

    const removeImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setPreview('');
        onUpload('');
    };

    return (
        <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 block">{label}</label>

            <div
                {...getRootProps()}
                className={clsx(
                    "relative border-2 border-dashed rounded-xl p-6 transition-all cursor-pointer group flex flex-col items-center justify-center min-h-[200px] overflow-hidden bg-gray-50",
                    isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300 hover:bg-gray-100"
                )}
            >
                <input {...getInputProps()} />

                {loading ? (
                    <div className="flex flex-col items-center animate-pulse">
                        <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-2" />
                        <p className="text-sm text-gray-500">Uploading...</p>
                    </div>
                ) : preview ? (
                    <div className="relative w-full h-full min-h-[200px] flex items-center justify-center">
                        {/* We use standard img tag for simplicity with local/external URLs mixed */}
                        <img
                            src={preview}
                            alt="Preview"
                            className="max-h-[200px] w-auto object-contain rounded-lg shadow-sm"
                        />
                        <button
                            onClick={removeImage}
                            className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full shadow-md hover:bg-red-600 transition-transform hover:scale-110"
                            type="button"
                        >
                            <X size={16} />
                        </button>
                    </div>
                ) : (
                    <div className="text-center space-y-2 text-gray-500 group-hover:text-gray-700 transition-colors">
                        <div className="p-3 bg-white rounded-full shadow-sm inline-block group-hover:scale-110 transition-transform">
                            <UploadCloud size={24} className="text-blue-500" />
                        </div>
                        <div>
                            <p className="text-sm font-medium">Click to upload or drag and drop</p>
                            <p className="text-xs text-gray-400">SVG, PNG, JPG or GIF</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
