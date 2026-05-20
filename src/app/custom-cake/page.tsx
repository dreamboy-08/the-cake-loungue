'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { ChefHat, Sparkles, Clock, Phone, Upload, Save, ShoppingCart, MessageCircle, CreditCard } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';

const CustomCakePage = () => {
  const { addToCart } = useCart();
  const [photos, setPhotos] = useState<string[]>([]);
  const [userPhoto, setUserPhoto] = useState('https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800');
  const [message, setMessage] = useState('');
  const [flavor, setFlavor] = useState('499');
  const [weight, setWeight] = useState('0');
  const [notes, setNotes] = useState('');
  const [totalPrice, setTotalPrice] = useState(499);

  // Draggable text state
  const [textPos, setTextPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let basePrice = parseInt(flavor) + parseInt(weight);
    if (photos.length > 0) basePrice += 150;
    setTotalPrice(basePrice);
  }, [flavor, weight, photos]);

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
          setPhotos((prev) => [...prev, ...newPhotos]);
          setUserPhoto(newPhotos[0]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAddToCart = () => {
    const customProduct = {
      id: Date.now(), // Generate temporary ID
      name: `Custom ${getFlavorName(flavor)} Cake`,
      flavor: getFlavorName(flavor),
      price: totalPrice,
      img: userPhoto,
      rating: 5,
      reviews: 0,
      description: `Custom cake order: ${weight === '0' ? '0.5 KG' : weight === '400' ? '1 KG' : '2 KG'}, Message: ${message}, Notes: ${notes}`
    };

    addToCart(customProduct);
    alert('Custom cake added to cart!');
  };

  const getFlavorName = (val: string) => {
    if (val === '499') return 'Chocolate';
    if (val === '599') return 'Vanilla';
    if (val === '699') return 'Red Velvet';
    return 'Custom';
  };

  const handleWhatsApp = () => {
    const text = `CUSTOM CAKE ORDER
Flavor: ${getFlavorName(flavor)}
Weight: ${weight === '0' ? '0.5 KG' : weight === '400' ? '1 KG' : '2 KG'}
Message: ${message}
Price: ₹${totalPrice}`;

    window.open(`https://wa.me/919910519242?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <main className="min-h-screen bg-cream pt-24 pb-12">
      <div className="container px-6">
        <div className="text-center mb-12">
          <h1 className="font-playfair text-4xl md:text-5xl font-bold text-chocolate mb-4">Design Your Masterpiece</h1>
          <p className="text-text-mid max-w-2xl mx-auto">Upload your photos, choose your flavors, and let us bring your vision to life.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* PREVIEW SECTION */}
          <div className="bg-white rounded-3xl p-6 shadow-xl overflow-hidden">
            <div
              ref={containerRef}
              className="relative aspect-square w-full max-w-[500px] mx-auto bg-rose/5 rounded-2xl overflow-hidden group"
            >
              <Image
                src="https://i.imgur.com/4AI6p5K.png"
                alt="Cake Base"
                fill
                className="object-contain transition-transform duration-500 group-hover:scale-105"
              />

              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="relative w-[40%] aspect-square mt-[-10%] pointer-events-auto">
                   <Image
                    src={userPhoto}
                    alt="User Photo"
                    fill
                    className="object-cover rounded-lg border-4 border-white shadow-lg"
                  />
                </div>
              </div>

              <motion.div
                drag
                dragConstraints={containerRef}
                className="absolute z-10 cursor-move text-white font-bold text-xl md:text-2xl text-center w-full px-4 drop-shadow-lg"
                style={{ top: '72%' }}
              >
                {message || "Your Text Here"}
              </motion.div>

              <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-rose-deep">
                DRAG TEXT TO REPOSITION
              </div>
            </div>

            {photos.length > 0 && (
              <div className="mt-6 flex gap-3 overflow-x-auto pb-2">
                {photos.map((src, idx) => (
                  <button
                    key={idx}
                    onClick={() => setUserPhoto(src)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${userPhoto === src ? 'border-rose-deep scale-105' : 'border-transparent'}`}
                  >
                    <Image src={src} alt={`Preview ${idx}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* FORM SECTION */}
          <div className="bg-white rounded-3xl p-8 shadow-xl">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-chocolate mb-2 flex items-center gap-2">
                  <Upload className="w-4 h-4" /> Upload Inspiration Photos
                </label>
                <div className="relative">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="border-2 border-dashed border-rose/30 rounded-xl p-6 text-center group-hover:border-rose transition-colors">
                    <p className="text-text-mid text-sm">Click to upload or drag & drop images</p>
                    <p className="text-xs text-text-light mt-1">First photo will be shown on the cake preview</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-chocolate mb-2">Cake Message</label>
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Happy Birthday Riya"
                  className="w-full px-4 py-3 rounded-xl border border-rose/20 focus:outline-none focus:ring-2 focus:ring-rose/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-chocolate mb-2">Flavor</label>
                  <select
                    value={flavor}
                    onChange={(e) => setFlavor(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-rose/20 focus:outline-none focus:ring-2 focus:ring-rose/50 bg-white"
                  >
                    <option value="499">Chocolate (₹499)</option>
                    <option value="599">Vanilla (₹599)</option>
                    <option value="699">Red Velvet (₹699)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-chocolate mb-2">Weight</label>
                  <select
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-rose/20 focus:outline-none focus:ring-2 focus:ring-rose/50 bg-white"
                  >
                    <option value="0">0.5 KG (+₹0)</option>
                    <option value="400">1 KG (+₹400)</option>
                    <option value="900">2 KG (+₹900)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-chocolate mb-2">Special Instructions</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-rose/20 focus:outline-none focus:ring-2 focus:ring-rose/50 resize-none"
                  placeholder="Any specific design requests..."
                />
              </div>

              <div className="bg-rose/5 rounded-2xl p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-text-mid">Estimated Total</p>
                  <p className="text-3xl font-bold text-rose-deep">₹{totalPrice}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-text-light">Includes design & customization</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => alert('Design saved to your account!')}
                  className="flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-white border-2 border-chocolate text-chocolate font-bold hover:bg-chocolate hover:text-white transition-all"
                >
                  <Save className="w-5 h-5" /> Save
                </button>
                <button
                  onClick={handleAddToCart}
                  className="flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-chocolate text-white font-bold hover:bg-black transition-all"
                >
                  <ShoppingCart className="w-5 h-5" /> Add to Cart
                </button>
                <button
                  onClick={handleWhatsApp}
                  className="flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-[#25D366] text-white font-bold hover:bg-[#128C7E] transition-all"
                >
                  <MessageCircle className="w-5 h-5" /> WhatsApp
                </button>
                <button
                  onClick={() => alert('Razorpay Payment Gateway would open here.')}
                  className="flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-rose-deep text-white font-bold hover:bg-rose transition-all"
                >
                  <CreditCard className="w-5 h-5" /> Pay Now
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-rose/10 flex items-center justify-center flex-shrink-0 text-rose-deep">
              <ChefHat className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-chocolate mb-1">Handcrafted</h3>
              <p className="text-sm text-text-mid">Every detail is painstakingly designed by our artisans.</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-rose/10 flex items-center justify-center flex-shrink-0 text-rose-deep">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-chocolate mb-1">Premium Quality</h3>
              <p className="text-sm text-text-mid">We use only the finest gourmet ingredients available.</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-rose/10 flex items-center justify-center flex-shrink-0 text-rose-deep">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-chocolate mb-1">Freshly Baked</h3>
              <p className="text-sm text-text-mid">Made to order to ensure the best taste and texture.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CustomCakePage;
