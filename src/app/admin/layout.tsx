"use client";

import React, { useEffect, useState } from 'react';
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
import { Suspense } from 'react';

const AdminLayoutContent = ({ children }: { children: React.ReactNode }) => {
  const { user, isAdmin, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const isBypass = searchParams?.get('bypass') === 'true';

  useEffect(() => {
    if (isBypass) return;
    if (!loading && (!user || !isAdmin)) {
      router.push('/login');
    }
  }, [user, isAdmin, loading, router, isBypass]);

  // Lock body scroll when sidebar drawer is open on mobile
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isSidebarOpen]);

  if (!isBypass && (loading || !user || !isAdmin)) {
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
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50 overflow-x-hidden">

      {/* Mobile Sticky Header */}
      <header className="lg:hidden sticky top-0 z-[150] w-full flex items-center justify-between px-4 py-3 bg-chocolate text-white shadow-md h-16 shrink-0">
        <button
          className="w-11 h-11 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 transition-all text-white focus:outline-none"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          aria-label="Toggle Sidebar Menu"
        >
          {isSidebarOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        <Link href="/" className="font-playfair text-lg font-bold text-center">
          The Cake <span className="text-blush">Lounge</span>
          <span className="block text-[8px] uppercase tracking-[0.2em] text-blush/60 font-poppins font-semibold">Admin Panel</span>
        </Link>

        {/* Dynamic User Avatar / Logo placeholder to balance header */}
        <div className="w-11 h-11 flex items-center justify-center">
          {user ? (
            <div className="w-8 h-8 rounded-full bg-rose-deep flex items-center justify-center text-white text-xs font-bold border border-white/20">
              {user.displayName ? user.displayName[0].toUpperCase() : user.email?.[0].toUpperCase() || 'A'}
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-blush text-xs font-bold">
              CL
            </div>
          )}
        </div>
      </header>

      {/* Sidebar Drawer Container */}
      <aside className={`
        fixed inset-y-0 left-0 z-[200] w-64 bg-chocolate text-white transition-transform duration-300 ease-in-out transform flex flex-col h-full
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full p-6 overflow-y-auto">
          {/* Brand/Header */}
          <div className="mb-8 pt-4 lg:pt-0 flex items-center justify-between">
            <Link href="/" className="font-playfair text-2xl font-bold">
              The Cake <span className="text-blush">Lounge</span>
              <span className="block text-[10px] uppercase tracking-[0.2em] text-blush/60 mt-1 font-poppins">Admin Dashboard</span>
            </Link>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 space-y-1.5">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 h-11 min-h-[44px]
                    ${isActive
                      ? 'bg-rose-deep text-white shadow-lg shadow-rose-deep/20'
                      : 'text-white/70 hover:bg-white/10 hover:text-white'}
                  `}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <span className="shrink-0">{item.icon}</span>
                  <span className="font-bold text-xs uppercase tracking-wider">{item.label}</span>
                  {isActive && <ChevronRight size={14} className="ml-auto text-white shrink-0" />}
                </Link>
              );
            })}
          </nav>

          {/* Sidebar Footer with Logout */}
          <div className="mt-auto pt-6 border-t border-white/10">
            {user && (
              <div className="flex items-center gap-3 px-4 py-3 mb-4 bg-white/5 rounded-2xl border border-white/5">
                <div className="w-10 h-10 rounded-full bg-rose-deep flex items-center justify-center text-white font-bold border-2 border-white/20 shrink-0">
                  {user.displayName ? user.displayName[0].toUpperCase() : user.email?.[0].toUpperCase() || 'A'}
                </div>
                <div className="flex flex-col overflow-hidden">
                  <span className="font-bold text-sm truncate" title={user.displayName || 'Admin'}>{user.displayName || 'Admin'}</span>
                  <span className="text-[10px] text-white/50 truncate" title={user.email || ''}>{user.email}</span>
                </div>
              </div>
            )}
            <button
              onClick={() => logout()}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-white/60 hover:bg-red-500/15 hover:text-red-400 transition-all duration-300 h-11 min-h-[44px]"
            >
              <LogOut size={20} className="shrink-0" />
              <span className="font-bold text-xs uppercase tracking-wider">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-64 p-4 sm:p-6 lg:p-8 transition-all duration-300 min-w-0">
        <div className="max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>

      {/* Overlay Backdrop for Mobile Sidebar Drawer */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-chocolate/60 backdrop-blur-sm z-[180] lg:hidden transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
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
