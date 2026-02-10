
'use client';

import { useState } from 'react';
import { Loader2, Save, Upload, Building2, MapPin, Phone, Mail, FileText } from 'lucide-react';
import { clsx } from 'clsx';
import FileUpload from '@/components/ui/FileUpload';

export default function CompanySettingsForm({ initialData, onSave }: { initialData: any, onSave: (data: any) => Promise<void> }) {
    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        logoUrl: initialData?.logoUrl || '',
        mobile: initialData?.mobile || '',
        email: initialData?.email || '',
        address: initialData?.address || '',
        gstNumber: initialData?.gstNumber || '',
        fssaiNumber: initialData?.fssaiNumber || '',
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSave(formData);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Branding Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                    <Building2 size={20} className="text-blue-600" />
                    Brand Identity
                </h3>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Logo Preview Area */}
                    <div className="md:col-span-1 space-y-3">
                        <FileUpload
                            label="Company Logo"
                            defaultValue={formData.logoUrl}
                            onUpload={(url) => setFormData(prev => ({ ...prev, logoUrl: url }))}
                        />
                    </div>

                    <div className="md:col-span-2 space-y-4">
                        <div className="grid gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-700 block mb-1">Company Name</label>
                                <input
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full border border-gray-200 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all font-medium"
                                    placeholder="e.g. My Awesome Shop"
                                />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-700 block mb-1">Mobile Number</label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-3 text-gray-400" size={16} />
                                    <input
                                        name="mobile"
                                        value={formData.mobile}
                                        onChange={handleChange}
                                        className="w-full pl-9 border border-gray-200 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                                        placeholder="+91 98765 43210"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700 block mb-1">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 text-gray-400" size={16} />
                                    <input
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full pl-9 border border-gray-200 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                                        placeholder="contact@myshop.com"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-700 block mb-1">Address</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3 text-gray-400" size={16} />
                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="w-full pl-9 border border-gray-200 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 min-h-[100px]"
                                    placeholder="Enter full business address..."
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Legal Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                    <FileText size={20} className="text-blue-600" />
                    Legal Information
                </h3>

                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label className="text-sm font-medium text-gray-700 block mb-1">GST Number</label>
                        <input
                            name="gstNumber"
                            value={formData.gstNumber}
                            onChange={handleChange}
                            className="w-full border border-gray-200 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 font-mono"
                            placeholder="22AAAAA0000A1Z5"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700 block mb-1">FSSAI / License Number</label>
                        <input
                            name="fssaiNumber"
                            value={formData.fssaiNumber}
                            onChange={handleChange}
                            className="w-full border border-gray-200 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 font-mono"
                            placeholder="10021000000000"
                        />
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 text-white px-8 py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2 font-medium shadow-sm transition-all hover:shadow-md"
                >
                    {loading ? <Loader2 className="animate-spin h-5 w-5" /> : <Save size={18} />}
                    Save Changes
                </button>
            </div>
        </form>
    );
}
