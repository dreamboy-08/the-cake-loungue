import React from 'react';

export const HowItWorks = () => {
  const steps = [
    { icon: "🔍", title: "1. Browse & Choose", desc: "Explore our 500+ flavours and designs — birthday, wedding, custom and more." },
    { icon: "✍️", title: "2. Personalise", desc: "Add a message, choose size, flavour, and any custom decoration you'd like." },
    { icon: "💳", title: "3. Place Order", desc: "Pay securely online or via WhatsApp." },
    { icon: "🚚", title: "4. Delivered Fresh", desc: "Your cake arrives fresh and perfectly packed." },
  ];

  return (
    <section id="how-it-works" className="py-24 md:py-[90px] bg-cream">
      <div className="container px-6">
        <div className="text-center mb-14">
          <p className="text-[0.75rem] font-bold uppercase tracking-[0.18em] text-rose mb-2.5">Simple & Sweet</p>
          <h2 className="font-playfair text-[clamp(1.8rem,8vw,3rem)] font-bold text-chocolate leading-[1.2]">How It Works</h2>
          <p className="mt-3.5 text-[clamp(0.85rem,2vw,0.95rem)] text-text-soft leading-[1.7] max-w-[480px] mx-auto">
            Getting your dream cake delivered is as easy as 1-2-3-4.
          </p>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-14">
          {/* Connector line for desktop */}
          <div className="hidden lg:block absolute top-11 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-blush via-rose to-blush z-0" />

          {steps.map((step, i) => (
            <div key={i} className="text-center relative z-10 group">
              <div className="w-[88px] h-[88px] rounded-full bg-white border-[3px] border-blush flex items-center justify-center mx-auto mb-5 text-3xl shadow-md transition-all duration-350 group-hover:bg-rose-deep group-hover:border-rose-deep group-hover:scale-110">
                {step.icon}
              </div>
              <h3 className="text-base font-bold text-chocolate mb-2">{step.title}</h3>
              <p className="text-[0.82rem] text-text-soft leading-relaxed px-4">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
