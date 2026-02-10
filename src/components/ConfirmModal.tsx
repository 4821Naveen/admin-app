'use client';

import { X, CheckCircle, AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'info' | 'warning' | 'danger' | 'success';
}

export default function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    type = 'info'
}: ConfirmModalProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
        } else {
            const timer = setTimeout(() => setIsVisible(false), 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!isVisible) return null;

    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    const typeStyles = {
        info: {
            icon: <CheckCircle className="text-blue-500" size={48} />,
            confirmBg: 'bg-blue-600 hover:bg-blue-700',
            accentColor: 'text-blue-600'
        },
        warning: {
            icon: <AlertCircle className="text-amber-500" size={48} />,
            confirmBg: 'bg-amber-600 hover:bg-amber-700',
            accentColor: 'text-amber-600'
        },
        danger: {
            icon: <AlertCircle className="text-red-500" size={48} />,
            confirmBg: 'bg-red-600 hover:bg-red-700',
            accentColor: 'text-red-600'
        },
        success: {
            icon: <CheckCircle className="text-green-500" size={48} />,
            confirmBg: 'bg-green-600 hover:bg-green-700',
            accentColor: 'text-green-600'
        }
    };

    const currentStyle = typeStyles[type];

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div
                className={`relative bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all duration-300 ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
                    }`}
            >
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                    <X size={20} className="text-gray-500" />
                </button>

                {/* Content */}
                <div className="p-8 text-center">
                    {/* Icon */}
                    <div className="flex justify-center mb-6 animate-bounce-slow">
                        {currentStyle.icon}
                    </div>

                    {/* Title */}
                    <h3 className={`text-2xl font-bold mb-3 ${currentStyle.accentColor}`}>
                        {title}
                    </h3>

                    {/* Message */}
                    <p className="text-gray-600 mb-8 text-base leading-relaxed">
                        {message}
                    </p>

                    {/* Actions */}
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 px-6 py-3 rounded-xl border-2 border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-all duration-200 hover:scale-105"
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={handleConfirm}
                            className={`flex-1 px-6 py-3 rounded-xl text-white font-semibold transition-all duration-200 hover:scale-105 shadow-lg ${currentStyle.confirmBg}`}
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
