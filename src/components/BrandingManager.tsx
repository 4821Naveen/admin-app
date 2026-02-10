'use client';

import { useBranding } from '@/hooks/useBranding';

export default function BrandingManager({ defaultTitle }: { defaultTitle: string }) {
    useBranding(defaultTitle);
    return null;
}
