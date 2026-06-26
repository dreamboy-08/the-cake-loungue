import React from 'react';
import Image from 'next/image';
import { Sprout, Hand, Truck } from 'lucide-react';

const About = () => {
  return (
    <section id="about" className="py-[100px] bg-white">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          {/* Visual */}
          <div className="relative hidden lg:block">
            <div className="absolute top-[-20px] left-[-20px] w-[100px] h-[100px] bg-gold-light rounded-full z-0 opacity-60"></div>
            <div className="rounded-xl overflow-hidden shadow-lg aspect-[4/5] relative">
              <Image
                src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=700&q=80"
                alt="Our Bakery"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="absolute bottom-[-24px] right-[-24px] bg-white rounded-md p-6 shadow-md z-[2] max-w-[200px]">
              <div className="font-playfair text-[2.2rem] font-bold text-rose-deep leading-none">10+</div>
              <p className="text-[0.8rem] text-text-soft mt-1 leading-[1.4]">Years of crafting joyful memories with every cake</p>
            </div>
          </div>

          {/* Content */}
          <div className="about-content">
            <p className="section-label">Our Story</p>
            <h2 className="section-title">Baked with Passion,<br />Served with Love</h2>
            <p className="mt-4 text-[0.95rem] text-text-soft leading-[1.7] max-w-full">
              Cake Lounge was born from a grandmother&apos;s kitchen in 2015. What started as late-night baking sessions and recipes passed down through generations has blossomed into a beloved patisserie trusted by thousands.
            </p>

            <div className="mt-9 flex flex-col gap-5">
              {[
                { icon: <Sprout size={20} />, title: "All-Natural Ingredients", desc: "We source only the finest local produce — no artificial preservatives, ever." },
                { icon: <Hand size={20} />, title: "Handcrafted Daily", desc: "Each cake is made fresh the morning of delivery by our master pastry chefs." },
                { icon: <Truck size={20} />, title: "Guaranteed Freshness", desc: "Freshly Baked for Your Selected Date." },
              ].map((feat, i) => (
                <div key={i} className="flex items-start gap-4 animate-fade-up" style={{ animationDelay: `${i * 0.1}s` }}>
                  <div className="w-11 h-11 min-w-[44px] bg-cream-dark rounded-sm flex items-center justify-center text-rose-deep">
                    {feat.icon}
                  </div>
                  <div>
                    <h4 className="text-[0.95rem] font-semibold mb-0.5">{feat.title}</h4>
                    <p className="text-[0.82rem] text-text-soft leading-[1.5]">{feat.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
