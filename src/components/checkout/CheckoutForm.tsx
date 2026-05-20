'use client';

import React, { useState } from 'react';
import { useForm, UseFormRegister, FieldErrors } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

export const checkoutSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().regex(/^[0-9+\s-]{10,}$/, 'Invalid phone number'),
  email: z.string().email('Invalid email address'),
  street: z.string().min(5, 'Address is too short'),
  city: z.string().min(2, 'City is required'),
  landmark: z.string().optional(),
  pincode: z.string().length(6, 'Pincode must be 6 digits'),
  deliveryDate: z.string().min(1, 'Please select a delivery date'),
  timeSlot: z.string().min(1, 'Please select a time slot'),
  cakeMessage: z.string().optional(),
  instructions: z.string().optional(),
  paymentMethod: z.enum(['razorpay', 'cod']),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;

interface SectionProps {
  register: UseFormRegister<CheckoutFormData>;
  errors: FieldErrors<CheckoutFormData>;
}

export const ContactSection: React.FC<SectionProps> = ({ register, errors }) => {
  return (
    <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-cream/50">
      <h2 className="text-xl font-bold text-chocolate mb-6 flex items-center gap-2">
        <span className="flex items-center justify-center w-6 h-6 bg-rose-deep text-white text-[10px] rounded-full">1</span>
        Contact Information
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-text-soft">Full Name</label>
          <input
            {...register('fullName')}
            type="text"
            placeholder="John Doe"
            className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-rose/20 transition-all ${errors.fullName ? 'border-red-500' : 'border-cream focus:border-rose'}`}
          />
          {errors.fullName && <p className="text-red-500 text-[0.7rem] font-bold">{errors.fullName.message}</p>}
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-text-soft">Phone Number</label>
          <input
            {...register('phone')}
            type="tel"
            placeholder="+91 98765 43210"
            className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-rose/20 transition-all ${errors.phone ? 'border-red-500' : 'border-cream focus:border-rose'}`}
          />
          {errors.phone && <p className="text-red-500 text-[0.7rem] font-bold">{errors.phone.message}</p>}
        </div>
        <div className="md:col-span-2 space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-text-soft">Email Address</label>
          <input
            {...register('email')}
            type="email"
            placeholder="john@example.com"
            className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-rose/20 transition-all ${errors.email ? 'border-red-500' : 'border-cream focus:border-rose'}`}
          />
          {errors.email && <p className="text-red-500 text-[0.7rem] font-bold">{errors.email.message}</p>}
        </div>
      </div>
    </div>
  );
};

export const ShippingSection: React.FC<SectionProps> = ({ register, errors }) => {
  return (
    <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-cream/50">
      <h2 className="text-xl font-bold text-chocolate mb-6 flex items-center gap-2">
        <span className="flex items-center justify-center w-6 h-6 bg-rose-deep text-white text-[10px] rounded-full">2</span>
        Delivery Address
      </h2>
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-text-soft">Street Address</label>
          <input
            {...register('street')}
            type="text"
            placeholder="Flat no., Building Name, Street"
            className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-rose/20 transition-all ${errors.street ? 'border-red-500' : 'border-cream focus:border-rose'}`}
          />
          {errors.street && <p className="text-red-500 text-[0.7rem] font-bold">{errors.street.message}</p>}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-text-soft">City</label>
            <input
              {...register('city')}
              type="text"
              placeholder="New Delhi"
              className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-rose/20 transition-all ${errors.city ? 'border-red-500' : 'border-cream focus:border-rose'}`}
            />
            {errors.city && <p className="text-red-500 text-[0.7rem] font-bold">{errors.city.message}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-text-soft">Pincode</label>
            <input
              {...register('pincode')}
              type="text"
              placeholder="110001"
              className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-rose/20 transition-all ${errors.pincode ? 'border-red-500' : 'border-cream focus:border-rose'}`}
            />
            {errors.pincode && <p className="text-red-500 text-[0.7rem] font-bold">{errors.pincode.message}</p>}
          </div>
          <div className="md:col-span-2 space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-text-soft">Landmark (Optional)</label>
            <input
              {...register('landmark')}
              type="text"
              placeholder="Near Apollo Hospital"
              className="w-full px-4 py-3 rounded-lg border border-cream focus:outline-none focus:ring-2 focus:ring-rose/20 focus:border-rose transition-all"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export const DeliverySchedule: React.FC<SectionProps> = ({ register, errors }) => {
  const timeSlots = [
    "10:00 AM - 12:00 PM",
    "12:00 PM - 02:00 PM",
    "02:00 PM - 04:00 PM",
    "04:00 PM - 06:00 PM",
    "06:00 PM - 08:00 PM",
    "08:00 PM - 10:00 PM"
  ];

  return (
    <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-cream/50">
      <h2 className="text-xl font-bold text-chocolate mb-6 flex items-center gap-2">
        <span className="flex items-center justify-center w-6 h-6 bg-rose-deep text-white text-[10px] rounded-full">3</span>
        Delivery Schedule
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-text-soft">Delivery Date</label>
          <input
            {...register('deliveryDate')}
            type="date"
            className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-rose/20 transition-all ${errors.deliveryDate ? 'border-red-500' : 'border-cream focus:border-rose'}`}
            min={new Date().toISOString().split('T')[0]}
          />
          {errors.deliveryDate && <p className="text-red-500 text-[0.7rem] font-bold">{errors.deliveryDate.message}</p>}
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-text-soft">Time Slot</label>
          <div className="relative">
            <select
              {...register('timeSlot')}
              className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-rose/20 transition-all appearance-none bg-white ${errors.timeSlot ? 'border-red-500' : 'border-cream focus:border-rose'}`}
            >
              <option value="">Select a time slot</option>
              {timeSlots.map(slot => (
                <option key={slot} value={slot}>{slot}</option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-text-soft">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          {errors.timeSlot && <p className="text-red-500 text-[0.7rem] font-bold">{errors.timeSlot.message}</p>}
        </div>
      </div>
    </div>
  );
};

export const SpecialInstructions: React.FC<SectionProps> = ({ register, errors }) => {
  return (
    <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-cream/50">
      <h2 className="text-xl font-bold text-chocolate mb-6 flex items-center gap-2">
        <span className="flex items-center justify-center w-6 h-6 bg-rose-deep text-white text-[10px] rounded-full">4</span>
        Message on Cake & Instructions
      </h2>
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-text-soft">Message to be written on cake</label>
          <input
            {...register('cakeMessage')}
            type="text"
            placeholder="Happy Birthday Alex!"
            className="w-full px-4 py-3 rounded-lg border border-cream focus:outline-none focus:ring-2 focus:ring-rose/20 focus:border-rose transition-all"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-text-soft">Special Instructions for Chef</label>
          <textarea
            {...register('instructions')}
            placeholder="Any allergies or specific delivery instructions..."
            rows={3}
            className="w-full px-4 py-3 rounded-lg border border-cream focus:outline-none focus:ring-2 focus:ring-rose/20 focus:border-rose transition-all"
          />
        </div>
      </div>
    </div>
  );
};
