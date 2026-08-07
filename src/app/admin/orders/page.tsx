"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { db } from '@/utils/firebase';
import {
  collection,
  query,
  orderBy,
  updateDoc,
  doc,
  onSnapshot,
  limit,
  startAfter,
  getDocs
} from 'firebase/firestore';
import {
  ShoppingBag,
  Search,
  Clock,
  CheckCircle2,
  XCircle,
  ChevronRight,
  User,
  CreditCard,
  MapPin,
  Calendar,
  Loader2,
  Filter,
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';
import Image from 'next/image';

const ORDER_STATUSES = ['Pending', 'Confirmed', 'Preparing', 'Baking', 'Ready for Dispatch', 'Out for Delivery', 'Delivered', 'Cancelled'];

const AdminOrders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortField, setSortField] = useState<'createdAt' | 'deliveryDate'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const [lastDoc, setLastDoc] = useState<any>(null);
  const [hasMore, setHasMore] = useState(true);
  const PAGE_SIZE = 20;

  // Mobile check
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 1. Real-time listener for VERY RECENT orders (e.g., last 24 hours or last 10)
  useEffect(() => {
    // Only use real-time for the first page to ensure "instant" appearance
    // If searching or filtering, real-time becomes tricky with pagination,
    // so we'll keep it simple: real-time for the main view's top orders.
    if (searchTerm || statusFilter !== 'All') return;

    const q = query(
      collection(db, 'orders'),
      orderBy(sortField, sortOrder),
      limit(PAGE_SIZE)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const liveOrders = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setOrders(prev => {
        // Robust ID-based merge to prevent duplicates and data loss
        const liveIds = new Set(liveOrders.map(o => o.id));
        const filteredPrev = prev.filter(o => !liveIds.has(o.id));
        const combined = [...liveOrders, ...filteredPrev];

        // Sort by date descending
        return combined.sort((a, b) => {
          const dateA = a.createdAt?.seconds ? a.createdAt.seconds * 1000 : new Date(a.createdAt).getTime();
          const dateB = b.createdAt?.seconds ? b.createdAt.seconds * 1000 : new Date(b.createdAt).getTime();
          return dateB - dateA;
        });
      });
      if (snapshot.docs.length > 0) {
        setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [sortField, sortOrder, searchTerm, statusFilter]); // Removed lastDoc dependency

  // 2. Paginated fetch for historical data
  const fetchMore = async () => {
    if (!hasMore || loading || !lastDoc) return;
    setLoading(true);
    try {
      const q = query(
        collection(db, 'orders'),
        orderBy(sortField, sortOrder),
        startAfter(lastDoc),
        limit(PAGE_SIZE)
      );
      const snapshot = await getDocs(q);
      const newOrders = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));

      setOrders(prev => {
        const merged = [...prev, ...newOrders];
        return Array.from(new Map(merged.map(item => [item.id, item])).values());
      });

      setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
      setHasMore(snapshot.docs.length === PAGE_SIZE);
    } catch (error) {
      console.error("Error fetching more orders:", error);
    } finally {
      setLoading(false);
    }
  };

  // Reset pagination when sorting or filters change
  useEffect(() => {
    setLastDoc(null);
    setHasMore(true);
    // If not using real-time (due to filters), do an initial fetch
    if (searchTerm || statusFilter !== 'All') {
       const fetchInitial = async () => {
         setLoading(true);
         const q = query(collection(db, 'orders'), orderBy(sortField, sortOrder), limit(PAGE_SIZE));
         const snapshot = await getDocs(q);
         setOrders(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
         setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
         setHasMore(snapshot.docs.length === PAGE_SIZE);
         setLoading(false);
       };
       fetchInitial();
    }
  }, [sortField, sortOrder, searchTerm, statusFilter]);

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      const orderRef = doc(db, 'orders', orderId);
      const timestamp = new Date().toISOString();
      const statusUpdate = {
        status: newStatus,
        [`statusHistory.${newStatus}`]: timestamp,
        updatedAt: timestamp
      };

      await updateDoc(orderRef, statusUpdate);

      setOrders(prev => prev.map(o => o.id === orderId ? {
        ...o,
        status: newStatus,
        statusHistory: { ...(o.statusHistory || {}), [newStatus]: timestamp },
        updatedAt: timestamp
      } : o));

      if (selectedOrder?.id === orderId) {
        setSelectedOrder({
          ...selectedOrder,
          status: newStatus,
          statusHistory: { ...(selectedOrder.statusHistory || {}), [newStatus]: timestamp },
          updatedAt: timestamp
        });
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const id = o.id || '';
      const razorpayOrderId = o.razorpayOrderId || '';
      const customerName = o.customer?.name || o.customerName || '';
      const customerEmail = o.customer?.email || '';
      const customerPhone = o.customer?.phone || '';
      const paymentId = o.paymentId || '';

      const matchesSearch =
        id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        razorpayOrderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customerPhone.toLowerCase().includes(searchTerm.toLowerCase()) ||
        paymentId.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'All' || o.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, searchTerm, statusFilter]);

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'delivered': return 'bg-green-50 text-green-600 border-green-100';
      case 'confirmed': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'preparing': return 'bg-yellow-50 text-yellow-600 border-yellow-100';
      case 'baking': return 'bg-orange-50 text-orange-600 border-orange-100';
      case 'ready for dispatch': return 'bg-indigo-50 text-indigo-600 border-indigo-100';
      case 'out for delivery': return 'bg-purple-50 text-purple-600 border-purple-100';
      case 'pending': return 'bg-rose-50 text-rose-600 border-rose-100';
      case 'cancelled': return 'bg-red-50 text-red-600 border-red-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  return (
    <div className="px-4 sm:px-6 md:px-8 py-6 space-y-6 sm:space-y-8 animate-fade-up pb-24 max-w-[1600px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-playfair font-bold text-chocolate">Order Management</h1>
          <p className="text-gray-500 text-sm mt-1">Track and manage customer cake orders and payments.</p>
        </div>
        <div className="flex items-center justify-center gap-2 bg-white text-chocolate px-6 py-3 rounded-2xl font-bold shadow-sm border border-gray-100 h-11 min-h-[44px]">
          {loading ? <Loader2 className="animate-spin" size={20} /> : <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />}
          <span className="text-xs">{loading ? 'Syncing...' : 'Live Orders'}</span>
        </div>
      </div>

      <div className="bg-white p-4 sm:p-6 rounded-[28px] sm:rounded-[32px] shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 sm:gap-6">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by ID, name, email or payment ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-rose/20 outline-none transition-all text-sm h-11 min-h-[44px]"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full md:w-auto">
          <div className="flex items-center gap-2 bg-gray-50 px-4 py-3 rounded-xl border border-gray-50 h-11 min-h-[44px] overflow-hidden">
            <Filter className="text-gray-400 shrink-0" size={16} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-xs font-bold text-chocolate outline-none cursor-pointer w-full min-w-[120px]"
            >
              <option value="All">All Statuses</option>
              {ORDER_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="flex items-center gap-2 bg-gray-50 px-4 py-3 rounded-xl border border-gray-50 h-11 min-h-[44px]">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest shrink-0">Sort By</span>
            <select
              value={`${sortField}_${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('_');
                setSortField(field as 'createdAt' | 'deliveryDate');
                setSortOrder(order as 'asc' | 'desc');
              }}
              className="bg-transparent text-xs font-bold text-chocolate outline-none cursor-pointer min-w-[120px]"
            >
              <option value="createdAt_desc">Order Date (Newest)</option>
              <option value="createdAt_asc">Order Date (Oldest)</option>
              <option value="deliveryDate_asc">Delivery Date (Soonest)</option>
              <option value="deliveryDate_desc">Delivery Date (Latest)</option>
            </select>
          </div>
        </div>
      </div>

      {!isMobile ? (
        <div className="bg-white rounded-[28px] sm:rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-6 py-4 text-[10px] font-bold text-chocolate/60 uppercase tracking-widest border-b border-gray-100">Order ID</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-chocolate/60 uppercase tracking-widest border-b border-gray-100">Customer</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-chocolate/60 uppercase tracking-widest border-b border-gray-100">Dates</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-chocolate/60 uppercase tracking-widest border-b border-gray-100">Payment</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-chocolate/60 uppercase tracking-widest border-b border-gray-100">Total</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-chocolate/60 uppercase tracking-widest border-b border-gray-100">Status</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-chocolate/60 uppercase tracking-widest border-b border-gray-100 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading && orders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <Loader2 className="animate-spin text-rose-deep" size={32} />
                        <p className="text-sm text-gray-400 font-medium">Loading orders...</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <ShoppingBag className="text-gray-200" size={48} />
                        <p className="text-sm text-gray-400 font-medium">No orders found.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-6 py-4" onClick={() => setSelectedOrder(order)}>
                        <span className="font-mono text-[10px] font-bold text-rose-deep bg-cream-dark px-2 py-1 rounded">#{order.id.slice(-8).toUpperCase()}</span>
                      </td>
                      <td className="px-6 py-4" onClick={() => setSelectedOrder(order)}>
                        <div className="flex flex-col">
                          <span className="font-bold text-chocolate text-sm">{order.customer?.name || 'Guest'}</span>
                          <span className="text-[10px] text-gray-400">{order.customer?.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4" onClick={() => setSelectedOrder(order)}>
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1.5 text-[9px] font-bold text-gray-500">
                            <Clock size={10} />
                            Ordered: {new Date(order.createdAt).toLocaleDateString()}
                          </div>
                          {order.deliveryDate && (
                            <div className="flex items-center gap-1.5 text-[10px] font-black text-rose-deep">
                              <Calendar size={12} />
                              Delivery: {new Date(order.deliveryDate).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4" onClick={() => setSelectedOrder(order)}>
                        <div className="flex flex-col gap-1">
                          <span className={`inline-flex items-center gap-1 text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${order.paymentStatus === 'Paid' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-orange-50 text-orange-600 border-orange-100'}`}>
                            {order.paymentStatus === 'Paid' ? <CheckCircle2 size={10} /> : <Clock size={10} />}
                            {order.paymentStatus || 'Pending'}
                          </span>
                          <span className="text-[9px] font-mono text-gray-400 truncate max-w-[100px]">{order.paymentId || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4" onClick={() => setSelectedOrder(order)}>
                        <span className="font-bold text-chocolate text-sm">₹{order.totalAmount}</span>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={order.status || 'Pending'}
                          disabled={updatingId === order.id}
                          onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                          className={`px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider border outline-none cursor-pointer transition-all ${getStatusColor(order.status || 'Pending')}`}
                        >
                          {ORDER_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => setSelectedOrder(order)} className="p-2 text-gray-400 group-hover:text-rose-deep transition-colors h-11 w-11 flex items-center justify-center rounded-xl hover:bg-gray-100">
                          <ArrowUpRight size={20} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {loading && orders.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-gray-100 text-center flex flex-col items-center justify-center">
              <Loader2 className="animate-spin text-rose-deep mb-4" size={40} />
              <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">Loading orders...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-gray-100 text-center flex flex-col items-center justify-center">
              <ShoppingBag className="mx-auto text-gray-200 mb-4" size={64} />
              <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">No orders found</p>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div
                key={order.id}
                onClick={() => setSelectedOrder(order)}
                className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm space-y-4 cursor-pointer active:scale-[0.99] transition-all"
              >
                <div className="flex justify-between items-center">
                  <span className="font-mono text-[10px] font-bold text-rose-deep bg-cream-dark px-2.5 py-1 rounded">#{order.id.slice(-8).toUpperCase()}</span>
                  <span className={`text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider border ${getStatusColor(order.status || 'Pending')}`}>
                    {order.status || 'Pending'}
                  </span>
                </div>

                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1 min-w-0">
                    <h3 className="font-bold text-chocolate text-base truncate">{order.customer?.name || 'Guest'}</h3>
                    <p className="text-[11px] text-gray-400 truncate">{order.customer?.email}</p>
                    <div className="flex flex-col gap-1 pt-1">
                      <p className="text-[9px] text-gray-400 font-bold">Ordered: {new Date(order.createdAt).toLocaleDateString()}</p>
                      {order.deliveryDate && (
                        <p className="text-[10px] font-black text-rose-deep">Delivery: {new Date(order.deliveryDate).toLocaleDateString()}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end gap-1 shrink-0">
                    <span className="font-black text-chocolate text-lg">₹{order.totalAmount}</span>
                    <span className={`inline-flex items-center gap-1 text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${order.paymentStatus === 'Paid' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-orange-50 text-orange-600 border-orange-100'}`}>
                      {order.paymentStatus || 'Pending'}
                    </span>
                  </div>
                </div>

                <div className="flex gap-3 pt-2" onClick={(e) => e.stopPropagation()}>
                  <select
                    value={order.status || 'Pending'}
                    disabled={updatingId === order.id}
                    onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                    className={`flex-1 h-11 px-4 rounded-xl text-xs font-bold uppercase tracking-wider border outline-none cursor-pointer transition-all ${getStatusColor(order.status || 'Pending')}`}
                  >
                    {ORDER_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="flex items-center justify-center bg-gray-50 border border-gray-200 hover:bg-gray-100 text-chocolate h-11 w-12 rounded-xl transition-all"
                  >
                    <ArrowUpRight size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {hasMore && !loading && !searchTerm && statusFilter === 'All' && (
        <div className="flex justify-center mt-8">
          <button
            onClick={fetchMore}
            className="px-8 py-3 bg-white border border-gray-100 rounded-2xl font-bold text-chocolate hover:bg-gray-50 transition-all shadow-sm h-11 min-h-[44px]"
          >
            Load More Orders
          </button>
        </div>
      )}

      {selectedOrder && (
        <div className="fixed inset-0 z-[400] flex items-center justify-end p-0 sm:p-4 bg-chocolate/60 transition-all duration-300">
          <div className="bg-white h-full sm:h-[calc(100vh-2rem)] w-full max-w-2xl shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-300 rounded-t-3xl sm:rounded-l-[40px] sm:rounded-tr-none">
            <div className="p-6 sm:p-8 border-b flex items-center justify-between sticky top-0 bg-white z-10">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold font-playfair text-chocolate">Order Details</h2>
                <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest font-bold">#{selectedOrder.id.toUpperCase()}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <XCircle size={28} className="text-gray-400" />
              </button>
            </div>

            <div className="p-8 space-y-10">
              <div className="flex items-center justify-between bg-gray-50 p-6 rounded-3xl border border-gray-100">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Update Order Status</span>
                  <div className="mt-2 flex items-center gap-3">
                    <select
                      value={selectedOrder.status || 'Pending'}
                      disabled={updatingId === selectedOrder.id}
                      onChange={(e) => handleStatusUpdate(selectedOrder.id, e.target.value)}
                      className={`px-4 py-2 rounded-2xl text-xs font-bold uppercase tracking-wider border outline-none cursor-pointer transition-all ${getStatusColor(selectedOrder.status || 'Pending')}`}
                    >
                      {ORDER_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    {updatingId === selectedOrder.id && <Loader2 className="animate-spin text-rose-deep" size={20} />}
                  </div>
                </div>
                <div className="text-right">
                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Placed On</p>
                   <p className="font-bold text-chocolate">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-rose-deep">
                    <User size={18} />
                    <h3 className="font-bold text-xs uppercase tracking-wider">Customer Info</h3>
                  </div>
                  <div className="text-sm bg-cream p-5 rounded-2xl border border-cream/50 h-full">
                    <p className="font-bold text-chocolate mb-1">{selectedOrder.customer?.name}</p>
                    <p className="text-gray-500 mb-1">{selectedOrder.customer?.email}</p>
                    <p className="text-gray-500">{selectedOrder.customer?.phone}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-rose-deep">
                    <Calendar size={18} />
                    <h3 className="font-bold text-xs uppercase tracking-wider">Delivery Schedule</h3>
                  </div>
                  <div className="text-sm bg-cream-dark p-5 rounded-2xl border border-rose-deep/20 h-full">
                    <p className="text-[10px] font-bold text-rose-deep uppercase tracking-widest mb-1">Date</p>
                    <p className="font-bold text-chocolate text-lg">
                      {selectedOrder.deliveryDate ? new Date(selectedOrder.deliveryDate).toLocaleDateString(undefined, { dateStyle: 'long' }) : 'Not specified'}
                    </p>
                    {selectedOrder.deliveryTimeSlot && (
                      <div className="mt-2">
                        <p className="text-[10px] font-bold text-rose-deep uppercase tracking-widest mb-1">Time Slot</p>
                        <p className="font-bold text-chocolate">{selectedOrder.deliveryTimeSlot}</p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-rose-deep">
                    <MapPin size={18} />
                    <h3 className="font-bold text-xs uppercase tracking-wider">Shipping Address</h3>
                  </div>
                  <div className="text-sm bg-cream p-5 rounded-2xl border border-cream/50 h-full min-h-[100px]">
                    {selectedOrder.address ? (
                      <div className="space-y-1">
                        <p className="font-bold text-chocolate">{selectedOrder.address.houseNumber}, {selectedOrder.address.street}</p>
                            {selectedOrder.address.landmark && <p className="text-xs text-text-soft font-bold">Landmark: {selectedOrder.address.landmark}</p>}
                            <p className="text-gray-600 font-medium">{selectedOrder.address.area}</p>
                            <p className="text-gray-600 font-medium">{selectedOrder.address.city}, {selectedOrder.address.state} - {selectedOrder.address.zipCode || selectedOrder.address.pincode}</p>
                      </div>
                    ) : (
                      <p className="text-gray-600 leading-relaxed">{selectedOrder.shippingAddress || 'No address provided.'}</p>
                    )}
                  </div>
                </div>
              </div>

              {selectedOrder.deliveryInstructions && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-rose-deep">
                    <ShieldCheck size={18} />
                    <h3 className="font-bold text-xs uppercase tracking-wider">Delivery Instructions</h3>
                  </div>
                  <div className="bg-orange-50 p-5 rounded-2xl border border-orange-100 italic text-sm text-chocolate">
                    &quot;{selectedOrder.deliveryInstructions}&quot;
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-rose-deep">
                  <ShoppingBag size={18} />
                  <h3 className="font-bold text-xs uppercase tracking-wider">Order Items</h3>
                </div>
                <div className="space-y-3">
                  {(selectedOrder.items || []).map((item: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between p-4 rounded-2xl border border-gray-50 bg-white shadow-sm">
                      <div className="flex items-center gap-4">
                        <div className="relative w-14 h-14 rounded-xl bg-gray-100 flex-shrink-0 overflow-hidden border border-gray-100">
                          <Image
                            src={item.img}
                            alt={item.name}
                            fill
                            sizes="56px"
                            className="object-cover"
                          />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-chocolate">{item.name}</span>
                          <div className="flex flex-wrap items-center gap-2 mt-1">
                            <span className="text-[10px] text-gray-400">₹{item.price} × {item.quantity}</span>
                            <span className="text-[10px] font-bold text-rose-deep bg-cream-dark px-1.5 rounded">
                              Weight: {item.weight || '0.5 Kg'}
                            </span>
                            {(item.serves || item.servings) && (
                              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 rounded border border-blue-100">
                                Serves: {item.serves || item.servings}
                              </span>
                            )}
                            {item.flavor && (
                              <span className="text-[10px] font-bold text-chocolate bg-gray-100 px-1.5 rounded">
                                Flavor: {item.flavor}
                              </span>
                            )}
                          </div>
                          {item.message && (
                            <p className="text-[11px] font-bold text-rose-deep mt-1.5 bg-rose/5 border border-rose/10 px-2.5 py-1 rounded-xl inline-block self-start">
                              Cake Message: &ldquo;{item.message}&rdquo;
                            </p>
                          )}
                        </div>
                      </div>
                      <span className="text-sm font-bold text-chocolate">₹{item.quantity * item.price}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100">
                <div className="flex items-center gap-2 text-rose-deep mb-4">
                  <CreditCard size={18} />
                  <h3 className="font-bold text-xs uppercase tracking-wider">Payment Details</h3>
                </div>
                <div className="bg-chocolate text-white p-8 rounded-[35px] shadow-xl relative overflow-hidden">
                  <div className="relative z-10 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-white/40 text-[9px] font-bold uppercase tracking-widest">Payment Status</p>
                        <div className="flex items-center gap-2">
                           <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase border ${selectedOrder.paymentStatus === 'Paid' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-orange-500/20 text-orange-400 border-orange-500/30'}`}>
                              {selectedOrder.paymentStatus || 'Pending'}
                           </span>
                        </div>
                      </div>
                      <div className="space-y-1 text-right">
                        <p className="text-white/40 text-[9px] font-bold uppercase tracking-widest">Razorpay Order ID</p>
                        <p className="text-[10px] font-mono text-white/70 truncate">{selectedOrder.razorpayOrderId || selectedOrder.id || 'N/A'}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-white/40 text-[9px] font-bold uppercase tracking-widest">Payment ID (Transaction)</p>
                        <p className="text-[10px] font-mono text-white/70 truncate">{selectedOrder.paymentId || 'N/A'}</p>
                      </div>
                      <div className="space-y-1 text-right">
                        <p className="text-white/40 text-[9px] font-bold uppercase tracking-widest">Payment Method</p>
                        <p className="text-[10px] font-bold text-white/70">{selectedOrder.paymentMethod || 'Online'}</p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-white/10">
                      <div className="flex justify-between text-white/60 text-xs mb-2">
                        <span>Subtotal</span>
                        <span>₹{selectedOrder.subtotal || selectedOrder.totalAmount - (selectedOrder.shippingFee || 0)}</span>
                      </div>
                      <div className="flex justify-between text-white/60 text-xs mb-2">
                        <span>Delivery Fee</span>
                        <span>₹{selectedOrder.shippingFee || 0}</span>
                      </div>
                      <div className="flex justify-between text-white/60 text-xs mb-4">
                        <span>Tax & Discount</span>
                        <span>₹{selectedOrder.taxes || 0} / -₹{selectedOrder.discount || 0}</span>
                      </div>
                      <div className="flex justify-between items-center pt-4 border-t border-white/10">
                        <div>
                          <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Total Amount Paid</p>
                          <div className="flex items-baseline gap-2">
                            <p className="text-4xl font-black text-blush">₹{selectedOrder.totalAmount}</p>
                            {selectedOrder.paymentStatus === 'Paid' && <CheckCircle2 size={16} className="text-green-400" />}
                          </div>
                        </div>
                        <div className="text-right">
                           <ShieldCheck className="text-white/20 inline-block" size={40} />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute top-[-20px] right-[-20px] opacity-10">
                    <CreditCard size={150} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
