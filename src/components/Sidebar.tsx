
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    CreditCard,
    Settings,
    FileText,
    Menu,
    X
} from 'lucide-react';
import { clsx } from 'clsx';
import { useBranding } from '@/hooks/useBranding';

const navItems = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Products', href: '/products', icon: Package },
    { name: 'Orders', href: '/orders', icon: ShoppingCart },
    { name: 'Payments', href: '/payments', icon: CreditCard },
    { name: 'Invoices', href: '/invoices', icon: FileText },
    { name: 'Settings', href: '/settings', icon: Settings },
];

export default function Sidebar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const { name, logo } = useBranding('Admin Panel');

    const toggleSidebar = () => setIsOpen(!isOpen);

    return (
        <>
            {/* ... */}
            <aside className={clsx(
                "bg-white h-screen fixed left-0 top-0 border-r border-gray-200 w-64 z-40 transition-transform duration-300 ease-in-out md:translate-x-0 overflow-y-auto",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="p-6 border-b border-gray-100 flex items-center gap-3">
                    {logo ? (
                        <img src={logo} alt={name} className="w-8 h-8 object-contain" />
                    ) : null}
                    <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent truncate">
                        {name || 'Admin Panel'}
                    </h1>
                </div>

                <nav className="p-4 space-y-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        // Check direct match or if it's a sub-route (but not just '/')
                        const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setIsOpen(false)}
                                className={clsx(
                                    'flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium',
                                    isActive
                                        ? 'bg-blue-50 text-blue-600 shadow-sm'
                                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                                )}
                            >
                                <Icon size={20} className={isActive ? "stroke-[2.5px]" : "stroke-[2px]"} />
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100 bg-gray-50/50">
                    <div className="flex items-center gap-3 px-2">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs">
                            AD
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">Administrator</p>
                            <p className="text-xs text-gray-500 truncate">admin@shop.com</p>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}
