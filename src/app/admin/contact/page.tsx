"use client";

import React, { useState, useEffect } from 'react';
import { useCMS } from '@/context/CMSContext';
import { ContactSettings } from '@/types/cms';
import {
  Save,
  Loader2,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Type,
  MapPin,
  Phone,
  Mail,
  Clock,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DEFAULT_CONTACT_SETTINGS } from '@/constants/cmsDefaults';

const AdminContact = () => {
  const { contactSettings, updateContactSettings, loading } = useCMS();
  const [localContact, setLocalContact] = useState<ContactSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (contactSettings) {
      setLocalContact(JSON.parse(JSON.stringify(contactSettings)));
    }
  }, [contactSettings]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleFieldChange = (field: keyof ContactSettings, value: any) => {
    if (!localContact) return;
    setLocalContact(prev => prev ? ({ ...prev, [field]: value }) : null);
  };

  const handleSaveSettings = async () => {
    if (!localContact) return;
    setSaving(true);
    try {
      await updateContactSettings(localContact);
      showToast("Contact settings saved successfully!");
    } catch (err) {
      console.error("Error saving contact settings:", err);
      showToast("Failed to save contact settings.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleResetToDefaults = () => {
    setLocalContact(JSON.parse(JSON.stringify(DEFAULT_CONTACT_SETTINGS)));
    showToast("Reset local inputs to premium system defaults. Click 'Save All Settings' to apply.");
  };

  if (loading || !localContact) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="animate-spin text-rose-deep" size={36} />
        <p className="text-gray-500 font-medium">Synchronizing Homepage Contact CMS Module...</p>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 md:px-8 py-6 space-y-6 sm:space-y-8 animate-fade-up pb-24 max-w-[1600px] mx-auto">
      {/* Toast Alert */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className={`fixed top-8 left-1/2 z-[500] px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 font-bold text-sm ${
              toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
            }`}
          >
            {toast.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 pb-4 border-b border-gray-100">
        <div>
          <h1 className="text-2xl sm:text-3xl font-playfair font-bold text-chocolate">Homepage Contact CMS</h1>
          <p className="text-gray-500 mt-1 text-sm">Direct, real-time control over Contact section copy headings, address, phone number, email and active business hours.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleResetToDefaults}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 h-11 min-h-[44px]"
          >
            <RefreshCw size={14} />
            <span>Reset Defaults</span>
          </button>

          <button
            onClick={() => handleFieldChange('enabled', !localContact.enabled)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all border h-11 min-h-[44px] ${
              localContact.enabled
                ? 'bg-green-50 text-green-600 border-green-200'
                : 'bg-red-50 text-red-500 border-red-200'
            }`}
          >
            {localContact.enabled ? <Eye size={14} /> : <EyeOff size={14} />}
            <span>{localContact.enabled ? 'Section Live' : 'Section Hidden'}</span>
          </button>

          <button
            disabled={saving}
            onClick={handleSaveSettings}
            className="flex items-center gap-2 bg-chocolate text-white px-6 py-2.5 rounded-xl font-bold shadow-md hover:bg-brown transition-all disabled:opacity-50 text-xs shrink-0 h-11 min-h-[44px]"
          >
            {saving ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />}
            <span>Save All Settings</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column: Heading copywriting */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-[28px] shadow-sm border border-gray-100 space-y-6">
            <h2 className="text-lg font-bold text-chocolate flex items-center gap-2 border-b border-gray-50 pb-3 font-playfair">
              <Type size={20} className="text-rose-deep" />
              Contact Headings
            </h2>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Main Heading Title</label>
                <input
                  type="text"
                  value={localContact.heading || ''}
                  onChange={(e) => handleFieldChange('heading', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-1 focus:ring-rose-deep text-sm font-bold text-chocolate font-playfair"
                  placeholder="e.g. Let's Create Something Sweet Together"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Subheading Description</label>
                <textarea
                  rows={4}
                  value={localContact.subheading || ''}
                  onChange={(e) => handleFieldChange('subheading', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-1 focus:ring-rose-deep text-xs font-semibold text-gray-500 leading-relaxed"
                  placeholder="Contact description subtitle..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right columns: Contact coordinate cards */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-[28px] shadow-sm border border-gray-100 space-y-6">
            <h2 className="text-lg font-bold text-chocolate flex items-center gap-2 border-b border-gray-50 pb-3 font-playfair">
              <MapPin size={20} className="text-rose-deep" />
              Contact Details Coordinates
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Address */}
              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 space-y-3">
                <div className="flex items-center gap-2 text-chocolate font-bold text-sm">
                  <MapPin size={16} className="text-rose-deep" />
                  <span>Physical Store Address</span>
                </div>
                <textarea
                  rows={3}
                  value={localContact.address || ''}
                  onChange={(e) => handleFieldChange('address', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-1 focus:ring-rose-deep text-xs font-semibold text-chocolate"
                  placeholder="Street details..."
                />
              </div>

              {/* Phone */}
              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 space-y-3">
                <div className="flex items-center gap-2 text-chocolate font-bold text-sm">
                  <Phone size={16} className="text-rose-deep" />
                  <span>Phone Number</span>
                </div>
                <input
                  type="text"
                  value={localContact.phone || ''}
                  onChange={(e) => handleFieldChange('phone', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-1 focus:ring-rose-deep text-xs font-bold text-chocolate"
                  placeholder="e.g. +91 77038 70170"
                />
              </div>

              {/* Email */}
              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 space-y-3">
                <div className="flex items-center gap-2 text-chocolate font-bold text-sm">
                  <Mail size={16} className="text-rose-deep" />
                  <span>Email Coordinate</span>
                </div>
                <input
                  type="text"
                  value={localContact.email || ''}
                  onChange={(e) => handleFieldChange('email', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-1 focus:ring-rose-deep text-xs font-semibold text-chocolate"
                  placeholder="e.g. contact@thecakelounge.com"
                />
              </div>

              {/* Hours */}
              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 space-y-3">
                <div className="flex items-center gap-2 text-chocolate font-bold text-sm">
                  <Clock size={16} className="text-rose-deep" />
                  <span>Business Working Hours</span>
                </div>
                <input
                  type="text"
                  value={localContact.hoursMonSun || ''}
                  onChange={(e) => handleFieldChange('hoursMonSun', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-1 focus:ring-rose-deep text-xs font-semibold text-chocolate"
                  placeholder="e.g. Mon-Sun 8am-10pm"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminContact;
