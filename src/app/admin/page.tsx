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
  getCountFromServer,
  where,
  Timestamp,
  getDocs
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
  ChevronRight,
  Loader2
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
    const fetchInitialStats = async () => {
      try {
        const productsCount = await getCountFromServer(collection(db, 'products'));
        const categoriesCount = await getCountFromServer(collection(db, 'categories'));
        const usersCount = await getCountFromServer(collection(db, 'users'));
        const ordersCount = await getCountFromServer(collection(db, 'orders'));

        setStats(prev => ({
          ...prev,
          totalProducts: productsCount.data().count,
          totalCategories: categoriesCount.data().count,
          totalCustomers: usersCount.data().count,
          totalOrders: ordersCount.data().count,
        }));

        // Fetch detailed status counts and revenue
        // For production, these would ideally be in a summary document updated by Cloud Functions.
        // As a client-side fallback, we fetch recent orders for calculations.
        const now = new Date();
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

        const qRecent = query(
          collection(db, 'orders'),
          where('createdAt', '>=', monthStart.toISOString()),
          orderBy('createdAt', 'desc')
        );

        const snapshot = await getDocs(qRecent);
        const monthOrders = snapshot.docs.map(doc => doc.data());

        let todayCount = 0;
        let pending = 0;
        let confirmed = 0;
        let delivered = 0;
        let cancelled = 0;
        let revToday = 0;
        let revWeek = 0;
        let revMonth = 0;

        const todayStart = new Date(now.setHours(0, 0, 0, 0)).getTime();
        const weekStart = new Date();
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());
        weekStart.setHours(0, 0, 0, 0);
        const weekStartTime = weekStart.getTime();

        monthOrders.forEach((order: any) => {
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
            revMonth += amount;
            if (orderDate >= weekStartTime) revWeek += amount;
          }
        });

        setStats(prev => ({
          ...prev,
          todayOrders: todayCount,
          pendingOrders: pending,
          confirmedOrders: confirmed,
          deliveredOrders: delivered,
          cancelledOrders: cancelled,
          revenueToday: revToday,
          revenueWeek: revWeek,
          revenueMonth: revMonth,
        }));

      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialStats();

    // Optimized Live listener: Only fetch recent/relevant orders for live stats
    // Historical stats are fetched once in fetchInitialStats
    const qRecentOrdersSync = query(collection(db, 'orders'), orderBy('createdAt', 'desc'), limit(50));
    const unsubOrders = onSnapshot(qRecentOrdersSync, (snapshot) => {
      const recentOrdersList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Update Recent Orders UI (Top 5)
      setRecentOrders(recentOrdersList.slice(0, 5));

      // Update TODAY'S stats in real-time
      const now = new Date();
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const todayStartTime = todayStart.getTime();

      let todayCount = 0;
      let revToday = 0;

      recentOrdersList.forEach((order: any) => {
        const orderDate = new Date(order.createdAt).getTime();
        const amount = Number(order.totalAmount) || 0;
        const status = order.status?.toLowerCase();

        if (orderDate >= todayStartTime) {
          todayCount++;
          if (status !== 'cancelled') revToday += amount;
        }
      });

      setStats(prev => ({
        ...prev,
        todayOrders: todayCount,
        revenueToday: revToday,
        // For other stats, we could either re-fetch or assume fetchInitialStats is sufficient
        // In a real production app, we'd use a summary document.
      }));
    });

    const qRecentUsers = query(collection(db, 'users'), orderBy('createdAt', 'desc'), limit(5));
    const unsubRecentUsers = onSnapshot(qRecentUsers, (snapshot) => {
      setRecentCustomers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => {
      unsubOrders();
      unsubRecentUsers();
    };
  }, []);

  const statCards = [
    { label: 'Total Products', value: stats.totalProducts, icon: <Package size={24} />, color: 'text-blue-600', bg: 'bg-blue-50', link: '/admin/products' },
    { label: 'Total Categories', value: stats.totalCategories, icon: <Tags size={24} />, color: 'text-purple-600', bg: 'bg-purple-50', link: '/admin/categories' },
    { label: 'Total Orders', value: stats.totalOrders, icon: <ShoppingBag size={24} />, color: 'text-orange-600', bg: 'bg-orange-50', link: '/admin/orders' },
    { label: 'Total Customers', value: stats.totalCustomers, icon: <Users size={24} />, color: 'text-green-600', bg: 'bg-green-50', link: '/admin/customers' },
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
  ];

  if (loading && stats.totalProducts === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="animate-spin text-rose-deep" size={48} />
        <p className="text-chocolate font-bold animate-pulse uppercase tracking-widest text-sm">Initialising Dashboard...</p>
      </div>
    );
  }

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
          <div
            key={i}
            onClick={() => router.push(stat.link)}
            className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-all group cursor-pointer"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.bg} ${stat.color} p-3 rounded-2xl transition-transform group-hover:scale-110`}>
                {stat.icon}
              </div>
              <ArrowRight size={18} className="text-gray-300 group-hover:text-chocolate group-hover:translate-x-1 transition-all" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">{stat.label}</span>
              <span className="text-3xl font-black text-chocolate mt-1">{stat.value}</span>
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {revenueStats.map((rev, i) => (
                <div key={i} className="bg-gray-50 p-6 rounded-3xl border border-gray-100 flex flex-col gap-4">
                   <div className={`${rev.color} bg-white p-3 rounded-2xl shadow-sm w-fit`}>
                    {rev.icon}
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{rev.label}</p>
                    <p className={`text-2xl font-black ${rev.color}`}>{rev.value}</p>
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
                    <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Status</th>
                    <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {recentOrders.length === 0 ? (
                    <tr><td colSpan={4} className="px-8 py-12 text-center text-gray-400 font-bold uppercase tracking-widest text-xs">No orders yet.</td></tr>
                  ) : (
                    recentOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50/50 transition-colors cursor-pointer" onClick={() => router.push('/admin/orders')}>
                        <td className="px-8 py-4">
                          <span className="font-mono text-[10px] font-bold text-rose-deep bg-cream-dark px-2 py-1 rounded">#{order.id.slice(-8).toUpperCase()}</span>
                        </td>
                        <td className="px-8 py-4">
                          <div className="flex flex-col">
                            <span className="font-bold text-chocolate text-sm leading-tight">{order.customerName || order.customer?.name || 'Guest'}</span>
                            <span className="text-[10px] text-gray-400 mt-1">{new Date(order.createdAt).toLocaleDateString()}</span>
                          </div>
                        </td>
                        <td className="px-8 py-4 text-center">
                          <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider ${
                            order.status?.toLowerCase() === 'delivered' ? 'bg-green-100 text-green-600' :
                            order.status?.toLowerCase() === 'pending' ? 'bg-orange-100 text-orange-600' :
                            'bg-blue-100 text-blue-600'
                          }`}>
                            {order.status || 'Pending'}
                          </span>
                        </td>
                        <td className="px-8 py-4 text-right font-black text-chocolate">₹{order.totalAmount}</td>
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
                <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 border border-gray-100 group hover:border-rose-deep/30 transition-all">
                  <div className="flex items-center gap-3">
                    <div className={`${stat.color} bg-white p-2.5 rounded-xl shadow-sm transition-transform group-hover:scale-110`}>
                      {stat.icon}
                    </div>
                    <span className="text-sm font-bold text-gray-500">{stat.label}</span>
                  </div>
                  <span className="text-lg font-black text-chocolate">{stat.value}</span>
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
              {recentCustomers.length === 0 ? (
                <p className="text-center text-gray-400 py-8 font-bold uppercase tracking-widest text-[10px]">No customers yet.</p>
              ) : (
                recentCustomers.map((customer) => (
                  <div key={customer.id} className="flex items-center justify-between group cursor-pointer" onClick={() => router.push('/admin/customers')}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-cream-dark border border-rose/10 flex items-center justify-center text-rose-deep font-bold">
                        {customer.displayName?.[0] || customer.email?.[0] || 'U'}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-chocolate group-hover:text-rose-deep transition-colors leading-tight">{customer.displayName || 'Guest'}</span>
                        <span className="text-[10px] text-gray-400 mt-0.5">{new Date(customer.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-gray-300 group-hover:text-chocolate transition-colors" />
                  </div>
                ))
              )}
            </div>
            <button
              onClick={() => router.push('/admin/customers')}
              className="w-full mt-8 py-3.5 rounded-2xl bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-widest hover:bg-chocolate hover:text-white transition-all shadow-sm border border-gray-100"
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
