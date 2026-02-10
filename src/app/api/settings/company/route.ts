
import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import CompanyDetails from '@/models/CompanyDetails';

export async function GET() {
    await connectToDatabase();
    try {
        let details = await CompanyDetails.findOne();
        if (!details) {
            details = await CompanyDetails.create({});
        }
        return NextResponse.json(details);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    await connectToDatabase();
    try {
        const body = await req.json();
        // Use findOneAndUpdate with upsert to ensure we always update the single doc
        const details = await CompanyDetails.findOneAndUpdate({}, body, {
            new: true,
            upsert: true,
            runValidators: true,
            setDefaultsOnInsert: true,
        });
        return NextResponse.json(details);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
