
import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';

export async function GET() {
    try {
        await connectToDatabase();
        return NextResponse.json({ status: 'ok', message: 'Database connected successfully' });
    } catch (error: any) {
        return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
    }
}
