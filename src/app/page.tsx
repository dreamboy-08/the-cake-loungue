"use client";

import React from 'react';
import { useCMS } from '@/context/CMSContext';
import { useSEO } from '@/hooks/useSEO';
import Hero from "@/components/home/Hero";
import OfferMarquee from "@/components/home/OfferMarquee";
import Categories from "@/components/home/Categories";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import About from "@/components/home/About";
import Gallery from "@/components/home/Gallery";
import HowItWorks from "@/components/home/HowItWorks";
import Testimonials from "@/components/home/Testimonials";
import Contact from "@/components/home/Contact";
import { Loader2 } from 'lucide-react';

export default function Home() {
  const { homepageSections, loading } = useCMS();
  console.log("HOME RENDER: loading is", loading, "homepageSections length:", homepageSections?.length);

  // Load Home SEO dynamically from the CMS SEO manager
  useSEO('home');

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <Loader2 className="animate-spin text-rose-deep" size={48} />
      </div>
    );
  }

  // Sort sections by the CMS configuration order
  const activeSections = [...(homepageSections || [])]
    .filter(s => s.enabled)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  return (
    <>
      {activeSections.map((section) => {
        switch (section.id) {
          case 'hero':
            return <Hero key={section.id} />;
          case 'announcement':
            return <OfferMarquee key={section.id} />;
          case 'categories':
            return <Categories key={section.id} />;
          case 'trending':
            return <FeaturedProducts key={section.id} sectionId="trending" />;
          case 'bestsellers':
            return <FeaturedProducts key={section.id} sectionId="bestsellers" />;
          case 'about':
            return <About key={section.id} />;
          case 'gallery':
            return (
              <React.Fragment key={section.id}>
                <Gallery />
                <HowItWorks />
              </React.Fragment>
            );
          case 'testimonials':
            return <Testimonials key={section.id} />;
          case 'contact':
            return <Contact key={section.id} />;
          default:
            return null;
        }
      })}
    </>
  );
}
