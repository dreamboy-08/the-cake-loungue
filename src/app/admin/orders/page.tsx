"use client";

import React, { useState, useEffect } from 'react';
import { db } from '@/utils/firebase';
import {
  collection,
  getDocs,
  query,
  orderBy,
  updateDoc,
  doc,
  where
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

const ORDER_STATUSES = ['Pending', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'];

const AdminOrders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      let q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, { status: newStatus });
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = orders.filter(o => {
    const matchesSearch =
      o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (o.customer?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (o.customer?.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (o.paymentId || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'All' || o.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'delivered': return 'bg-green-50 text-green-600 border-green-100';
      case 'confirmed': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'preparing': return 'bg-yellow-50 text-yellow-600 border-yellow-100';
      case 'out for delivery': return 'bg-purple-50 text-purple-600 border-purple-100';
      case 'pending': return 'bg-orange-50 text-orange-600 border-orange-100';
      case 'cancelled': return 'bg-red-50 text-red-600 border-red-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  return (
    <div className="space-y-8 animate-fade-up pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-playfair font-bold text-chocolate">Order Management</h1>
          <p className="text-gray-500 mt-1">Track and manage customer cake orders and payments.</p>
        </div>
        <button
          onClick={fetchOrders}
          className="flex items-center justify-center gap-2 bg-white text-chocolate px-6 py-3 rounded-2xl font-bold shadow-sm border border-gray-100 hover:bg-gray-50 transition-all"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : <Clock size={20} />}
          <span>Refresh Orders</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by ID, name, email or payment ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-rose/20 outline-none transition-all text-sm"
            />
          </div>
        </div>
        <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
          <Filter className="text-gray-400 shrink-0" size={20} />
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {['All', ...ORDER_STATUSES].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                  statusFilter === status
                    ? 'bg-rose-deep text-white border-rose-deep shadow-md shadow-rose-deep/20'
                    : 'bg-gray-50 text-gray-500 border-gray-100 hover:bg-gray-100'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-6 py-4 text-[10px] font-bold text-chocolate/60 uppercase tracking-widest border-b border-gray-100">Order ID</th>
                <th className="px-6 py-4 text-[10px] font-bold text-chocolate/60 uppercase tracking-widest border-b border-gray-100">Customer</th>
                <th className="px-6 py-4 text-[10px] font-bold text-chocolate/60 uppercase tracking-widest border-b border-gray-100">Payment</th>
                <th className="px-6 py-4 text-[10px] font-bold text-chocolate/60 uppercase tracking-widest border-b border-gray-100">Total</th>
                <th className="px-6 py-4 text-[10px] font-bold text-chocolate/60 uppercase tracking-widest border-b border-gray-100">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold text-chocolate/60 uppercase tracking-widest border-b border-gray-100 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading && orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 className="animate-spin text-rose-deep" size={32} />
                      <p className="text-sm text-gray-400 font-medium">Loading orders...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
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
                      <span className="font-mono text-[10px] font-bold text-rose-deep bg-rose/5 px-2 py-1 rounded">#{order.id.slice(-8).toUpperCase()}</span>
                    </td>
                    <td className="px-6 py-4" onClick={() => setSelectedOrder(order)}>
                      <div className="flex flex-col">
                        <span className="font-bold text-chocolate text-sm">{order.customer?.name || 'Guest'}</span>
                        <span className="text-[10px] text-gray-400">{order.customer?.email}</span>
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
                      <button onClick={() => setSelectedOrder(order)} className="p-2 text-gray-400 group-hover:text-rose-deep transition-colors">
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

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[400] flex items-center justify-end p-4 bg-black/60 backdrop-blur-sm transition-all duration-300">
          <div className="bg-white h-full w-full max-w-2xl shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-300 rounded-l-[40px]">
            <div className="p-8 border-b flex items-center justify-between sticky top-0 bg-white z-10">
              <div>
                <h2 className="text-2xl font-bold font-playfair text-chocolate">Order Details</h2>
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-rose-deep">
                    <User size={18} />
                    <h3 className="font-bold text-xs uppercase tracking-wider">Customer Info</h3>
                  </div>
                  <div className="text-sm bg-cream/20 p-5 rounded-2xl border border-cream/50">
                    <p className="font-bold text-chocolate mb-1">{selectedOrder.customer?.name}</p>
                    <p className="text-gray-500 mb-1">{selectedOrder.customer?.email}</p>
                    <p className="text-gray-500">{selectedOrder.customer?.phone}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-rose-deep">
                    <MapPin size={18} />
                    <h3 className="font-bold text-xs uppercase tracking-wider">Shipping Address</h3>
                  </div>
                  <div className="text-sm bg-cream/20 p-5 rounded-2xl border border-cream/50 min-h-[100px]">
                    <p className="text-gray-600 leading-relaxed">{selectedOrder.shippingAddress || 'No address provided.'}</p>
                  </div>
                </div>
              </div>

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
                          <span className="text-[10px] text-gray-400">₹{item.price} × {item.quantity}</span>
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
                        <p className="text-white/40 text-[9px] font-bold uppercase tracking-widest">Payment ID</p>
                        <p className="text-[10px] font-mono text-white/70 truncate">{selectedOrder.paymentId || 'N/A'}</p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-white/10">
                      <div className="flex justify-between text-white/60 text-xs mb-2">
                        <span>Subtotal</span>
                        <span>₹{selectedOrder.subtotal || selectedOrder.totalAmount - (selectedOrder.shippingFee || 0)}</span>
                      </div>
                      <div className="flex justify-between text-white/60 text-xs mb-4">
                        <span>Delivery Fee</span>
                        <span>₹{selectedOrder.shippingFee || 0}</span>
                      </div>
                      <div className="flex justify-between items-center pt-4 border-t border-white/10">
                        <div>
                          <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Total Amount</p>
                          <p className="text-4xl font-black text-blush">₹{selectedOrder.totalAmount}</p>
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
