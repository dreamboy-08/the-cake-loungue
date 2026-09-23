"use client";

import React, { useState, useEffect } from 'react';
import { useCMS } from '@/context/CMSContext';
import { CMSWhatsAppSettings, CMSWhatsAppMessageSlot } from '@/types/cms';
import { DEFAULT_WHATSAPP_SETTINGS } from '@/constants/cmsDefaults';
import { renderTemplateMessage, resolveOrderVariables } from '@/services/whatsappService';
import {
  MessageSquare,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Eye,
  Info,
  Smartphone,
  Copy,
  Sliders,
  ShieldAlert
} from 'lucide-react';
import AdminConfirmationModal from '@/components/admin/AdminConfirmationModal';

const SAMPLE_ORDER = {
  orderId: 'order_sample_789',
  customerName: 'Ananya Sharma',
  customerEmail: 'ananya@example.com',
  customerPhone: '+91 98765 43210',
  items: [
    { name: 'Belgian Chocolate Truffle Cake', price: 850, quantity: 1 },
    { name: 'Red Velvet Cupcakes', price: 150, quantity: 2 }
  ],
  totalAmount: 1150,
  deliveryDate: '2025-05-20',
  deliveryTimeSlot: '04:00 PM – 06:00 PM',
  shippingAddress: 'Flat 402, Rosewood Apartments, Sector 54, Gurugram - 122002',
  specialRequests: 'Please write "Happy Birthday Ananya!"',
};

const AVAILABLE_VARIABLES = [
  { varName: '{customerName}', desc: 'Customer Full Name' },
  { varName: '{customerPhone}', desc: 'Customer Phone Number' },
  { varName: '{customerEmail}', desc: 'Customer Email Address' },
  { varName: '{orderId}', desc: 'Unique Order / Razorpay ID' },
  { varName: '{items}', desc: 'Formatted Ordered Items & Line Quantities' },
  { varName: '{totalAmount}', desc: 'Total Amount Paid (₹)' },
  { varName: '{deliveryDate}', desc: 'Selected Delivery Date' },
  { varName: '{deliveryTime}', desc: 'Selected Delivery Time Slot' },
  { varName: '{deliveryAddress}', desc: 'Complete Shipping Address' },
  { varName: '{specialRequests}', desc: 'Custom Message / Special Requests' },
];

