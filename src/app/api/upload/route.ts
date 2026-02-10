
import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function POST(req: Request) {
    try {
        const data = await req.formData();
        const file: File | null = data.get('file') as unknown as File;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Create unique filename
        const filename = `${Date.now()}-${file.name.replace(/\s/g, '-')}`;

        // Save to public/uploads
        // Note: In production Vercel/Netlify, this won't persist. Cloudinary is needed.
        // But for local dev (which is the user's current context), this works perfectly.
        const uploadDir = path.join(process.cwd(), 'public/uploads');
        const filePath = path.join(uploadDir, filename);

        await writeFile(filePath, buffer);

        // Return the URL
        const fileUrl = `/uploads/${filename}`;

        return NextResponse.json({ url: fileUrl });

    } catch (error: any) {
        console.error('Upload Error:', error);
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }
}
