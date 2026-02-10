
'use client';

import { useEffect } from 'react';
import gsap from 'gsap';

export default function Template({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        gsap.to('#page-transition', { opacity: 1, duration: 0.5, ease: 'power2.out' });
    }, []);

    return (
        <div id="page-transition" className="opacity-0">
            {children}
        </div>
    );
}
