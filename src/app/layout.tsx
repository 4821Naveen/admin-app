
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { clsx } from 'clsx';
import BrandingManager from '@/components/BrandingManager';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Admin Panel',
  description: 'E-Commerce Admin Dashboard',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <BrandingManager defaultTitle="Admin Panel" />
      <body className={clsx(inter.className, "bg-gray-50 text-gray-900 antialiased")}>
        {children}
      </body>
    </html>
  );
}
