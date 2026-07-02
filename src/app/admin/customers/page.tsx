"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { db } from '@/utils/firebase';
import {
  collection,
  query,
  orderBy,
  limit,
  startAfter,
  getDocs,
  where
} from 'firebase/firestore';
import {
  Users,
  Search,
  Mail,
  Phone,
  ShoppingBag,
  Calendar,
  ChevronRight,
  User as UserIcon,
  MapPin,
  XCircle,
  Loader2,
  TrendingUp,
  CreditCard,
  Clock,
  ArrowRight,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';
import Image from 'next/image';

const AdminCustomers = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [hasMore, setHasMore] = useState(true);
  const PAGE_SIZE = 10;
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [customerOrders, setCustomerOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [customerAddresses, setCustomerAddresses] = useState<any[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const fetchUsers = useCallback(async (isNext = false) => {
    setLoading(true);
    try {
      let q = query(collection(db, 'users'), orderBy('createdAt', 'desc'), limit(PAGE_SIZE));

      if (isNext && lastDoc) {
        q = query(collection(db, 'users'), orderBy('createdAt', 'desc'), startAfter(lastDoc), limit(PAGE_SIZE));
      }

      const snapshot = await getDocs(q);
      const newUsers = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));

      if (isNext) {
        setUsers(prev => {
          const existingIds = new Set(prev.map(u => u.id));
          const uniqueNew = newUsers.filter(u => !existingIds.has(u.id));
          return [...prev, ...uniqueNew];
        });
      } else {
        setUsers(newUsers);
      }

      setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
      setHasMore(snapshot.docs.length === PAGE_SIZE);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  }, [lastDoc]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const fetchCustomerHistory = async (customer: any) => {
    setLoadingOrders(true);
    setLoadingAddresses(true);
    setSelectedCustomer(customer);

    // Fetch addresses from 'savedAddresses' collection if it exists
    try {
      const addrQ = query(collection(db, 'savedAddresses'), where('userId', '==', customer.id));
      const addrSnapshot = await getDocs(addrQ);
      const addresses = addrSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));

      // Combine with addresses in user document if any
      const userDocAddresses = customer.addresses || [];
      const combinedAddresses = [...userDocAddresses];

      addresses.forEach(addr => {
        if (!combinedAddresses.find(a => a.id === addr.id)) {
          combinedAddresses.push(addr);
        }
      });

      setCustomerAddresses(combinedAddresses);
    } catch (err) {
      console.error("Error fetching addresses:", err);
      setCustomerAddresses(customer.addresses || []);
    } finally {
      setLoadingAddresses(false);
    }

    try {
      // Query orders by customer ID first, then fallback to email if needed
      let q = query(
        collection(db, 'orders'),
        where('userId', '==', customer.id),
        orderBy('createdAt', 'desc'),
        limit(50)
      );

      let snapshot = await getDocs(q);

      if (snapshot.empty) {
        q = query(
          collection(db, 'orders'),
          where('customer.email', '==', customer.email),
          orderBy('createdAt', 'desc'),
          limit(50)
        );
        snapshot = await getDocs(q);
      }

      setCustomerOrders(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    } catch (error) {
      console.error("Error fetching customer history:", error);
    } finally {
      setLoadingOrders(false);
    }
  };

  const filteredCustomers = useMemo(() => {
    return users.filter(c =>
      (c.displayName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.phone || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  return (
    <div className="space-y-8 animate-fade-up pb-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-playfair font-bold text-chocolate">Customer Management</h1>
          <p className="text-gray-500 mt-1">View and manage your customer relationships.</p>
        </div>
        <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by name, email or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-2 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-rose/20 outline-none transition-all text-sm"
            />
          </div>
        </div>
      </header>

      <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-8 py-5 text-[10px] font-black text-chocolate/40 uppercase tracking-widest">Customer</th>
                <th className="px-8 py-5 text-[10px] font-black text-chocolate/40 uppercase tracking-widest text-center">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-chocolate/40 uppercase tracking-widest text-center">Joined</th>
                <th className="px-8 py-5 text-[10px] font-black text-chocolate/40 uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading && users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center">
                    <Loader2 className="animate-spin mx-auto text-rose-deep mb-4" size={32} />
                    <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">Loading Customers...</p>
                  </td>
                </tr>
              ) : filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center">
                    <Users className="mx-auto text-gray-100 mb-4" size={64} />
                    <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">No customers found</p>
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50/50 transition-colors group cursor-pointer" onClick={() => fetchCustomerHistory(customer)}>
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-cream-dark flex items-center justify-center text-rose-deep font-bold border border-rose/10">
                          {customer.displayName?.[0] || customer.email?.[0] || 'U'}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-chocolate text-sm leading-tight">{customer.displayName || 'Guest User'}</span>
                          <span className="text-[10px] text-gray-400 mt-0.5">{customer.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${customer.role === 'admin' ? 'bg-rose-deep text-white' : 'bg-blue-50 text-blue-600'}`}>
                        {customer.role || 'user'}
                      </span>
                    </td>
                    <td className="px-8 py-4 text-center">
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                        {customer.createdAt ? new Date(customer.createdAt).toLocaleDateString() : 'Unknown'}
                      </span>
                    </td>
                    <td className="px-8 py-4 text-right">
                      <button className="p-2.5 text-gray-300 group-hover:text-rose-deep transition-colors">
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

      {selectedCustomer && (
        <div className="fixed inset-0 z-[400] flex items-center justify-end p-4 bg-chocolate/60 backdrop-blur-sm transition-all duration-300">
          <div className="bg-white h-full w-full max-w-2xl shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-300 rounded-l-[40px]">
            <div className="p-8 border-b flex items-center justify-between sticky top-0 bg-white z-10">
              <div className="flex items-center gap-4">
                 <div className="w-16 h-16 rounded-full bg-rose-deep flex items-center justify-center text-white text-2xl font-black shadow-lg">
                    {selectedCustomer.displayName?.[0] || selectedCustomer.email?.[0]}
                 </div>
                 <div>
                    <h2 className="text-2xl font-bold font-playfair text-chocolate">{selectedCustomer.displayName || 'Guest'}</h2>
                    <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest font-bold">Customer Since {new Date(selectedCustomer.createdAt).toLocaleDateString()}</p>
                 </div>
              </div>
              <button onClick={() => setSelectedCustomer(null)} className="p-3 hover:bg-gray-100 rounded-full transition-colors">
                <XCircle size={32} className="text-gray-300" />
              </button>
            </div>

            <div className="p-8 space-y-10">
              {loadingOrders ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                   <Loader2 className="animate-spin text-rose-deep" size={32} />
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Fetching Account History...</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4">
                     <div className="bg-blue-50 p-6 rounded-[32px] border border-blue-100">
                        <div className="text-blue-500 mb-2"><ShoppingBag size={20} /></div>
                        <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Total Orders</p>
                        <p className="text-2xl font-black text-blue-600">{customerOrders.length}</p>
                     </div>
                     <div className="bg-green-50 p-6 rounded-[32px] border border-green-100">
                        <div className="text-green-500 mb-2"><TrendingUp size={20} /></div>
                        <p className="text-[10px] font-black text-green-400 uppercase tracking-widest">Total Spend</p>
                        <p className="text-2xl font-black text-green-600">₹{customerOrders.reduce((acc, curr) => acc + (Number(curr.totalAmount) || 0), 0).toLocaleString()}</p>
                     </div>
                  </div>

                  <div className="space-y-4">
                     <h3 className="text-xs font-black text-chocolate uppercase tracking-widest flex items-center gap-2">
                        <UserIcon size={16} className="text-rose-deep" />
                        Contact Information
                     </h3>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                           <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Email Address</p>
                           <p className="text-sm font-bold text-chocolate">{selectedCustomer.email}</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                           <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Phone Number</p>
                           <p className="text-sm font-bold text-chocolate">{selectedCustomer.phone || 'Not Provided'}</p>
                        </div>
                     </div>
                  </div>

                  <div className="space-y-4">
                     <h3 className="text-xs font-black text-chocolate uppercase tracking-widest flex items-center gap-2">
                        <MapPin size={16} className="text-rose-deep" />
                        Saved Addresses
                     </h3>
                     <div className="space-y-3">
                        {loadingAddresses ? (
                          <div className="flex justify-center py-8">
                            <Loader2 className="animate-spin text-rose-deep" size={24} />
                          </div>
                        ) : customerAddresses && customerAddresses.length > 0 ? (
                          customerAddresses.map((addr: any, idx: number) => (
                            <div key={idx} className="p-5 rounded-[24px] bg-gray-50 border border-gray-100 flex items-start gap-4">
                               <div className={`p-2 rounded-xl ${addr.isDefault ? 'bg-rose-deep text-white' : 'bg-white text-gray-300 shadow-sm'}`}>
                                  <MapPin size={16} />
                               </div>
                               <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                     <p className="text-sm font-bold text-chocolate">{addr.name}</p>
                                     {addr.isDefault && <span className="text-[9px] font-black bg-rose/10 text-rose-deep px-2 py-0.5 rounded-full uppercase">Default</span>}
                                  </div>
                                  <p className="text-xs text-chocolate font-bold mb-1">{addr.phone}</p>
                                  <p className="text-xs text-gray-500 leading-relaxed">
                                    {addr.houseNumber}, {addr.street}, {addr.landmark && `Near ${addr.landmark}, `}
                                    {addr.area}, {addr.city}, {addr.state} - {addr.zipCode || addr.pincode}
                                  </p>
                               </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-gray-400 italic bg-gray-50 p-6 rounded-3xl border border-dashed border-gray-200 text-center">
                            No saved addresses found.
                          </p>
                        )}
                     </div>
                  </div>

                  <div className="space-y-4">
                     <h3 className="text-xs font-black text-chocolate uppercase tracking-widest flex items-center gap-2">
                        <ShoppingBag size={16} className="text-rose-deep" />
                        Order History
                     </h3>
                     <div className="space-y-3">
                        {customerOrders.length > 0 ? (
                          customerOrders.map((order: any) => (
                            <div key={order.id} className="p-5 rounded-[24px] bg-white border border-gray-100 flex items-center justify-between hover:border-rose-deep/30 transition-all cursor-pointer group shadow-sm">
                               <div className="flex items-center gap-4">
                                  <div className="bg-cream-dark p-3 rounded-2xl text-rose-deep font-mono text-[10px] font-bold uppercase">
                                     #{order.id.slice(-6).toUpperCase()}
                                  </div>
                                  <div className="flex flex-col">
                                     <span className="text-sm font-bold text-chocolate group-hover:text-rose-deep transition-colors">₹{order.totalAmount}</span>
                                     <span className="text-[10px] text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</span>
                                  </div>
                               </div>
                               <div className="flex items-center gap-3">
                                  <span className={`text-[9px] font-black px-2 py-1 rounded-full uppercase tracking-widest ${
                                     order.status?.toLowerCase() === 'delivered' ? 'bg-green-50 text-green-600' :
                                     order.status?.toLowerCase() === 'cancelled' ? 'bg-red-50 text-red-600' :
                                     'bg-blue-50 text-blue-600'
                                  }`}>
                                     {order.status || 'Pending'}
                                  </span>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedOrder(order);
                                    }}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-all"
                                  >
                                    <ArrowRight size={14} className="text-gray-300 group-hover:text-chocolate transition-all" />
                                  </button>
                               </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-gray-400 italic bg-gray-50 p-6 rounded-3xl border border-dashed border-gray-200 text-center">
                            No orders placed yet.
                          </p>
                        )}
                     </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {selectedOrder && (
        <div className="fixed inset-0 z-[500] flex items-center justify-end p-4 bg-chocolate/60 transition-all duration-300">
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-rose-deep">
                    <UserIcon size={18} />
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
                        {selectedOrder.address.landmark && <p className="text-xs text-text-soft">Near {selectedOrder.address.landmark}</p>}
                        <p className="text-gray-600">{selectedOrder.address.area}</p>
                        <p className="text-gray-600">{selectedOrder.address.city}, {selectedOrder.address.state} - {selectedOrder.address.zipCode}</p>
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
                          {item.img && <Image
                            src={item.img}
                            alt={item.name}
                            fill
                            sizes="56px"
                            className="object-cover"
                          />}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-chocolate">{item.name}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-gray-400">₹{item.price} × {item.quantity}</span>
                            <span className="text-[10px] font-bold text-rose-deep bg-cream-dark px-1.5 rounded">
                              {item.weight || '0.5 Kg'}
                            </span>
                            {item.flavor && (
                              <span className="text-[10px] font-bold text-chocolate bg-gray-100 px-1.5 rounded">
                                {item.flavor}
                              </span>
                            )}
                          </div>
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

      {hasMore && !loading && (
        <div className="flex justify-center mt-8">
          <button
            onClick={() => fetchUsers(true)}
            className="px-8 py-3 bg-white border border-gray-100 rounded-2xl font-bold text-chocolate hover:bg-gray-50 transition-all shadow-sm"
          >
            Load More Customers
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminCustomers;
