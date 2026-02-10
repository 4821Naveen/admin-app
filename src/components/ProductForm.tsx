
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import FileUpload from '@/components/ui/FileUpload';

interface ProductFormProps {
    initialData?: any;
    isid?: string;
}

export default function ProductForm({ initialData, isid }: ProductFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        description: initialData?.description || '',
        price: initialData?.price || '',
        offerPrice: initialData?.offerPrice || '',
        category: initialData?.category || '',
        stock: initialData?.stock || '',
        images: initialData?.images?.join(',') || '', // Simple comma separated for now
        isActive: initialData?.isActive ?? true,
        showInSlider: initialData?.showInSlider ?? false,
        isBuyNowEnabled: initialData?.isBuyNowEnabled ?? true,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            // handle checkbox if needed, though isActive is usually toggle
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                ...formData,
                price: Number(formData.price),
                offerPrice: formData.offerPrice ? Number(formData.offerPrice) : undefined,
                stock: Number(formData.stock),
                images: formData.images.split(',').map((s: string) => s.trim()).filter(Boolean),
                showInSlider: formData.showInSlider,
                isBuyNowEnabled: formData.isBuyNowEnabled,
            };

            const url = initialData
                ? `/api/products/${initialData._id}`
                : '/api/products';

            const method = initialData ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error('Failed to save product');

            router.push('/products');
            router.refresh();
        } catch (error) {
            console.error(error);
            alert('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl bg-white p-6 rounded-xl shadow-sm border">
            <div className="space-y-2">
                <label className="text-sm font-medium">Product Name</label>
                <input
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-2"
                    placeholder="e.g. Wireless Headset"
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <textarea
                    name="description"
                    required
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-2 h-32"
                    placeholder="Product details..."
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Price (MRP)</label>
                    <input
                        name="price"
                        type="number"
                        required
                        value={formData.price}
                        onChange={handleChange}
                        className="w-full border rounded-lg p-2"
                        placeholder="0.00"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Offer Price (Optional)</label>
                    <input
                        name="offerPrice"
                        type="number"
                        value={formData.offerPrice}
                        onChange={handleChange}
                        className="w-full border rounded-lg p-2"
                        placeholder="0.00"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Category</label>
                    <input
                        name="category"
                        required
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full border rounded-lg p-2"
                        placeholder="Electronics, Clothing..."
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Stock</label>
                    <input
                        name="stock"
                        type="number"
                        required
                        value={formData.stock}
                        onChange={handleChange}
                        className="w-full border rounded-lg p-2"
                        placeholder="0"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 border rounded-lg bg-gray-50">
                    <input
                        type="checkbox"
                        name="showInSlider"
                        id="showInSlider"
                        checked={formData.showInSlider}
                        onChange={(e) => setFormData(prev => ({ ...prev, showInSlider: e.target.checked }))}
                        className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="showInSlider" className="text-sm font-medium text-gray-700 cursor-pointer select-none">
                        Show in Homepage Slider
                    </label>
                </div>
                <div className="flex items-center gap-3 p-4 border rounded-lg bg-gray-50">
                    <input
                        type="checkbox"
                        name="isBuyNowEnabled"
                        id="isBuyNowEnabled"
                        checked={formData.isBuyNowEnabled}
                        onChange={(e) => setFormData(prev => ({ ...prev, isBuyNowEnabled: e.target.checked }))}
                        className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="isBuyNowEnabled" className="text-sm font-medium text-gray-700 cursor-pointer select-none">
                        Enable "Buy Now"
                    </label>
                </div>
            </div>

            <div className="space-y-2">
                <FileUpload
                    label="Product Image"
                    defaultValue={formData.images.split(',')[0]}
                    onUpload={(url) => setFormData(prev => ({ ...prev, images: url }))}
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
            >
                {loading && <Loader2 className="animate-spin h-4 w-4" />}
                {initialData ? 'Update Product' : 'Create Product'}
            </button>
        </form>
    );
}
