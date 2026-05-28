"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/utils/firebase';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { ShoppingBag, Package, Calendar, ChevronRight, Loader2, Search, CreditCard, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const OrdersPage = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const q = query(
          collection(db, 'orders'),
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(q);
        setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const filteredOrders = orders.filter(o =>
    o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.items.some((item: any) => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'confirmed': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'preparing': return 'bg-yellow-50 text-yellow-600 border-yellow-100';
      case 'out for delivery': return 'bg-purple-50 text-purple-600 border-purple-100';
      case 'delivered': return 'bg-green-50 text-green-600 border-green-100';
      case 'cancelled': return 'bg-red-50 text-red-600 border-red-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="pt-32 pb-20 bg-cream min-h-screen flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-rose-deep" size={40} />
        <p className="text-chocolate font-medium">Fetching your orders...</p>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 bg-cream min-h-screen">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-bold font-playfair text-chocolate mb-2">Order History</h1>
            <p className="text-text-soft">Manage and track your recent cake orders.</p>
          </div>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-soft" size={18} />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-6 py-3 bg-white rounded-full border border-cream shadow-sm outline-none focus:border-rose-deep w-full md:w-64 transition-all"
            />
          </div>
        </div>

        <div className="space-y-6">
          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-cream">
              <div className="w-20 h-20 bg-cream rounded-full flex items-center justify-center mx-auto mb-6 text-rose/30">
                <ShoppingBag size={40} />
              </div>
              <h3 className="text-xl font-bold text-chocolate mb-2">No orders found</h3>
              <p className="text-text-soft mb-8">You haven't placed any orders yet.</p>
              <Link
                href="/menu"
                className="inline-block bg-rose-deep text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-brown transition-all"
              >
                Explore Menu
              </Link>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[40px] p-6 md:p-8 shadow-sm border border-cream hover:shadow-md transition-shadow relative overflow-hidden"
              >
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-6 border-b border-cream/50">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-rose/5 rounded-2xl flex items-center justify-center text-rose-deep">
                      <Package size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-text-soft uppercase tracking-widest">Order ID</p>
                      <p className="font-mono font-bold text-chocolate">#{order.id.slice(-8).toUpperCase()}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(order.status)}`}>
                      {order.status}
                    </div>
                    {order.paymentStatus === 'Paid' && (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-600 rounded-full text-[10px] font-bold uppercase tracking-wider border border-green-100">
                        <CheckCircle2 size={12} />
                        Paid
                      </div>
                    )}
                    <Link
                      href={`/orders/${order.id}`}
                      className="p-2 bg-cream/30 hover:bg-rose-deep hover:text-white rounded-full transition-all text-chocolate"
                    >
                      <ChevronRight size={20} />
                    </Link>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-text-soft text-sm font-medium">
                      <Calendar size={16} />
                      {new Date(order.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}
                    </div>
                    <div className="flex -space-x-3 overflow-hidden">
                      {order.items.slice(0, 4).map((item: any, idx: number) => (
                        <div key={idx} className="w-10 h-10 rounded-full border-2 border-white overflow-hidden bg-cream shadow-sm">
                          <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                      ))}
                      {order.items.length > 4 && (
                        <div className="w-10 h-10 rounded-full border-2 border-white bg-chocolate text-white text-[10px] font-bold flex items-center justify-center">
                          +{order.items.length - 4}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <p className="text-[10px] font-bold text-text-soft uppercase tracking-widest mb-2">Items Ordered</p>
                    <p className="text-sm text-chocolate font-medium leading-relaxed">
                      {order.items.map((i: any) => `${i.name} (x${i.quantity})`).join(', ')}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-[10px] font-bold text-text-soft uppercase tracking-widest mb-1">Total Amount</p>
                    <p className="text-3xl font-black text-rose-deep">₹{order.totalAmount}</p>
                    {order.paymentId && (
                      <div className="mt-2 flex items-center justify-end gap-1.5 text-[10px] text-text-soft font-mono">
                        <CreditCard size={12} />
                        {order.paymentId.slice(0, 12)}...
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
