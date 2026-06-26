"use client";

import React, { useState, useRef, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { Upload, MessageCircle, Save, Loader2, Sparkles, Calendar as CalendarIcon, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { storage } from '@/utils/firebase';
import { motion, AnimatePresence } from 'framer-motion';
import BackButton from '@/components/BackButton';
import CalendarPicker from '@/components/CalendarPicker';

const CustomCakePage = () => {
  const router = useRouter();
  const { user, userData } = useAuth();
  const [photos, setPhotos] = useState<string[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<string>("https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800");
  const [message, setMessage] = useState<string>("Happy Birthday!");
  const [flavor, setFlavor] = useState<string>("499");
  const [weight, setWeight] = useState<string>("0");
  const [theme, setTheme] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [price, setPrice] = useState<number>(499);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  // Date selection
  const [deliveryDate, setDeliveryDate] = useState<string>('');
  const [showCalendar, setShowCalendar] = useState(false);

  const earliestDate = useMemo(() => {
    const today = new Date();
    const date = new Date(today);
    date.setDate(today.getDate() + 2); // Custom cakes need 2 days
    return date;
  }, []);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

  const generatePreviewImage = (): Promise<string> => {
    return new Promise((resolve, reject) => {
      const canvas = canvasRef.current;
      if (!canvas) return reject("Canvas not found");
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject("Context not found");

      const baseImg = new window.Image();
      baseImg.crossOrigin = "anonymous";
      baseImg.src = "https://i.imgur.com/4AI6p5K.png";

      baseImg.onload = () => {
        canvas.width = 500;
        canvas.height = 404;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(baseImg, 0, 0, 500, 404);

        const userImg = new window.Image();
        userImg.crossOrigin = "anonymous";
        userImg.src = selectedPhoto;

        userImg.onload = () => {
          const x = 250 - 90;
          const y = 404 * 0.34 - 30;

          ctx.fillStyle = "white";
          ctx.fillRect(x - 4, y - 4, 188, 188);
          ctx.drawImage(userImg, x, y, 180, 180);

          ctx.fillStyle = "white";
          ctx.font = "bold 24px Arial";
          ctx.textAlign = "center";
          ctx.shadowColor = "rgba(0,0,0,0.5)";
          ctx.shadowBlur = 10;
          ctx.fillText(message, 250, 404 * 0.72 + 20);

          resolve(canvas.toDataURL('image/jpeg', 0.8));
        };
        userImg.onerror = () => reject("Failed to load user photo");
      };
      baseImg.onerror = () => reject("Failed to load base cake image");
    });
  };

  const sendWhatsApp = async () => {
    if (!deliveryDate) {
      alert("Please select a delivery date first.");
      setShowCalendar(true);
      return;
    }

    setLoading(true);
    setStatus("Generating preview...");
    try {
      const imageData = await generatePreviewImage();
      setStatus("Uploading image...");

      const fileName = `custom-cake-${Date.now()}.jpg`;
      const storageRef = ref(storage, `custom-cake-previews/${fileName}`);
      await uploadString(storageRef, imageData, 'data_url');
      const downloadURL = await getDownloadURL(storageRef);

      const flavorLabel = flavorOptions.find(f => f.value === flavor)?.label;
      const weightLabel = weightOptions.find(w => w.value === weight)?.label;
      const formattedDate = new Date(deliveryDate).toLocaleDateString(undefined, { dateStyle: 'long' });

      const customerDetails = user ? `
Customer Name: ${userData?.displayName || user.displayName || 'N/A'}
Customer Email: ${user.email}
Customer Phone: ${userData?.addresses?.[0]?.phone || 'N/A'}` : '';

      const text = `🎂 *CUSTOM CAKE REQUEST* 🎂
---------------------------
🖼️ *Preview:* ${downloadURL}
🌈 *Theme:* ${theme || 'Standard'}
🍓 *Flavor:* ${flavorLabel}
⚖️ *Weight:* ${weightLabel}
📅 *Delivery Date:* ${formattedDate}
✍️ *Message:* ${message}
📝 *Instructions:* ${notes || 'None'}
💰 *Est. Price:* ₹${price}
---------------------------
👤 *CUSTOMER DETAILS*${customerDetails}
---------------------------
Please let me know if you need any other details!`;

      window.open(`https://wa.me/917703870170?text=${encodeURIComponent(text)}`, "_blank");
      setStatus("Success!");
      setTimeout(() => setStatus(null), 3000);
    } catch (error) {
      console.error("WhatsApp error:", error);
      alert("Failed to send WhatsApp message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-32 pb-20 bg-cream min-h-screen">
      <canvas ref={canvasRef} width="500" height="404" className="hidden" />
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto mb-12">
          <BackButton fallbackRoute="/shop/birthday-cakes" />
          <div className="text-center mt-6">
            <h1 className="text-4xl md:text-5xl font-playfair font-bold text-chocolate mb-4">
              Custom Cake Builder
            </h1>
            <p className="text-text-soft">Design your dream cake and send us the request directly on WhatsApp.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Preview Section */}
          <div className="bg-white rounded-[40px] p-8 shadow-xl border border-cream h-fit lg:sticky lg:top-32">
            <h3 className="text-xl font-bold text-chocolate mb-6 flex items-center gap-2 font-playfair">
              <Sparkles className="text-rose-deep" size={20} />
              Live Preview
            </h3>
            <div className="relative w-full max-w-[500px] mx-auto overflow-hidden group aspect-[500/404] bg-cream/30 rounded-[30px]">
              <Image
                src="https://i.imgur.com/4AI6p5K.png"
                alt="Cake Base"
                fill
                sizes="(max-width: 500px) 100vw, 500px"
                className="object-contain transition-transform duration-300 group-hover:scale-[1.01]"
                priority
              />
              <div className="absolute top-[34%] left-1/2 -translate-x-1/2 w-[160px] h-[160px] sm:w-[180px] sm:h-[180px] rounded-2xl overflow-hidden border-4 border-white z-[2] transition-all duration-300 group-hover:scale-[1.05] shadow-lg">
                <Image src={selectedPhoto} alt="User Photo" fill className="object-cover" />
              </div>
              <div className="absolute top-[72%] left-1/2 -translate-x-1/2 text-white text-xl sm:text-2xl font-bold cursor-default drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] z-[3] transition-transform duration-300 group-hover:scale-[1.02] text-center w-full px-4">
                {message}
              </div>
            </div>

            <div className="flex gap-2.5 mt-6 flex-wrap justify-center lg:justify-start">
              {photos.map((photo, i) => (
                <div
                  key={i}
                  className={`w-[70px] h-[70px] rounded-2xl overflow-hidden relative cursor-pointer transition-all hover:scale-110 hover:shadow-md border-2 ${selectedPhoto === photo ? 'border-rose-deep' : 'border-transparent'}`}
                  onClick={() => setSelectedPhoto(photo)}
                >
                  <Image src={photo} alt={`Upload ${i}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* Form Section */}
          <div className="bg-white rounded-[40px] p-8 md:p-10 shadow-xl border border-cream flex flex-col gap-8">
            <div className="form-group">
              <label className="block mb-3 font-bold text-chocolate uppercase tracking-widest text-xs">Upload Inspiration Photos</label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-rose-100 rounded-[30px] p-10 flex flex-col items-center justify-center cursor-pointer hover:bg-cream/30 transition-all group bg-cream/10"
              >
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-sm">
                  <Upload size={32} className="text-rose-deep" />
                </div>
                <span className="text-sm font-bold text-chocolate">Drop images here or click to upload</span>
                <p className="text-xs text-text-soft mt-1">PNG, JPG up to 10MB</p>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-group">
                <label className="block mb-3 font-bold text-chocolate uppercase tracking-widest text-xs">Cake Message</label>
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Happy Birthday Riya"
                  className="w-full p-4 bg-cream/30 rounded-2xl border-2 border-transparent focus:border-rose-deep outline-none transition-all font-semibold text-chocolate"
                />
              </div>
              <div className="form-group">
                <label className="block mb-3 font-bold text-chocolate uppercase tracking-widest text-xs">Cake Theme</label>
                <input
                  type="text"
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  placeholder="e.g. Space, Jungle, Minimalist"
                  className="w-full p-4 bg-cream/30 rounded-2xl border-2 border-transparent focus:border-rose-deep outline-none transition-all font-semibold text-chocolate"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="form-group">
                <label className="block mb-3 font-bold text-chocolate uppercase tracking-widest text-xs">Flavor</label>
                <div className="relative">
                  <select
                    value={flavor}
                    onChange={(e) => setFlavor(e.target.value)}
                    className="w-full p-4 bg-cream/30 rounded-2xl border-2 border-transparent focus:border-rose-deep outline-none transition-all font-semibold text-chocolate cursor-pointer appearance-none"
                  >
                    {flavorOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-rose-deep">
                    <Sparkles size={16} />
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label className="block mb-3 font-bold text-chocolate uppercase tracking-widest text-xs">Weight</label>
                <div className="relative">
                  <select
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-full p-4 bg-cream/30 rounded-2xl border-2 border-transparent focus:border-rose-deep outline-none transition-all font-semibold text-chocolate cursor-pointer appearance-none"
                  >
                    {weightOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-rose-deep">
                    <Sparkles size={16} />
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Date Selection */}
            <div className="form-group relative">
              <label className="block mb-3 font-bold text-chocolate uppercase tracking-widest text-xs">Expected Delivery Date</label>
              <button
                onClick={() => setShowCalendar(!showCalendar)}
                className="w-full text-left p-4 bg-cream/30 rounded-2xl border-2 border-transparent hover:border-rose-deep/30 focus:border-rose-deep outline-none transition-all font-bold text-chocolate flex items-center justify-between"
                type="button"
              >
                <div className="flex items-center gap-3">
                  <CalendarIcon size={20} className="text-rose-deep" />
                  {deliveryDate ? new Date(deliveryDate).toLocaleDateString(undefined, { dateStyle: 'medium' }) : "Select delivery date"}
                </div>
                <div className="text-rose-deep/50">
                  {showCalendar ? 'Close' : 'Choose'}
                </div>
              </button>

              <AnimatePresence>
                {showCalendar && (
                  <div className="absolute top-full left-0 mt-4 z-50 w-full min-w-[320px] shadow-2xl">
                    <CalendarPicker
                      selectedDate={deliveryDate}
                      minDate={earliestDate}
                      onSelect={(date) => {
                        setDeliveryDate(date);
                        setShowCalendar(false);
                      }}
                      onClose={() => setShowCalendar(false)}
                    />
                  </div>
                )}
              </AnimatePresence>
              <p className="mt-3 text-[11px] text-text-soft flex items-center gap-2 bg-cream/20 p-3 rounded-xl">
                <AlertCircle size={14} className="text-rose-deep shrink-0" />
                Custom cakes require at least 2 days advance notice.
              </p>
            </div>

            <div className="form-group">
              <label className="block mb-3 font-bold text-chocolate uppercase tracking-widest text-xs">Special Instructions</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Share your specific vision (color scheme, name on cake, dietary requirements)..."
                className="w-full p-4 bg-cream/30 rounded-2xl border-2 border-transparent focus:border-rose-deep outline-none transition-all font-semibold text-chocolate resize-none h-[120px]"
              />
            </div>

            <div className="bg-rose/10 p-8 rounded-[40px] border-2 border-rose-deep/20 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-left">
                <span className="text-chocolate font-bold block text-sm uppercase tracking-wider mb-1">Estimated Price</span>
                <p className="text-xs text-text-soft font-medium">Final price will be confirmed on WhatsApp</p>
              </div>
              <span className="text-5xl font-black text-rose-deep font-playfair">₹{price}</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-2">
              <button
                onClick={() => alert("Design Saved Successfully to your profile!")}
                className="flex-1 py-5 bg-white text-chocolate border-2 border-cream rounded-[24px] font-bold text-lg shadow-sm hover:bg-cream/50 transition-all flex items-center justify-center gap-2"
              >
                <Save size={20} /> Save Design
              </button>
              <button
                onClick={sendWhatsApp}
                disabled={loading}
                className="flex-[2] py-5 bg-[#25D366] text-white rounded-[24px] font-bold text-xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 relative disabled:opacity-70 disabled:scale-100"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={24} />
                    {status}
                  </>
                ) : (
                  <>
                    <MessageCircle size={24} />
                    Send on WhatsApp
                  </>
                )}
              </button>
            </div>

            {!user && (
              <p className="text-center text-xs font-bold text-rose-deep uppercase tracking-[0.2em] mt-2 opacity-70">
                Sign in to save your designs
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomCakePage;