export default function WhatsAppManagementPage() {
  const { whatsappSettings, updateWhatsAppSettings, hasUndo, undo, restoreDefaults, loading } = useCMS();
  const [activeTab, setActiveTab] = useState<'customer' | 'admin'>('customer');
  const [formData, setFormData] = useState<CMSWhatsAppSettings>(whatsappSettings || DEFAULT_WHATSAPP_SETTINGS);

  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [copiedVar, setCopiedVar] = useState<string | null>(null);
  const [isRestoreModalOpen, setIsRestoreModalOpen] = useState(false);

  useEffect(() => {
    if (whatsappSettings) {
      setFormData(whatsappSettings);
    }
  }, [whatsappSettings]);

  const currentSlot: CMSWhatsAppMessageSlot =
    activeTab === 'customer'
      ? formData.customerConfirmation || DEFAULT_WHATSAPP_SETTINGS.customerConfirmation
      : formData.adminNewOrderAlert || DEFAULT_WHATSAPP_SETTINGS.adminNewOrderAlert;

  const handleSlotChange = (field: keyof CMSWhatsAppMessageSlot, value: any) => {
    setFormData((prev) => {
      const updatedSlot = { ...currentSlot, [field]: value };
      if (activeTab === 'customer') {
        return { ...prev, customerConfirmation: updatedSlot };
      } else {
        return { ...prev, adminNewOrderAlert: updatedSlot };
      }
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setSuccessMessage(null);
    try {
      await updateWhatsAppSettings({
        ...formData,
        updatedAt: new Date().toISOString(),
      });
      setSuccessMessage('WhatsApp message configurations saved successfully!');
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (error) {
      console.error('Failed to save WhatsApp settings:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleCopyVar = (varName: string) => {
    navigator.clipboard.writeText(varName);
    setCopiedVar(varName);
    setTimeout(() => setCopiedVar(null), 2000);
  };

  const sampleVars = resolveOrderVariables(SAMPLE_ORDER as any);
  const livePreviewText = renderTemplateMessage(currentSlot.messageTemplate, sampleVars);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-deep"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-8 rounded-[30px] border border-gray-100 shadow-sm">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-deep">
              <MessageSquare size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold font-playfair text-chocolate">WhatsApp Message Management</h1>
              <p className="text-xs text-text-soft font-medium mt-0.5">
                Configure automated order notification templates and Meta Cloud API controls.
              </p>
            </div>
          </div>
        </div>

        {/* Global Safety & Action Toolbar */}
        <div className="flex items-center gap-3 self-end md:self-auto">
          {hasUndo('whatsappSettings') && (
            <button
              onClick={() => undo('whatsappSettings')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-amber-200 bg-amber-50 text-amber-800 text-xs font-bold hover:bg-amber-100 transition-all shadow-sm"
            >
              <RotateCcw size={16} /> Undo Last Change
            </button>
          )}

          <button
            onClick={() => setIsRestoreModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-700 text-xs font-bold hover:bg-gray-100 transition-all"
          >
            <RotateCcw size={16} /> Restore Defaults
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-chocolate text-white text-xs font-bold hover:bg-brown transition-all shadow-md disabled:opacity-50"
          >
            <Save size={16} /> {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-sm font-bold flex items-center gap-3 shadow-sm animate-fade-in">
          <CheckCircle2 className="text-emerald-600 shrink-0" size={20} />
          {successMessage}
        </div>
      )}

      {/* Primary Tab Navigation */}
      <div className="flex border-b border-gray-200 gap-4">
        <button
          onClick={() => setActiveTab('customer')}
          className={`pb-4 px-2 font-bold text-sm flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'customer'
              ? 'border-rose-deep text-rose-deep'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <Smartphone size={18} />
          <span>Customer Order Confirmation</span>
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${
            formData.customerConfirmation?.enabled ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-500'
          }`}>
            {formData.customerConfirmation?.enabled ? 'Enabled' : 'Disabled'}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('admin')}
          className={`pb-4 px-2 font-bold text-sm flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'admin'
              ? 'border-rose-deep text-rose-deep'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <ShieldAlert size={18} />
          <span>Admin New Order Alert</span>
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${
            formData.adminNewOrderAlert?.enabled ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-500'
          }`}>
            {formData.adminNewOrderAlert?.enabled ? 'Enabled' : 'Disabled'}
          </span>
        </button>
      </div>

      {/* Main Grid: Template Editor + Live Dynamic Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Left Column: Config Controls & Variable Editor */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white p-6 rounded-[28px] border border-gray-100 shadow-sm space-y-6">

            {/* Slot Enable Toggle */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-200">
              <div>
                <h3 className="font-bold text-chocolate text-sm">
                  {activeTab === 'customer' ? 'Automatic Customer Confirmation' : 'Automatic Admin Order Notification'}
                </h3>
                <p className="text-xs text-gray-500 font-medium mt-0.5">
                  {activeTab === 'customer'
                    ? 'Dispatched to customer phone number automatically upon verified payment.'
                    : 'Dispatched to admin WhatsApp number automatically upon new order creation.'}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={currentSlot.enabled}
                  onChange={(e) => handleSlotChange('enabled', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-deep"></div>
              </label>
            </div>

            {/* Template Message Content Area */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                Message Body Template
              </label>
              <textarea
                rows={14}
                value={currentSlot.messageTemplate}
                onChange={(e) => handleSlotChange('messageTemplate', e.target.value)}
                placeholder="Enter template content..."
                className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-200 text-xs font-mono text-gray-800 focus:bg-white focus:border-rose-deep focus:outline-none transition-all leading-relaxed"
              />
            </div>

            {/* Meta Template Cloud API Configuration */}
            <div className="p-5 bg-rose-50/50 rounded-2xl border border-rose-100 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sliders size={18} className="text-rose-deep" />
                  <span className="font-bold text-chocolate text-xs uppercase tracking-wider">
                    Meta WhatsApp Cloud API Template Compatibility
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={currentSlot.useMetaTemplate || false}
                    onChange={(e) => handleSlotChange('useMetaTemplate', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-rose-deep"></div>
                </label>
              </div>

              {currentSlot.useMetaTemplate && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">
                      Approved Meta Template Name
                    </label>
                    <input
                      type="text"
                      value={currentSlot.templateName || ''}
                      onChange={(e) => handleSlotChange('templateName', e.target.value)}
                      placeholder="e.g. order_confirmation_v1"
                      className="w-full p-2.5 bg-white border border-gray-200 rounded-xl text-xs font-mono outline-none focus:border-rose-deep"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">
                      Language Code
                    </label>
                    <input
                      type="text"
                      value={currentSlot.languageCode || 'en'}
                      onChange={(e) => handleSlotChange('languageCode', e.target.value)}
                      placeholder="e.g. en or en_US"
                      className="w-full p-2.5 bg-white border border-gray-200 rounded-xl text-xs font-mono outline-none focus:border-rose-deep"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Available Variables Helper Box */}
          <div className="bg-white p-6 rounded-[28px] border border-gray-100 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-chocolate">
              <Info size={18} className="text-rose-deep" />
              <h3 className="font-bold text-xs uppercase tracking-wider">Available System Variables</h3>
            </div>
            <p className="text-xs text-gray-500">
              Click any variable to copy it into your clipboard, then paste it into the message template above. System values are dynamically replaced before dispatch.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {AVAILABLE_VARIABLES.map((v) => (
                <button
                  key={v.varName}
                  onClick={() => handleCopyVar(v.varName)}
                  className="flex items-center justify-between p-2.5 bg-gray-50 hover:bg-rose-50/60 rounded-xl border border-gray-100 transition-all text-left group"
                >
                  <div>
                    <span className="font-mono text-xs font-bold text-rose-deep block">{v.varName}</span>
                    <span className="text-[10px] text-gray-500">{v.desc}</span>
                  </div>
                  <span className="text-[10px] font-bold text-gray-400 group-hover:text-rose-deep flex items-center gap-1">
                    {copiedVar === v.varName ? 'Copied!' : <Copy size={12} />}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Live Mobile Screen Preview */}
        <div className="lg:col-span-5 space-y-4">
          <div className="sticky top-24 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye size={18} className="text-rose-deep" />
                <h3 className="font-bold text-chocolate text-xs uppercase tracking-wider">Live Preview</h3>
              </div>
              <span className="text-[10px] font-bold text-gray-400">Sample Order Data</span>
            </div>

            {/* Smartphone Graphic Mockup Container */}
            <div className="bg-chocolate p-4 rounded-[40px] shadow-xl border-4 border-brown max-w-sm mx-auto">
              <div className="bg-[#efeae2] rounded-[32px] p-4 text-chocolate min-h-[500px] max-h-[620px] overflow-y-auto space-y-3 font-sans shadow-inner">
                {/* Simulated Header */}
                <div className="bg-[#075e54] text-white p-3 rounded-2xl flex items-center gap-3 -mx-1 -mt-1 shadow-sm">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-xs">
                    CL
                  </div>
                  <div>
                    <p className="font-bold text-xs">The Cake Lounge</p>
                    <p className="text-[9px] text-white/80">Official Business Account</p>
                  </div>
                </div>

                {/* Simulated Chat Bubble */}
                <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm text-xs whitespace-pre-wrap leading-relaxed text-gray-800 font-sans border border-gray-200/60">
                  {livePreviewText}
                  <div className="text-[9px] text-gray-400 text-right mt-2">
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ✓✓
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal for Restore Defaults */}
      <AdminConfirmationModal
        isOpen={isRestoreModalOpen}
        onClose={() => setIsRestoreModalOpen(false)}
        onConfirm={async () => {
          await restoreDefaults('whatsappSettings');
          setIsRestoreModalOpen(false);
          setSuccessMessage('WhatsApp message settings restored to default templates!');
          setTimeout(() => setSuccessMessage(null), 4000);
        }}
        title="Restore Default WhatsApp Templates?"
        message="Are you sure you want to restore default WhatsApp notification templates? Your current template customizations will be overwritten."
        confirmText="Restore Defaults"
      />
    </div>
  );
}
