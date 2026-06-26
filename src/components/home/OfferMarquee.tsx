import React from 'react';

const offers = [
  '🚚 <strong>Free Delivery</strong> on Orders Above ₹499',
  '📅 <strong>Schedule</strong> Your Delivery Date',
  '🎁 Custom Cakes Require <strong>2 Days Advance Notice</strong>',
  '🍰 <strong>Freshly Baked</strong> for Every Celebration',
  '🎉 <strong>Premium Cakes</strong> for Every Occasion',
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
