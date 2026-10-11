"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
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
  ShieldCheck
} from 'lucide-react';
import Image from 'next/image';

type CustomerRecord = {
  id: string;
  displayName?: string;
  email?: string;
  phone?: string;
  role?: string;
  createdAt?: string | number | Date;
  [key: string]: unknown;
};

const AdminCustomers = () => {
  const [users, setUsers] = useState<CustomerRecord[]>([]);
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

  // SSR safety for portals
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll when any modal is open
  useEffect(() => {
    if (!mounted) return;
    if (selectedCustomer || selectedOrder) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [mounted, selectedCustomer, selectedOrder]);

  // Handle Escape key closure
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (selectedOrder) {
          setSelectedOrder(null);
        } else if (selectedCustomer) {
          setSelectedCustomer(null);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCustomer, selectedOrder]);

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

  const fetchUsers = useCallback(async (isNext = false) => {
    setLoading(true);
    try {
      let q = query(collection(db, 'users'), orderBy('createdAt', 'desc'), limit(PAGE_SIZE));

      if (isNext && lastDoc) {
        q = query(collection(db, 'users'), orderBy('createdAt', 'desc'), startAfter(lastDoc), limit(PAGE_SIZE));
      }

      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Firestore timeout')), 3000)
      );

      const snapshot = await Promise.race([getDocs(q), timeoutPromise]);
      const newUsers: CustomerRecord[] = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
      } as CustomerRecord));

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
      // Fallback sample users for mock/offline testing
      if (!isNext) {
        setUsers([
          {
            id: 'cust_1',
            displayName: 'Eleanor Vance',
            email: 'eleanor@cakelounge.com',
            phone: '+91 98765 43210',
            role: 'user',
            createdAt: '2024-01-15T10:00:00.000Z',
          },
          {
            id: 'cust_2',
            displayName: 'Julian Caine',
            email: 'julian@cakelounge.com',
            phone: '+91 98765 43211',
            role: 'user',
            createdAt: '2024-02-01T14:30:00.000Z',
          }
        ]);
        setHasMore(false);
      }
    } finally {
      setLoading(false);
    }
  }, [lastDoc]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const fetchCustomerHistory = async (customer: any) => {
    if (selectedCustomer?.id === customer.id) {
      return;
    }

    setLoadingOrders(true);
    setLoadingAddresses(true);
    setSelectedCustomer(customer);
    setSelectedOrder(null);

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
    <div className="px-4 sm:px-6 md:px-8 py-6 space-y-6 sm:space-y-8 animate-fade-up pb-24 max-w-[1600px] mx-auto">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-playfair font-bold text-chocolate">Customer Management</h1>
          <p className="text-gray-500 text-sm mt-1">View and manage your customer relationships.</p>
        </div>
      </header>

      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex-1 max-w-md w-full">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by name, email or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-rose/20 outline-none transition-all text-sm h-11 min-h-[44px]"
            />
          </div>
        </div>
      </header>

      {!isMobile ? (
        <div className="bg-white rounded-[28px] sm:rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
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
                        <div className="flex items-center justify-end" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => fetchCustomerHistory(customer)}
                            className="p-2.5 text-gray-300 group-hover:text-rose-deep transition-colors h-10 w-10 flex items-center justify-center rounded-xl hover:bg-gray-50"
                          >
                            <ChevronRight size={20} />
                          </button>
                        </div>
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
          {loading && users.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-gray-100 text-center flex flex-col items-center justify-center">
              <Loader2 className="animate-spin text-rose-deep mb-4" size={40} />
              <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">Loading Customers...</p>
            </div>
          ) : filteredCustomers.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-gray-100 text-center flex flex-col items-center justify-center">
              <Users className="mx-auto text-gray-100 mb-4" size={64} />
              <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">No customers found</p>
            </div>
          ) : (
            filteredCustomers.map((customer) => (
              <div
                key={customer.id}
                onClick={() => fetchCustomerHistory(customer)}
                className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm space-y-4 cursor-pointer active:scale-[0.99] transition-all"
              >
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-cream-dark flex items-center justify-center text-rose-deep font-bold border border-rose/10 shrink-0">
                    {customer.displayName?.[0] || customer.email?.[0] || 'U'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-chocolate text-base truncate">{customer.displayName || 'Guest User'}</h3>
                    <p className="text-[11px] text-gray-400 truncate mt-0.5">{customer.email}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${customer.role === 'admin' ? 'bg-rose-deep text-white' : 'bg-blue-50 text-blue-600'}`}>
                        {customer.role || 'user'}
                      </span>
                      <span className="text-[10px] font-bold text-gray-400">
                        Joined: {customer.createdAt ? new Date(customer.createdAt).toLocaleDateString() : 'Unknown'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 self-center" onClick={(e) => e.stopPropagation()}>
                    <ChevronRight size={20} className="text-gray-300" />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {mounted && selectedCustomer && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-chocolate/60 backdrop-blur-sm transition-opacity duration-200">
          <div
            className="fixed inset-0"
            onClick={() => setSelectedCustomer(null)}
          />
          <div className="relative bg-white rounded-[32px] sm:rounded-[40px] max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden z-10 border border-gray-100">
            {/* Modal Header */}
            <div className="p-6 sm:p-8 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-rose-deep flex items-center justify-center text-white text-xl sm:text-2xl font-black shadow-md">
                    {selectedCustomer.displayName?.[0] || selectedCustomer.email?.[0]}
                 </div>
                 <div>
                    <h2 className="text-lg sm:text-2xl font-bold font-playfair text-chocolate">{selectedCustomer.displayName || 'Guest'}</h2>
                    <p className="text-[10px] text-gray-400 mt-0.5 uppercase tracking-widest font-bold">
                      Customer Since {selectedCustomer.createdAt ? new Date(selectedCustomer.createdAt).toLocaleDateString() : 'Unknown'}
                    </p>
                 </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedCustomer(null)}
                  className="p-2.5 hover:bg-gray-100 text-gray-400 hover:text-chocolate rounded-full transition-colors"
                  aria-label="Close modal"
                  type="button"
                >
                  <XCircle size={28} />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-8 flex-1 overflow-y-auto min-h-0">
              {loadingOrders ? (
                <div className="flex flex-col items-center justify-center py-16 gap-4">
                   <Loader2 className="animate-spin text-rose-deep" size={32} />
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Fetching Account History...</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4">
                     <div className="bg-blue-50 p-5 sm:p-6 rounded-[28px] border border-blue-100">
                        <div className="text-blue-500 mb-2"><ShoppingBag size={20} /></div>
                        <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Total Orders</p>
                        <p className="text-2xl font-black text-blue-600">{customerOrders.length}</p>
                     </div>
                     <div className="bg-green-50 p-5 sm:p-6 rounded-[28px] border border-green-100">
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
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                           <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Email Address</p>
                           <p className="text-sm font-bold text-chocolate truncate">{selectedCustomer.email}</p>
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
                               <div className="flex-1 min-w-0">
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
                            <div key={order.id} className="p-5 rounded-[24px] bg-white border border-gray-100 flex items-center justify-between hover:border-rose-deep/30 transition-all cursor-pointer group shadow-sm" onClick={() => setSelectedOrder(order)}>
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
        </div>,
        document.body
      )}

      {mounted && selectedOrder && createPortal(
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 sm:p-6 bg-chocolate/60 backdrop-blur-sm transition-opacity duration-200">
          <div
            className="fixed inset-0"
            onClick={() => setSelectedOrder(null)}
          />
          <div className="relative bg-white rounded-[32px] sm:rounded-[40px] max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden z-10 border border-gray-100">
            {/* Modal Header */}
            <div className="p-6 sm:p-8 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold font-playfair text-chocolate">Order Details</h2>
                <p className="text-[10px] text-gray-400 mt-0.5 uppercase tracking-widest font-bold">#{selectedOrder.id.toUpperCase()}</p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2.5 hover:bg-gray-100 text-gray-400 hover:text-chocolate rounded-full transition-colors"
                aria-label="Close modal"
              >
                <XCircle size={28} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-8 flex-1 overflow-y-auto min-h-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-rose-deep">
                    <UserIcon size={18} />
                    <h3 className="font-bold text-xs uppercase tracking-wider">Customer Info</h3>
                  </div>
                  <div className="text-sm bg-cream p-5 rounded-2xl border border-cream/50 h-full">
                    <p className="font-bold text-chocolate mb-1">{selectedOrder.customer?.name}</p>
                    <p className="text-gray-500 mb-1 truncate">{selectedOrder.customer?.email}</p>
                    <p className="text-gray-500">{selectedOrder.customer?.phone}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-rose-deep">
                    <Calendar size={18} />
                    <h3 className="font-bold text-xs uppercase tracking-wider">Delivery Schedule</h3>
                  </div>
                  <div className="text-sm bg-cream-dark p-5 rounded-2xl border border-rose-deep/20 h-full">
                    <p className="text-[10px] font-bold text-rose-deep uppercase tracking-widest mb-1">Date</p>
                    <p className="font-bold text-chocolate text-base">
                      {selectedOrder.deliveryDate ? new Date(selectedOrder.deliveryDate).toLocaleDateString(undefined, { dateStyle: 'long' }) : 'Not specified'}
                    </p>
                    {selectedOrder.deliveryTimeSlot && (
                      <div className="mt-2">
                        <p className="text-[10px] font-bold text-rose-deep uppercase tracking-widest mb-1">Time Slot</p>
                        <p className="font-bold text-chocolate text-sm">{selectedOrder.deliveryTimeSlot}</p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="space-y-3">
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
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-rose-deep">
                    <ShieldCheck size={18} />
                    <h3 className="font-bold text-xs uppercase tracking-wider">Delivery Instructions</h3>
                  </div>
                  <div className="bg-orange-50 p-5 rounded-2xl border border-orange-100 italic text-sm text-chocolate">
                    &quot;{selectedOrder.deliveryInstructions}&quot;
                  </div>
                </div>
              )}

              <div className="space-y-3">
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
                        <div className="flex flex-col min-w-0">
                          <span className="text-sm font-bold text-chocolate truncate">{item.name}</span>
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
                      <span className="text-sm font-bold text-chocolate shrink-0">₹{item.quantity * item.price}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100">
                <div className="flex items-center gap-2 text-rose-deep mb-4">
                  <CreditCard size={18} />
                  <h3 className="font-bold text-xs uppercase tracking-wider">Payment Details</h3>
                </div>
                <div className="bg-chocolate text-white p-6 sm:p-8 rounded-[32px] shadow-xl relative overflow-hidden">
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
                          <p className="text-3xl sm:text-4xl font-black text-blush">₹{selectedOrder.totalAmount}</p>
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
        </div>,
        document.body
      )}

      {hasMore && !loading && (
        <div className="flex justify-center mt-8">
          <button
            onClick={() => fetchUsers(true)}
            className="px-8 py-3 bg-white border border-gray-100 rounded-2xl font-bold text-chocolate hover:bg-gray-50 transition-all shadow-sm h-11 min-h-[44px]"
          >
            Load More Customers
          </button>
        </div>
      )}

    </div>
  );
};

export default AdminCustomers;
