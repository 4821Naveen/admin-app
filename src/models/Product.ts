
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProduct extends Document {
    name: string;
    description: string;
    price: number;
    offerPrice?: number;
    images: string[];
    category: string;
    isActive: boolean;
    showInSlider: boolean;
    isBuyNowEnabled: boolean;
    stock: number;
    createdAt: Date;
    updatedAt: Date;
}

const ProductSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        description: { type: String, required: true },
        price: { type: Number, required: true },
        offerPrice: { type: Number },
        images: { type: [String], default: [] },
        category: { type: String, required: true },
        isActive: { type: Boolean, default: true },
        showInSlider: { type: Boolean, default: false },
        isBuyNowEnabled: { type: Boolean, default: true },
        stock: { type: Number, default: 0 },
    },
    { timestamps: true }
);

const Product: Model<IProduct> =
    mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

export default Product;
