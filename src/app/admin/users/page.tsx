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
  Search as SearchIcon,
  Trash2,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import AdminConfirmationModal from '@/components/admin/AdminConfirmationModal';

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

  // Modal states for Team Roles confirmations
  const [pendingRoleChange, setPendingRoleChange] = useState<{ user: any; newRole: string } | null>(null);
  const [pendingUserDelete, setPendingUserDelete] = useState<any | null>(null);
  const [isDeletingUser, setIsDeletingUser] = useState(false);
  const [userDeleteError, setUserDeleteError] = useState<string | null>(null);

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

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    setLoading(true);
    const fallbackUsers = [
      {
        id: 'user_1',
        displayName: 'Eleanor Vance',
        email: 'eleanor@cakelounge.com',
        role: 'user',
        createdAt: '2024-01-15T10:00:00.000Z',
      },
      {
        id: 'user_2',
        displayName: 'Julian Caine',
        email: 'julian@cakelounge.com',
        role: 'staff',
        createdAt: '2024-02-01T14:30:00.000Z',
      }
    ];

    const isFirebaseConfigured =
      typeof process !== 'undefined' &&
      process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
      process.env.NEXT_PUBLIC_FIREBASE_API_KEY !== "your_api_key" &&
      process.env.NEXT_PUBLIC_FIREBASE_API_KEY !== "missing";

    if (!isFirebaseConfigured) {
      setUsers(fallbackUsers);
      setLoading(false);
      return;
    }

    const timer = setTimeout(() => {
      setUsers(prev => prev.length > 0 ? prev : fallbackUsers);
      setLoading(false);
    }, 500);

    try {
      const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));

      const unsubscribe = onSnapshot(q, (snapshot) => {
        clearTimeout(timer);
        const fetchedUsers = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        setUsers(fetchedUsers.length > 0 ? fetchedUsers : fallbackUsers);
        setLoading(false);
      }, (error) => {
        clearTimeout(timer);
        console.error("Error listening to users:", error);
        setUsers(fallbackUsers);
        setLoading(false);
      });

      return () => {
        clearTimeout(timer);
        unsubscribe();
      };
    } catch (err) {
      console.error("Error initializing users listener:", err);
      clearTimeout(timer);
      setUsers(fallbackUsers);
      setLoading(false);
      return () => {};
    }
  }, []);

  const requestRoleChange = (userToUpdate: any, newRole: string) => {
    if (!isAdmin) {
      showToast("You do not have permission to manage roles.", "error");
      return;
    }

    if (userToUpdate.id === currentUser?.uid) {
      showToast("You cannot change your own role.", "error");
      return;
    }

    if ((userToUpdate.role || 'user') === newRole) {
      return;
    }

    setPendingRoleChange({ user: userToUpdate, newRole });
  };

  const confirmRoleChange = async () => {
    if (!pendingRoleChange) return;
    const { user: targetUser, newRole } = pendingRoleChange;
    setUpdatingId(targetUser.id);
    try {
      await updateDoc(doc(db, 'users', targetUser.id), {
        role: newRole,
        updatedAt: new Date().toISOString()
      });
      showToast(`User role updated to ${newRole.toUpperCase()} successfully.`);
    } catch (error) {
      console.error("Error updating role:", error);
      showToast("Failed to update user role.", "error");
    } finally {
      setUpdatingId(null);
      setPendingRoleChange(null);
    }
  };

  const confirmDeleteUser = async () => {
    if (!pendingUserDelete) return;
    setIsDeletingUser(true);
    setUserDeleteError(null);

    try {
      let idToken = '';
      if (currentUser && typeof (currentUser as any).getIdToken === 'function') {
        idToken = await (currentUser as any).getIdToken();
      }

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (idToken) {
        headers['Authorization'] = `Bearer ${idToken}`;
      }

      const res = await fetch('/api/admin/delete-customer', {
        method: 'POST',
        headers,
        body: JSON.stringify({ targetUid: pendingUserDelete.id })
      });

      let data: any = null;
      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        try {
          data = await res.json();
        } catch (jsonErr) {
          throw new Error(`Invalid JSON response received from server (Status ${res.status})`);
        }
      } else {
        const text = await res.text();
        throw new Error(text || `Server returned non-JSON response with status ${res.status}`);
      }

      if (!res.ok || !data || !data.success) {
        throw new Error(data?.error || data?.message || 'Failed to delete user');
      }

      setUsers(prev => prev.filter(u => u.id !== pendingUserDelete.id));
      showToast(`User ${pendingUserDelete.displayName || pendingUserDelete.email} permanently deleted.`);
      setPendingUserDelete(null);
    } catch (err: any) {
      console.error("Error deleting user:", err);
      setUserDeleteError(err.message || "Failed to delete user account.");
    } finally {
      setIsDeletingUser(false);
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
    <div className="px-4 sm:px-6 md:px-8 py-6 space-y-6 sm:space-y-8 animate-fade-up pb-24 max-w-[1600px] mx-auto">
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

      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-playfair font-bold text-chocolate">User Role Management</h1>
          <p className="text-gray-500 text-sm mt-1">Control access levels and manage team permissions.</p>
        </div>
      </header>

      <div className="bg-white p-4 sm:p-6 rounded-[28px] sm:rounded-[32px] shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 sm:gap-6">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-rose/20 outline-none transition-all text-sm h-11 min-h-[44px]"
          />
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-gray-50 px-4 py-3 rounded-xl border border-gray-50 h-11 min-h-[44px] w-full md:w-auto">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Filter Role:</span>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-transparent text-xs font-bold text-chocolate outline-none cursor-pointer w-full"
            >
              <option value="All">All Roles</option>
              {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
            </select>
          </div>
        </div>
      </div>

      {!isMobile ? (
        <div className="bg-white rounded-[28px] sm:rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
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
                            <>
                              <select
                                disabled={!isAdmin || u.id === currentUser?.uid}
                                value={u.role || 'user'}
                                onChange={(e) => requestRoleChange(u, e.target.value)}
                                className="px-4 py-2 rounded-xl bg-gray-50 border border-gray-100 text-xs font-bold text-chocolate outline-none cursor-pointer hover:border-rose-deep/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed h-11 min-h-[44px]"
                              >
                                {ROLES.map(r => (
                                  <option key={r.value} value={r.value}>{r.label}</option>
                                ))}
                              </select>
                              {isAdmin && u.id !== currentUser?.uid && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setUserDeleteError(null);
                                    setPendingUserDelete(u);
                                  }}
                                  title="Delete User"
                                  className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors rounded-xl flex items-center justify-center h-10 w-10"
                                >
                                  <Trash2 size={18} />
                                </button>
                              )}
                            </>
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
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {loading && users.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-gray-100 text-center flex flex-col items-center justify-center">
              <Loader2 className="animate-spin text-rose-deep mb-4" size={40} />
              <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">Fetching users...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-gray-100 text-center flex flex-col items-center justify-center">
              <Users className="mx-auto text-gray-100 mb-4" size={64} />
              <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">No users found</p>
            </div>
          ) : (
            filteredUsers.map((u) => (
              <div key={u.id} className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm space-y-4">
                <div className="flex gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold border-2 shrink-0 ${
                    u.role === 'admin' ? 'bg-rose-50 text-rose-deep border-rose-100' :
                    'bg-cream-dark text-chocolate border-rose/10'
                  }`}>
                    {u.displayName?.[0] || u.email?.[0] || 'U'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-chocolate text-base truncate flex items-center gap-2">
                      {u.displayName || 'Guest User'}
                      {u.id === currentUser?.uid && (
                        <span className="text-[8px] bg-chocolate text-white px-1.5 py-0.5 rounded-full uppercase tracking-tighter">You</span>
                      )}
                    </h3>
                    <p className="text-[11px] text-gray-400 truncate mt-0.5">{u.email}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      {getRoleBadge(u.role || 'user')}
                      <span className="text-[10px] font-bold text-gray-400">
                        Joined: {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'Unknown'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-50 flex items-center justify-between gap-3">
                  <div className="flex-1">
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1">Assign New Role</span>
                    {updatingId === u.id ? (
                      <div className="h-11 flex items-center justify-center">
                        <Loader2 className="animate-spin text-rose-deep" size={20} />
                      </div>
                    ) : (
                      <select
                        disabled={!isAdmin || u.id === currentUser?.uid}
                        value={u.role || 'user'}
                        onChange={(e) => requestRoleChange(u, e.target.value)}
                        className="w-full h-11 px-4 py-2 rounded-xl bg-gray-50 border border-gray-100 text-xs font-bold text-chocolate outline-none cursor-pointer hover:border-rose-deep/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {ROLES.map(r => (
                          <option key={r.value} value={r.value}>{r.label}</option>
                        ))}
                      </select>
                    )}
                  </div>
                  {isAdmin && u.id !== currentUser?.uid && (
                    <button
                      type="button"
                      onClick={() => {
                        setUserDeleteError(null);
                        setPendingUserDelete(u);
                      }}
                      title="Delete User"
                      className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors rounded-xl flex items-center justify-center h-11 w-11 mt-4"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Role Change Confirmation Modal */}
      <AdminConfirmationModal
        isOpen={!!pendingRoleChange}
        onClose={() => setPendingRoleChange(null)}
        onConfirm={confirmRoleChange}
        title="Confirm Role Change?"
        message="Are you sure you want to change the access permissions for this account?"
        confirmText={updatingId ? "Updating..." : "Confirm Role Change"}
        cancelText="Cancel"
        type={pendingRoleChange?.newRole === 'admin' ? 'warning' : 'info'}
        isLoading={!!updatingId}
      >
        {pendingRoleChange && (
          <div className="space-y-4 pt-1">
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-left space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-gray-500">User:</span>
                <span className="font-bold text-chocolate">{pendingRoleChange.user.displayName || 'Guest User'}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-gray-500">Email:</span>
                <span className="font-bold text-chocolate truncate max-w-[200px]">{pendingRoleChange.user.email}</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 p-4 bg-cream-dark/50 rounded-2xl border border-rose/10">
              <div className="text-center">
                <span className="text-[9px] font-black uppercase text-gray-400 block mb-1">Current Role</span>
                {getRoleBadge(pendingRoleChange.user.role || 'user')}
              </div>
              <ArrowRight size={18} className="text-rose-deep shrink-0" />
              <div className="text-center">
                <span className="text-[9px] font-black uppercase text-gray-400 block mb-1">New Role</span>
                {getRoleBadge(pendingRoleChange.newRole)}
              </div>
            </div>
          </div>
        )}
      </AdminConfirmationModal>

      {/* Delete User Confirmation Modal */}
      <AdminConfirmationModal
        isOpen={!!pendingUserDelete}
        onClose={() => {
          if (!isDeletingUser) {
            setPendingUserDelete(null);
            setUserDeleteError(null);
          }
        }}
        onConfirm={confirmDeleteUser}
        title="Permanently Delete User?"
        message="Are you sure you want to delete this user account? This action cannot be undone."
        confirmText={isDeletingUser ? "Deleting..." : "Permanently Delete"}
        cancelText="Cancel"
        type="danger"
        isLoading={isDeletingUser}
      >
        {pendingUserDelete && (
          <div className="space-y-4 pt-1">
            <div className="bg-red-50/60 p-4 rounded-2xl border border-red-100 text-left space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-gray-500">Name:</span>
                <span className="font-bold text-chocolate">{pendingUserDelete.displayName || 'Guest User'}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-gray-500">Email:</span>
                <span className="font-bold text-chocolate truncate max-w-[200px]">{pendingUserDelete.email}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-gray-500">UID:</span>
                <span className="font-mono text-[10px] text-gray-400">{pendingUserDelete.id}</span>
              </div>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200/60 rounded-xl text-left text-[11px] text-amber-800 leading-relaxed font-medium">
              ⚠️ Deleting this team member will permanently revoke their login and profile.
            </div>

            {userDeleteError && (
              <div className="p-3 bg-red-100 border border-red-300 text-red-800 rounded-xl text-xs font-bold text-left">
                {userDeleteError}
              </div>
            )}
          </div>
        )}
      </AdminConfirmationModal>

      <div className="bg-cream-dark/30 p-6 sm:p-8 rounded-[28px] sm:rounded-[40px] border border-rose/10 flex flex-col md:flex-row items-center gap-6 mt-8">
        <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-rose-deep shadow-sm shrink-0">
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
