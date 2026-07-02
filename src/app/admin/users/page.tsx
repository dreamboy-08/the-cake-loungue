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
  updateDoc,
  doc,
  onSnapshot,
  where
} from 'firebase/firestore';
import {
  Users,
  Search,
  Shield,
  ShieldCheck,
  ShieldAlert,
  User as UserIcon,
  Loader2,
  Filter,
  CheckCircle2,
  AlertCircle,
  XCircle,
  RefreshCcw,
  Search as SearchIcon
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const ROLES = [
  { value: 'admin', label: 'Admin', icon: <ShieldCheck size={14} />, color: 'bg-rose-deep', textColor: 'text-rose-deep' },
  { value: 'staff', label: 'Staff', icon: <Shield size={14} />, color: 'bg-blue-500', textColor: 'text-blue-500' },
  { value: 'user', label: 'Customer', icon: <UserIcon size={14} />, color: 'bg-gray-500', textColor: 'text-gray-500' },
];

const AdminUsers = () => {
  const { user: currentUser, isAdmin } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    setLoading(true);
    const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedUsers = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setUsers(fetchedUsers);
      setLoading(false);
    }, (error) => {
      console.error("Error listening to users:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleRoleChange = async (userId: string, newRole: string) => {
    if (!isAdmin) {
      showToast("You do not have permission to manage roles.", "error");
      return;
    }

    if (userId === currentUser?.uid) {
      showToast("You cannot change your own role.", "error");
      return;
    }

    setUpdatingId(userId);
    try {
      await updateDoc(doc(db, 'users', userId), {
        role: newRole,
        updatedAt: new Date().toISOString()
      });
      showToast("User role updated successfully.");
    } catch (error) {
      console.error("Error updating role:", error);
      showToast("Failed to update user role.", "error");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const name = (u.displayName || '').toLowerCase();
      const email = (u.email || '').toLowerCase();
      const role = u.role || 'user';

      const matchesSearch = name.includes(searchTerm.toLowerCase()) ||
                          email.includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === 'All' || role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, searchTerm, roleFilter]);

  const getRoleBadge = (roleValue: string) => {
    const role = ROLES.find(r => r.value === roleValue) || ROLES[3];
    return (
      <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-opacity-10 ${role.textColor} ${role.color.replace('bg-', 'bg-opacity-10 bg-')}`}>
        {role.icon}
        {role.label}
      </span>
    );
  };

  return (
    <div className="space-y-8 animate-fade-up pb-12">
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-8 left-1/2 -translate-x-1/2 z-[500] px-6 py-3 rounded-[22px] shadow-2xl flex items-center gap-3 font-bold text-sm ${
              toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
            }`}
          >
            {toast.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-playfair font-bold text-chocolate">User Role Management</h1>
          <p className="text-gray-500 mt-1">Control access levels and manage team permissions.</p>
        </div>
      </header>

      <div className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-rose/20 outline-none transition-all text-sm"
          />
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Filter Role:</span>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-4 py-2 rounded-xl bg-gray-50 border-none text-xs font-bold text-chocolate outline-none cursor-pointer"
            >
              <option value="All">All Roles</option>
              {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-8 py-5 text-[10px] font-black text-chocolate/40 uppercase tracking-widest">User Information</th>
                <th className="px-8 py-5 text-[10px] font-black text-chocolate/40 uppercase tracking-widest text-center">Current Role</th>
                <th className="px-8 py-5 text-[10px] font-black text-chocolate/40 uppercase tracking-widest text-center">Joined Date</th>
                <th className="px-8 py-5 text-[10px] font-black text-chocolate/40 uppercase tracking-widest text-right">Assign New Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading && users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center">
                    <Loader2 className="animate-spin mx-auto text-rose-deep mb-4" size={32} />
                    <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">Fetching users...</p>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center">
                    <Users className="mx-auto text-gray-100 mb-4" size={64} />
                    <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">No users found</p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold border-2 ${
                          u.role === 'admin' ? 'bg-rose-50 text-rose-deep border-rose-100' :
                          'bg-cream-dark text-chocolate border-rose/10'
                        }`}>
                          {u.displayName?.[0] || u.email?.[0] || 'U'}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-chocolate text-sm leading-tight flex items-center gap-2">
                            {u.displayName || 'Guest User'}
                            {u.id === currentUser?.uid && (
                              <span className="text-[8px] bg-chocolate text-white px-1.5 py-0.5 rounded-full uppercase tracking-tighter">You</span>
                            )}
                          </span>
                          <span className="text-[10px] text-gray-400 mt-0.5">{u.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-4 text-center">
                      <div className="flex justify-center">
                        {getRoleBadge(u.role || 'user')}
                      </div>
                    </td>
                    <td className="px-8 py-4 text-center">
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' }) : 'Unknown'}
                      </span>
                    </td>
                    <td className="px-8 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        {updatingId === u.id ? (
                          <Loader2 className="animate-spin text-rose-deep" size={20} />
                        ) : (
                          <select
                            disabled={!isAdmin || u.id === currentUser?.uid}
                            value={u.role || 'user'}
                            onChange={(e) => handleRoleChange(u.id, e.target.value)}
                            className="px-4 py-2 rounded-xl bg-gray-50 border border-gray-100 text-xs font-bold text-chocolate outline-none cursor-pointer hover:border-rose-deep/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {ROLES.map(r => (
                              <option key={r.value} value={r.value}>{r.label}</option>
                            ))}
                          </select>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-cream-dark/30 p-8 rounded-[40px] border border-rose/10 flex flex-col md:flex-row items-center gap-6 mt-8">
        <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-rose-deep shadow-sm">
           <ShieldAlert size={32} />
        </div>
        <div className="flex-1 text-center md:text-left">
           <h3 className="text-lg font-bold text-chocolate mb-1">Permission Guardrails</h3>
           <p className="text-sm text-gray-500">Administrators have full control over role assignments. Changes are applied instantly across the platform. Users cannot modify their own permissions to prevent accidental lockouts.</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="text-right hidden lg:block">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Your Status</p>
              <p className="text-sm font-bold text-chocolate capitalize">{isAdmin ? 'Administrator (Full Access)' : 'Team Member'}</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
