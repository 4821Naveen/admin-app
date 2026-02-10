
import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Order from '@/models/Order';

export async function PUT(
    req: Request,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    await connectToDatabase();
    try {
        const { status, paymentStatus } = await req.json();
        const updateData: any = {};

        if (status) {
            updateData.status = status;
            if (status === 'confirmed') {
                updateData['dates.confirmedDate'] = new Date();
            } else if (status === 'packed') {
                updateData['dates.packedDate'] = new Date();
            } else if (status === 'shipped') {
                updateData['dates.shippedDate'] = new Date();
            } else if (status === 'delivered') {
                updateData['dates.deliveredDate'] = new Date();
            }
        }

        if (paymentStatus) {
            updateData.paymentStatus = paymentStatus;
        }

        const order = await Order.findByIdAndUpdate(params.id, updateData, { new: true });

        if (!order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }
        return NextResponse.json(order);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
