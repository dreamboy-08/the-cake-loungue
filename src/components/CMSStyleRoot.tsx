"use client";

import React from 'react';
import { useCMS } from '@/context/CMSContext';

export default function CMSStyleRoot() {
  const { websiteSettings } = useCMS();

  if (!websiteSettings) return null;

  const { primaryColor, secondaryColor, accentColor, borderRadius, typography } = websiteSettings;

  let styleContent = "";

  // Only inject if primaryColor was changed from original production default (#3d1f10)
  if (primaryColor && primaryColor !== '#3d1f10') {
    styleContent += `
      :root {
        --chocolate: ${primaryColor} !important;
      }
    `;
  }

  // Only inject if secondaryColor was changed from original production default (#fdf6ee)
  if (secondaryColor && secondaryColor !== '#fdf6ee') {
    styleContent += `
      :root {
        --cream: ${secondaryColor} !important;
      }
    `;
  }

  // Only inject if accentColor was changed from original production default (#c9614a)
  if (accentColor && accentColor !== '#c9614a') {
    styleContent += `
      :root {
        --rose-deep: ${accentColor} !important;
        --rose: ${accentColor} !important;
      }
    `;
  }

  // Only inject if borderRadius was changed from original production default (22px)
  if (borderRadius && borderRadius !== '22px') {
    // Treat numeric/string inputs safely (e.g. "22px" or just "22")
    const radiusVal = borderRadius.endsWith('px') || borderRadius.endsWith('rem') || borderRadius.endsWith('%')
      ? borderRadius
      : `${borderRadius}px`;

    styleContent += `
      :root {
        --radius-sm: ${radiusVal} !important;
        --radius-md: ${radiusVal} !important;
        --radius-lg: ${radiusVal} !important;
        --radius-xl: ${radiusVal} !important;
      }
    `;
  }

  // Only inject if typography was changed from original production default (Playfair Display, Poppins)
  if (typography && typography !== 'Playfair Display, Poppins') {
    // Split fonts if comma-separated
    const fonts = typography.split(',').map(f => f.trim()).filter(Boolean);
    if (fonts.length > 0) {
      styleContent += `
        body {
          font-family: ${fonts.join(', ')} !important;
        }
      `;
    }
  }

  if (!styleContent) return null;

  return (
    <style dangerouslySetInnerHTML={{ __html: styleContent }} />
  );
}
