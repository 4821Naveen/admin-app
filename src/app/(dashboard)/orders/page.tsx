
'use client';

import { useEffect, useState } from 'react';
import { Eye, CheckCircle, XCircle, FileText, ShoppingBag, AlertCircle, Package, ArrowRight, Printer } from 'lucide-react';
import { clsx } from 'clsx';
import { generateInvoice } from '@/lib/invoiceGenerator';
import ConfirmModal from '@/components/ConfirmModal';
import CancellationDetailsModal from '@/components/CancellationDetailsModal';

export default function OrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Modal state
    const [modalConfig, setModalConfig] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        type: 'info' | 'warning' | 'danger' | 'success';
        confirmText: string;
        onConfirm: () => void;
    }>({
        isOpen: false,
        title: '',
        message: '',
        type: 'info',
        confirmText: 'Confirm',
        onConfirm: () => { }
    });

    // Cancellation details modal state
    const [cancellationModal, setCancellationModal] = useState<{
        isOpen: boolean;
        order: any;
    }>({
        isOpen: false,
        order: null
    });

    const [dateRange, setDateRange] = useState({
        start: '',
        end: ''
    });

    const [mobileFilter, setMobileFilter] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const [selectedOrders, setSelectedOrders] = useState<string[]>([]);

    const toggleSelectOrder = (orderId: string) => {
        setSelectedOrders(prev =>
            prev.includes(orderId)
                ? prev.filter(id => id !== orderId)
                : [...prev, orderId]
        );
    };

    const toggleSelectAll = () => {
        const filtered = getFilteredOrders();
        if (selectedOrders.length === filtered.length && filtered.length > 0) {
            setSelectedOrders([]);
        } else {
            setSelectedOrders(filtered.map(o => o._id));
        }
    };

    const isAllSelected = () => {
        const filtered = getFilteredOrders();
        return filtered.length > 0 && selectedOrders.length === filtered.length;
    };

    const fetchOrders = async () => {
        try {
            const res = await fetch('/api/admin-orders');
            if (!res.ok) {
                const errData = await res.json();
                console.error('API Error:', errData);
                setOrders([]);
                return;
            }
            const data = await res.json();
            if (Array.isArray(data)) {
                setOrders(data);
            } else {
                console.error('Data is not an array:', data);
                setOrders([]);
            }
        } catch (err) {
            console.error(err);
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    const getFilteredOrders = () => {
        let filtered = orders;

        // Date Filter
        if (dateRange.start || dateRange.end) {
            filtered = filtered.filter(order => {
                const orderDate = new Date(order.createdAt);
                const start = dateRange.start ? new Date(dateRange.start) : new Date('1970-01-01');
                const end = dateRange.end ? new Date(dateRange.end) : new Date();
                end.setHours(23, 59, 59, 999);
                return orderDate >= start && orderDate <= end;
            });
        }

        // Mobile Filter
        if (mobileFilter) {
            filtered = filtered.filter(order =>
                order.customer.mobile.includes(mobileFilter)
            );
        }

        // Search Filter (Order ID or Payment ID)
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(order =>
                (order.orderId && order.orderId.toLowerCase().includes(query)) ||
                (order.paymentId && order.paymentId.toLowerCase().includes(query))
            );
        }

        return filtered;
    };

    const handleExportExcel = () => {
        const filteredOrders = getFilteredOrders();

        // Flatten data for Excel
        const excelData = filteredOrders.map(order => ({
            'Order ID': order.orderId,
            'Date': new Date(order.createdAt).toLocaleDateString(),
            'Customer Name': order.customer.name,
            'Mobile': order.customer.mobile,
            'Address': order.customer.address,
            'Amount': order.totalAmount,
            'Status': order.status.toUpperCase(),
            'Items': order.products.map((p: any) => `${p.name} (x${p.quantity})`).join(', '),
            'Payment Status': order.paymentStatus || 'Pending',
            'Payment ID': order.paymentId || 'N/A'
        }));

        // Dynamically import xlsx to avoid SSR issues
        import('xlsx').then(XLSX => {
            const worksheet = XLSX.utils.json_to_sheet(excelData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");

            // Generate filename with date
            const dateStr = new Date().toISOString().split('T')[0];
            XLSX.writeFile(workbook, `Orders_Report_${dateStr}.xlsx`);
        });
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const updateStatus = async (id: string, status: string) => {
        const statusMessages: Record<string, { title: string; message: string; type: 'info' | 'warning' | 'danger' | 'success' }> = {
            confirmed: {
                title: 'Confirm Order',
                message: 'Mark this order as confirmed? The customer will be notified.',
                type: 'info'
            },
            packed: {
                title: 'Mark as Packed',
                message: 'Confirm that this order has been packed and is ready for shipping?',
                type: 'info'
            },
            shipped: {
                title: 'Mark as Shipped',
                message: 'Confirm that this order has been shipped? Tracking will be updated.',
                type: 'success'
            },
            delivered: {
                title: 'Mark as Delivered',
                message: 'Confirm that this order has been successfully delivered to the customer?',
                type: 'success'
            },
            cancelled: {
                title: 'Cancel Order',
                message: 'Are you sure you want to cancel this order? This action cannot be undone.',
                type: 'danger'
            }
        };

        const config = statusMessages[status] || {
            title: 'Update Status',
            message: `Mark order as ${status}?`,
            type: 'info' as const
        };

        setModalConfig({
            isOpen: true,
            title: config.title,
            message: config.message,
            type: config.type,
            confirmText: 'Yes, Proceed',
            onConfirm: async () => {
                try {
                    await fetch(`/api/admin-orders/${id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ status }),
                    });
                    fetchOrders();
                } catch (err) {
                    console.error('Failed to update status:', err);
                }
            }
        });
    };

    const handleRefund = async (orderId: string) => {
        setModalConfig({
            isOpen: true,
            title: 'Process Refund',
            message: 'Approve this cancellation request and issue a full refund? This action cannot be undone.',
            type: 'warning',
            confirmText: 'Yes, Refund',
            onConfirm: async () => {
                try {
                    const res = await fetch(`/api/admin-orders/${orderId}/refund`, {
                        method: 'POST'
                    });
                    if (res.ok) {
                        fetchOrders();
                    } else {
                        const err = await res.json();
                        console.error(err.error || 'Refund failed');
                    }
                } catch (err) {
                    console.error('Error processing refund:', err);
                }
            }
        });
    };

    const showCancellationDetails = (order: any) => {
        setCancellationModal({
            isOpen: true,
            order: order
        });
    };

    const handleApproveCancellation = async () => {
        if (!cancellationModal.order) return;
        try {
            const res = await fetch(`/api/admin-orders/${cancellationModal.order.orderId}/refund`, {
                method: 'POST'
            });
            if (res.ok) {
                fetchOrders();
            }
        } catch (err) {
            console.error('Error processing refund:', err);
        }
    };

    const handleRejectCancellation = async () => {
        if (!cancellationModal.order) return;
        try {
            const res = await fetch(`/api/admin-orders/${cancellationModal.order.orderId}/reject-cancellation`, {
                method: 'POST'
            });
            if (res.ok) {
                fetchOrders();
            }
        } catch (err) {
            console.error('Error rejecting cancellation:', err);
        }
    };

    const statusColors: any = {
        placed: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
        packed: 'bg-indigo-100 text-indigo-800 border-indigo-200',
        shipped: 'bg-purple-100 text-purple-800 border-purple-200',
        delivered: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        cancelled: 'bg-red-100 text-red-800 border-red-200',
        refunded: 'bg-slate-100 text-slate-800 border-slate-200',
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            {/* Print Header */}
            <div className="print-header">
                <h1 className="text-2xl font-bold">Order Report</h1>
                <p className="text-sm text-gray-500">Generated on {new Date().toLocaleDateString()}</p>
            </div>

            <div className="no-print">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Orders</h1>
                <p className="text-gray-500 mt-1">Track and manage customer orders</p>

                {/* Filters & Export */}
                <div className="mt-6 flex flex-wrap gap-4 items-end bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1">Search ID</label>
                        <input
                            type="text"
                            placeholder="Order ID or Payment ID..."
                            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-peca-purple/20 focus:border-peca-purple w-48"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1">Customer Mobile</label>
                        <input
                            type="text"
                            placeholder="Filter by mobile..."
                            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-peca-purple/20 focus:border-peca-purple w-40"
                            value={mobileFilter}
                            onChange={(e) => setMobileFilter(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1">Start Date</label>
                        <input
                            type="date"
                            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-peca-purple/20 focus:border-peca-purple"
                            value={dateRange.start}
                            onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1">End Date</label>
                        <input
                            type="date"
                            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-peca-purple/20 focus:border-peca-purple"
                            value={dateRange.end}
                            onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                        />
                    </div>
                    <div className="flex-1"></div>
                    <button
                        onClick={handleExportExcel}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold text-sm shadow-sm"
                    >
                        <FileText size={16} /> Export to Excel
                    </button>
                    <button
                        onClick={() => window.print()}
                        disabled={selectedOrders.length === 0}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors font-semibold text-sm shadow-sm ${selectedOrders.length > 0
                            ? 'bg-gray-800 text-white hover:bg-gray-900'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            }`}
                    >
                        <Printer size={16} /> {selectedOrders.length > 0 ? `Print Selected (${selectedOrders.length})` : 'Select Orders to Print'}
                    </button>
                </div>
            </div>

            <div className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden ${selectedOrders.length > 0 ? 'print-selection-mode' : ''}`}>
                {orders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="p-4 bg-gray-50 rounded-full mb-4">
                            <ShoppingBag size={48} className="text-gray-300" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">No orders yet</h3>
                        <p className="text-gray-500 max-w-sm mt-2">When customers place orders, they will appear here.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50/50 text-gray-500 font-medium border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 w-4">
                                        <input
                                            type="checkbox"
                                            className="rounded border-gray-300 text-peca-purple focus:ring-peca-purple"
                                            checked={isAllSelected()}
                                            onChange={toggleSelectAll}
                                        />
                                    </th>
                                    <th className="px-6 py-4">Order ID</th>
                                    <th className="px-6 py-4">Customer</th>
                                    <th className="hidden print:table-cell px-6 py-4">Address & Items</th>
                                    <th className="px-6 py-4">Amount</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4 text-right no-print">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {getFilteredOrders().map((order) => (
                                    <tr
                                        key={order._id}
                                        className={`hover:bg-gray-50/50 transition-colors ${selectedOrders.includes(order._id) ? 'bg-purple-50/30' : ''} ${selectedOrders.length > 0 && !selectedOrders.includes(order._id) ? 'print:hidden' : ''}`}
                                    >
                                        <td className="px-6 py-4 w-4 no-print">
                                            <input
                                                type="checkbox"
                                                className="rounded border-gray-300 text-peca-purple focus:ring-peca-purple"
                                                checked={selectedOrders.includes(order._id)}
                                                onChange={() => toggleSelectOrder(order._id)}
                                            />
                                        </td>
                                        <td className="px-6 py-4 font-mono text-xs text-gray-500 align-top">#{order.orderId}</td>
                                        <td className="px-6 py-4 align-top">
                                            <div className="font-medium text-gray-900">{order.customer.name}</div>
                                            <div className="text-xs text-gray-500">{order.customer.mobile}</div>
                                        </td>
                                        {/* Hidden column for Print only - Address & Items */}
                                        <td className="hidden print:table-cell px-6 py-4 align-top text-xs">
                                            <div className="mb-2">
                                                <span className="font-bold text-gray-700">Address:</span> {order.customer.address}
                                            </div>
                                            <div>
                                                <span className="font-bold text-gray-700">Items:</span>
                                                <ul className="list-disc pl-4 mt-1 space-y-1">
                                                    {order.products.map((p: any, idx: number) => (
                                                        <li key={idx}>{p.name} <span className="text-gray-500">(x{p.quantity})</span></li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-900 align-top">₹{order.totalAmount}</td>
                                        <td className="px-6 py-4 align-top">
                                            <span className={clsx(
                                                'px-2.5 py-1 rounded-full text-xs font-medium border',
                                                statusColors[order.status] || 'bg-gray-100 text-gray-800 border-gray-200'
                                            )}>
                                                {order.status.toUpperCase()}
                                            </span>
                                            {order.cancellationRequest?.requested && order.cancellationRequest?.status === 'pending' && (
                                                <button
                                                    onClick={() => showCancellationDetails(order)}
                                                    className="mt-2 flex items-center gap-1 text-[10px] font-bold text-white bg-gradient-to-r from-orange-500 to-red-500 px-3 py-1.5 rounded-full hover:shadow-lg transition-all animate-pulse hover:animate-none no-print"
                                                >
                                                    <AlertCircle size={12} /> VIEW REQUEST
                                                </button>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 align-top">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-2 align-top no-print">
                                            {/* Step 1: Confirm */}
                                            {order.status === 'placed' && (
                                                <button
                                                    onClick={() => updateStatus(order._id, 'confirmed')}
                                                    className="inline-flex items-center justify-center p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Confirm Order"
                                                >
                                                    <CheckCircle size={18} />
                                                </button>
                                            )}
                                            {/* Step 2: Pack */}
                                            {order.status === 'confirmed' && (
                                                <button
                                                    onClick={() => updateStatus(order._id, 'packed')}
                                                    className="inline-flex items-center justify-center p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                    title="Mark Packed"
                                                >
                                                    <Package size={18} />
                                                </button>
                                            )}
                                            {/* Step 3: Ship */}
                                            {order.status === 'packed' && (
                                                <button
                                                    onClick={() => updateStatus(order._id, 'shipped')}
                                                    className="inline-flex items-center justify-center p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                                                    title="Mark Shipped"
                                                >
                                                    <ArrowRight size={18} />
                                                </button>
                                            )}
                                            {/* Step 4: Deliver */}
                                            {order.status === 'shipped' && (
                                                <button
                                                    onClick={() => updateStatus(order._id, 'delivered')}
                                                    className="inline-flex items-center justify-center p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                                    title="Mark Delivered"
                                                >
                                                    <CheckCircle size={18} />
                                                </button>
                                            )}
                                            {/* Cancel/Refund */}
                                            {order.status !== 'cancelled' && order.status !== 'refunded' && (
                                                <button
                                                    onClick={() => {
                                                        if (order.cancellationRequest?.requested) {
                                                            handleRefund(order.orderId);
                                                        } else {
                                                            updateStatus(order._id, 'cancelled');
                                                        }
                                                    }}
                                                    className={clsx(
                                                        "inline-flex items-center justify-center p-2 rounded-lg transition-colors",
                                                        order.cancellationRequest?.requested ? "text-orange-600 hover:bg-orange-50" : "text-red-600 hover:bg-red-50"
                                                    )}
                                                    title={order.cancellationRequest?.requested ? "Approve Refund" : "Cancel Order"}
                                                >
                                                    {order.cancellationRequest?.requested ? <CheckCircle size={18} /> : <XCircle size={18} />}
                                                </button>
                                            )}
                                            {/* Invoice Button Moved to Invoices Page */}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Custom Confirmation Modal */}
            <ConfirmModal
                isOpen={modalConfig.isOpen}
                onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
                onConfirm={modalConfig.onConfirm}
                title={modalConfig.title}
                message={modalConfig.message}
                type={modalConfig.type}
                confirmText={modalConfig.confirmText}
                cancelText="Cancel"
            />

            {/* Cancellation Details Modal */}
            <CancellationDetailsModal
                isOpen={cancellationModal.isOpen}
                onClose={() => setCancellationModal({ isOpen: false, order: null })}
                onApprove={handleApproveCancellation}
                onReject={handleRejectCancellation}
                order={cancellationModal.order}
            />
        </div>
    );
}
