"use client";

import React from 'react';
import { useRouter } from 'next/navigation';

const AdminDashboard = () => {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-playfair font-bold text-chocolate">Dashboard Overview</h1>
        <p className="text-gray-500 mt-1">Welcome back to your store management.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Products', value: '0', sub: '+0 from last month', color: 'bg-blue-500' },
          { label: 'Categories', value: '0', sub: 'Active categories', color: 'bg-purple-500' },
          { label: 'Recent Orders', value: '0', sub: 'Pending fulfillment', color: 'bg-orange-500' },
          { label: 'Total Revenue', value: '₹0', sub: 'Last 30 days', color: 'bg-green-500' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 transition-hover duration-300 hover:shadow-md">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-400 uppercase tracking-wider">{stat.label}</span>
              <div className={`${stat.color} w-2 h-2 rounded-full`}></div>
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-bold text-chocolate">{stat.value}</span>
              <span className="text-xs text-gray-400 mt-1">{stat.sub}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-chocolate mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => router.push('/admin/products')}
              className="flex flex-col items-center justify-center p-4 rounded-xl border border-dashed border-gray-200 hover:border-rose-deep hover:bg-cream-dark transition-all text-gray-500 hover:text-rose-deep"
            >
              <span className="text-sm font-medium">Add Product</span>
            </button>
            <button
              onClick={() => router.push('/admin/categories')}
              className="flex flex-col items-center justify-center p-4 rounded-xl border border-dashed border-gray-200 hover:border-rose-deep hover:bg-cream-dark transition-all text-gray-500 hover:text-rose-deep"
            >
              <span className="text-sm font-medium">New Category</span>
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-chocolate mb-4">Recent Activity</h2>
          <div className="flex flex-col items-center justify-center h-32 text-gray-400">
            <p className="text-sm">No recent activity to show.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
