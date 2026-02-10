
'use client';

import {
  CreditCard,
  Package,
  ShoppingCart,
  Activity,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { useState, useEffect } from 'react';
import DashboardCharts from '@/components/DashboardCharts';

export default function DashboardPage() {
  const [data, setData] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalCancelledOrders: 0,
    totalCancelledAmount: 0,
    productsCount: 0,
    activenow: 0
  });

  useEffect(() => {
    fetch('/api/dashboard/stats')
      .then(res => res.json())
      .then(setData)
      .catch(console.error);
  }, []);

  const stats = [
    {
      name: 'Total Sales',
      value: `₹${data.totalSales.toLocaleString()}`,
      icon: CreditCard,
      change: 'Lifetime',
      color: 'bg-yellow-50',
      iconColor: 'text-yellow-600'
    },
    {
      name: 'Total Orders',
      value: data.totalOrders.toString(),
      icon: ShoppingCart,
      change: 'Lifetime',
      color: 'bg-slate-50',
      iconColor: 'text-slate-600'
    },
    {
      name: 'Total Cancelled',
      value: data.totalCancelledOrders.toString(),
      icon: XCircle,
      change: 'Orders',
      color: 'bg-red-50',
      iconColor: 'text-red-600'
    },
    {
      name: 'Cancelled Value',
      value: `₹${data.totalCancelledAmount.toLocaleString()}`,
      icon: AlertCircle,
      change: 'Refunded/Lost',
      color: 'bg-orange-50',
      iconColor: 'text-orange-600'
    },
    {
      name: 'Products',
      value: data.productsCount.toString(),
      icon: Package,
      change: 'In Catalog',
      color: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
  ];

  return (
    <div className="space-y-10 pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-slate-900">Dashboard Overview</h1>
          <p className="text-sm text-slate-500 font-medium">Monitoring your store's performance in real-time.</p>
        </div>
        <div className="text-sm text-green-600 flex items-center gap-2 bg-green-50 px-4 py-2 rounded-full font-black border border-green-100">
          <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></div>
          Live Operational
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.name}
              className="rounded-[28px] border border-gray-100 bg-white p-7 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="flex items-center justify-between space-y-0 pb-2">
                <p className="text-xs font-black uppercase tracking-widest text-slate-400 group-hover:text-slate-600 transition-colors">
                  {stat.name}
                </p>
                <div className={`p-3 ${stat.color} rounded-2xl transition-transform group-hover:rotate-12`}>
                  <Icon className={`h-6 w-6 ${stat.iconColor}`} />
                </div>
              </div>
              <div className="flex items-center pt-3">
                <div className="text-3xl font-black text-slate-900 tracking-tighter">{stat.value}</div>
              </div>
              <p className="text-[10px] font-black uppercase tracking-tighter text-slate-400 pt-2 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-slate-200 rounded-full"></span>
                {stat.change}
              </p>
            </div>
          );
        })}
      </div>

      <DashboardCharts />
    </div>
  );
}

