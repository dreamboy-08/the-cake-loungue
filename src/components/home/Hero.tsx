import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, LayoutGrid } from 'lucide-react';

const Hero = () => {
  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#3d1f10] via-[#6b3a2a] to-[#c9614a] z-0"></div>

      {/* Decorative blobs */}
      <div className="absolute rounded-full blur-[60px] opacity-25 animate-blob-float w-[400px] h-[400px] bg-gold top-[-80px] right-[120px]"></div>
      <div className="absolute rounded-full blur-[60px] opacity-25 animate-blob-float w-[280px] h-[280px] bg-blush bottom-[60px] right-[60px] [animation-delay:-3s]"></div>
      <div className="absolute rounded-full blur-[60px] opacity-25 animate-blob-float w-[200px] h-[200px] bg-rose top-1/2 left-[40%] [animation-delay:-5s]"></div>

      <div className="container mx-auto px-6 relative z-10 w-full pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[60px] items-center min-h-screen">
          <div className="py-[60px]">
            <div className="inline-flex items-center gap-2 bg-chocolate border border-gold/20 text-gold-light text-[0.78rem] font-semibold tracking-[0.12em] uppercase px-[18px] py-2 rounded-[50px] mb-7 animate-fade-up">
              <span className="text-sm">★</span> Artisan Patisserie Since 2015
            </div>
            <h1 className="text-white text-[clamp(2.6rem,5vw,4.2rem)] font-bold leading-[1.15] animate-fade-up [animation-delay:0.25s]">
              Exquisite Cakes<br /><em className="text-gold-light italic">Delivered Fresh</em><br />to Your Door
            </h1>
            <p className="mt-[22px] text-cream/80 text-base leading-[1.75] max-w-[440px] animate-fade-up [animation-delay:0.4s]">
              Handcrafted with love using only the finest ingredients. Every bite is a moment of pure bliss — made just for you.
            </p>
            <div className="mt-9 flex flex-wrap gap-4 animate-fade-up [animation-delay:0.55s]">
              <Link href="/menu" className="btn btn-primary">
                <ShoppingBag size={18} className="mr-2" /> Order Now
              </Link>
              <Link href="/menu" className="btn btn-outline">
                <LayoutGrid size={18} className="mr-2" /> View Menu
              </Link>
            </div>
            <div className="mt-[56px] flex gap-10 animate-fade-up [animation-delay:0.7s]">
              <div>
                <div className="font-playfair text-[2rem] font-bold text-gold-light leading-none">50k+</div>
                <div className="text-[0.78rem] text-cream/70 mt-1 uppercase tracking-[0.1em]">Happy Customers</div>
              </div>
              <div>
                <div className="font-playfair text-[2rem] font-bold text-gold-light leading-none">4.9★</div>
                <div className="text-[0.78rem] text-cream/70 mt-1 uppercase tracking-[0.1em]">Average Rating</div>
              </div>
            </div>
          </div>

          <div className="hidden lg:block relative h-[580px] animate-fade-up [animation-delay:0.3s]">
            <div className="absolute bg-white rounded-[14px] px-4 py-2.5 shadow-md text-[0.8rem] font-semibold text-chocolate flex items-center gap-1.5 whitespace-nowrap animate-blob-float top-[10px] left-5">
              <span className="text-rose">🍃</span> Fresh Every Day
            </div>

            <div className="absolute rounded-[18px] overflow-hidden shadow-lg w-[260px] h-[340px] top-10 left-10 -rotate-4 z-[2] transition-transform duration-[6s] hover:scale-105">
              <Image
                src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&q=80"
                alt="Chocolate Cake"
                fill
                sizes="260px"
                className="object-cover"
                priority
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
              />
            </div>
            <div className="absolute rounded-[18px] overflow-hidden shadow-lg w-[230px] h-[290px] top-5 right-10 rotate-3 z-[3] transition-transform duration-[6s] hover:scale-105">
              <Image
                src="https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=500&q=80"
                alt="Birthday Cake"
                fill
                sizes="230px"
                className="object-cover"
                priority
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
              />
            </div>
            <div className="absolute rounded-[18px] overflow-hidden shadow-lg w-[210px] h-[260px] bottom-[30px] left-[100px] rotate-2 z-[4] transition-transform duration-[6s] hover:scale-105">
              <Image
                src="https://images.unsplash.com/photo-1535141192574-5d4897c12636?w=500&q=80"
                alt="Strawberry Cake"
                fill
                sizes="210px"
                className="object-cover"
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
              />
            </div>
            <div className="absolute rounded-[18px] overflow-hidden shadow-lg w-[180px] h-[220px] bottom-[60px] right-[60px] -rotate-3 z-[2] transition-transform duration-[6s] hover:scale-105">
              <Image
                src="https://images.unsplash.com/photo-1618426703623-c1b334571d97?w=500&q=80"
                alt="Wedding Cake"
                fill
                sizes="180px"
                className="object-cover"
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
              />
            </div>

            <div className="absolute bg-white rounded-[14px] px-4 py-2.5 shadow-md text-[0.8rem] font-semibold text-chocolate flex items-center gap-1.5 whitespace-nowrap animate-blob-float [animation-delay:-2s] bottom-[10px] right-5">
              <span className="text-rose">📅</span> Schedule Your Delivery
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
