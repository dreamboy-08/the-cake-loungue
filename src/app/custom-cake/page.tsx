"use client";

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Upload, MessageCircle, Save, Loader2, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { storage } from '@/utils/firebase';
import { motion, AnimatePresence } from 'framer-motion';

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
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(baseImg, 0, 0, 500, 404);

        const userImg = new window.Image();
        userImg.crossOrigin = "anonymous";
        userImg.src = selectedPhoto;

        userImg.onload = () => {
          // Draw user photo in the center frame area
          // Top: 34%, Left: 50%, W: 180, H: 180
          const x = 250 - 90;
          const y = 404 * 0.34 - 30; // Adjustment for canvas coords

          // Draw a white border for the photo
          ctx.fillStyle = "white";
          ctx.fillRect(x - 4, y - 4, 188, 188);

          ctx.drawImage(userImg, x, y, 180, 180);

          // Draw message
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
        <div className="max-w-4xl mx-auto mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-playfair font-bold text-chocolate mb-4">
            Custom Cake Builder
          </h1>
          <p className="text-text-soft">Design your dream cake and send us the request directly on WhatsApp.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Preview Section */}
          <div className="bg-white rounded-[40px] p-8 shadow-xl border border-cream h-fit sticky top-32">
            <h3 className="text-xl font-bold text-chocolate mb-6 flex items-center gap-2">
              <Sparkles className="text-rose-deep" size={20} />
              Live Preview
            </h3>
            <div className="relative w-full max-w-[500px] mx-auto overflow-hidden group aspect-[500/404] bg-cream/30 rounded-3xl">
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
          <div className="bg-white rounded-[40px] p-8 md:p-10 shadow-xl border border-cream flex flex-col gap-6">
            <div className="form-group">
              <label className="block mb-3 font-bold text-chocolate">Upload Inspiration Photos</label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-rose-100 rounded-[24px] p-10 flex flex-col items-center justify-center cursor-pointer hover:bg-cream/30 transition-all group"
              >
                <div className="w-16 h-16 bg-cream rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
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
                <label className="block mb-3 font-bold text-chocolate">Cake Message</label>
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Happy Birthday Riya"
                  className="w-full p-4 bg-cream/30 rounded-2xl border-2 border-transparent focus:border-rose-deep outline-none transition-all font-semibold text-chocolate"
                />
              </div>
              <div className="form-group">
                <label className="block mb-3 font-bold text-chocolate">Cake Theme</label>
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
                <label className="block mb-3 font-bold text-chocolate">Flavor</label>
                <select
                  value={flavor}
                  onChange={(e) => setFlavor(e.target.value)}
                  className="w-full p-4 bg-cream/30 rounded-2xl border-2 border-transparent focus:border-rose-deep outline-none transition-all font-semibold text-chocolate cursor-pointer appearance-none"
                >
                  {flavorOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="block mb-3 font-bold text-chocolate">Weight</label>
                <select
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full p-4 bg-cream/30 rounded-2xl border-2 border-transparent focus:border-rose-deep outline-none transition-all font-semibold text-chocolate cursor-pointer appearance-none"
                >
                  {weightOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="block mb-3 font-bold text-chocolate">Special Instructions</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Share your specific vision..."
                className="w-full p-4 bg-cream/30 rounded-2xl border-2 border-transparent focus:border-rose-deep outline-none transition-all font-semibold text-chocolate resize-none h-[120px]"
              />
            </div>

            <div className="bg-rose/10 p-6 rounded-[30px] border-2 border-rose-deep/20 flex items-center justify-between">
              <span className="text-chocolate font-bold">Estimated Price:</span>
              <span className="text-3xl font-black text-rose-deep font-playfair">₹{price}</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <button
                onClick={() => alert("Design Saved Successfully")}
                className="flex-1 py-5 bg-white text-chocolate border-2 border-cream rounded-2xl font-bold text-lg shadow-sm hover:bg-cream/50 transition-all flex items-center justify-center gap-2"
              >
                <Save size={20} /> Save Design
              </button>
              <button
                onClick={sendWhatsApp}
                disabled={loading}
                className="flex-[2] py-5 bg-[#25D366] text-white rounded-2xl font-bold text-xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 relative disabled:opacity-70 disabled:scale-100"
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
              <p className="text-center text-xs font-bold text-rose-deep uppercase tracking-widest mt-2">
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
