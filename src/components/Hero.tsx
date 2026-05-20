"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, Layout as LayoutIcon, Star, Leaf, Truck, ArrowRight, ArrowLeft } from 'lucide-react';

export const Hero = () => {
  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-chocolate via-brown to-rose-deep z-0" />

      {/* Decorative blobs */}
      <div className="absolute w-[400px] h-[400px] bg-gold rounded-full blur-[60px] opacity-25 top-[-80px] right-[120px] animate-pulse" />
      <div className="absolute w-[280px] h-[280px] bg-blush rounded-full blur-[60px] opacity-25 bottom-[60px] right-[60px] animate-pulse delay-700" />
      <div className="absolute w-[200px] h-[200px] bg-rose rounded-full blur-[60px] opacity-25 top-1/2 left-[40%] animate-pulse delay-1000" />

      <div className="container relative z-10 w-full px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-screen pt-20">
          <div className="py-[60px] text-center lg:text-left flex flex-col items-center lg:items-start">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md border border-white/25 text-gold-light text-[0.78rem] font-semibold uppercase tracking-widest py-2 px-[18px] rounded-full mb-7 animate-fade-up">
              <Star size={14} className="fill-current" /> Artisan Patisserie Since 2015
            </div>
            <h1 className="font-playfair text-[clamp(2.2rem,9vw,4.2rem)] font-bold text-white leading-[1.15] animate-fade-up delay-150">
              Exquisite Cakes<br /><em className="text-gold-light italic not-italic">Delivered Fresh</em><br />to Your Door
            </h1>
            <p className="mt-5.5 text-[clamp(0.9rem,2.5vw,1.1rem)] text-white/75 leading-[1.75] max-w-[440px] animate-fade-up delay-300">
              Handcrafted with love using only the finest ingredients. Every bite is a moment of pure bliss — made just for you.
            </p>
            <div className="mt-9 flex flex-wrap gap-4 justify-center lg:justify-start animate-fade-up delay-450 w-full lg:w-auto">
              <Link href="/menu" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-rose-deep text-white py-3.5 px-8 rounded-full text-[0.9rem] font-semibold transition-all hover:bg-brown hover:-translate-y-0.5 shadow-[0_6px_24px_rgba(201,97,74,0.35)]">
                <ShoppingBag size={18} /> Order Now
              </Link>
              <Link href="/menu" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-transparent text-white border-2 border-white/70 py-3.5 px-8 rounded-full text-[0.9rem] font-semibold transition-all hover:bg-white/15 hover:border-white hover:-translate-y-0.5">
                <LayoutIcon size={18} /> View Menu
              </Link>
            </div>

            <div className="mt-14 flex gap-10 animate-fade-up delay-600">
              {[
                { num: "500+", label: "Cake Flavors" },
                { num: "50k+", label: "Happy Customers" },
                { num: "4.9★", label: "Average Rating" },
              ].map((stat, i) => (
                <div key={i}>
                  <div className="font-playfair text-[2rem] font-bold text-gold-light leading-none">{stat.num}</div>
                  <div className="text-[0.78rem] text-white/60 mt-1 uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative h-[580px] hidden lg:block animate-fade-up delay-300">
            <div className="absolute top-[10px] left-[20px] bg-white rounded-md py-2.5 px-4 shadow-md text-[0.8rem] font-semibold text-chocolate flex items-center gap-1.5 z-10 animate-float">
              <Leaf size={14} className="text-rose" /> Fresh Every Day
            </div>

            <div className="absolute w-[260px] h-[340px] top-10 left-10 -rotate-4 rounded-lg overflow-hidden shadow-lg z-[2] group hover:z-20 transition-all">
              <Image src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&q=80" alt="Chocolate Cake" fill className="object-cover transition-transform duration-[6000ms] group-hover:scale-105" />
            </div>
            <div className="absolute w-[230px] h-[290px] top-5 right-10 rotate-3 rounded-lg overflow-hidden shadow-lg z-[3] group hover:z-20 transition-all">
              <Image src="https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=500&q=80" alt="Birthday Cake" fill className="object-cover transition-transform duration-[6000ms] group-hover:scale-105" />
            </div>
            <div className="absolute w-[210px] h-[260px] bottom-[30px] left-[100px] rotate-2 rounded-lg overflow-hidden shadow-lg z-[4] group hover:z-20 transition-all">
              <Image src="https://images.unsplash.com/photo-1535141192574-5d4897c12636?w=500&q=80" alt="Strawberry Cake" fill className="object-cover transition-transform duration-[6000ms] group-hover:scale-105" />
            </div>
            <div className="absolute w-[180px] h-[220px] bottom-[60px] right-[60px] -rotate-3 rounded-lg overflow-hidden shadow-lg z-[2] group hover:z-20 transition-all">
              <Image src="https://images.unsplash.com/photo-1618426703623-c1b334571d97?w=500&q=80" alt="Wedding Cake" fill className="object-cover transition-transform duration-[6000ms] group-hover:scale-105" />
            </div>

            <div className="absolute bottom-[10px] right-[20px] bg-white rounded-md py-2.5 px-4 shadow-md text-[0.8rem] font-semibold text-chocolate flex items-center gap-1.5 z-10 animate-float delay-1000">
              <Truck size={14} className="text-rose" /> Same Day Delivery
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const slides = [
  { img: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=1400&q=80", title: "Decadent Chocolate\nDrip Cakes", desc: "Handcrafted with love, every single time." },
  { img: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=1400&q=80", title: "Elegant Wedding\nMasterpieces", desc: "Make your special day unforgettable." },
  { img: "https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=1400&q=80", title: "Floral & Pastel\nCreations", desc: "Blooming with beauty and flavour." },
  { img: "https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=1400&q=80", title: "Birthday Cakes\nWorth Celebrating", desc: "From simple to showstopper — we do it all." },
  { img: "https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=1400&q=80", title: "Gourmet Cupcakes\n& Mini Treats", desc: "Small bites, big smiles." },
];

export const HeroSlider = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <section className="relative w-full overflow-hidden">
      <div className="relative h-[320px] md:h-[520px]">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${index === current ? 'opacity-100' : 'opacity-0'}`}
          >
            <Image src={slide.img} alt={slide.title} fill className="object-cover" priority={index === 0} />
            <div className="absolute inset-0 bg-gradient-to-b from-black/15 to-black/45" />
            <div className="absolute bottom-15 left-6 md:left-[60px] z-10 text-white animate-fade-in">
              <h2 className="font-playfair text-3xl md:text-[2.6rem] leading-tight mb-2 whitespace-pre-line">{slide.title}</h2>
              <p className="text-[0.9rem] md:text-base font-light tracking-wide opacity-90">{slide.desc}</p>
            </div>
          </div>
        ))}

        <button onClick={prevSlide} className="absolute top-1/2 left-[18px] -translate-y-1/2 z-20 w-[38px] md:w-[46px] h-[38px] md:h-[46px] bg-white/22 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-rose-deep transition-all">
          <ArrowLeft size={20} />
        </button>
        <button onClick={nextSlide} className="absolute top-1/2 right-[18px] -translate-y-1/2 z-20 w-[38px] md:w-[46px] h-[38px] md:h-[46px] bg-white/22 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-rose-deep transition-all">
          <ArrowRight size={20} />
        </button>

        <div className="absolute bottom-5 w-full flex justify-center gap-2.5 z-20">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${i === current ? 'bg-rose scale-125' : 'bg-white/55'}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
