"use client";

import React, { useState, useEffect } from 'react';
import { useAuth, Address } from '@/context/AuthContext';
import { Plus, Edit2, Trash2, CheckCircle2, MapPin, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AddressManager = ({ onSelect, selectedAddress }: { onSelect?: (address: Address) => void, selectedAddress?: Address | null }) => {
  const { user, userData, addAddress, updateAddress, deleteAddress, setDefaultAddress } = useAuth();
  const [isAdding, setIsAdding] = useState(!user && !selectedAddress); // Default to adding if guest and no address selected
  const [guestAddress, setGuestAddress] = useState<Address | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null); // To track which address action is loading
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<Omit<Address, 'id'>>({
    name: '',
    phone: '',
    houseNumber: '',
    street: '',
    landmark: '',
    area: '',
    city: '',
    state: '',
    zipCode: '',
    email: '',
    isDefault: false
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (user) {
        if (editingId) {
          await updateAddress(editingId, formData);
          setEditingId(null);
        } else {
          await addAddress(formData);
          setIsAdding(false);
        }
      } else {
        // Guest mode: just pass the data up
        const tempAddress: Address = {
          ...formData,
          id: 'guest-temp-' + Date.now(),
        };
        setGuestAddress(tempAddress);
        onSelect?.(tempAddress);
        setIsAdding(false);
      }
      setFormData({
        name: '',
        phone: '',
        houseNumber: '',
        street: '',
        landmark: '',
        area: '',
        city: '',
        state: '',
        zipCode: '',
        isDefault: false
      });
    } catch (error: any) {
      console.error("Error saving address:", error);
      setError(error.message || "Failed to save address. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const startEditing = (address: Address) => {
    setFormData({
      name: address.name,
      phone: address.phone,
      houseNumber: address.houseNumber || '',
      street: address.street,
      landmark: address.landmark || '',
      area: address.area || '',
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      email: address.email || '',
      isDefault: address.isDefault
    });
    setEditingId(address.id);
  };

  const addresses = user
    ? (userData?.addresses || [])
    : (selectedAddress ? [selectedAddress] : (guestAddress ? [guestAddress] : []));

  useEffect(() => {
    if (!user && selectedAddress && isAdding) {
      setIsAdding(false);
    }
  }, [user, selectedAddress, isAdding]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-chocolate flex items-center gap-2">
          <MapPin size={20} className="text-rose-deep" />
          Delivery Addresses
        </h3>
        {!isAdding && !editingId && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 text-rose-deep font-bold text-sm hover:bg-cream-dark px-4 py-2 rounded-full transition-all"
          >
            <Plus size={18} /> Add New
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {(isAdding || editingId) ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-[22px] border-2 border-cream p-6 shadow-sm overflow-hidden"
          >
            <div className="flex justify-between items-center mb-6">
              <h4 className="font-bold text-chocolate">
                {user ? (editingId ? 'Edit Address' : 'Add New Address') : 'Delivery Address'}
              </h4>
              {user && (
                <button
                  onClick={() => { setIsAdding(false); setEditingId(null); setError(null); }}
                  className="text-text-soft hover:text-chocolate"
                >
                  <X size={20} />
                </button>
              )}
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm flex items-center gap-2">
                <CheckCircle2 size={16} className="rotate-45" /> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="p-3 bg-cream border border-cream rounded-xl outline-none focus:border-rose-deep transition-all"
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  required
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="p-3 bg-cream border border-cream rounded-xl outline-none focus:border-rose-deep transition-all"
                />
              </div>
              {!user && (
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address (for order updates)"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-cream border border-cream rounded-xl outline-none focus:border-rose-deep transition-all"
                />
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="houseNumber"
                  placeholder="House / Flat / Office No."
                  required
                  value={formData.houseNumber}
                  onChange={handleInputChange}
                  className="p-3 bg-cream border border-cream rounded-xl outline-none focus:border-rose-deep transition-all"
                />
                <input
                  type="text"
                  name="street"
                  placeholder="Street / Road Name"
                  required
                  value={formData.street}
                  onChange={handleInputChange}
                  className="p-3 bg-cream border border-cream rounded-xl outline-none focus:border-rose-deep transition-all"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="landmark"
                  placeholder="Landmark (Optional)"
                  value={formData.landmark}
                  onChange={handleInputChange}
                  className="p-3 bg-cream border border-cream rounded-xl outline-none focus:border-rose-deep transition-all"
                />
                <input
                  type="text"
                  name="area"
                  placeholder="Area / Sector / Locality"
                  required
                  value={formData.area}
                  onChange={handleInputChange}
                  className="p-3 bg-cream border border-cream rounded-xl outline-none focus:border-rose-deep transition-all"
                />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  required
                  value={formData.city}
                  onChange={handleInputChange}
                  className="p-3 bg-cream border border-cream rounded-xl outline-none focus:border-rose-deep transition-all"
                />
                <input
                  type="text"
                  name="state"
                  placeholder="State"
                  required
                  value={formData.state}
                  onChange={handleInputChange}
                  className="p-3 bg-cream border border-cream rounded-xl outline-none focus:border-rose-deep transition-all"
                />
                <input
                  type="text"
                  name="zipCode"
                  placeholder="Zip Code"
                  required
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  className="p-3 bg-cream border border-cream rounded-xl outline-none focus:border-rose-deep transition-all col-span-2 md:col-span-1"
                />
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="isDefault"
                  checked={formData.isDefault}
                  onChange={handleInputChange}
                  className="w-5 h-5 rounded accent-rose-deep"
                />
                <span className="text-sm font-medium text-text-mid">Set as default address</span>
              </label>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-rose-deep text-white font-bold py-3 rounded-xl shadow-lg hover:bg-brown transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  user ? (editingId ? 'Update Address' : 'Save Address') : 'Apply Address'
                )}
              </button>
            </form>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addresses.map((address: Address) => (
              <motion.div
                key={address.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`relative p-5 rounded-[22px] border-2 transition-all cursor-pointer group ${
                  (address.isDefault || selectedAddress?.id === address.id) ? 'border-rose-deep bg-cream-dark' : 'border-cream bg-white hover:border-rose/30'
                }`}
                onClick={() => onSelect?.(address)}
              >
                {(address.isDefault || selectedAddress?.id === address.id) && (
                  <div className="absolute top-4 right-4 text-rose-deep">
                    <CheckCircle2 size={20} />
                  </div>
                )}
                <div className="pr-8">
                  <p className="font-bold text-chocolate mb-1">{address.name}</p>
                  <p className="text-sm text-text-mid mb-2">{address.phone}</p>
                  <p className="text-sm text-text-soft leading-relaxed">
                    {address.houseNumber}, {address.street}<br />
                    {address.landmark && <span className="text-xs text-text-soft/70">Near {address.landmark}<br /></span>}
                    {address.area}, {address.city}<br />
                    {address.state} - {address.zipCode || address.pincode}
                  </p>
                </div>
                <div className="mt-4 flex gap-4 border-t border-cream pt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => { e.stopPropagation(); startEditing(address); }}
                    className="flex items-center gap-1 text-xs font-bold text-chocolate hover:text-rose-deep"
                  >
                    <Edit2 size={14} /> Edit
                  </button>
                  <button
                    onClick={async (e) => {
                      e.stopPropagation();
                      setActionLoading(address.id);
                      try {
                        await deleteAddress(address.id);
                      } catch (err) {}
                      setActionLoading(null);
                    }}
                    disabled={!!actionLoading}
                    className="flex items-center gap-1 text-xs font-bold text-red-500 hover:text-red-600 disabled:opacity-50"
                  >
                    {actionLoading === address.id ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={14} />}
                    Delete
                  </button>
                  {user && !address.isDefault && (
                    <button
                      onClick={async (e) => {
                        e.stopPropagation();
                        setActionLoading(address.id);
                        try {
                          await setDefaultAddress(address.id);
                        } catch (err) {}
                        setActionLoading(null);
                      }}
                      disabled={!!actionLoading}
                      className="flex items-center gap-1 text-xs font-bold text-rose-deep hover:underline ml-auto disabled:opacity-50"
                    >
                      {actionLoading === address.id && <Loader2 size={12} className="animate-spin" />}
                      Set Default
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
            {addresses.length === 0 && (
              <div className="md:col-span-2 text-center py-10 bg-white rounded-3xl border-2 border-dashed border-cream">
                <p className="text-text-soft mb-4">No addresses saved yet.</p>
                <button
                  onClick={() => setIsAdding(true)}
                  className="bg-rose-deep text-white px-6 py-2 rounded-full font-bold text-sm shadow-md"
                >
                  Add Your First Address
                </button>
              </div>
            )}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AddressManager;
