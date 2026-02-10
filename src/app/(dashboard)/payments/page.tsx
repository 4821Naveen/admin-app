
'use client';

import { useEffect, useState } from 'react';
import { clsx } from 'clsx';
import { ArrowUpRight } from 'lucide-react';

export default function PaymentsPage() {
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [methodFilter, setMethodFilter] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = () => {
        fetch('/api/admin-orders')
            .then(res => res.json())
            .then(data => {
                // Filter orders that have payment info or just show all
                const validTxns = data.filter((o: any) => o.paymentId || o.paymentStatus !== 'pending');
                // process method if possible, for now map to a display friendlier object
                const processed = validTxns.map((t: any) => ({
                    ...t,
                    // Mocking method for now as it's not in DB, 
                    // in real prod we'd save this from webhook. 
                    // We can randomize or leave generic if unknown.
                    // For now let's try to infer or leave blank, 
                    // BUT user wants to filter. Let's add a placeholder 
                    // or if paymentId starts with 'pay_', likely Razorpay.
                    method: t.paymentId ? 'Online' : 'Cash'
                }));
                setTransactions(processed);
            })
            .finally(() => setLoading(false));
    };

    const getFilteredTransactions = () => {
        let filtered = transactions;

        if (methodFilter) {
            // Since we don't have real method data, we might have to skip or 
            // if we added the mock above, filter by that.
            // For now, let's filter by the 'method' property we added.
            // If user selects 'UPI', and we don't have it, it returns empty.
            // This is expected until we have real data.
            // However, to make it usable for the user's request:
            // "change into Payment Method"
            filtered = filtered.filter(t => t.method === methodFilter);
        }

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(t =>
                t.paymentId && t.paymentId.toLowerCase().includes(query)
            );
        }

        return filtered;
    };

    const handleExportExcel = () => {
        const filtered = getFilteredTransactions();
        const excelData = filtered.map(t => ({
            'Payment ID': t.paymentId || 'N/A',
            'Order ID': t.orderId,
            'Amount': t.totalAmount,
            'Status': t.paymentStatus?.toUpperCase(),
            'Date': new Date(t.createdAt).toLocaleDateString(),
            'Method': t.method || 'N/A'
        }));

        import('xlsx').then(XLSX => {
            const worksheet = XLSX.utils.json_to_sheet(excelData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Payments");
            const dateStr = new Date().toISOString().split('T')[0];
            XLSX.writeFile(workbook, `Payments_Report_${dateStr}.xlsx`);
        });
    };

    if (loading) return <div>Loading...</div>;

    const filteredTransactions = getFilteredTransactions();

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Transactions & Payments</h1>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-wrap gap-4 items-end">
                <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Search Payment ID</label>
                    <input
                        type="text"
                        placeholder="e.g. pay_Go12..."
                        className="px-3 py-2 border border-gray-200 rounded-lg text-sm w-48 focus:outline-none focus:ring-2 focus:ring-peca-purple/20 focus:border-peca-purple"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Payment Method</label>
                    <select
                        className="px-3 py-2 border border-gray-200 rounded-lg text-sm w-40 focus:outline-none focus:ring-2 focus:ring-peca-purple/20 focus:border-peca-purple"
                        value={methodFilter}
                        onChange={(e) => setMethodFilter(e.target.value)}
                    >
                        <option value="">All Methods</option>
                        <option value="Online">Online (Razorpay)</option>
                        <option value="Cash">Cash</option>
                        {/* 
                          Ideally we'd have UPI, Card etc. 
                          But typically Razorpay just gives us 'Online' in the basic integration 
                          unless we queried specific payment details.
                        */}
                    </select>
                </div>
                <div className="flex-1"></div>
                <button
                    onClick={handleExportExcel}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold text-sm shadow-sm"
                >
                    <ArrowUpRight size={16} /> Export Payments
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-500 font-medium border-b">
                        <tr>
                            <th className="px-6 py-3">Payment ID</th>
                            <th className="px-6 py-3">Order ID</th>
                            <th className="px-6 py-3">Amount</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3">Method</th>
                            <th className="px-6 py-3">Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {filteredTransactions.map((txn) => (
                            <tr key={txn._id} className="hover:bg-gray-50">
                                <td className="px-6 py-3 font-mono text-xs text-gray-600">{txn.paymentId || 'N/A'}</td>
                                <td className="px-6 py-3 font-medium">#{txn.orderId}</td>
                                <td className="px-6 py-3">₹{txn.totalAmount}</td>
                                <td className="px-6 py-3">
                                    <span className={clsx(
                                        'px-2 py-1 rounded-full text-xs font-medium',
                                        txn.paymentStatus === 'success' ? 'bg-green-100 text-green-800' :
                                            txn.paymentStatus === 'refunded' ? 'bg-red-100 text-red-800' :
                                                'bg-gray-100 text-gray-800'
                                    )}>
                                        {txn.paymentStatus?.toUpperCase()}
                                    </span>
                                </td>
                                <td className="px-6 py-3 text-gray-600">{txn.method}</td>
                                <td className="px-6 py-3 text-gray-500">
                                    {new Date(txn.createdAt).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                        {filteredTransactions.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                    No transactions found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
