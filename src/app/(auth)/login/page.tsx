
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [creds, setCreds] = useState({ username: '', password: '' });

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(creds),
            });

            if (!res.ok) throw new Error('Login failed');

            router.push('/');
        } catch (error) {
            alert('Invalid username or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <form onSubmit={handleLogin} className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm space-y-6">
                <h1 className="text-2xl font-bold text-center">Admin Login</h1>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Username</label>
                    <input
                        className="w-full border p-2 rounded-lg"
                        value={creds.username}
                        onChange={e => setCreds({ ...creds, username: e.target.value })}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Password</label>
                    <input
                        type="password"
                        className="w-full border p-2 rounded-lg"
                        value={creds.password}
                        onChange={e => setCreds({ ...creds, password: e.target.value })}
                    />
                </div>
                <button
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 flex justify-center"
                >
                    {loading ? <Loader2 className="animate-spin" /> : 'Login'}
                </button>
            </form>
        </div>
    );
}
