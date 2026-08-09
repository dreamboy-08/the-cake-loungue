"use client";

import React from 'react';
import { useCMS } from '@/context/CMSContext';
import Link from 'next/link';

const OfferMarquee = () => {
  const { announcements, loading } = useCMS();

  // If loading and we have no announcements, show a simple placeholder
  if (loading && announcements.length === 0) {
    return (
      <div id="offer-banner" className="bg-brown overflow-hidden py-3.5 min-h-[48px]">
        <div className="flex w-max animate-marquee">
          <div className="inline-flex items-center gap-3 px-12 text-[0.85rem] font-medium text-gold-light whitespace-nowrap">
            <span className="text-rose text-[0.9rem]">●</span>
            <span>Loading exquisite offers...</span>
          </div>
        </div>
      </div>
    );
  }

  // Filter active announcements
  const now = new Date();
  const activeAnnouncements = announcements
    .filter(item => {
      if (item.enabled === false) return false;
      if (item.startDate) {
        const start = new Date(item.startDate);
        if (now < start) return false;
      }
      if (item.endDate) {
        const end = new Date(item.endDate);
        if (now > end) return false;
      }
      return true;
    })
    .sort((a, b) => a.displayOrder - b.displayOrder);

  if (activeAnnouncements.length === 0) {
    return null;
  }

  // To keep marquee continuous and filled, duplicate items if they are fewer than 10
  let displayedAnnouncements = [...activeAnnouncements];
  if (displayedAnnouncements.length > 0) {
    while (displayedAnnouncements.length < 10) {
      displayedAnnouncements = [...displayedAnnouncements, ...activeAnnouncements];
    }
  }

  return (
    <div id="offer-banner" className="bg-brown overflow-hidden py-3.5 select-none">
      <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
        {displayedAnnouncements.map((item, i) => {
          const content = (
            <span className="inline-flex items-center gap-2">
              {item.icon && <span className="text-[1.1rem] shrink-0">{item.icon}</span>}
              <span className="font-semibold text-gold-light tracking-wide">{item.text}</span>
            </span>
          );

          const isExternal = item.link && (item.link.startsWith('http://') || item.link.startsWith('https://'));

          return (
            <div
              key={`${item.id}-${i}`}
              className="inline-flex items-center gap-3 px-12 text-[0.85rem] font-medium text-gold-light whitespace-nowrap transition-all duration-300"
            >
              <span className="text-rose text-[0.9rem] shrink-0">●</span>
              {item.link ? (
                isExternal ? (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-rose transition-colors duration-200"
                  >
                    {content}
                  </a>
                ) : (
                  <Link
                    href={item.link}
                    className="hover:text-rose transition-colors duration-200"
                  >
                    {content}
                  </Link>
                )
              ) : (
                <span>{content}</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OfferMarquee;
