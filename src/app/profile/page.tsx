"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/utils/firebase';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { User, Mail, Phone, Calendar, ShoppingBag, MapPin, ChevronRight, Loader2, LogOut, Settings } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import BackButton from '@/components/BackButton';

const ProfilePage = () => {
  const { user, userData, logout } = useAuth();
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentOrders = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const q = query(
          collection(db, 'orders'),
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc'),
          limit(3)
        );
        const snapshot = await getDocs(q);
        setRecentOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching recent orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentOrders();
  }, [user]);

  if (!user && !loading) {
    return (
      <div className="pt-32 pb-20 bg-cream min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <h2 className="text-2xl font-bold text-chocolate mb-4">Please log in</h2>
        <Link href="/login" className="bg-rose-deep text-white px-8 py-3 rounded-full font-bold shadow-lg">
          Log In / Sign Up
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 bg-cream min-h-screen">
      <div className="container mx-auto px-6 max-w-5xl">
        <BackButton fallbackRoute="/" ariaLabel="Go back to home" />
        
        <div className="grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-10">
          {/* Sidebar - Profile Card */}
          <div className="space-y-6">
            <div className="bg-white rounded-[40px] p-8 shadow-sm border border-cream overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-24 bg-chocolate" />

              <div className="relative pt-10 text-center space-y-4">
                <div className="w-24 h-24 rounded-[30px] bg-rose-deep border-4 border-white mx-auto flex items-center justify-center text-white text-3xl font-black shadow-lg">
                  {user?.displayName ? user.displayName[0].toUpperCase() : 'U'}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-chocolate font-playfair">{user?.displayName || 'Valued Member'}</h2>
                  <p className="text-xs font-bold text-rose-deep uppercase tracking-widest mt-1">Cake Lounge Member</p>
                </div>

                <div className="pt-6 space-y-4 text-left">
                  <div className="flex items-center gap-3 text-text-mid bg-cream p-3 rounded-[22px] border border-cream/50">
                    <Mail size={18} className="text-rose-deep" />
                    <span className="text-sm truncate">{user?.email}</span>
                  </div>
                  {userData?.addresses?.[0] && (
                    <div className="flex items-center gap-3 text-text-mid bg-cream p-3 rounded-[22px] border border-cream/50">
                      <Phone size={18} className="text-rose-deep" />
                      <span className="text-sm">{userData.addresses.find((a: any) => a.isDefault)?.phone || userData.addresses[0].phone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3 text-text-mid bg-cream p-3 rounded-[22px] border border-cream/50">
                    <Calendar size={18} className="text-rose-deep" />
                    <span className="text-sm">Joined {new Date(user?.metadata.creationTime || '').toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="pt-6 grid grid-cols-2 gap-3">
                  <button className="flex items-center justify-center gap-2 p-3 rounded-[22px] bg-cream text-chocolate hover:bg-cream transition-all text-sm font-bold">
                    <Settings size={18} /> Edit
                  </button>
                  <button
                    onClick={() => logout()}
                    className="flex items-center justify-center gap-2 p-3 rounded-[22px] bg-red-50 text-red-600 hover:bg-red-100 transition-all text-sm font-bold"
                  >
                    <LogOut size={18} /> Logout
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-[40px] p-8 shadow-sm border border-cream space-y-4">
              <h3 className="font-bold text-chocolate mb-2">Quick Actions</h3>
              <Link href="/orders" className="flex items-center justify-between p-4 rounded-[22px] hover:bg-cream-dark transition-all border border-transparent hover:border-rose/10 group">
                <div className="flex items-center gap-3 text-text-mid">
                  <ShoppingBag size={20} className="text-rose-deep" />
                  <span className="font-medium">My Orders</span>
                </div>
                <ChevronRight size={18} className="text-text-soft group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/checkout" className="flex items-center justify-between p-4 rounded-[22px] hover:bg-cream-dark transition-all border border-transparent hover:border-rose/10 group">
                <div className="flex items-center gap-3 text-text-mid">
                  <MapPin size={20} className="text-rose-deep" />
                  <span className="font-medium">Manage Addresses</span>
                </div>
                <ChevronRight size={18} className="text-text-soft group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Main Content - Recent Orders */}
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-chocolate font-playfair flex items-center gap-3">
                <ShoppingBag className="text-rose-deep" />
                Recent Orders
              </h3>
              <Link href="/orders" className="text-rose-deep font-bold text-sm hover:underline">View All Orders</Link>
            </div>

            {loading ? (
              <div className="bg-white rounded-[40px] p-20 flex flex-col items-center justify-center border border-cream shadow-sm">
                <Loader2 className="animate-spin text-rose-deep mb-4" size={32} />
                <p className="text-text-soft font-medium">Loading your orders...</p>
              </div>
            ) : recentOrders.length === 0 ? (
              <div className="bg-white rounded-[40px] p-12 text-center border-2 border-dashed border-cream shadow-sm">
                <div className="w-20 h-20 bg-cream rounded-full flex items-center justify-center mx-auto mb-6 text-rose/30">
                  <ShoppingBag size={40} />
                </div>
                <h3 className="text-xl font-bold text-chocolate mb-2">No orders placed yet</h3>
                <p className="text-text-soft mb-8">Start your sweet journey with Cake Lounge!</p>
                <Link
                  href="/menu"
                  className="inline-block bg-rose-deep text-white px-8 py-4 rounded-full font-bold shadow-lg hover:bg-brown transition-all"
                >
                  Browse Our Menu
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white rounded-[35px] p-6 shadow-sm border border-cream hover:shadow-md transition-all group"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="flex items-center gap-4">
                        <div className="relative w-16 h-16 rounded-[22px] bg-cream overflow-hidden">
                          <Image
                            src={order.items[0].img}
                            alt={order.items[0].name}
                            fill
                            sizes="64px"
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-bold text-chocolate">#{order.id.slice(-8).toUpperCase()}</p>
                            <span className={`px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              order.status === 'Delivered' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'
                            }`}>
                              {order.status}
                            </span>
                          </div>
                          <p className="text-xs text-text-soft">
                            {order.items.length} item{order.items.length > 1 ? 's' : ''} • ₹{order.totalAmount}
                          </p>
                          <p className="text-[10px] text-text-mid mt-1 uppercase tracking-widest font-bold">
                            {new Date(order.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                          </p>
                        </div>
                      </div>
                      <Link
                        href={`/orders/${order.id}`}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-cream rounded-[22px] text-chocolate font-bold text-sm hover:bg-rose-deep hover:text-white transition-all group"
                      >
                        Order Details
                        <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Favorite Section Placeholder */}
            <div className="bg-gradient-to-r from-chocolate to-brown rounded-[40px] p-10 text-white shadow-xl relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-2xl font-bold font-playfair mb-2">Gift a Celebration!</h3>
                <p className="text-white/70 text-sm max-w-sm mb-6">Sending a surprise to your loved ones? Add a custom message to any cake at checkout.</p>
                <Link href="/menu" className="inline-block bg-blush text-chocolate px-6 py-3 rounded-full font-bold text-sm shadow-lg">Send a Cake</Link>
              </div>
              <div className="absolute top-[-20px] right-[-20px] opacity-10">
                <ShoppingBag size={200} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
