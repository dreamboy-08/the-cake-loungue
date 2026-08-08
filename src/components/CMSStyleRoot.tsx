"use client";

import React from 'react';
import { useCMS } from '@/context/CMSContext';

export default function CMSStyleRoot() {
  const { websiteSettings } = useCMS();

  return (
    <style dangerouslySetInnerHTML={{ __html: `
      :root {
        --primary-color: ${websiteSettings?.primaryColor || '#3d1f10'};
        --secondary-color: ${websiteSettings?.secondaryColor || '#fdf6ee'};
        --accent-color: ${websiteSettings?.accentColor || '#d4a45a'};
        --border-radius-cards: ${websiteSettings?.borderRadius || '22px'};
      }
    `}} />
  );
}
