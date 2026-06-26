"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Mail, Lock, LogIn, Chrome } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login, signInWithGoogle } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    try {
      await signInWithGoogle();
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Failed to sign in with Google');
    }
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-6 py-20 md:py-32">
      <div className="max-w-md w-full bg-white rounded-[40px] shadow-2xl overflow-hidden animate-fade-up">
        <div className="bg-rose-deep pt-12 pb-10 px-8 text-center">
          <h1 className="font-playfair text-4xl font-bold text-white leading-tight">Welcome Back</h1>
          <p className="text-white/80 mt-2 font-medium">Login to your Cake Lounge account</p>
        </div>

        <div className="p-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-chocolate mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-chocolate/40" size={20} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-cream border border-rose/10 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-rose/20 transition-all text-chocolate"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-chocolate">Password</label>
                <Link href="/forgot-password" title="Forgot Password" className="text-xs text-rose hover:text-rose-deep font-semibold">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-chocolate/40" size={20} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-cream border border-rose/10 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-rose/20 transition-all text-chocolate"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-rose-deep text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-brown transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-rose-deep/20"
            >
              {loading ? "Logging in..." : (
                <>
                  <LogIn size={20} />
                  Login
                </>
              )}
            </button>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-rose/10"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-4 text-chocolate/40 font-medium">Or continue with</span>
              </div>
            </div>

            <button
              onClick={handleGoogleSignIn}
              className="mt-6 w-full bg-white border border-rose/10 text-chocolate py-4 rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-cream transition-all"
            >
              <Chrome size={20} className="text-rose" />
              Sign in with Google
            </button>
          </div>

          <p className="text-center mt-10 text-chocolate/60 text-sm">
            Don&apos;t have an account?{' '}
            <Link href="/signup" title="Sign Up" className="text-rose font-bold hover:text-rose-deep">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
