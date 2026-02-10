
import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Admin from '@/models/Admin';

export async function POST(req: Request) {
    await connectToDatabase();
    try {
        const { username, password } = await req.json();

        // 1. Super Admin Bypass
        const superEmail = process.env.SUPER_ADMIN_EMAIL;
        const superPass = process.env.SUPER_ADMIN_PASSWORD;

        if (superEmail && superPass && username === superEmail && password === superPass) {
             const response = NextResponse.json({ success: true, role: 'super_admin' });
             response.cookies.set('admin_token', 'super-admin-token', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 86400 // 1 day
            });
            return response;
        }

        // Check for hardcoded fallback first (for easy setup)
        if (username === 'admin' && password === 'admin123') {
            const response = NextResponse.json({ success: true });
            response.cookies.set('admin_token', 'logged-in', { httpOnly: true });
            return response;
        }

        const admin = await Admin.findOne({ username });
        if (!admin || admin.passwordHash !== password) { // In production use bcrypt
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        const response = NextResponse.json({ success: true });
        response.cookies.set('admin_token', 'logged-in', { httpOnly: true });
        return response;

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
