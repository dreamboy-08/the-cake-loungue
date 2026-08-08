"use client";

import { useEffect } from 'react';
import { useCMS } from '@/context/CMSContext';

export const useSEO = (pageId: string) => {
  const { seoMetadata } = useCMS();

  useEffect(() => {
    if (!seoMetadata || seoMetadata.length === 0) return;

    const meta = seoMetadata.find(item => item.id === pageId);
    if (!meta) return;

    // Update Page Title
    if (meta.seoTitle) {
      document.title = meta.seoTitle;
    }

    // Update Meta Description
    let descMeta = document.querySelector('meta[name="description"]');
    if (meta.metaDescription) {
      if (!descMeta) {
        descMeta = document.createElement('meta');
        descMeta.setAttribute('name', 'description');
        document.head.appendChild(descMeta);
      }
      descMeta.setAttribute('content', meta.metaDescription);
    }

    // Update Keywords
    let keywordsMeta = document.querySelector('meta[name="keywords"]');
    if (meta.keywords) {
      if (!keywordsMeta) {
        keywordsMeta = document.createElement('meta');
        keywordsMeta.setAttribute('name', 'keywords');
        document.head.appendChild(keywordsMeta);
      }
      keywordsMeta.setAttribute('content', meta.keywords);
    }

    // Update Robots index / noindex
    let robotsMeta = document.querySelector('meta[name="robots"]');
    if (!robotsMeta) {
      robotsMeta = document.createElement('meta');
      robotsMeta.setAttribute('name', 'robots');
      document.head.appendChild(robotsMeta);
    }
    robotsMeta.setAttribute('content', meta.indexPage ? 'index, follow' : 'noindex, nofollow');

  }, [pageId, seoMetadata]);
};
