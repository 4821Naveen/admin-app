
import connectToDatabase from '@/lib/db';
import Product from '@/models/Product';
import ProductForm from '@/components/ProductForm';
import { notFound } from 'next/navigation';

interface EditProductPageProps {
    params: Promise<{ id: string }>;
}

export default async function EditProductPage(props: EditProductPageProps) {
    const params = await props.params;
    await connectToDatabase();

    const product = await Product.findById(params.id).lean();

    if (!product) {
        notFound();
    }

    // Convert to serializable object (ObjectId to string, Date to string)
    const productData = JSON.parse(JSON.stringify(product));

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Edit Product</h1>
            <ProductForm initialData={productData} isid={params.id} />
        </div>
    );
}
