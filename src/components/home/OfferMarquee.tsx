import React from 'react';

const offers = [
  '🎂 Use code <strong>SWEET20</strong> for 20% off your first order!',
  '🚚 <strong>Free delivery</strong> on orders above ₹999',
  '🎁 Custom cakes available — <strong>Order 2 days in advance</strong>',
  '⭐ Rated <strong>#1 Bakery</strong> in Delhi NCR 2024',
  '🍓 New Summer Flavours now available — <strong>Mango Sorbet & Lychee Rose</strong>',
  '🎉 <strong>Same-day delivery</strong> in select areas — Order before 2 PM',
];

const OfferMarquee = () => {
  return (
    <div id="offer-banner" className="bg-brown overflow-hidden py-3.5">
      <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
        {[...offers, ...offers].map((offer, i) => (
          <div key={i} className="inline-flex items-center gap-3 px-12 text-[0.85rem] font-medium text-gold-light whitespace-nowrap">
            <span className="text-rose text-[0.9rem]">●</span>
            <span dangerouslySetInnerHTML={{ __html: offer }} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default OfferMarquee;
