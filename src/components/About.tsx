import React from 'react';
import Image from 'next/image';

export const About = () => {
  return (
    <section id="about" className="py-24 md:py-[100px]">
      <div className="container px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="relative hidden md:block">
            <div className="absolute -top-5 -left-5 w-[100px] h-[100px] bg-gold-light rounded-full z-0 opacity-60" />
            <div className="relative rounded-xl overflow-hidden shadow-lg aspect-[4/5]">
              <Image
                src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=700&q=80"
                alt="Our Bakery"
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-white rounded-md p-6 shadow-md z-10 max-w-[200px]">
              <div className="font-playfair text-[2.2rem] font-bold text-rose-deep leading-none">10+</div>
              <p className="text-[0.8rem] text-text-soft mt-1 leading-relaxed">Years of crafting joyful memories with every cake</p>
            </div>
          </div>

          <div className="flex flex-col">
            <p className="text-[0.75rem] font-bold uppercase tracking-[0.18em] text-rose mb-2.5">Our Story</p>
            <h2 className="font-playfair text-[clamp(1.8rem,8vw,3rem)] font-bold text-chocolate leading-[1.2] mb-4">
              Baked with Passion,<br />Served with Love
            </h2>
            <p className="text-[clamp(0.85rem,2vw,0.95rem)] text-text-soft leading-[1.7] mb-9">
              Cake Lounge was born from a grandmother&apos;s kitchen in 2015. What started as late-night baking sessions and recipes passed down through generations has blossomed into a beloved patisserie trusted by thousands.
            </p>

            <div className="flex flex-col gap-5">
              {[
                { icon: "🌱", title: "All-Natural Ingredients", desc: "We source only the finest local produce — no artificial preservatives, ever." },
                { icon: "👨‍🍳", title: "Handcrafted Daily", desc: "Each cake is made fresh the morning of delivery by our master pastry chefs." },
                { icon: "🚚", title: "Guaranteed Freshness", desc: "Express delivery in temperature-controlled packaging within 4 hours." },
              ].map((feat, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className="w-11 h-11 min-w-[44px] bg-cream-dark rounded-sm flex items-center justify-center text-xl">
                    {feat.icon}
                  </div>
                  <div>
                    <h4 className="text-[0.95rem] font-semibold mb-0.5">{feat.title}</h4>
                    <p className="text-[0.82rem] text-text-soft leading-relaxed">{feat.desc}</p>
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
