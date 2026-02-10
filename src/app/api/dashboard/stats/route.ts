
import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Order from '@/models/Order';
import Product from '@/models/Product';

export async function GET() {
    await connectToDatabase();

    try {
        const totalOrders = await Order.countDocuments();
        const productsCount = await Product.countDocuments();

        // Calculate Total Revenue (only paid/delivered orders ideally, but for now all non-cancelled)
        const activeOrders = await Order.find({ status: { $ne: 'cancelled' } });
        const totalSales = activeOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

        // Calculate Cancellation Stats
        const cancelledOrdersData = await Order.find({ status: 'cancelled' });
        const totalCancelledOrders = cancelledOrdersData.length;
        const totalCancelledAmount = cancelledOrdersData.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

        const activenow = 0; // Placeholder until we have analytics

        return NextResponse.json({
            totalSales,
            totalOrders,
            totalCancelledOrders,
            totalCancelledAmount,
            productsCount,
            activenow
        });
    } catch (error) {
        console.error("Stats Error", error);
        return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
    }
}
