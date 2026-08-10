"use client";

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useCMS } from '@/context/CMSContext';
import { useProducts } from '@/context/ProductsContext';

export default function SEOHeadManager() {
  const pathname = usePathname();
  const { seoMetadata, collections, websiteSettings } = useCMS();
  const { products } = useProducts();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. Determine the page context and resolve metadata values
    let title = websiteSettings?.websiteName || "The Cake Lounge — Artisan Bakery & Patisserie";
    let description = websiteSettings?.footerText || "Handcrafted cakes and desserts delivered fresh to your door.";
    let keywords = "cakes, online cake delivery gurugram, premium cake shop, custom cakes, bento cakes, designer cakes";
    let ogImage = "";
    let canonical = `https://thecakelounge.com${pathname}`;
    let isIndex = true;

    // Helper to extract product ID from pathname e.g., /shop/123
    const productMatch = pathname.match(/^\/shop\/([^\/]+)$/);

    if (productMatch) {
      // Dynamic Product Page
      const productId = productMatch[1];
      const product = products.find(p => p.id.toString() === productId.toString());

      if (product) {
        title = `${product.name} | ${websiteSettings?.websiteName || "The Cake Lounge"}`;
        description = product.description || description;
        keywords = `${product.category || "Cakes"}, ${product.name}, premium cakes, online cake delivery`;
        ogImage = product.img || "";
        canonical = `https://thecakelounge.com/shop/${product.id}`;
        isIndex = true;
      }
    } else {
      // Check if it's a collection page
      const collection = collections.find(c =>
        pathname.endsWith('/' + c.slug) ||
        pathname.includes('/' + c.slug) ||
        pathname === `/menu?category=${c.slug}`
      );

      if (collection) {
        title = collection.seoTitle || `${collection.title} | ${websiteSettings?.websiteName || "The Cake Lounge"}`;
        description = collection.seoDescription || collection.description || description;
        keywords = collection.seoKeywords || keywords;
        ogImage = collection.bannerImage || collection.thumbnailImage || "";
        canonical = `https://thecakelounge.com/shop/${collection.slug}`;
        isIndex = collection.enabled;
      } else {
        // Find general page mapping in CMS SEOMetadata
        let slug = 'home';
        if (pathname === '/menu') {
          slug = 'shop';
        } else if (pathname !== '/') {
          slug = pathname.replace(/^\//, ''); // e.g. "custom-cake"
        }

        const currentMeta = seoMetadata.find(meta =>
          meta.id === slug ||
          meta.id === pathname ||
          (meta.id === 'home' && pathname === '/') ||
          (meta.id === 'shop' && pathname === '/menu')
        );

        if (currentMeta) {
          title = currentMeta.seoTitle || title;
          description = currentMeta.metaDescription || description;
          keywords = currentMeta.keywords || keywords;
          ogImage = currentMeta.ogImage || ogImage;
          canonical = currentMeta.canonicalUrl || canonical;
          isIndex = currentMeta.indexPage;
        }
      }
    }

    // 2. Perform DOM mutations in <head>
    // Update Title
    document.title = title;

    // Update Description
    let descMeta: HTMLMetaElement | null = document.querySelector("meta[name='description']");
    if (!descMeta) {
      descMeta = document.createElement('meta');
      descMeta.name = 'description';
      document.head.appendChild(descMeta);
    }
    descMeta.content = description;

    // Update Keywords
    let keywordsMeta: HTMLMetaElement | null = document.querySelector("meta[name='keywords']");
    if (!keywordsMeta) {
      keywordsMeta = document.createElement('meta');
      keywordsMeta.name = 'keywords';
      document.head.appendChild(keywordsMeta);
    }
    keywordsMeta.content = keywords;

    // Update OG Image
    let ogImageMeta: HTMLMetaElement | null = document.querySelector("meta[property='og:image']");
    if (!ogImageMeta) {
      ogImageMeta = document.createElement('meta');
      ogImageMeta.setAttribute('property', 'og:image');
      document.head.appendChild(ogImageMeta);
    }
    if (ogImage) {
      ogImageMeta.content = ogImage;
    } else {
      // Fallback ogImage from Home metadata if possible
      const homeMeta = seoMetadata.find(m => m.id === 'home');
      ogImageMeta.content = homeMeta?.ogImage || "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1200&auto=format&fit=crop";
    }

    // Update Canonical URL
    let canonicalLink: HTMLLinkElement | null = document.querySelector("link[rel='canonical']");
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.rel = 'canonical';
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = canonical;

    // Update Robots (index/noindex)
    let robotsMeta: HTMLMetaElement | null = document.querySelector("meta[name='robots']");
    if (!robotsMeta) {
      robotsMeta = document.createElement('meta');
      robotsMeta.name = 'robots';
      document.head.appendChild(robotsMeta);
    }
    robotsMeta.content = isIndex ? 'index, follow' : 'noindex, nofollow';

  }, [pathname, seoMetadata, collections, websiteSettings, products]);

  return null;
}
