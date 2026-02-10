
'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface AnimationWrapperProps {
    children: React.ReactNode;
    animation?: 'fade-up' | 'fade-in' | 'scale-up' | 'slide-in';
    delay?: number;
    duration?: number;
    className?: string;
    stagger?: number;
}

export default function AnimationWrapper({
    children,
    animation = 'fade-up',
    delay = 0,
    duration = 0.6,
    className = '',
    stagger = 0,
}: AnimationWrapperProps) {
    const comp = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const element = comp.current;

            let fromVars: gsap.TweenVars = { opacity: 0, duration: duration, delay: delay, ease: 'power3.out' };

            switch (animation) {
                case 'fade-up':
                    fromVars = { ...fromVars, y: 30 };
                    break;
                case 'slide-in':
                    fromVars = { ...fromVars, x: -30 };
                    break;
                case 'scale-up':
                    fromVars = { ...fromVars, scale: 0.9 };
                    break;
                case 'fade-in':
                default:
                    break;
            }

            gsap.from(element, {
                ...fromVars,
                scrollTrigger: {
                    trigger: element,
                    start: 'top 85%', // Trigger when top of element hits 85% of viewport height
                    toggleActions: 'play none none reverse',
                },
            });
        }, comp);

        return () => ctx.revert();
    }, [animation, delay, duration]);

    return (
        <div ref={comp} className={className}>
            {children}
        </div>
    );
}
