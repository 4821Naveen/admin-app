'use client';

import { X, AlertCircle, User, Phone, MapPin, Package, IndianRupee } from 'lucide-react';
import { useEffect, useState } from 'react';

interface CancellationDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onApprove: () => void;
    onReject: () => void;
    order: any;
}

export default function CancellationDetailsModal({
    isOpen,
    onClose,
    onApprove,
    onReject,
    order
}: CancellationDetailsModalProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
        } else {
            const timer = setTimeout(() => setIsVisible(false), 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!isVisible || !order) return null;

    const handleApprove = () => {
        onApprove();
        onClose();
    };

    const handleReject = () => {
        onReject();
        onClose();
    };

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div
                className={`relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
                    }`}
            >
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-orange-500 to-red-500 text-white p-6 rounded-t-2xl">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/20 transition-colors"
                    >
                        <X size={20} />
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-white/20 rounded-full animate-pulse">
                            <AlertCircle size={28} />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold">Cancellation Request</h3>
                            <p className="text-white/90 text-sm mt-1">Order #{order.orderId}</p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Cancellation Reason */}
                    <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-lg">
                        <h4 className="font-bold text-amber-900 mb-2 flex items-center gap-2">
                            <AlertCircle size={18} />
                            Cancellation Reason
                        </h4>
                        <p className="text-amber-800 text-sm leading-relaxed">
                            {order.cancellationRequest?.reason || 'No reason provided'}
                        </p>
                        <p className="text-amber-600 text-xs mt-2">
                            Requested on: {new Date(order.cancellationRequest?.requestedAt).toLocaleString()}
                        </p>
                    </div>

                    {/* Customer Details */}
                    <div className="bg-blue-50 rounded-xl p-5">
                        <h4 className="font-bold text-blue-900 mb-4 flex items-center gap-2">
                            <User size={18} />
                            Customer Information
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <User size={16} className="text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-blue-600 font-semibold">Name</p>
                                    <p className="text-sm font-bold text-blue-900">{order.customer.name}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <Phone size={16} className="text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-blue-600 font-semibold">Mobile</p>
                                    <p className="text-sm font-bold text-blue-900">{order.customer.mobile}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 md:col-span-2">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <MapPin size={16} className="text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-blue-600 font-semibold">Address</p>
                                    <p className="text-sm font-bold text-blue-900">{order.customer.address}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order Items */}
                    <div className="bg-gray-50 rounded-xl p-5">
                        <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Package size={18} />
                            Purchased Items
                        </h4>
                        <div className="space-y-3">
                            {order.products.map((item: any, idx: number) => (
                                <div key={idx} className="flex items-center justify-between bg-white p-4 rounded-lg border border-gray-200">
                                    <div className="flex items-center gap-4">
                                        {item.productId?.images?.[0] && (
                                            <img
                                                src={item.productId.images[0]}
                                                alt={item.name}
                                                className="w-16 h-16 object-cover rounded-lg"
                                            />
                                        )}
                                        <div>
                                            <p className="font-bold text-gray-900">{item.name}</p>
                                            <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-gray-900 flex items-center gap-1">
                                            <IndianRupee size={14} />
                                            {item.price}
                                        </p>
                                        <p className="text-xs text-gray-500">per item</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Total Amount */}
                        <div className="mt-4 pt-4 border-t-2 border-gray-200 flex justify-between items-center">
                            <span className="font-bold text-gray-700">Total Amount</span>
                            <span className="text-2xl font-black text-gray-900 flex items-center gap-1">
                                <IndianRupee size={20} />
                                {order.totalAmount}
                            </span>
                        </div>
                    </div>

                    {/* Payment Status */}
                    <div className="bg-green-50 rounded-xl p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-green-600 font-semibold">Payment Status</p>
                                <p className="text-lg font-bold text-green-900 uppercase">{order.paymentStatus}</p>
                            </div>
                            {order.paymentId && (
                                <div className="text-right">
                                    <p className="text-xs text-green-600 font-semibold">Payment ID</p>
                                    <p className="text-sm font-mono text-green-900">{order.paymentId}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
                        <button
                            onClick={handleReject}
                            className="flex-1 px-6 py-4 rounded-xl border-2 border-gray-300 text-gray-700 font-bold hover:bg-gray-50 transition-all duration-200 hover:scale-105"
                        >
                            Reject Request
                        </button>
                        <button
                            onClick={handleApprove}
                            className="flex-1 px-6 py-4 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
                        >
                            Approve & Refund
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
