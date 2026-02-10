import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Order from '@/models/Order';

export async function POST(
    req: Request,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    await connectToDatabase();
    try {
        const orderId = params.id;

        const order = await Order.findOne({ orderId });
        if (!order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        if (!order.cancellationRequest?.requested) {
            return NextResponse.json({ error: 'No cancellation request found' }, { status: 400 });
        }

        // Reject the cancellation request
        order.cancellationRequest.status = 'rejected';
        order.cancellationRequest.processedAt = new Date();

        await order.save();

        return NextResponse.json({ success: true, message: 'Cancellation request rejected' });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
