
'use client';

import { useState } from 'react';
import { Loader2, Save, CreditCard, ShieldCheck, AlertCircle } from 'lucide-react';
import { clsx } from 'clsx';

export default function PaymentSettingsForm({ initialData, onSave }: { initialData: any, onSave: (data: any) => Promise<void> }) {
    const [formData, setFormData] = useState({
        provider: 'Razorpay',
        isActive: initialData?.paymentGateway?.isActive ?? false,
        keyId: initialData?.paymentGateway?.keyId || '',
        keySecret: initialData?.paymentGateway?.keySecret || '',
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData(prev => ({ ...prev, [e.target.name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Ensure we nest it properly as expected by the schema update logic
            const payload = {
                paymentGateway: formData
            };
            await onSave(payload);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                            <CreditCard size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Razorpay Integration</h3>
                            <p className="text-sm text-gray-500">Configure your payment gateway credentials</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <span className={clsx(
                            "text-sm font-medium",
                            formData.isActive ? "text-green-600" : "text-gray-500"
                        )}>
                            {formData.isActive ? "Payment Method Active" : "Payment Method Disabled"}
                        </span>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                name="isActive"
                                checked={formData.isActive}
                                onChange={handleChange}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
                        <AlertCircle className="text-amber-600 flex-shrink-0 mt-0.5" size={18} />
                        <p className="text-sm text-amber-800">
                            These credentials allow your store to accept real payments. Ensure you are copying them directly from your Razorpay Dashboard.
                        </p>
                    </div>

                    <div className="grid gap-6">
                        <div>
                            <label className="text-sm font-medium text-gray-700 block mb-1">Key ID</label>
                            <div className="relative">
                                <ShieldCheck className="absolute left-3 top-3 text-gray-400" size={16} />
                                <input
                                    name="keyId"
                                    value={formData.keyId}
                                    onChange={handleChange}
                                    className="w-full pl-9 border border-gray-200 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                                    placeholder="rzp_test_..."
                                    type="password"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700 block mb-1">Key Secret</label>
                            <div className="relative">
                                <ShieldCheck className="absolute left-3 top-3 text-gray-400" size={16} />
                                <input
                                    name="keySecret"
                                    value={formData.keySecret}
                                    onChange={handleChange}
                                    className="w-full pl-9 border border-gray-200 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                                    placeholder="Enter Key Secret"
                                    type="password"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 text-white px-8 py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2 font-medium shadow-sm transition-all hover:shadow-md"
                >
                    {loading ? <Loader2 className="animate-spin h-5 w-5" /> : <Save size={18} />}
                    Save Payment Settings
                </button>
            </div>
        </form>
    );
}
