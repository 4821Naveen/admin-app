
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICompanyDetails extends Document {
    name: string;
    logoUrl?: string;
    mobile: string;
    email: string;
    address: string;
    gstNumber?: string;
    fssaiNumber?: string;
    socialLinks?: Record<string, string>;
    paymentGateway?: {
        provider: string;
        isActive: boolean;
        keyId?: string;
        keySecret?: string;
    };
}

const CompanyDetailsSchema: Schema = new Schema({
    name: { type: String, required: true, default: 'My Shop' },
    logoUrl: { type: String },
    mobile: { type: String },
    email: { type: String },
    address: { type: String },
    gstNumber: { type: String },
    fssaiNumber: { type: String },
    socialLinks: { type: Map, of: String },
    paymentGateway: {
        provider: { type: String, default: 'Razorpay' },
        isActive: { type: Boolean, default: false },
        keyId: { type: String },
        keySecret: { type: String }
    }
}, { timestamps: true });

const CompanyDetails: Model<ICompanyDetails> = mongoose.models.CompanyDetails || mongoose.model<ICompanyDetails>('CompanyDetails', CompanyDetailsSchema);

export default CompanyDetails;
