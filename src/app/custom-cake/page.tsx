"use client";

import React, { useState, useMemo } from 'react';
import { MessageCircle, Loader2, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

import CakePreview from '@/components/custom-cake/CakePreview';
import FlavorSelector, { FLAVORS, Flavor } from '@/components/custom-cake/FlavorSelector';
import WeightSelector, { WEIGHT_OPTIONS, WeightOption } from '@/components/custom-cake/WeightSelector';
import PhotoUploader from '@/components/custom-cake/PhotoUploader';
import { generateCakeComposite } from '@/components/custom-cake/CakeCanvasExporter';
import { sendWhatsAppOrder } from '@/components/custom-cake/WhatsAppService';

const CustomCakePage = () => {
  // Form State
  const [flavor, setFlavor] = useState<Flavor>(FLAVORS[0]);
  const [weight, setWeight] = useState<WeightOption>(WEIGHT_OPTIONS[0]);
  const [photo, setPhoto] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [instructions, setInstructions] = useState("");

  // UI State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState("");

  // Price Calculation
  const totalPrice = useMemo(() => {
    let base = flavor.basePrice * weight.multiplier;
    if (photo) base += 200; // Extra charge for edible photo
    return Math.round(base);
  }, [flavor, weight, photo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) {
      alert("Please enter your name and phone number.");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("Generating design preview...");
    try {
      // 1. Generate Composite Image
      const imageBlob = await generateCakeComposite(flavor, photo, message);

      setSubmitStatus("Uploading design...");
      // 2. Send to WhatsApp via Service
      await sendWhatsAppOrder({
        name,
        phone,
        flavor: flavor.name,
        weight: weight.label,
        message,
        instructions,
        price: totalPrice
      }, imageBlob);

      setSubmitStatus("Redirecting to WhatsApp...");
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-24 pb-20 bg-cream min-h-screen">
      <div className="container mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <Link href="/" className="inline-flex items-center text-text-soft hover:text-rose-deep transition-colors mb-2 group">
              <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-medium">Back to Home</span>
            </Link>
            <h1 className="text-3xl md:text-4xl font-playfair font-bold text-chocolate">
              Design Your Masterpiece
            </h1>
            <p className="text-text-soft text-sm md:text-base mt-1">
              Custom-crafted cakes, tailored to your celebration.
            </p>
          </div>
          <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-cream-dark flex items-center gap-4">
            <span className="text-text-soft text-sm font-medium">Estimated Price</span>
            <span className="text-2xl font-bold text-rose-deep">₹{totalPrice}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 items-start">

          {/* Left 60%: Live Preview */}
          <div className="lg:col-span-6 sticky top-28">
            <CakePreview
              flavor={flavor}
              photo={photo}
              message={message}
            />
            <div className="mt-4 p-4 bg-white/50 rounded-2xl border border-cream-dark/50 flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-rose-deep/10 flex items-center justify-center shrink-0 mt-0.5">
                <div className="w-2 h-2 rounded-full bg-rose-deep" />
              </div>
              <p className="text-xs text-text-mid leading-relaxed italic">
                * This is a realistic digital mockup. Our artisan bakers will ensure the final cake
                matches your vision as closely as possible. Edible photos are printed with food-grade
                inks on premium icing sheets.
              </p>
            </div>
          </div>

          {/* Right 40%: Customization Form */}
          <div className="lg:col-span-4 bg-white rounded-[32px] p-6 md:p-8 shadow-sm border border-cream-dark">
            <form onSubmit={handleSubmit} className="space-y-8">

              {/* Flavor */}
              <FlavorSelector
                selectedFlavorId={flavor.id}
                onFlavorChange={setFlavor}
              />

              {/* Weight */}
              <WeightSelector
                selectedWeight={weight.value}
                onWeightChange={setWeight}
              />

              {/* Photo Upload */}
              <PhotoUploader
                photo={photo}
                onPhotoUpload={setPhoto}
              />

              {/* Cake Message */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-text-mid uppercase tracking-wider">
                  4. Cake Message (Max 25 chars)
                </label>
                <input
                  type="text"
                  maxLength={25}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="e.g. Happy Birthday Riya"
                  className="w-full p-4 rounded-xl border-2 border-cream-dark focus:border-blush outline-none transition-all font-medium text-text placeholder:text-text-soft/50"
                />
              </div>

              {/* Customer Info */}
              <div className="space-y-4 pt-4 border-t border-cream-dark">
                <label className="block text-sm font-semibold text-text-mid uppercase tracking-wider">
                  5. Contact Details
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your Name"
                    className="w-full p-3.5 rounded-xl border border-cream-dark focus:border-blush outline-none transition-all text-sm"
                  />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Phone Number"
                    className="w-full p-3.5 rounded-xl border border-cream-dark focus:border-blush outline-none transition-all text-sm"
                  />
                </div>
                <textarea
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="Any special instructions for our bakers? (e.g. less sugar, eggless preference etc.)"
                  className="w-full p-4 rounded-xl border border-cream-dark focus:border-blush outline-none transition-all text-sm h-24 resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`
                  w-full py-4 px-6 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all
                  ${isSubmitting
                    ? 'bg-cream-dark text-text-soft cursor-not-allowed'
                    : 'bg-[#25D366] text-white hover:bg-[#20bd5c] shadow-lg shadow-green-500/20 hover:-translate-y-0.5 active:translate-y-0'}
                `}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    {submitStatus || "Preparing Request..."}
                  </>
                ) : (
                  <>
                    <MessageCircle size={20} />
                    Send Custom Cake Request
                  </>
                )}
              </button>

              <p className="text-[11px] text-center text-text-soft px-4">
                Clicking the button will generate your design and open WhatsApp to finalize details with our team.
              </p>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CustomCakePage;
