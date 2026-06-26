"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import LivePreview from '@/components/custom-cake/LivePreview';
import CustomizationForm from '@/components/custom-cake/CustomizationForm';
import { generateCakeImage } from '@/utils/canvasUtils';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/utils/firebase';

const flavorPrices: Record<string, number> = {
  "Chocolate": 499,
  "Vanilla": 599,
  "Red Velvet": 699,
  "Butterscotch": 599,
  "Black Forest": 649,
};

const weightPrices: Record<string, number> = {
  "0": 0,
  "400": 400,
  "900": 900,
};

const CustomCakePage = () => {
  const { addToCart } = useCart();
  const router = useRouter();

  const [photos, setPhotos] = useState<string[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [message, setMessage] = useState<string>("Your Text");
  const [flavor, setFlavor] = useState<string>("Chocolate");
  const [weight, setWeight] = useState<string>("0");
  const [theme, setTheme] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [price, setPrice] = useState<number>(499);
  const [userName, setUserName] = useState<string>("");
  const [userPhone, setUserPhone] = useState<string>("");

  // Preload flavor images for smooth switching
  useEffect(() => {
    Object.keys(flavorPrices).forEach((flavorName) => {
      const img = new Image();
      img.src = `/images/custom-cakes/${flavorName.toLowerCase().replace(' ', '-')}.jpg`;
    });
  }, []);

  useEffect(() => {
    let total = (flavorPrices[flavor] || 499) + (weightPrices[weight] || 0);
    if (photos.length > 0) total += 150; // Edible photo charge
    setPrice(total);
  }, [flavor, weight, photos]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setPhotos(prev => [...prev, result]);
        setSelectedPhoto(result);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAddToCart = async () => {
    try {
      const finalImageBlob = await generateCakeImage(flavor, selectedPhoto, message, theme);
      const storageRef = ref(storage, `custom-cakes/cart-${Date.now()}.jpg`);
      await uploadBytes(storageRef, finalImageBlob);
      const imageUrl = await getDownloadURL(storageRef);

      addToCart({
        id: Date.now(),
        name: `Custom Cake (${flavor}, ${weight === "0" ? "0.5 KG" : weight === "400" ? "1 KG" : "2 KG"})`,
        price: price,
        img: imageUrl,
        flavor: flavor,
        weight: weight === "0" ? "0.5 KG" : weight === "400" ? "1 KG" : "2 KG",
        message: message,
      });
      alert("Added To Cart");
    } catch (error) {
      console.error("Error adding to cart:", error);
      // Fallback if image generation/upload fails
      addToCart({
        id: Date.now(),
        name: `Custom Cake (${flavor}, ${weight === "0" ? "0.5 KG" : weight === "400" ? "1 KG" : "2 KG"})`,
        price: price,
        img: selectedPhoto || "/images/custom-cakes/chocolate.jpg",
        flavor: flavor,
        weight: weight === "0" ? "0.5 KG" : weight === "400" ? "1 KG" : "2 KG",
        message: message,
      });
      alert("Added To Cart (Base Image)");
    }
  };

  const sendWhatsApp = async () => {
    try {
      const finalImageBlob = await generateCakeImage(flavor, selectedPhoto, message, theme);
      const storageRef = ref(storage, `custom-cakes/whatsapp-${Date.now()}.jpg`);

      // Show loading state or similar in real app
      alert("Generating final design and uploading... Please wait.");

      await uploadBytes(storageRef, finalImageBlob);
      const imageUrl = await getDownloadURL(storageRef);

      const weightLabel = weight === "0" ? "0.5 KG" : weight === "400" ? "1 KG" : "2 KG";
      const text = `*NEW CUSTOM CAKE DESIGN* 🎂

*Design Preview:* ${imageUrl}

*Customer Details:*
- *Name:* ${userName || "Not provided"}
- *Phone:* ${userPhone || "Not provided"}

*Order Details:*
- *Flavor:* ${flavor}
- *Weight:* ${weightLabel}
- *Theme:* ${theme || "N/A"}
- *Message:* ${message}
- *Instructions:* ${notes || "None"}
- *Price:* ₹${price}

_Generated via Cake Lounge AI Builder_`;

      window.open(`https://wa.me/917703870170?text=${encodeURIComponent(text)}`, "_blank");
    } catch (error) {
      console.error("WhatsApp error:", error);
      alert("Design export failed. Sending details without image.");

      const weightLabel = weight === "0" ? "0.5 KG" : weight === "400" ? "1 KG" : "2 KG";
      const text = `*CUSTOM CAKE ORDER*
*Flavor:* ${flavor}
*Weight:* ${weightLabel}
*Theme:* ${theme || "N/A"}
*Message:* ${message}
*Price:* ₹${price}`;

      window.open(`https://wa.me/917703870170?text=${encodeURIComponent(text)}`, "_blank");
    }
  };

  return (
    <div className="pt-32 pb-20 bg-[#fffdfb] min-h-screen">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-16 text-center max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-playfair font-bold text-rose-950 mb-6">Experience the Art of Gifting</h1>
          <p className="text-lg text-gray-600 leading-relaxed font-light">
            Design your bespoke cake in real-time. From premium flavors to custom edible prints,
            witness your creation come to life before it reaches your doorstep.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-16 items-start">
          {/* Left: Large Live Preview (60% visual focus) */}
          <div className="w-full lg:w-[60%] lg:sticky lg:top-32">
            <LivePreview
              flavor={flavor}
              photo={selectedPhoto}
              message={message}
              theme={theme}
            />
          </div>

          {/* Right: Controls (40% width) */}
          <div className="w-full lg:w-[40%]">
            <CustomizationForm
              message={message}
              setMessage={setMessage}
              flavor={flavor}
              setFlavor={setFlavor}
              weight={weight}
              setWeight={setWeight}
              theme={theme}
              setTheme={setTheme}
              notes={notes}
              setNotes={setNotes}
              price={price}
              userName={userName}
              setUserName={setUserName}
              userPhone={userPhone}
              setUserPhone={setUserPhone}
              onPhotoUpload={handlePhotoUpload}
              onAddToCart={handleAddToCart}
              onSave={() => alert("Design Saved Successfully!")}
              onWhatsApp={sendWhatsApp}
              onPayNow={() => router.push('/checkout')}
              photos={photos}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomCakePage;
