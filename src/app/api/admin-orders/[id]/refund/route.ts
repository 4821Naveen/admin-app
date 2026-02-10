
import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Order from '@/models/Order';
import CompanyDetails from '@/models/CompanyDetails';
import Razorpay from 'razorpay';

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

        if (order.paymentStatus !== 'success' || !order.paymentId) {
            return NextResponse.json({ error: 'No successful payment found to refund' }, { status: 400 });
        }

        const details = await CompanyDetails.findOne();
        if (!details || !details.paymentGateway?.keyId || !details.paymentGateway?.keySecret) {
            return NextResponse.json({ error: 'Payment gateway not configured' }, { status: 400 });
        }

        const razorpay = new Razorpay({
            key_id: details.paymentGateway.keyId,
            key_secret: details.paymentGateway.keySecret,
        });

        console.log('[Refund] Attempting refund for payment ID:', order.paymentId);
        console.log('[Refund] Amount:', order.totalAmount);

        // Fetch payment details from Razorpay to verify it's captured
        try {
            const payment = await razorpay.payments.fetch(order.paymentId);
            console.log('[Refund] Payment status:', payment.status);
            console.log('[Refund] Payment captured:', payment.captured);

            if (!payment.captured || payment.status !== 'captured') {
                console.error('[Refund] Payment not captured. Status:', payment.status);

                // Try to capture it now if it's still authorized
                if (payment.status === 'authorized') {
                    console.log('[Refund] Attempting to capture payment before refund...');
                    try {
                        const captureResponse = await razorpay.payments.capture(
                            order.paymentId,
                            order.totalAmount * 100,
                            'INR'
                        );
                        console.log('[Refund] Payment captured successfully:', captureResponse.id);
                    } catch (captureErr: any) {
                        console.error('[Refund] Capture failed:', captureErr);
                        return NextResponse.json({
                            error: 'Cannot refund: Payment capture failed - ' + (captureErr.error?.description || captureErr.message)
                        }, { status: 400 });
                    }
                } else {
                    return NextResponse.json({
                        error: `Cannot refund: Payment status is '${payment.status}', not 'captured'`
                    }, { status: 400 });
                }
            }
        } catch (fetchErr: any) {
            console.error('[Refund] Failed to fetch payment:', fetchErr);
            // Continue with refund attempt - payment might still be valid
        }

        // 1. Trigger Razorpay Refund
        let refundProcessed = false;
        try {
            const refundResponse = await razorpay.payments.refund(order.paymentId, {
                amount: order.totalAmount * 100, // full refund in paise
                notes: {
                    orderId: order.orderId,
                    reason: order.cancellationRequest?.reason || 'Approved by admin'
                }
            });
            console.log('[Refund] Razorpay refund successful:', refundResponse);
            refundProcessed = true;
        } catch (rzpErr: any) {
            console.error('[Refund] Razorpay Error:', rzpErr);
            console.error('[Refund] Error details:', JSON.stringify(rzpErr, null, 2));

            // If Razorpay fails, we'll still mark the order as cancelled
            // but note that manual refund is needed
            console.log('[Refund] Proceeding with manual refund process');
        }

        // 2. Update Order Status
        order.status = 'cancelled';
        order.paymentStatus = refundProcessed ? 'refunded' : 'refund_pending';
        if (order.cancellationRequest) {
            order.cancellationRequest.status = 'approved';
            order.cancellationRequest.processedAt = new Date();
        }

        await order.save();

        const message = refundProcessed
            ? 'Refund processed successfully and order cancelled'
            : 'Order cancelled. Razorpay refund failed - manual refund required';

        return NextResponse.json({
            success: true,
            message,
            manualRefundRequired: !refundProcessed
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
