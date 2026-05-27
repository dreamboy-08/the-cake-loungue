"use client";

import React, { useState, useEffect } from 'react';
import { db } from '@/utils/firebase';
import {
  collection,
  getDocs,
  query,
  orderBy
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
  Loader2
} from 'lucide-react';

const AdminOrders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
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

  const filteredOrders = orders.filter(o =>
    o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (o.customer?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (o.customer?.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'bg-green-50 text-green-600 border-green-100';
      case 'pending': return 'bg-orange-50 text-orange-600 border-orange-100';
      case 'cancelled': return 'bg-red-50 text-red-600 border-red-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  return (
    <div className="space-y-8 animate-fade-up">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-playfair font-bold text-chocolate">Order Management</h1>
          <p className="text-gray-500 mt-1">Track and manage customer cake orders.</p>
        </div>
        <button
          onClick={fetchOrders}
          className="flex items-center justify-center gap-2 bg-white text-chocolate px-6 py-3 rounded-2xl font-bold shadow-sm border border-gray-100 hover:bg-gray-50 transition-all"
        >
          <Clock size={20} />
          <span>Refresh Orders</span>
        </button>
      </div>

      <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by order ID, customer name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-rose/20 outline-none transition-all text-sm"
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-6 py-4 text-xs font-bold text-chocolate/60 uppercase tracking-widest border-b border-gray-100">Order ID</th>
                <th className="px-6 py-4 text-xs font-bold text-chocolate/60 uppercase tracking-widest border-b border-gray-100">Customer</th>
                <th className="px-6 py-4 text-xs font-bold text-chocolate/60 uppercase tracking-widest border-b border-gray-100">Date</th>
                <th className="px-6 py-4 text-xs font-bold text-chocolate/60 uppercase tracking-widest border-b border-gray-100">Total</th>
                <th className="px-6 py-4 text-xs font-bold text-chocolate/60 uppercase tracking-widest border-b border-gray-100">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-chocolate/60 uppercase tracking-widest border-b border-gray-100 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
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
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-colors group cursor-pointer" onClick={() => setSelectedOrder(order)}>
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs font-bold text-rose-deep bg-rose/5 px-2 py-1 rounded">#{order.id.slice(-6).toUpperCase()}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-chocolate text-sm">{order.customer?.name || 'Guest'}</span>
                        <span className="text-xs text-gray-400">{order.customer?.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-gray-500 font-medium">
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-chocolate text-sm">₹{order.totalAmount || order.total}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(order.status || 'Pending')}`}>
                        {order.status || 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-gray-400 group-hover:text-rose-deep transition-colors">
                        <ChevronRight size={20} />
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
          <div className="bg-white h-full w-full max-w-xl shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-300">
            <div className="p-8 border-b flex items-center justify-between sticky top-0 bg-white z-10">
              <h2 className="text-2xl font-bold font-playfair text-chocolate text-center">Order Details</h2>
              <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <XCircle size={24} className="text-gray-400" />
              </button>
            </div>

            <div className="p-8 space-y-10">
              <div className="flex items-center justify-between bg-gray-50 p-6 rounded-3xl border border-gray-100">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Order ID</span>
                  <span className="font-mono text-lg font-bold text-chocolate">#{selectedOrder.id.toUpperCase()}</span>
                </div>
                <div className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider border ${getStatusColor(selectedOrder.status || 'Pending')}`}>
                  {selectedOrder.status || 'Pending'}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-rose-deep">
                    <User size={18} />
                    <h3 className="font-bold text-sm uppercase tracking-wider">Customer</h3>
                  </div>
                  <div className="text-sm">
                    <p className="font-bold text-chocolate">{selectedOrder.customer?.name}</p>
                    <p className="text-gray-500">{selectedOrder.customer?.email}</p>
                    <p className="text-gray-500">{selectedOrder.customer?.phone}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-rose-deep">
                    <Calendar size={18} />
                    <h3 className="font-bold text-sm uppercase tracking-wider">Date</h3>
                  </div>
                  <div className="text-sm">
                    <p className="font-bold text-chocolate">{selectedOrder.createdAt ? new Date(selectedOrder.createdAt).toLocaleString() : 'N/A'}</p>
                    <p className="text-gray-500">Order placed online</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-rose-deep">
                  <MapPin size={18} />
                  <h3 className="font-bold text-sm uppercase tracking-wider">Shipping Address</h3>
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl text-sm text-gray-600 border border-gray-100 leading-relaxed">
                  {selectedOrder.shippingAddress || 'No address provided.'}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-rose-deep">
                  <ShoppingBag size={18} />
                  <h3 className="font-bold text-sm uppercase tracking-wider">Items Summary</h3>
                </div>
                <div className="space-y-3">
                  {(selectedOrder.items || []).map((item: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden border border-gray-100">
                          <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-chocolate">{item.name}</span>
                          <span className="text-xs text-gray-400">Qty: {item.quantity} × ₹{item.price}</span>
                        </div>
                      </div>
                      <span className="text-sm font-bold text-chocolate">₹{item.quantity * item.price}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4 pt-6 border-t">
                <div className="flex items-center gap-2 text-rose-deep">
                  <CreditCard size={18} />
                  <h3 className="font-bold text-sm uppercase tracking-wider">Payment Details</h3>
                </div>
                <div className="space-y-3 bg-chocolate text-white p-6 rounded-3xl shadow-xl">
                  <div className="flex justify-between text-sm text-white/60">
                    <span>Subtotal</span>
                    <span>₹{(selectedOrder.totalAmount || selectedOrder.total) - 50}</span>
                  </div>
                  <div className="flex justify-between text-sm text-white/60">
                    <span>Delivery Fee</span>
                    <span>₹50</span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-white/10">
                    <span className="font-bold">Total Amount</span>
                    <span className="text-2xl font-bold text-blush">₹{selectedOrder.totalAmount || selectedOrder.total}</span>
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
