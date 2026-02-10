
'use client';

import { useState, useEffect } from 'react';
import CompanySettingsForm from './components/CompanySettingsForm';
import PaymentSettingsForm from './components/PaymentSettingsForm'; // We will create this
import { Building2, CreditCard } from 'lucide-react';
import { clsx } from 'clsx';

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState<'company' | 'payments'>('company');
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const res = await fetch('/api/settings/company');
            const json = await res.json();
            setData(json);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSave = async (payload: any) => {
        try {
            const res = await fetch('/api/settings/company', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            if (!res.ok) throw new Error('Failed');
            alert('Settings saved successfully!');
            fetchData(); // Refresh data
        } catch (e) {
            alert('Error saving settings');
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Settings</h1>
                <p className="text-gray-500 mt-1">Manage your store's profile and configurations</p>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Settings Sidebar Nav */}
                <aside className="w-full md:w-64 flex-shrink-0">
                    <nav className="flex md:flex-col space-y-0 md:space-y-1 bg-white p-2 rounded-xl shadow-sm border border-gray-100">
                        <button
                            onClick={() => setActiveTab('company')}
                            className={clsx(
                                "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg w-full transition-all",
                                activeTab === 'company'
                                    ? "bg-blue-50 text-blue-700"
                                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                            )}
                        >
                            <Building2 size={18} />
                            Company Details
                        </button>
                        <button
                            onClick={() => setActiveTab('payments')}
                            className={clsx(
                                "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg w-full transition-all",
                                activeTab === 'payments'
                                    ? "bg-blue-50 text-blue-700"
                                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                            )}
                        >
                            <CreditCard size={18} />
                            Payment Methods
                        </button>
                    </nav>
                </aside>

                {/* Content Area */}
                <div className="flex-1">
                    {activeTab === 'company' && (
                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <CompanySettingsForm initialData={data} onSave={handleSave} />
                        </div>
                    )}
                    {activeTab === 'payments' && (
                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <PaymentSettingsForm initialData={data} onSave={handleSave} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
