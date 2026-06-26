"use client";

import React, { useState, useEffect } from 'react';
import { db } from '@/utils/firebase';
import { collection, query, getDocs, orderBy } from 'firebase/firestore';
import { Search, User as UserIcon, Shield, ShieldAlert, MoreVertical, Check, X, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface UserData {
  uid: string;
  displayName: string;
  email: string;
  role: string;
  createdAt: string;
  lastLogin?: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [confirmingRole, setConfirmingRole] = useState<{ uid: string, role: string } | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const { updateUserRole, isSuperAdmin, isAdmin } = useAuth();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const fetchedUsers: UserData[] = [];
      querySnapshot.forEach((doc) => {
        fetchedUsers.push({ uid: doc.id, ...doc.data() } as UserData);
      });
      setUsers(fetchedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      setMessage({ type: 'error', text: 'Failed to load users' });
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async () => {
    if (!confirmingRole) return;

    setActionLoading(true);
    try {
      await updateUserRole(confirmingRole.uid, confirmingRole.role as any);
      setMessage({ type: 'success', text: 'User role updated successfully' });
      setUsers(users.map(u => u.uid === confirmingRole.uid ? { ...u, role: confirmingRole.role as any } : u));
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to update user role' });
    } finally {
      setActionLoading(false);
      setConfirmingRole(null);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = (user.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          user.uid.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-chocolate font-playfair">User Management</h1>
          <p className="text-chocolate/60 text-sm">View and manage all registered users</p>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-xl flex items-center gap-3 animate-fade-in ${
          message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
        }`}>
          {message.type === 'success' ? <Check size={20} /> : <AlertCircle size={20} />}
          <span className="font-medium">{message.text}</span>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-rose/10 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-chocolate/40" size={18} />
          <input
            type="text"
            placeholder="Search by name, email or UID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-cream/30 border border-rose/10 rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-rose/20 transition-all text-sm"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-cream/30 border border-rose/10 rounded-xl py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-rose/20 transition-all text-sm text-chocolate"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admins</option>
            <option value="staff">Staff</option>
            <option value="user">Customers</option>
          </select>
          <button
            onClick={fetchUsers}
            className="p-2.5 bg-rose-deep text-white rounded-xl hover:bg-brown transition-all"
            title="Refresh list"
          >
            <MoreVertical size={20} />
          </button>
        </div>
      </div>

      {/* User Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-rose/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-cream/30 border-b border-rose/10">
                <th className="px-6 py-4 text-xs font-bold text-chocolate/60 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-xs font-bold text-chocolate/60 uppercase tracking-wider">UID</th>
                <th className="px-6 py-4 text-xs font-bold text-chocolate/60 uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-xs font-bold text-chocolate/60 uppercase tracking-wider">Joined</th>
                <th className="px-6 py-4 text-xs font-bold text-chocolate/60 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rose/5">
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4"><div className="h-10 w-40 bg-cream/50 rounded-lg"></div></td>
                    <td className="px-6 py-4"><div className="h-4 w-24 bg-cream/50 rounded-lg"></div></td>
                    <td className="px-6 py-4"><div className="h-6 w-16 bg-cream/50 rounded-full"></div></td>
                    <td className="px-6 py-4"><div className="h-4 w-24 bg-cream/50 rounded-lg"></div></td>
                    <td className="px-6 py-4 text-right"><div className="h-8 w-20 bg-cream/50 rounded-lg ml-auto"></div></td>
                  </tr>
                ))
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.uid} className="hover:bg-cream/10 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-rose-deep/10 flex items-center justify-center text-rose-deep font-bold border border-rose-deep/20">
                          {user.displayName ? user.displayName[0].toUpperCase() : user.email[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-chocolate text-sm leading-tight">{user.displayName || 'Guest User'}</p>
                          <p className="text-chocolate/50 text-xs mt-0.5">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[10px] font-mono bg-cream/50 px-2 py-1 rounded-md text-chocolate/60">{user.uid}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        user.role === 'super_admin' ? 'bg-purple-100 text-purple-700' :
                        user.role === 'admin' ? 'bg-blue-100 text-blue-700' :
                        user.role === 'staff' ? 'bg-orange-100 text-orange-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-chocolate/60">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      }) : 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        {user.role === 'user' && (
                          <button
                            onClick={() => setConfirmingRole({ uid: user.uid, role: 'admin' })}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                            title="Promote to Admin"
                          >
                            <Shield size={18} />
                          </button>
                        )}
                        {user.role === 'admin' && (
                          <button
                            onClick={() => setConfirmingRole({ uid: user.uid, role: 'user' })}
                            className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-all"
                            title="Demote to Customer"
                          >
                            <ShieldAlert size={18} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center text-chocolate/40">
                    <UserIcon size={48} className="mx-auto mb-4 opacity-20" />
                    <p className="font-medium">No users found matching your criteria</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmingRole && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-[32px] max-w-md w-full p-8 shadow-2xl animate-scale-in">
            <div className="w-16 h-16 rounded-full bg-rose/10 flex items-center justify-center text-rose mx-auto mb-6">
              <AlertCircle size={32} />
            </div>
            <h3 className="text-2xl font-bold text-chocolate font-playfair text-center mb-2">Change User Role?</h3>
            <p className="text-chocolate/60 text-center mb-8">
              Are you sure you want to change this user&apos;s role to <span className="font-bold text-chocolate">{confirmingRole.role}</span>?
              This will update their permissions immediately.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setConfirmingRole(null)}
                disabled={actionLoading}
                className="flex-1 py-4 border border-rose/10 rounded-2xl font-bold text-chocolate hover:bg-cream/50 transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleRoleChange}
                disabled={actionLoading}
                className="flex-1 py-4 bg-rose-deep text-white rounded-2xl font-bold hover:bg-brown transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-rose-deep/20"
              >
                {actionLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>Confirm Change</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
