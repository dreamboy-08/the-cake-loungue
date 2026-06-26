"use client";

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Upload, ShoppingCart, MessageCircle, CreditCard, Save } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';

const CustomCakePage = () => {
  const { addToCart } = useCart();
  const router = useRouter();
  const [photos, setPhotos] = useState<string[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<string>("https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800");
  const [message, setMessage] = useState<string>("Your Text");
  const [flavor, setFlavor] = useState<string>("499");
  const [weight, setWeight] = useState<string>("0");
  const [notes, setNotes] = useState<string>("");
  const [price, setPrice] = useState<number>(499);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let total = Number(flavor) + Number(weight);
    if (photos.length > 0) total += 150;
    setPrice(total);
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
          setPhotos(prev => [...prev, ...newPhotos]);
          setSelectedPhoto(newPhotos[0]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const flavorOptions = [
    { label: "Chocolate", value: "499" },
    { label: "Vanilla", value: "599" },
    { label: "Red Velvet", value: "699" },
  ];

  const weightOptions = [
    { label: "0.5 KG", value: "0" },
    { label: "1 KG", value: "400" },
    { label: "2 KG", value: "900" },
  ];

  const handleAddToCart = () => {
    const flavorLabel = flavorOptions.find(f => f.value === flavor)?.label;
    const weightLabel = weightOptions.find(w => w.value === weight)?.label;

    addToCart({
      id: Date.now(), // Generate a unique ID for custom cake
      name: `Custom Cake (${flavorLabel}, ${weightLabel})`,
      price: price,
      img: selectedPhoto,
      flavor: flavorLabel,
      weight: weightLabel,
      message: message,
    });
    alert("Added To Cart");
  };

  const sendWhatsApp = () => {
    const flavorLabel = flavorOptions.find(f => f.value === flavor)?.label;
    const weightLabel = weightOptions.find(w => w.value === weight)?.label;

    const text = `CUSTOM CAKE ORDER
Flavor: ${flavorLabel}
Weight: ${weightLabel}
Message: ${message}
Price: ₹${price}`;

    window.open(`https://wa.me/917703870170?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div className="pt-32 pb-20 bg-[#fff7f8] min-h-screen">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-9">
          {/* Preview Section */}
          <div className="bg-white rounded-[22px] p-6 shadow-sm">
            <div className="relative w-full max-w-[500px] mx-auto overflow-hidden group aspect-[500/404]">
              <Image
                src="https://i.imgur.com/4AI6p5K.png"
                alt="Cake Base"
                fill
                sizes="(max-width: 500px) 100vw, 500px"
                className="object-contain transition-transform duration-300 group-hover:scale-[1.01]"
                priority
              />
              <div className="absolute top-[34%] left-1/2 -translate-x-1/2 w-[180px] h-[180px] rounded-xe overflow-hidden border-4 border-white z-[2] transition-all duration-300 group-hover:scale-[1.05]">
                <Image src={selectedPhoto} alt="User Photo" fill className="object-cover" />
              </div>
              <div className="absolute top-[72%] left-1/2 -translate-x-1/2 text-white text-2xl font-bold cursor-move drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] z-[3] transition-transform duration-300 group-hover:scale-[1.02]">
                {message}
              </div>
            </div>

            <div className="flex gap-2.5 mt-3 flex-wrap">
              {photos.map((photo, i) => (
                <div
                  key={i}
                  className="w-[70px] h-[70px] rounded-sm overflow-hidden relative cursor-pointer transition-all hover:scale-110 hover:shadow-md"
                  onClick={() => setSelectedPhoto(photo)}
                >
                  <Image src={photo} alt={`Upload ${i}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* Form Section */}
          <div className="bg-white rounded-[22px] p-6 shadow-sm flex flex-col gap-4">
            <div className="form-group">
              <label className="block mb-2 font-semibold">Upload Photos</label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-cream-dark rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-cream transition-colors"
              >
                <Upload size={32} className="text-text-soft mb-2" />
                <span className="text-sm text-text-soft">Click to upload photos</span>
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
              <label className="block mb-2 font-semibold">Cake Message</label>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Happy Birthday Riya"
                className="w-full p-3.5 border border-[#ddd] rounded-xl outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="form-group">
                <label className="block mb-2 font-semibold">Flavor</label>
                <select
                  value={flavor}
                  onChange={(e) => setFlavor(e.target.value)}
                  className="w-full p-3.5 border border-[#ddd] rounded-xl outline-none bg-white"
                >
                  {flavorOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="block mb-2 font-semibold">Weight</label>
                <select
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full p-3.5 border border-[#ddd] rounded-xl outline-none bg-white"
                >
                  {weightOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="block mb-2 font-semibold">Special Instructions</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-3.5 border border-[#ddd] rounded-xl outline-none resize-none h-[100px]"
              />
            </div>

            <div className="bg-[#fff0f3] p-[18px] rounded-xl mt-[15px] text-[22px] font-bold text-[#ff2e63]">
              Total Price: ₹{price}
            </div>

            <div className="flex flex-wrap gap-3.5 mt-5">
              <button onClick={() => alert("Design Saved Successfully")} className="bg-[#ff4d6d] text-white py-3.5 px-5 rounded-xl font-semibold cursor-pointer border-none flex items-center gap-2 hover:opacity-90">
                <Save size={18} /> Save Design
              </button>
              <button onClick={handleAddToCart} className="bg-[#111] text-white py-3.5 px-5 rounded-xl font-semibold cursor-pointer border-none flex items-center gap-2 hover:opacity-90">
                <ShoppingCart size={18} /> Add To Cart
              </button>
              <button onClick={sendWhatsApp} className="bg-[#25D366] text-white py-3.5 px-5 rounded-xl font-semibold cursor-pointer border-none flex items-center gap-2 hover:opacity-90">
                <MessageCircle size={18} /> WhatsApp
              </button>
              <button onClick={() => router.push('/checkout')} className="bg-[#3395ff] text-white py-3.5 px-5 rounded-xl font-semibold cursor-pointer border-none flex items-center gap-2 hover:opacity-90">
                <CreditCard size={18} /> Pay Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomCakePage;
