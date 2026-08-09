"use client";

import React from 'react';
import { useCMS } from '@/context/CMSContext';

export default function CMSStyleRoot() {
  const { websiteSettings } = useCMS();

  if (!websiteSettings) return null;

  const { primaryColor, secondaryColor, accentColor, borderRadius, typography } = websiteSettings;

  let styleContent = "";

  if (primaryColor) {
    styleContent += `
      :root {
        --chocolate: ${primaryColor} !important;
      }
    `;
  }
  if (secondaryColor) {
    styleContent += `
      :root {
        --cream: ${secondaryColor} !important;
      }
    `;
  }
  if (accentColor) {
    styleContent += `
      :root {
        --gold: ${accentColor} !important;
        --rose: ${accentColor} !important;
        --rose-deep: ${accentColor} !important;
      }
    `;
  }
  if (borderRadius) {
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
  if (typography) {
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

  return (
    <style dangerouslySetInnerHTML={{ __html: styleContent }} />
  );
}
