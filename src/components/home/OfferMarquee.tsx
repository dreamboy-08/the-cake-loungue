import React, { useMemo } from 'react';
import { useCMS } from '@/context/CMSContext';

const OfferMarquee = () => {
  const { announcements, generalSettings } = useCMS();

  const offers = useMemo(() => {
    const list: string[] = [];

    // 1. Check if emergency notice is active
    if (generalSettings?.emergencyBannerEnabled && generalSettings?.emergencyBannerText) {
      list.push(`⚠️ <strong>${generalSettings.emergencyBannerText}</strong>`);
    }

    // 2. Check if coupon marquee banner is active
    if (generalSettings?.couponBannerEnabled && generalSettings?.couponBannerText) {
      list.push(`🎉 <strong>${generalSettings.couponBannerText}</strong>`);
    }

    // 3. Load announcements from CMS
    const activeAnnouncements = announcements
      ?.filter(a => a.enabled)
      ?.sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0)) || [];

    activeAnnouncements.forEach(a => {
      list.push(`${a.icon || '●'} ${a.text}`);
    });

    // Fallback if list is entirely empty
    if (list.length === 0) {
      return [
        '🚚 <strong>Free Delivery</strong> on Orders Above ₹499',
        '📅 <strong>Schedule</strong> Your Delivery Date',
        '🎁 Custom Cakes Require <strong>2 Days Advance Notice</strong>',
        '🍰 <strong>Freshly Baked</strong> for Every Celebration',
      ];
    }

    return list;
  }, [announcements, generalSettings]);

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
