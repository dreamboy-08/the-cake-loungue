import React from 'react';
import { Search, PenTool as PenFancy, CreditCard, Truck } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    { icon: <Search size={32} />, title: "1. Browse & Choose", desc: "Explore our 500+ flavours and designs — birthday, wedding, custom and more." },
    { icon: <PenFancy size={32} />, title: "2. Personalise", desc: "Add a message, choose size, flavour, and any custom decoration you'd like." },
    { icon: <CreditCard size={32} />, title: "3. Place Order", desc: "Pay securely online or via WhatsApp." },
    { icon: <Truck size={32} />, title: "4. Delivered Fresh", desc: "Your cake arrives fresh and perfectly packed." },
  ];

  return (
    <section id="how-it-works" className="py-[90px] bg-cream">
      <div className="container mx-auto px-6">
        <div className="text-center">
          <p className="section-label">Simple & Sweet</p>
          <h2 className="section-title">How It Works</h2>
          <p className="section-sub mx-auto">Getting your dream cake delivered is as easy as 1-2-3-4.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-[54px] relative before:hidden lg:before:block before:content-[''] before:absolute before:top-11 before:left-[12.5%] before:right-[12.5%] before:h-[2px] before:bg-gradient-to-r before:from-blush before:via-rose before:to-blush before:z-0">
          {steps.map((step, i) => (
            <div key={i} className="text-center relative z-10 group">
              <div className="w-[88px] h-[88px] rounded-full bg-white border-[3px] border-blush flex items-center justify-center mx-auto mb-5 text-[1.8rem] shadow-md transition-all duration-350 group-hover:bg-rose-deep group-hover:border-rose-deep group-hover:scale-110">
                <div className="text-rose-deep transition-colors duration-300 group-hover:text-white">
                  {step.icon}
                </div>
              </div>
              <h3 className="text-base font-bold text-chocolate mb-2">{step.title}</h3>
              <p className="text-[0.82rem] text-text-soft leading-[1.6]">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
