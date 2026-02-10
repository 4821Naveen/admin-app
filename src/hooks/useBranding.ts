'use client';

import { useEffect, useState } from 'react';

export function useBranding(defaultTitle: string = 'Admin Panel') {
    const [branding, setBranding] = useState({
        name: '',
        logo: '',
        loading: true
    });

    useEffect(() => {
        fetch('/api/settings/company')
            .then(res => res.json())
            .then(data => {
                if (data && !data.error) {
                    setBranding({
                        name: data.name,
                        logo: data.logo,
                        loading: false
                    });

                    // Update Title
                    if (data.name) {
                        document.title = `${data.name} - ${defaultTitle}`;
                    }

                    // Update Favicon
                    if (data.logo) {
                        const link: HTMLLinkElement = document.querySelector("link[rel*='icon']") || document.createElement('link');
                        link.type = 'image/x-icon';
                        link.rel = 'shortcut icon';
                        link.href = data.logo;
                        document.getElementsByTagName('head')[0].appendChild(link);
                    }
                }
            })
            .catch(err => {
                console.error('Failed to load branding:', err);
                setBranding(prev => ({ ...prev, loading: false }));
            });
    }, [defaultTitle]);

    return branding;
}
