"use client";

import { useEffect } from 'react';
import { useCMS } from '@/context/CMSContext';

export default function FaviconManager() {
  const { websiteSettings } = useCMS();

  useEffect(() => {
    if (websiteSettings && websiteSettings.faviconUrl) {
      let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.getElementsByTagName('head')[0].appendChild(link);
      }
      link.href = websiteSettings.faviconUrl;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [websiteSettings?.faviconUrl]);

  return null;
}
