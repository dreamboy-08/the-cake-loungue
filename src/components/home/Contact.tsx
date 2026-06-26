"use client";

import React, { useState } from 'react';
import { MapPin, Phone, Mail, Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    honeypot: '' // Spam protection
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'https://the-cake-loungue.onrender.com').replace(/\/$/, '');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validation
    if (!formData.name || !formData.email || !formData.message) {
      setErrorMessage('Please fill in all required fields.');
      setStatus('error');
      setTimeout(() => setStatus('idle'), 4000);
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch(`${API_URL}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', phone: '', message: '', honeypot: '' });
        setTimeout(() => setStatus('idle'), 6000);
      } else {
        throw new Error(data.error || 'Something went wrong. Please try again.');
      }
    } catch (error: any) {
      console.error('Submission error:', error);
      setErrorMessage(error.message || 'Failed to send message. Please try again.');
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  return (
    <section id="contact" className="py-[100px] bg-white">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          <div className="contact-info">
            <p className="section-label">Get In Touch</p>
            <h2 className="section-title mb-4">Let&apos;s Create Something Sweet Together</h2>
            <p className="section-sub">Have a special order in mind? Want to know more about our bespoke cakes? We&apos;d love to hear from you.</p>

            <div className="mt-9 flex flex-col gap-5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-cream-dark rounded-sm flex items-center justify-center text-rose-deep shrink-0">
                  <MapPin size={20} />
                </div>
                <div>
                  <h4 className="text-[0.88rem] font-semibold text-chocolate">Find Us</h4>
                  <p className="text-[0.82rem] text-text-soft mt-0.5">Cake lounge, U-block, DLF phase-3, sector-24, Gurugram, – Haryana </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-cream-dark rounded-sm flex items-center justify-center text-rose-deep shrink-0">
                  <Phone size={20} />
                </div>
                <div>
                  <h4 className="text-[0.88rem] font-semibold text-chocolate">Call Us</h4>
                  <p className="text-[0.82rem] text-text-soft mt-0.5">+91 77038 70170 · Mon–Sun 8am–10pm</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-cream-dark rounded-sm flex items-center justify-center text-rose-deep shrink-0">
                  <Mail size={20} />
                </div>
                <div>
                  <h4 className="text-[0.88rem] font-semibold text-chocolate">Email Us</h4>
                  <p className="text-[0.82rem] text-text-soft mt-0.5">thecakeloungegurgaon@gmail.com</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-[44px_40px] shadow-md border border-cream relative overflow-hidden">
            <AnimatePresence>
              {status === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-10 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center text-center p-8"
                >
                  <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6 text-green-500">
                    <CheckCircle2 size={48} />
                  </div>
                  <h3 className="text-2xl font-bold text-chocolate mb-2">Thank you!</h3>
                  <p className="text-text-soft">
                    We&apos;ve received your message.<br />
                    Our team will get back to you shortly.
                  </p>
                  <button
                    onClick={() => setStatus('idle')}
                    className="mt-8 text-rose-deep font-bold text-sm hover:underline"
                  >
                    Send another message
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <h3 className="mb-6 text-[1.4rem] text-chocolate font-bold">Send a Message</h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-[22px]">
              {/* Honeypot field for spam protection */}
              <input
                type="text"
                name="honeypot"
                value={formData.honeypot}
                onChange={handleChange}
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
              />

              <div className="flex flex-col gap-2">
                <label className="text-[0.82rem] font-semibold text-text-mid">Your Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Priya Sharma"
                  className="w-full p-[14px_18px] border-2 border-cream-dark rounded-sm font-poppins text-[0.88rem] text-text bg-cream outline-none transition-all focus:border-rose focus:shadow-[0_0_0_3px_rgba(232,145,122,0.15)]"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[0.82rem] font-semibold text-text-mid">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="you@example.com"
                  className="w-full p-[14px_18px] border-2 border-cream-dark rounded-sm font-poppins text-[0.88rem] text-text bg-cream outline-none transition-all focus:border-rose focus:shadow-[0_0_0_3px_rgba(232,145,122,0.15)]"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[0.82rem] font-semibold text-text-mid">Phone (optional)</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  className="w-full p-[14px_18px] border-2 border-cream-dark rounded-sm font-poppins text-[0.88rem] text-text bg-cream outline-none transition-all focus:border-rose focus:shadow-[0_0_0_3px_rgba(232,145,122,0.15)]"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[0.82rem] font-semibold text-text-mid">Your Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  placeholder="Tell us about your dream cake..."
                  className="w-full h-[120px] p-[14px_18px] border-2 border-cream-dark rounded-sm font-poppins text-[0.88rem] text-text bg-cream outline-none resize-none transition-all focus:border-rose focus:shadow-[0_0_0_3px_rgba(232,145,122,0.15)]"
                ></textarea>
              </div>

              <AnimatePresence>
                {status === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center gap-2 text-red-500 text-xs font-bold bg-red-50 p-3 rounded-lg border border-red-100"
                  >
                    <AlertCircle size={14} />
                    <span>{errorMessage}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full p-[15px] bg-rose-deep text-white border-none rounded-[50px] font-poppins text-[0.95rem] font-semibold cursor-pointer transition-all duration-350 flex items-center justify-center gap-2 hover:bg-brown hover:translate-y-[-2px] hover:shadow-[0_6px_20px_rgba(107,58,42,0.3)] disabled:bg-text-soft disabled:cursor-not-allowed disabled:transform-none"
              >
                {status === 'loading' ? (
                  <>
                    <Loader2 size={18} className="animate-spin" /> Sending...
                  </>
                ) : (
                  <>
                    <Send size={18} /> Send Message
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
