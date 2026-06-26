"use client";

import React, { useRef } from 'react';
import { Upload, ShoppingCart, MessageCircle, CreditCard, Save } from 'lucide-react';

interface CustomizationFormProps {
  message: string;
  setMessage: (m: string) => void;
  flavor: string;
  setFlavor: (f: string) => void;
  weight: string;
  setWeight: (w: string) => void;
  theme: string;
  setTheme: (t: string) => void;
  notes: string;
  setNotes: (n: string) => void;
  price: number;
  userName: string;
  setUserName: (n: string) => void;
  userPhone: string;
  setUserPhone: (p: string) => void;
  onPhotoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAddToCart: () => void;
  onSave: () => void;
  onWhatsApp: () => void;
  onPayNow: () => void;
  photos: string[];
}

const flavorOptions = [
  { label: "Chocolate", value: "Chocolate", price: 499 },
  { label: "Vanilla", value: "Vanilla", price: 599 },
  { label: "Red Velvet", value: "Red Velvet", price: 699 },
  { label: "Butterscotch", value: "Butterscotch", price: 599 },
  { label: "Black Forest", value: "Black Forest", price: 649 },
];

const weightOptions = [
  { label: "0.5 KG", value: "0", price: 0 },
  { label: "1 KG", value: "400", price: 400 },
  { label: "2 KG", value: "900", price: 900 },
];

const CustomizationForm: React.FC<CustomizationFormProps> = ({
  message, setMessage,
  flavor, setFlavor,
  weight, setWeight,
  theme, setTheme,
  notes, setNotes,
  price,
  userName, setUserName,
  userPhone, setUserPhone,
  onPhotoUpload,
  onAddToCart,
  onSave,
  onWhatsApp,
  onPayNow,
  photos
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="bg-white rounded-[22px] p-8 shadow-sm border border-rose-50 flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-playfair font-bold text-rose-900 mb-2">Customize Your Cake</h2>
        <p className="text-sm text-gray-500">Every detail matters for your special occasion.</p>
      </div>

      <div className="form-group">
        <label className="block mb-2 font-semibold text-rose-800">Upload Photo (Optional)</label>
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-rose-200 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-rose-50 transition-colors"
        >
          <Upload size={32} className="text-rose-400 mb-2" />
          <span className="text-sm text-gray-600">Click to upload edible photo</span>
          <p className="text-xs text-gray-400 mt-1">Recommended: Square high-res image</p>
          <input
            type="file"
            ref={fileInputRef}
            onChange={onPhotoUpload}
            accept="image/*"
            className="hidden"
          />
        </div>
        {photos.length > 0 && (
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
            {photos.map((p, i) => (
              <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 border-rose-100">
                <img src={p} alt="Uploaded" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="form-group">
          <label className="block mb-2 font-semibold text-rose-800">Your Name</label>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="John Doe"
            className="w-full p-3.5 border border-rose-100 rounded-xl outline-none focus:ring-2 focus:ring-rose-500/20 transition-all"
          />
        </div>

        <div className="form-group">
          <label className="block mb-2 font-semibold text-rose-800">Phone Number</label>
          <input
            type="tel"
            value={userPhone}
            onChange={(e) => setUserPhone(e.target.value)}
            placeholder="+91 9876543210"
            className="w-full p-3.5 border border-rose-100 rounded-xl outline-none focus:ring-2 focus:ring-rose-500/20 transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="form-group">
          <label className="block mb-2 font-semibold text-rose-800">Cake Message</label>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Happy Birthday Riya"
            className="w-full p-3.5 border border-rose-100 rounded-xl outline-none focus:ring-2 focus:ring-rose-500/20 transition-all"
          />
        </div>

        <div className="form-group">
          <label className="block mb-2 font-semibold text-rose-800">Cake Theme</label>
          <input
            type="text"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            placeholder="Princess, Cars, Space..."
            className="w-full p-3.5 border border-rose-100 rounded-xl outline-none focus:ring-2 focus:ring-rose-500/20 transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="form-group">
          <label className="block mb-2 font-semibold text-rose-800">Flavor</label>
          <select
            value={flavor}
            onChange={(e) => setFlavor(e.target.value)}
            className="w-full p-3.5 border border-rose-100 rounded-xl outline-none bg-white focus:ring-2 focus:ring-rose-500/20 transition-all"
          >
            {flavorOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="block mb-2 font-semibold text-rose-800">Weight</label>
          <select
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="w-full p-3.5 border border-rose-100 rounded-xl outline-none bg-white focus:ring-2 focus:ring-rose-500/20 transition-all"
          >
            {weightOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </div>
      </div>

      <div className="form-group">
        <label className="block mb-2 font-semibold text-rose-800">Special Instructions</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Any specific requests?"
          className="w-full p-3.5 border border-rose-100 rounded-xl outline-none resize-none h-[100px] focus:ring-2 focus:ring-rose-500/20 transition-all"
        />
      </div>

      <div className="bg-rose-50 p-6 rounded-2xl flex justify-between items-center">
        <div>
          <p className="text-sm text-rose-600 font-medium">Estimated Price</p>
          <p className="text-3xl font-bold text-rose-900">₹{price}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-rose-400">Final price confirmed on call</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-4">
        <button onClick={onSave} className="flex items-center justify-center gap-2 bg-white text-rose-600 border-2 border-rose-100 py-4 rounded-xl font-bold hover:bg-rose-50 transition-all">
          <Save size={20} /> Save
        </button>
        <button onClick={onAddToCart} className="flex items-center justify-center gap-2 bg-rose-900 text-white py-4 rounded-xl font-bold hover:bg-rose-950 transition-all shadow-lg shadow-rose-900/20">
          <ShoppingCart size={20} /> Add to Cart
        </button>
        <button onClick={onWhatsApp} className="flex items-center justify-center gap-2 bg-[#25D366] text-white py-4 rounded-xl font-bold hover:opacity-90 transition-all col-span-2 shadow-lg shadow-green-500/20">
          <MessageCircle size={20} /> Send Design on WhatsApp
        </button>
        <button onClick={onPayNow} className="flex items-center justify-center gap-2 bg-rose-500 text-white py-4 rounded-xl font-bold hover:opacity-90 transition-all col-span-2 shadow-lg shadow-rose-500/20">
          <CreditCard size={20} /> Pay Now
        </button>
      </div>
    </div>
  );
};

export default CustomizationForm;
