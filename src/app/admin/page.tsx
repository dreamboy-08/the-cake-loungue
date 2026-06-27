"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '@/utils/firebase';
import {
  collection,
  query,
  onSnapshot,
  orderBy,
  limit,
} from 'firebase/firestore';
import {
  Package,
  Tags,
  ShoppingBag,
  Users,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  TrendingUp,
  IndianRupee,
  Calendar,
  ArrowRight,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';

const AdminDashboard = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalOrders: 0,
    totalCustomers: 0,
    todayOrders: 0,
    pendingOrders: 0,
    confirmedOrders: 0,
    deliveredOrders: 0,
    cancelledOrders: 0,
    revenueToday: 0,
    revenueWeek: 0,
    revenueMonth: 0,
    totalRevenue: 0
  });

  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [recentCustomers, setRecentCustomers] = useState<any[]>([]);

  useEffect(() => {
    // Products listener
    const unsubProducts = onSnapshot(collection(db, 'products'), (snapshot) => {
      setStats(prev => ({ ...prev, totalProducts: snapshot.size }));
    });

    // Categories listener
    const unsubCategories = onSnapshot(collection(db, 'categories'), (snapshot) => {
      setStats(prev => ({ ...prev, totalCategories: snapshot.size }));
    });

    // Users listener
    const unsubUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
      setStats(prev => ({ ...prev, totalCustomers: snapshot.size }));
    });

    // Recent Customers
    const qRecentUsers = query(collection(db, 'users'), orderBy('createdAt', 'desc'), limit(5));
    const unsubRecentUsers = onSnapshot(qRecentUsers, (snapshot) => {
      setRecentCustomers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    // Orders listener
    const unsubOrders = onSnapshot(collection(db, 'orders'), (snapshot) => {
      const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as any }));

      let todayCount = 0;
      let pending = 0;
      let confirmed = 0;
      let delivered = 0;
      let cancelled = 0;
      let revToday = 0;
      let revWeek = 0;
      let revMonth = 0;
      let revTotal = 0;

      const now = new Date();
      const todayStart = new Date(now.setHours(0, 0, 0, 0)).getTime();

      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      weekStart.setHours(0, 0, 0, 0);
      const weekStartTime = weekStart.getTime();

      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      monthStart.setHours(0, 0, 0, 0);
      const monthStartTime = monthStart.getTime();

      orders.forEach(order => {
        const orderDate = new Date(order.createdAt).getTime();
        const amount = Number(order.totalAmount) || 0;
        const status = order.status?.toLowerCase();

        if (status === 'pending') pending++;
        else if (status === 'confirmed') confirmed++;
        else if (status === 'delivered') delivered++;
        else if (status === 'cancelled') cancelled++;

        if (orderDate >= todayStart) {
          todayCount++;
          if (status !== 'cancelled') revToday += amount;
        }

        if (status !== 'cancelled') {
          revTotal += amount;
          if (orderDate >= weekStartTime) revWeek += amount;
          if (orderDate >= monthStartTime) revMonth += amount;
        }
      });

      setStats(prev => ({
        ...prev,
        totalOrders: snapshot.size,
        todayOrders: todayCount,
        pendingOrders: pending,
        confirmedOrders: confirmed,
        deliveredOrders: delivered,
        cancelledOrders: cancelled,
        revenueToday: revToday,
        revenueWeek: revWeek,
        revenueMonth: revMonth,
        totalRevenue: revTotal
      }));

      const sortedOrders = [...orders].sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ).slice(0, 5);
      setRecentOrders(sortedOrders);

      setLoading(false);
    });

    return () => {
      unsubProducts();
      unsubCategories();
      unsubUsers();
      unsubOrders();
      unsubRecentUsers();
    };
  }, []);

  const statCards = [
    { label: 'Total Products', value: stats.totalProducts, icon: <Package size={24} />, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Categories', value: stats.totalCategories, icon: <Tags size={24} />, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Total Orders', value: stats.totalOrders, icon: <ShoppingBag size={24} />, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Total Customers', value: stats.totalCustomers, icon: <Users size={24} />, color: 'text-green-600', bg: 'bg-green-50' },
  ];

  const orderStats = [
    { label: 'Today', value: stats.todayOrders, icon: <Calendar size={18} />, color: 'text-chocolate' },
    { label: 'Pending', value: stats.pendingOrders, icon: <Clock size={18} />, color: 'text-orange-500' },
    { label: 'Confirmed', value: stats.confirmedOrders, icon: <CheckCircle2 size={18} />, color: 'text-blue-500' },
    { label: 'Delivered', value: stats.deliveredOrders, icon: <Truck size={18} />, color: 'text-green-500' },
    { label: 'Cancelled', value: stats.cancelledOrders, icon: <XCircle size={18} />, color: 'text-red-500' },
  ];

  const revenueStats = [
    { label: "Today's Revenue", value: `₹${stats.revenueToday.toLocaleString()}`, icon: <TrendingUp size={20} />, color: 'text-green-600' },
    { label: 'This Week', value: `₹${stats.revenueWeek.toLocaleString()}`, icon: <TrendingUp size={20} />, color: 'text-blue-600' },
    { label: 'This Month', value: `₹${stats.revenueMonth.toLocaleString()}`, icon: <TrendingUp size={20} />, color: 'text-purple-600' },
    { label: 'Total Revenue', value: `₹${stats.totalRevenue.toLocaleString()}`, icon: <IndianRupee size={20} />, color: 'text-chocolate' },
  ];

  return (
    <div className="space-y-8 pb-12 animate-fade-up">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-playfair font-bold text-chocolate">Dashboard Overview</h1>
          <p className="text-gray-500 mt-1">Real-time performance and store activity.</p>
        </div>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl shadow-sm border border-gray-100 text-xs font-bold text-chocolate uppercase tracking-widest">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          Live Analytics
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.bg} ${stat.color} p-3 rounded-2xl transition-transform group-hover:scale-110`}>
                {stat.icon}
              </div>
              <ArrowRight size={18} className="text-gray-300 group-hover:text-chocolate group-hover:translate-x-1 transition-all" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">{stat.label}</span>
              <span className="text-3xl font-black text-chocolate mt-1">{loading ? '...' : stat.value}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-chocolate mb-8 flex items-center gap-2">
              <IndianRupee size={24} className="text-rose-deep" />
              Revenue Breakdown
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {revenueStats.map((rev, i) => (
                <div key={i} className="bg-gray-50 p-6 rounded-3xl border border-gray-100 flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{rev.label}</p>
                    <p className={`text-2xl font-black ${rev.color}`}>{loading ? '...' : rev.value}</p>
                  </div>
                  <div className={`${rev.color} bg-white p-3 rounded-2xl shadow-sm`}>
                    {rev.icon}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-8 border-b border-gray-50 flex items-center justify-between">
              <h2 className="text-xl font-bold text-chocolate flex items-center gap-2">
                <ShoppingBag size={24} className="text-rose-deep" />
                Recent Orders
              </h2>
              <Link href="/admin/orders" className="text-sm font-bold text-rose-deep hover:underline">View All</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50/50">
                    <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Order ID</th>
                    <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Customer</th>
                    <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                    <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {loading ? (
                    <tr><td colSpan={4} className="px-8 py-12 text-center text-gray-400">Loading...</td></tr>
                  ) : recentOrders.length === 0 ? (
                    <tr><td colSpan={4} className="px-8 py-12 text-center text-gray-400">No orders yet.</td></tr>
                  ) : (
                    recentOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50/50 transition-colors cursor-pointer" onClick={() => router.push('/admin/orders')}>
                        <td className="px-8 py-4">
                          <span className="font-mono text-[10px] font-bold text-rose-deep bg-cream-dark px-2 py-1 rounded">#{order.id.slice(-8).toUpperCase()}</span>
                        </td>
                        <td className="px-8 py-4">
                          <div className="flex flex-col">
                            <span className="font-bold text-chocolate text-sm">{order.customer?.name || 'Guest'}</span>
                            <span className="text-[10px] text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</span>
                          </div>
                        </td>
                        <td className="px-8 py-4">
                          <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${
                            order.status?.toLowerCase() === 'delivered' ? 'bg-green-100 text-green-600' :
                            order.status?.toLowerCase() === 'pending' ? 'bg-orange-100 text-orange-600' :
                            'bg-blue-100 text-blue-600'
                          }`}>
                            {order.status || 'Pending'}
                          </span>
                        </td>
                        <td className="px-8 py-4 text-right font-bold text-chocolate">₹{order.totalAmount}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-chocolate mb-6 flex items-center gap-2">
              <Clock size={24} className="text-rose-deep" />
              Order Activity
            </h2>
            <div className="space-y-4">
              {orderStats.map((stat, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className={`${stat.color} bg-white p-2 rounded-xl shadow-sm`}>
                      {stat.icon}
                    </div>
                    <span className="text-sm font-bold text-gray-500">{stat.label}</span>
                  </div>
                  <span className="text-lg font-black text-chocolate">{loading ? '...' : stat.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-chocolate mb-6 flex items-center gap-2">
              <Users size={24} className="text-rose-deep" />
              New Customers
            </h2>
            <div className="space-y-4">
              {loading ? (
                <p className="text-center text-gray-400 py-4">Loading...</p>
              ) : recentCustomers.length === 0 ? (
                <p className="text-center text-gray-400 py-4">No customers yet.</p>
              ) : (
                recentCustomers.map((customer) => (
                  <div key={customer.id} className="flex items-center justify-between group cursor-pointer" onClick={() => router.push('/admin/customers')}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-cream-dark border border-rose/10 flex items-center justify-center text-rose-deep font-bold">
                        {customer.displayName?.[0] || customer.email?.[0] || 'U'}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-chocolate group-hover:text-rose-deep transition-colors">{customer.displayName || 'Guest'}</span>
                        <span className="text-[10px] text-gray-400">{new Date(customer.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-gray-300 group-hover:text-chocolate transition-colors" />
                  </div>
                ))
              )}
            </div>
            <button
              onClick={() => router.push('/admin/customers')}
              className="w-full mt-6 py-3 rounded-2xl bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-widest hover:bg-chocolate hover:text-white transition-all"
            >
              View All Customers
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
