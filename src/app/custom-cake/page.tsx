"use client";

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Upload, MessageCircle, Save, Calendar, Clock, User, Phone, Mail, Sparkles, IndianRupee } from 'lucide-react';
import BackButton from '@/components/BackButton';
import { CONTACT_INFO } from '@/constants/contact';

const CustomCakePage = () => {
  const [photos, setPhotos] = useState<string[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<string>("https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800");
  const [message, setMessage] = useState<string>("Your Text");
  const [flavor, setFlavor] = useState<string>("Chocolate");
  const [weight, setWeight] = useState<string>("0.5 KG");
  const [notes, setNotes] = useState<string>("");

  // New Fields
  const [customerName, setCustomerName] = useState<string>("");
  const [customerPhone, setCustomerPhone] = useState<string>("");
  const [customerEmail, setCustomerEmail] = useState<string>("");
  const [occasion, setOccasion] = useState<string>("");
  const [deliveryDate, setDeliveryDate] = useState<string>("");
  const [deliveryTime, setDeliveryTime] = useState<string>("");
  const [budget, setBudget] = useState<string>("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const flavorOptions = [
    { label: "Chocolate", value: "Chocolate" },
    { label: "Vanilla", value: "Vanilla" },
    { label: "Red Velvet", value: "Red Velvet" },
    { label: "Fruit Cake", value: "Fruit Cake" },
    { label: "Bento Style", value: "Bento Style" },
  ];

  const weightOptions = [
    { label: "0.5 KG", value: "0.5 KG" },
    { label: "1 KG", value: "1 KG" },
    { label: "2 KG", value: "2 KG" },
    { label: "Custom / Larger", value: "Custom" },
  ];

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newPhotos: string[] = [];
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        newPhotos.push(result);
        if (newPhotos.length === files.length) {
          setPhotos(prev => [...prev, ...newPhotos]);
          setSelectedPhoto(newPhotos[0]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const validateForm = () => {
    return (
      customerName.trim() !== "" &&
      customerPhone.trim() !== "" &&
      deliveryDate !== "" &&
      occasion.trim() !== ""
    );
  };

  const sendWhatsAppRequest = () => {
    if (!validateForm()) {
      alert("Please fill in all required fields (Name, Phone, Delivery Date, and Occasion) to continue.");
      return;
    }

    const whatsappMessage = `🎂 *CUSTOM CAKE REQUEST* 🎂

👤 *Customer Details:*
- Name: ${customerName}
- Phone: ${customerPhone}
- Email: ${customerEmail || 'Not provided'}

🍰 *Cake Specifications:*
- Type: Custom Designer Cake
- Flavor: ${flavor}
- Weight/Size: ${weight}
- Message on Cake: "${message}"
- Occasion: ${occasion}

🚚 *Delivery Details:*
- Date: ${deliveryDate}
- Preferred Time: ${deliveryTime || 'Flexible'}

💰 *Budget:* ${budget ? '₹' + budget : 'To be discussed'}

📝 *Special Instructions:*
${notes || 'None'}

${photos.length > 0 ? '\n📸 *Note:* I have uploaded a reference image on the website. I will attach it here now.' : ''}

---
Sent from Cake Lounge Website`;

    const encodedMessage = encodeURIComponent(whatsappMessage);
    const whatsappUrl = `https://wa.me/${CONTACT_INFO.whatsapp}?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="pt-24 pb-20 bg-cream min-h-screen">
      <div className="container mx-auto px-6">
        <div className="max-w-[1200px] mx-auto mb-8">
          <BackButton />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left: Preview Section */}
          <div className="sticky top-24">
            <div className="bg-white rounded-[22px] p-8 shadow-sm border border-cream">
              <p className="text-xs font-bold text-rose-deep uppercase tracking-widest mb-6 flex items-center gap-2">
                <Sparkles size={14} /> Design Preview
              </p>

              <div className="relative w-full max-w-[500px] mx-auto overflow-hidden group aspect-[500/404] bg-cream rounded-2xl">
                <Image
                  src="https://i.imgur.com/4AI6p5K.png"
                  alt="Cake Base"
                  fill
                  sizes="(max-width: 500px) 100vw, 500px"
                  className="object-contain transition-transform duration-300"
                  priority
                />
                <div className="absolute top-[34%] left-1/2 -translate-x-1/2 w-[180px] h-[180px] rounded-xe overflow-hidden border-4 border-white z-[2] shadow-lg">
                  <Image src={selectedPhoto} alt="User Photo" fill className="object-cover" />
                </div>
                <div className="absolute top-[72%] left-1/2 -translate-x-1/2 text-white text-2xl font-bold drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] z-[3] text-center w-full px-4">
                  {message}
                </div>
              </div>

              {photos.length > 0 && (
                <div className="mt-8">
                  <p className="text-[10px] font-bold text-text-soft uppercase tracking-wider mb-3">Uploaded References</p>
                  <div className="flex gap-3 flex-wrap">
                    {photos.map((photo, i) => (
                      <div
                        key={i}
                        className={`w-[60px] h-[60px] rounded-xl overflow-hidden relative cursor-pointer transition-all border-2 ${selectedPhoto === photo ? 'border-rose-deep scale-105 shadow-md' : 'border-transparent hover:border-cream-dark'}`}
                        onClick={() => setSelectedPhoto(photo)}
                      >
                        <Image src={photo} alt={`Upload ${i}`} fill className="object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-8 p-4 bg-cream rounded-xl border border-cream-dark">
                <p className="text-sm font-semibold text-chocolate flex items-center gap-2 mb-2">
                  <Upload size={16} className="text-rose-deep" /> Reference Image Policy
                </p>
                <p className="text-xs text-text-soft leading-relaxed">
                  The preview above is a visualization. Our master chefs will handcraft your cake based on your uploaded references and instructions.
                </p>
              </div>
            </div>
          </div>

          {/* Right: Form Section */}
          <div className="bg-white rounded-[22px] p-8 md:p-10 shadow-sm border border-cream">
            <div className="mb-8">
              <h1 className="font-playfair text-3xl font-bold text-chocolate mb-2">Customize Your Dream Cake</h1>
              <p className="text-text-soft text-sm">Tell us about the cake you have in mind, and we&apos;ll bring it to life.</p>
            </div>

            <div className="space-y-8">
              {/* Personal Details Section */}
              <div className="space-y-5">
                <p className="text-xs font-bold text-rose-deep uppercase tracking-[0.2em] border-b border-cream pb-2">1. Personal Details</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="form-group">
                    <label className="flex items-center gap-2 text-xs font-bold text-chocolate uppercase tracking-wider mb-2">
                      <User size={14} className="text-rose-deep" /> Full Name *
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full p-4 bg-cream rounded-xl border-none focus:ring-2 focus:ring-rose/20 outline-none transition-all text-sm font-medium"
                    />
                  </div>
                  <div className="form-group">
                    <label className="flex items-center gap-2 text-xs font-bold text-chocolate uppercase tracking-wider mb-2">
                      <Phone size={14} className="text-rose-deep" /> Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="+91 XXXXX XXXXX"
                      className="w-full p-4 bg-cream rounded-xl border-none focus:ring-2 focus:ring-rose/20 outline-none transition-all text-sm font-medium"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="flex items-center gap-2 text-xs font-bold text-chocolate uppercase tracking-wider mb-2">
                    <Mail size={14} className="text-rose-deep" /> Email Address
                  </label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full p-4 bg-cream rounded-xl border-none focus:ring-2 focus:ring-rose/20 outline-none transition-all text-sm font-medium"
                  />
                </div>
              </div>

              {/* Cake Details Section */}
              <div className="space-y-5">
                <p className="text-xs font-bold text-rose-deep uppercase tracking-[0.2em] border-b border-cream pb-2">2. Cake Specifications</p>

                <div className="form-group">
                  <label className="block text-xs font-bold text-chocolate uppercase tracking-wider mb-3">Upload Reference Photos</label>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-cream-dark rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-cream transition-colors group"
                  >
                    <div className="w-12 h-12 bg-cream-dark rounded-full flex items-center justify-center text-rose-deep mb-3 group-hover:scale-110 transition-transform">
                      <Upload size={24} />
                    </div>
                    <span className="text-sm font-bold text-chocolate">Click to upload references</span>
                    <span className="text-xs text-text-soft mt-1">JPEG, PNG up to 5MB</span>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handlePhotoUpload}
                      multiple
                      accept="image/*"
                      className="hidden"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="block text-xs font-bold text-chocolate uppercase tracking-wider mb-2">Cake Message</label>
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="e.g. Happy Birthday Riya"
                    className="w-full p-4 bg-cream rounded-xl border-none focus:ring-2 focus:ring-rose/20 outline-none transition-all text-sm font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div className="form-group">
                    <label className="block text-xs font-bold text-chocolate uppercase tracking-wider mb-2">Flavour</label>
                    <select
                      value={flavor}
                      onChange={(e) => setFlavor(e.target.value)}
                      className="w-full p-4 bg-cream rounded-xl border-none focus:ring-2 focus:ring-rose/20 outline-none transition-all text-sm font-bold text-chocolate appearance-none"
                    >
                      {flavorOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="block text-xs font-bold text-chocolate uppercase tracking-wider mb-2">Weight / Size</label>
                    <select
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      className="w-full p-4 bg-cream rounded-xl border-none focus:ring-2 focus:ring-rose/20 outline-none transition-all text-sm font-bold text-chocolate appearance-none"
                    >
                      {weightOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="block text-xs font-bold text-chocolate uppercase tracking-wider mb-2">Occasion *</label>
                  <input
                    type="text"
                    value={occasion}
                    onChange={(e) => setOccasion(e.target.value)}
                    placeholder="e.g. 1st Birthday, Wedding, Corporate Event"
                    className="w-full p-4 bg-cream rounded-xl border-none focus:ring-2 focus:ring-rose/20 outline-none transition-all text-sm font-medium"
                  />
                </div>
              </div>

              {/* Delivery Section */}
              <div className="space-y-5">
                <p className="text-xs font-bold text-rose-deep uppercase tracking-[0.2em] border-b border-cream pb-2">3. Delivery & Budget</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="form-group">
                    <label className="flex items-center gap-2 text-xs font-bold text-chocolate uppercase tracking-wider mb-2">
                      <Calendar size={14} className="text-rose-deep" /> Delivery Date *
                    </label>
                    <input
                      type="date"
                      value={deliveryDate}
                      onChange={(e) => setDeliveryDate(e.target.value)}
                      className="w-full p-4 bg-cream rounded-xl border-none focus:ring-2 focus:ring-rose/20 outline-none transition-all text-sm font-bold text-chocolate"
                    />
                  </div>
                  <div className="form-group">
                    <label className="flex items-center gap-2 text-xs font-bold text-chocolate uppercase tracking-wider mb-2">
                      <Clock size={14} className="text-rose-deep" /> Preferred Time
                    </label>
                    <select
                      value={deliveryTime}
                      onChange={(e) => setDeliveryTime(e.target.value)}
                      className="w-full p-4 bg-cream rounded-xl border-none focus:ring-2 focus:ring-rose/20 outline-none transition-all text-sm font-bold text-chocolate appearance-none"
                    >
                      <option value="">Select Time Slot</option>
                      <option value="10 AM - 1 PM">10 AM - 1 PM</option>
                      <option value="1 PM - 4 PM">1 PM - 4 PM</option>
                      <option value="4 PM - 7 PM">4 PM - 7 PM</option>
                      <option value="7 PM - 10 PM">7 PM - 10 PM</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label className="flex items-center gap-2 text-xs font-bold text-chocolate uppercase tracking-wider mb-2">
                    <IndianRupee size={14} className="text-rose-deep" /> Approximate Budget (Optional)
                  </label>
                  <input
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    placeholder="e.g. 2500"
                    className="w-full p-4 bg-cream rounded-xl border-none focus:ring-2 focus:ring-rose/20 outline-none transition-all text-sm font-medium"
                  />
                </div>
                <div className="form-group">
                  <label className="block text-xs font-bold text-chocolate uppercase tracking-wider mb-2">Special Instructions / Description</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Describe your vision (color theme, toppers, etc.)"
                    className="w-full p-4 bg-cream rounded-xl border-none focus:ring-2 focus:ring-rose/20 outline-none transition-all text-sm font-medium min-h-[120px] resize-none"
                  />
                </div>
              </div>

              {/* Action Section */}
              <div className="pt-6 border-t border-cream">
                {photos.length > 0 && (
                  <div className="mb-6 p-4 bg-green-50 rounded-2xl border border-green-100 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white shrink-0 mt-0.5">
                      <Image src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WA" width={16} height={16} className="brightness-0 invert" />
                    </div>
                    <p className="text-xs font-bold text-green-700 leading-relaxed">
                      After WhatsApp opens, please attach your reference cake image before sending your request.
                    </p>
                  </div>
                )}

                <button
                  onClick={sendWhatsAppRequest}
                  className={`w-full py-5 rounded-[22px] font-bold text-lg shadow-xl transition-all flex items-center justify-center gap-3 ${
                    validateForm()
                    ? 'bg-chocolate text-white hover:bg-brown hover:-translate-y-1 shadow-chocolate/20'
                    : 'bg-cream-dark text-text-soft cursor-not-allowed'
                  }`}
                >
                  <MessageCircle size={24} />
                  Send Request on WhatsApp
                </button>

                <p className="mt-4 text-[10px] text-center text-text-soft uppercase tracking-[0.2em] font-bold">
                  Bespoke Creations • Handcrafted Fresh
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomCakePage;
