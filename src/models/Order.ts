
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IOrder extends Document {
    orderId: string;
    customer: {
        name: string;
        mobile: string;
        email?: string;
        address: string;
    };
    products: {
        productId: mongoose.Types.ObjectId;
        name: string;
        price: number;
        quantity: number;
    }[];
    totalAmount: number;
    status: 'placed' | 'confirmed' | 'packed' | 'shipped' | 'delivered' | 'cancelled';
    paymentStatus: 'pending' | 'success' | 'failed' | 'refunded' | 'refund_pending';
    paymentId?: string;
    dates: {
        bookingDate: Date;
        preferredDeliveryDate?: Date;
        confirmedDate?: Date;
        packedDate?: Date;
        shippedDate?: Date;
        deliveredDate?: Date;
    };
    cancellationRequest?: {
        requested: boolean;
        reason: string;
        status: 'pending' | 'approved' | 'rejected';
        requestedAt?: Date;
        processedAt?: Date;
    };
    createdAt: Date;
    updatedAt: Date;
}

const OrderSchema: Schema = new Schema(
    {
        orderId: { type: String, required: true, unique: true },
        customer: {
            userId: { type: String },
            name: { type: String, required: true },
            mobile: { type: String, required: true },
            email: { type: String },
            address: { type: String, required: true },
        },
        products: [
            {
                productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
                name: String,
                price: Number,
                quantity: Number,
            },
        ],
        totalAmount: { type: Number, required: true },
        status: {
            type: String,
            enum: ['placed', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled'],
            default: 'placed',
        },
        paymentStatus: {
            type: String,
            enum: ['pending', 'success', 'failed', 'refunded', 'refund_pending'],
            default: 'pending',
        },
        paymentId: { type: String },
        dates: {
            bookingDate: { type: Date, default: Date.now },
            preferredDeliveryDate: Date,
            confirmedDate: Date,
            packedDate: Date,
            shippedDate: Date,
            deliveredDate: Date,
        },
        cancellationRequest: {
            requested: { type: Boolean, default: false },
            reason: String,
            status: {
                type: String,
                enum: ['pending', 'approved', 'rejected'],
            },
            requestedAt: Date,
            processedAt: Date,
        },
    },
    { timestamps: true }
);

const Order: Model<IOrder> =
    mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);

export default Order;
