import React from 'react';
import Image from 'next/image';
import { Star } from 'lucide-react';
import { testimonials } from '@/constants';

export const Testimonials = () => {
  return (
    <section id="testimonials" className="py-24 md:py-[100px] bg-cream-dark">
      <div className="container px-6">
        <div className="text-center mb-12.5">
          <p className="text-[0.75rem] font-bold uppercase tracking-[0.18em] text-rose mb-2.5">Happy Customers</p>
          <h2 className="font-playfair text-[clamp(1.8rem,8vw,3rem)] font-bold text-chocolate leading-[1.2]">What People Are Saying</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12.5">
          {testimonials.map((testi) => (
            <div key={testi.id} className="bg-white rounded-md p-8 shadow-sm hover:shadow-md hover:-translate-y-1.5 transition-all duration-350 relative">
              <div className="absolute top-2.5 left-5 text-[6rem] font-playfair text-cream-dark leading-none opacity-50 select-none">&ldquo;</div>

              <div className="flex gap-1 text-gold text-[0.9rem] mb-4 relative z-10">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className={i < Math.floor(testi.rating) ? 'fill-current' : ''} />
                ))}
              </div>

              <p className="text-[0.9rem] text-text-mid leading-[1.75] mb-6 relative z-10">
                &quot;{testi.text}&quot;
              </p>

              <div className="flex items-center gap-3.5">
                <div className="w-[46px] h-[46px] rounded-full overflow-hidden border-2 border-blush relative">
                  <Image src={testi.avatar} alt={testi.name} fill className="object-cover" />
                </div>
                <div>
                  <div className="text-[0.9rem] font-semibold text-chocolate">{testi.name}</div>
                  <div className="text-[0.75rem] text-text-soft">{testi.tag}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
