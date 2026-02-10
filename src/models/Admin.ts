
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAdmin extends Document {
    username: string;
    passwordHash: string; // Ideally hashed, but for MVP plain or simple hash
}

const AdminSchema: Schema = new Schema({
    username: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
});

const Admin: Model<IAdmin> = mongoose.models.Admin || mongoose.model<IAdmin>('Admin', AdminSchema);

export default Admin;
