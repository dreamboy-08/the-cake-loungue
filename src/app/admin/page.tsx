"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '@/utils/firebase';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';

const AdminDashboard = () => {
  const router = useRouter();
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    orders: 0,
    revenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [prodSnap, catSnap, orderSnap] = await Promise.all([
          getDocs(collection(db, 'products')),
          getDocs(collection(db, 'categories')),
          getDocs(collection(db, 'orders'))
        ]);

        const orders = orderSnap.docs.map(doc => doc.data());
        const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

        setStats({
          products: prodSnap.size,
          categories: catSnap.size,
          orders: orderSnap.size,
          revenue: totalRevenue
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-playfair font-bold text-chocolate">Dashboard Overview</h1>
        <p className="text-gray-500 mt-1">Welcome back to your store management.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Products', value: stats.products.toString(), sub: 'In catalog', color: 'bg-blue-500' },
          { label: 'Categories', value: stats.categories.toString(), sub: 'Active categories', color: 'bg-purple-500' },
          { label: 'Recent Orders', value: stats.orders.toString(), sub: 'Lifetime total', color: 'bg-orange-500' },
          { label: 'Total Revenue', value: `₹${stats.revenue.toLocaleString()}`, sub: 'Lifetime total', color: 'bg-green-500' },
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
              className="flex flex-col items-center justify-center p-4 rounded-xl border border-dashed border-gray-200 hover:border-rose-deep hover:bg-rose/5 transition-all text-gray-500 hover:text-rose-deep"
            >
              <span className="text-sm font-medium">Add Product</span>
            </button>
            <button
              onClick={() => router.push('/admin/categories')}
              className="flex flex-col items-center justify-center p-4 rounded-xl border border-dashed border-gray-200 hover:border-rose-deep hover:bg-rose/5 transition-all text-gray-500 hover:text-rose-deep"
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
