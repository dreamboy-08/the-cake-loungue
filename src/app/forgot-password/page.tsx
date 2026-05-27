"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Mail, ArrowLeft, Send, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      await resetPassword(email);
      setMessage('Password reset email sent! Please check your inbox.');
    } catch (err: any) {
      setError(err.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream pt-32 pb-20 flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="bg-rose-deep py-8 px-6 text-center">
          <h1 className="font-playfair text-3xl font-bold text-white">Reset Password</h1>
          <p className="text-white/80 mt-2">We'll help you get back into your account</p>
        </div>

        <div className="p-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm">
              {error}
            </div>
          )}

          {message ? (
            <div className="text-center py-6 animate-fade-up">
              <CheckCircle2 className="mx-auto text-green-500 mb-4" size={48} />
              <p className="text-chocolate font-medium mb-8">{message}</p>
              <Link
                href="/login"
                title="Back to Login"
                className="inline-flex items-center gap-2 text-rose font-bold hover:text-rose-deep transition-all"
              >
                <ArrowLeft size={18} />
                Back to Login
              </Link>
            </div>
          ) : (
            <>
              <form onSubmit={handleReset} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-chocolate mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-chocolate/40" size={20} />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-cream/50 border border-rose/10 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-rose/20 transition-all text-chocolate"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-rose-deep text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-brown transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-rose-deep/20"
                >
                  {loading ? "Sending..." : (
                    <>
                      <Send size={18} />
                      Send Reset Link
                    </>
                  )}
                </button>
              </form>

              <div className="mt-8 text-center">
                <Link
                  href="/login"
                  title="Back to Login"
                  className="inline-flex items-center gap-2 text-chocolate/60 text-sm hover:text-rose transition-all"
                >
                  <ArrowLeft size={16} />
                  Back to Login
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
