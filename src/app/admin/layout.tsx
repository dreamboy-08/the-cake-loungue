"use client";

import React, { useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard,
  Package,
  Tags,
  ShoppingBag,
  Users,
  ShieldCheck,
  LogOut,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';

import { Suspense } from 'react';

const AdminLayoutContent = ({ children }: { children: React.ReactNode }) => {
  const { user, isAdmin, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.push('/login');
    }
  }, [user, isAdmin, loading, router]);

  if (loading || !user || !isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-cream">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-deep"></div>
      </div>
    );
  }

  const menuItems = [
    { label: 'Dashboard', href: '/admin', icon: <LayoutDashboard size={20} /> },
    { label: 'Products', href: '/admin/products', icon: <Package size={20} /> },
    { label: 'Categories', href: '/admin/categories', icon: <Tags size={20} /> },
    { label: 'Orders', href: '/admin/orders', icon: <ShoppingBag size={20} /> },
    { label: 'Customers', href: '/admin/customers', icon: <Users size={20} /> },
    { label: 'Team Roles', href: '/admin/users', icon: <ShieldCheck size={20} /> },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile Sidebar Toggle */}
      <button
        className="lg:hidden fixed top-4 left-4 z-[250] p-2 bg-white rounded-lg shadow-md text-chocolate"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-[200] w-64 bg-chocolate text-white transition-transform duration-300 transform
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full p-6">
          <div className="mb-10 pt-4 lg:pt-0">
            <Link href="/" className="font-playfair text-2xl font-bold">
              Cake <span className="text-blush">Lounge</span>
              <span className="block text-[10px] uppercase tracking-[0.2em] text-blush/60 mt-1 font-poppins">Admin Dashboard</span>
            </Link>
          </div>

          <nav className="flex-1 space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300
                  ${pathname === item.href
                    ? 'bg-rose-deep text-white shadow-lg shadow-rose-deep/20'
                    : 'text-white/60 hover:bg-rose hover:text-white'}
                `}
                onClick={() => setIsSidebarOpen(false)}
              >
                {item.icon}
                <span className="font-medium text-sm">{item.label}</span>
                {pathname === item.href && <ChevronRight size={14} className="ml-auto" />}
              </Link>
            ))}
          </nav>

          <div className="mt-auto pt-6 border-t border-white/10">
            {user && (
              <div className="flex items-center gap-3 px-4 py-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-rose-deep flex items-center justify-center text-white font-bold border-2 border-white/20">
                  {user.displayName ? user.displayName[0].toUpperCase() : user.email?.[0].toUpperCase() || 'A'}
                </div>
                <div className="flex flex-col overflow-hidden">
                  <span className="font-bold text-sm truncate">{user.displayName || 'Admin'}</span>
                  <span className="text-xs text-rose-deep/60 truncate">{user.email}</span>
                </div>
              </div>
            )}
            <button
              onClick={() => logout()}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-white/60 hover:bg-red-500/10 hover:text-red-400 transition-all duration-300"
            >
              <LogOut size={20} />
              <span className="font-medium text-sm">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 p-4 lg:p-8 pt-20 lg:pt-8 transition-all duration-300">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-chocolate/50 z-[150] lg:hidden  transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-cream">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-deep"></div>
      </div>
    }>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </Suspense>
  );
};

export default AdminLayout;
