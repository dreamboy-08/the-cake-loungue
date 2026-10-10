"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Mail, Lock, User, LogIn, UserPlus, Chrome, ShieldCheck } from 'lucide-react';

function CustomerAuthGuardContent({ children }: { children: React.ReactNode }) {
  const { user, loading, login, signup, signInWithGoogle } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [authSubmitting, setAuthSubmitting] = useState(false);

  // Check if current route is public/exempt from mandatory auth gate
  const isExemptRoute =
    pathname === '/login' ||
    pathname === '/signup' ||
    pathname === '/forgot-password' ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/policies');

  // Prevent background scrolling when auth gate is active
  useEffect(() => {
    if (!loading && !user && !isExemptRoute) {
      document.body.style.overflow = 'hidden';
      // Save intended destination if not stored yet
      if (typeof window !== 'undefined' && pathname && !sessionStorage.getItem('auth_redirect')) {
        const fullPath = pathname + (window.location.search || '');
        if (fullPath !== '/' && !fullPath.startsWith('/login') && !fullPath.startsWith('/signup')) {
          sessionStorage.setItem('auth_redirect', fullPath);
        }
      }
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [loading, user, isExemptRoute, pathname]);

  const handleRedirectAfterAuth = () => {
    if (typeof window !== 'undefined') {
      const redirectUrl = sessionStorage.getItem('auth_redirect');
      if (redirectUrl) {
        sessionStorage.removeItem('auth_redirect');
        router.push(redirectUrl);
        return;
      }
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setAuthSubmitting(true);
    try {
      await login(email, password);
      handleRedirectAfterAuth();
    } catch (err: any) {
      setError(err.message || 'Failed to sign in. Please check your credentials.');
    } finally {
      setAuthSubmitting(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setAuthSubmitting(true);
    try {
      await signup(email, password, name);
      handleRedirectAfterAuth();
    } catch (err: any) {
      setError(err.message || 'Failed to create account. Please try again.');
    } finally {
      setAuthSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setAuthSubmitting(true);
    try {
      await signInWithGoogle();
      handleRedirectAfterAuth();
    } catch (err: any) {
      setError(err.message || 'Failed to sign in with Google.');
    } finally {
      setAuthSubmitting(false);
    }
  };

  // 1. While auth state is initializing, allow children or loading spinner
  if (loading) {
    return <>{children}</>;
  }

  // 2. If user is authenticated OR on an exempt route, render children normally
  if (user || isExemptRoute) {
    return <>{children}</>;
  }

  // 3. Otherwise, render the FULL SCREEN NON-DISMISSIBLE AUTH GATE overlay
  return (
    <div className="fixed inset-0 z-[9999] bg-chocolate/95 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="max-w-md w-full bg-cream rounded-[36px] shadow-2xl border border-cream-dark overflow-hidden my-auto animate-fade-up">
        {/* Gate Top Header Banner */}
        <div className="bg-rose-deep py-8 px-8 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-deep via-rose to-gold" />
          <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3 text-white border border-white/20">
            <ShieldCheck size={26} />
          </div>
          <h1 className="font-playfair text-2xl sm:text-3xl font-bold text-white leading-tight">
            Welcome to The Cake Lounge
          </h1>
          <p className="text-white/80 text-xs sm:text-sm mt-1.5 font-medium">
            Please log in or create an account to access our patisserie.
          </p>
        </div>

        {/* Gate Main Body */}
        <div className="p-6 sm:p-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-2xl mb-6 text-xs sm:text-sm font-medium">
              {error}
            </div>
          )}

          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 gap-2 p-1.5 bg-cream-dark rounded-2xl mb-6">
            <button
              type="button"
              onClick={() => { setMode('login'); setError(''); }}
              className={`py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all ${
                mode === 'login' ? 'bg-white text-chocolate shadow-md' : 'text-text-mid hover:text-chocolate'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setMode('signup'); setError(''); }}
              className={`py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all ${
                mode === 'signup' ? 'bg-white text-chocolate shadow-md' : 'text-text-mid hover:text-chocolate'
              }`}
            >
              Create Account
            </button>
          </div>

          {mode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-chocolate mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-chocolate/40" size={18} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white border border-cream-dark rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-rose/30 text-chocolate placeholder-text-soft"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-chocolate mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-chocolate/40" size={18} />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white border border-cream-dark rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-rose/30 text-chocolate placeholder-text-soft"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={authSubmitting}
                className="w-full bg-rose-deep hover:bg-brown text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50 text-sm shadow-md cursor-pointer mt-2"
              >
                {authSubmitting ? (
                  "Signing In..."
                ) : (
                  <>
                    <LogIn size={18} />
                    Sign In
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignupSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-chocolate mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-chocolate/40" size={18} />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white border border-cream-dark rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-rose/30 text-chocolate placeholder-text-soft"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-chocolate mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-chocolate/40" size={18} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white border border-cream-dark rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-rose/30 text-chocolate placeholder-text-soft"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-chocolate mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-chocolate/40" size={18} />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white border border-cream-dark rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-rose/30 text-chocolate placeholder-text-soft"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={authSubmitting}
                className="w-full bg-rose-deep hover:bg-brown text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50 text-sm shadow-md cursor-pointer mt-2"
              >
                {authSubmitting ? (
                  "Creating Account..."
                ) : (
                  <>
                    <UserPlus size={18} />
                    Create Account
                  </>
                )}
              </button>
            </form>
          )}

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-cream-dark"></div>
              </div>
              <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest">
                <span className="bg-cream px-3 text-chocolate/50">Or continue with</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={authSubmitting}
              className="mt-4 w-full bg-white border border-cream-dark hover:bg-cream-dark text-chocolate py-3 rounded-xl font-bold flex items-center justify-center gap-2.5 transition-all text-xs sm:text-sm cursor-pointer shadow-sm"
            >
              <Chrome size={18} className="text-rose" />
              Sign in with Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CustomerAuthGuard({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<>{children}</>}>
      <CustomerAuthGuardContent>{children}</CustomerAuthGuardContent>
    </Suspense>
  );
}
