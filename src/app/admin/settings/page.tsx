"use client";

import React, { useState, useEffect } from 'react';
import {
  getSiteSettings,
  updateSiteSettings,
  getContactInfo,
  updateContactInfo,
  getBusinessHours,
  updateBusinessHours,
  SiteSettings,
  BusinessHours,
  ContactInfo
} from '@/utils/adminService';
import {
  Save,
  Loader2,
  Clock,
  Truck,
  CreditCard,
  MapPin,
  Phone,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const [settings, setSettings] = useState<Partial<SiteSettings>>({
    deliveryCharges: 0,
    minOrderAmount: 0,
    deliveryTiming: '45 - 60 mins'
  });
  const [hours, setHours] = useState<Partial<BusinessHours>>({});
  const [contact, setContact] = useState<Partial<ContactInfo>>({});

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [s, h, c] = await Promise.all([
          getSiteSettings(),
          getBusinessHours(),
          getContactInfo()
        ]);
        if (s) setSettings((prev: any) => ({...prev, ...s}));
        if (h) setHours(h);
        if (c) setContact(c);
      } catch (error) {
        console.error("Error fetching settings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await Promise.all([
        updateSiteSettings(settings),
        updateBusinessHours(hours),
        updateContactInfo(contact)
      ]);
      showToast("Store settings updated successfully");
    } catch (error) {
      showToast("Failed to update settings", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-rose-deep" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-up">
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-8 left-1/2 -translate-x-1/2 z-[500] px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 font-bold text-sm ${
              toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
            }`}
          >
            {toast.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      <header>
        <h1 className="text-3xl font-playfair font-bold text-chocolate">Store Settings</h1>
        <p className="text-gray-500 mt-1">Configure your store&apos;s operational parameters.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Delivery Settings */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-50 text-green-600 rounded-lg">
              <Truck size={20} />
            </div>
            <h2 className="text-lg font-bold text-chocolate">Delivery Settings</h2>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Delivery Charges (₹)</label>
              <input
                type="number"
                value={settings.deliveryCharges}
                onChange={(e) => setSettings({...settings, deliveryCharges: Number(e.target.value)})}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-rose/20 outline-none transition-all text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Minimum Order Amount (₹)</label>
              <input
                type="number"
                value={settings.minOrderAmount}
                onChange={(e) => setSettings({...settings, minOrderAmount: Number(e.target.value)})}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-rose/20 outline-none transition-all text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Estimated Delivery Time</label>
              <input
                type="text"
                value={settings.deliveryTiming}
                onChange={(e) => setSettings({...settings, deliveryTiming: e.target.value})}
                placeholder="e.g. 45-60 mins"
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-rose/20 outline-none transition-all text-sm"
              />
            </div>
          </div>
        </div>

        {/* Operational Hours */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
              <Clock size={20} />
            </div>
            <h2 className="text-lg font-bold text-chocolate">Store Timing</h2>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Opening Time</label>
              <input
                type="text"
                value={hours.opening}
                onChange={(e) => setHours({...hours, opening: e.target.value})}
                placeholder="e.g. 10:00 AM"
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-rose/20 outline-none transition-all text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Closing Time</label>
              <input
                type="text"
                value={hours.closing}
                onChange={(e) => setHours({...hours, closing: e.target.value})}
                placeholder="e.g. 10:00 PM"
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-rose/20 outline-none transition-all text-sm"
              />
            </div>
          </div>
        </div>

        {/* Location Settings */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <MapPin size={20} />
            </div>
            <h2 className="text-lg font-bold text-chocolate">Location & Maps</h2>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Google Maps Embed/Link</label>
              <textarea
                rows={3}
                value={contact.googleMaps}
                onChange={(e) => setContact({...contact, googleMaps: e.target.value})}
                placeholder="Paste your Google Maps embed code or location link"
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-rose/20 outline-none transition-all text-sm resize-none"
              />
            </div>
          </div>
        </div>

        {/* Support Contact */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-rose-50 text-rose-deep rounded-lg">
              <Phone size={20} />
            </div>
            <h2 className="text-lg font-bold text-chocolate">Support Numbers</h2>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Primary WhatsApp</label>
              <input
                type="text"
                value={contact.whatsapp}
                onChange={(e) => setContact({...contact, whatsapp: e.target.value})}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-rose/20 outline-none transition-all text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button
          disabled={saving}
          onClick={handleSave}
          className="flex items-center gap-2 bg-chocolate text-white px-10 py-4 rounded-2xl font-bold shadow-xl shadow-chocolate/20 hover:bg-brown hover:-translate-y-0.5 transition-all disabled:opacity-50"
        >
          {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
          <span>Save Store Settings</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSettings;
