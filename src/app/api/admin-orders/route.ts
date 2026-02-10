
import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Order from '@/models/Order';
import Product from '@/models/Product'; // Ensure Product model is registered for populate

export const dynamic = 'force-dynamic';

export async function GET() {
    console.log('[Admin Orders API] GET request received');
    try {
        console.log('[Admin Orders API] Connecting to database...');
        await connectToDatabase();
        console.log('[Admin Orders API] Database connected');

        console.log('[Admin Orders API] Fetching orders...');

        // Explicitly ensure Product model is registered
        if (!Product) {
            throw new Error('Product model not loaded');
        }

        const orders = await Order.find({})
            .populate('products.productId', 'name images')
            .sort({ createdAt: -1 });

        console.log('[Admin Orders API] Fetched orders count:', orders.length);
        return NextResponse.json(orders);
    } catch (error: any) {
        console.error('[Admin Orders API] Error occurred:', error);
        console.error('[Admin Orders API] Error message:', error?.message);
        console.error('[Admin Orders API] Error stack:', error?.stack);
        return NextResponse.json({
            error: error?.message || 'Unknown error',
            details: error?.toString()
        }, { status: 500 });
    }
}
