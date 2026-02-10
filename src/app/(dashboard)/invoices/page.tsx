'use client';

import { useState } from 'react';
import { Search, FileText, Printer, AlertCircle } from 'lucide-react';
import { generateInvoice } from '@/lib/invoiceGenerator';

export default function InvoicesPage() {
    const [mobile, setMobile] = useState('');
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!mobile || mobile.length < 10) return;

        setLoading(true);
        setSearched(true);
        try {
            // Fetch all orders and filter by mobile on client for now 
            // (ideally should be a backend search API, but this is faster to implement without touching backend)
            const res = await fetch('/api/admin-orders');
            if (res.ok) {
                const allOrders = await res.json();
                const filtered = allOrders.filter((order: any) =>
                    order.customer.mobile.includes(mobile)
                );
                // Sort by date desc
                filtered.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                setOrders(filtered);
            }
        } catch (err) {
            console.error('Search failed:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Invoices</h1>
                <p className="text-gray-500 mt-1">Search and print official tax invoices for customers</p>
            </div>

            {/* Search Section */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <form onSubmit={handleSearch} className="flex gap-4 items-end">
                    <div className="flex-1 max-w-md">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Customer Mobile Number
                        </label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="tel"
                                placeholder="Enter 10-digit mobile number"
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-peca-purple/20 focus:border-peca-purple"
                                value={mobile}
                                onChange={(e) => setMobile(e.target.value)}
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={loading || !mobile}
                        className="px-6 py-2 bg-peca-purple text-yellow-500 rounded-lg hover:bg-peca-purple/90 transition-colors font-semibold disabled:opacity-50"
                    >
                        {loading ? 'Searching...' : 'Find Invoices'}
                    </button>
                </form>
            </div>

            {/* Results */}
            {searched && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    {orders.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="bg-gray-50 p-4 rounded-full inline-block mb-3">
                                <AlertCircle size={32} className="text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900">No invoices found</h3>
                            <p className="text-gray-500">No orders found for mobile number "{mobile}"</p>
                        </div>
                    ) : (
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50/50 text-gray-500 font-medium border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4">Order Details</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Invoice Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {orders.map((order) => (
                                    <tr key={order._id} className="hover:bg-gray-50/50">
                                        <td className="px-6 py-4">
                                            <div className="font-mono text-xs text-gray-500 mb-1">#{order.orderId}</div>
                                            <div className="font-medium text-gray-900">{order.customer.name}</div>
                                            <div className="text-xs text-gray-500">
                                                {new Date(order.createdAt).toLocaleDateString()} • ₹{order.totalAmount}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${order.status === 'delivered' ? 'bg-green-100 text-green-700 border-green-200' :
                                                    order.status === 'cancelled' ? 'bg-red-100 text-red-700 border-red-200' :
                                                        'bg-blue-100 text-blue-700 border-blue-200'
                                                }`}>
                                                {order.status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => generateInvoice(order)}
                                                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-xs font-semibold shadow-sm"
                                                >
                                                    <Printer size={14} /> Print Invoice
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}
        </div>
    );
}
