"use client";

import React, { useState, useEffect } from 'react';
import { db } from '@/utils/firebase';
import {
  collection,
  getDocs,
  query,
  orderBy,
  doc,
  updateDoc,
  getDoc
} from 'firebase/firestore';
import {
  Search,
  Shield,
  User as UserIcon,
  MoreVertical,
  ArrowUpDown,
  Mail,
  Calendar,
  ShieldAlert,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface UserData {
  uid: string;
  name?: string;
  displayName?: string;
  email: string;
  role: 'admin' | 'user' | 'super_admin' | 'staff';
  createdAt?: string;
  lastLogin?: string;
}

export default function UserManagementPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const { user: currentUser, isSuperAdmin } = useAuth();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Note: Removed orderBy to prevent excluding users missing the field before migration
      // and to avoid requiring a composite index immediately.
      const q = query(collection(db, 'users'));
      const snapshot = await getDocs(q);
      const usersList = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          uid: data.uid || doc.id // Ensure UID is present even if not in document data
        };
      }) as UserData[];

      // Sort manually to ensure consistency
      const sortedUsers = usersList.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });

      setUsers(sortedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      setMessage({ type: 'error', text: 'Failed to load users' });
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: 'admin' | 'user') => {
    if (userId === currentUser?.uid) {
      setMessage({ type: 'error', text: 'You cannot change your own role' });
      return;
    }

    setUpdatingId(userId);
    setMessage(null);

    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        role: newRole,
        updatedAt: new Date().toISOString()
      });

      setUsers(prevUsers =>
        prevUsers.map(u => u.uid === userId ? { ...u, role: newRole } : u)
      );

      setMessage({
        type: 'success',
        text: `User ${newRole === 'admin' ? 'promoted to Admin' : 'demoted to Customer'} successfully`
      });
    } catch (error) {
      console.error("Error updating role:", error);
      setMessage({ type: 'error', text: 'Failed to update user role' });
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredUsers = users.filter(user =>
    (user.name || user.displayName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.uid || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch (e) {
      return 'Invalid Date';
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-playfair font-bold text-chocolate">User Management</h1>
          <p className="text-gray-500 mt-1">Manage user roles and permissions</p>
        </div>
      </header>

      {message && (
        <div className={`p-4 rounded-xl flex items-center gap-3 animate-fade-up ${
          message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
        }`}>
          {message.type === 'success' ? <CheckCircle2 size={20} /> : <ShieldAlert size={20} />}
          <span className="font-medium text-sm">{message.text}</span>
        </div>
      )}

      <div className="bg-white rounded-[22px] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by name, email, or UID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-rose-deep/20 transition-all text-sm"
            />
          </div>
          <div className="text-sm text-gray-500">
            Total Users: <span className="font-bold text-chocolate">{users.length}</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Created</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Last Login</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 className="animate-spin text-rose-deep" size={32} />
                      <p className="text-gray-500 text-sm font-medium">Loading users...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                    No users found matching your search.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.uid} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-cream-dark flex items-center justify-center text-rose-deep font-bold border border-rose-deep/10">
                          {(user.name || user.displayName || user.email)[0].toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-chocolate text-sm">
                            {user.name || user.displayName || 'Unnamed User'}
                          </span>
                          <span className="text-xs text-gray-400 flex items-center gap-1">
                            <Mail size={12} />
                            {user.email}
                          </span>
                          <span className="text-[10px] text-gray-300 font-mono mt-0.5">
                            UID: {user.uid}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        user.role === 'admin' || user.role === 'super_admin'
                          ? 'bg-rose-deep/10 text-rose-deep'
                          : 'bg-blue-50 text-blue-600'
                      }`}>
                        <Shield size={12} />
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-gray-300" />
                        {formatDate(user.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(user.lastLogin)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {updatingId === user.uid ? (
                          <Loader2 className="animate-spin text-rose-deep" size={20} />
                        ) : user.role === 'user' ? (
                          <button
                            onClick={() => handleRoleChange(user.uid, 'admin')}
                            className="text-xs font-bold text-rose-deep hover:bg-rose-deep/10 px-3 py-1.5 rounded-lg transition-all"
                            disabled={user.uid === currentUser?.uid}
                          >
                            Promote to Admin
                          </button>
                        ) : (
                          user.role === 'admin' && (
                            <button
                              onClick={() => handleRoleChange(user.uid, 'user')}
                              className="text-xs font-bold text-gray-400 hover:bg-gray-100 px-3 py-1.5 rounded-lg transition-all"
                              disabled={user.uid === currentUser?.uid}
                            >
                              Demote to User
                            </button>
                          )
                        )}
                        {user.uid === currentUser?.uid && (
                          <span className="text-[10px] font-medium text-gray-300 italic px-2">You</span>
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
    </div>
  );
}
