"use client";

import React from 'react';
import Image from 'next/image';
import { MessageCircle } from 'lucide-react';
import BackButton from '@/components/BackButton';

const CustomCakePage = () => {
  const sendWhatsApp = () => {
    const text = "Hello Cake Lounge! I would like to order a custom cake. I have attached my reference design and would like to discuss the details.";
    window.open(`https://wa.me/917703870170?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div className="pt-32 pb-20 bg-cream min-h-screen">
      <div className="container mx-auto px-6">
        <div className="max-w-[1200px] mx-auto mb-12">
          <BackButton />
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Hero Text Section */}
            <div className="order-2 lg:order-1">
              <p className="text-rose-deep font-semibold tracking-widest uppercase text-sm mb-4">Bespoke Creations</p>
              <h1 className="text-5xl lg:text-7xl font-playfair font-bold text-chocolate leading-tight mb-8">
                Design Your <br />
                <span className="text-rose-deep italic">Dream Cake</span>
              </h1>
              <p className="text-lg text-text-soft leading-relaxed font-poppins mb-10 max-w-xl">
                Share your inspiration, reference images, occasion, and requirements with our cake designers.
                We&apos;ll personally help you create the perfect custom cake for your special moment.
              </p>

              <button
                onClick={sendWhatsApp}
                className="group flex items-center gap-4 bg-rose-deep text-white px-8 py-5 rounded-full font-bold text-lg shadow-lg hover:bg-brown transition-all duration-300 hover:scale-105 active:scale-95"
              >
                <div className="bg-white/20 p-2 rounded-full group-hover:rotate-12 transition-transform duration-300">
                  <MessageCircle size={24} />
                </div>
                <span>Send Your Cake Design on WhatsApp</span>
              </button>

              <div className="mt-12 flex items-center gap-6">
                <div className="flex -space-x-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-12 h-12 rounded-full border-4 border-cream bg-cream-dark overflow-hidden">
                      <Image
                        src={`https://i.pravatar.cc/150?img=${i + 10}`}
                        alt="Customer"
                        width={48}
                        height={48}
                      />
                    </div>
                  ))}
                </div>
                <p className="text-sm text-text-soft font-medium">
                  <span className="text-chocolate font-bold">500+</span> custom designs delivered this month
                </p>
              </div>
            </div>

            {/* Illustration Section */}
            <div className="order-1 lg:order-2">
              <div className="relative">
                {/* Decorative Elements */}
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-rose/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-rose-deep/5 rounded-full blur-3xl" />

                <div className="relative z-10 bg-white p-4 rounded-[32px] shadow-2xl border border-cream-dark transform hover:rotate-1 transition-transform duration-500">
                  <div className="relative aspect-square overflow-hidden rounded-[22px]">
                    <Image
                      src="/images/categories/Custom Cakes.png"
                      alt="Custom Cake Design"
                      fill
                      className="object-cover transition-transform duration-700 hover:scale-110"
                      priority
                    />
                  </div>

                  {/* Floating Tag */}
                  <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl border border-cream max-w-[200px]">
                    <div className="flex items-center gap-3 mb-2 text-rose-deep">
                      <div className="w-2 h-2 rounded-full bg-rose-deep animate-pulse" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Available Now</span>
                    </div>
                    <p className="text-sm font-playfair font-bold text-chocolate">
                      &quot;The only limit is your imagination.&quot;
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomCakePage;
