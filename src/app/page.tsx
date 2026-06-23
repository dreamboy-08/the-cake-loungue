"use client";

import React, { useState, useEffect } from 'react';
import Hero from "@/components/home/Hero";
import OfferMarquee from "@/components/home/OfferMarquee";
import Categories from "@/components/home/Categories";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import About from "@/components/home/About";
import Gallery from "@/components/home/Gallery";
import HowItWorks from "@/components/home/HowItWorks";
import Testimonials from "@/components/home/Testimonials";
import Contact from "@/components/home/Contact";
import { getHomepageContent } from "@/utils/adminService";

export default function Home() {
  const [content, setContent] = useState<any>(null);

  useEffect(() => {
    const fetchContent = async () => {
      const data = await getHomepageContent();
      setContent(data);
    };
    fetchContent();
  }, []);

  const sectionMap: { [key: string]: React.ReactNode } = {
    hero: <Hero content={content?.hero} />,
    offers: <OfferMarquee />,
    categories: <Categories />,
    featured: <FeaturedProducts />,
    about: <About content={content?.about} />,
    gallery: <Gallery />,
    how_it_works: <HowItWorks />,
    testimonials: <Testimonials content={content?.testimonials} />,
    contact: <Contact />
  };

  const sections = content?.sections?.sort((a: any, b: any) => a.order - b.order) || [
    { id: 'hero', enabled: true },
    { id: 'offers', enabled: true },
    { id: 'categories', enabled: true },
    { id: 'featured', enabled: true },
    { id: 'about', enabled: true },
    { id: 'gallery', enabled: true },
    { id: 'how_it_works', enabled: true },
    { id: 'testimonials', enabled: true },
    { id: 'contact', enabled: true }
  ];

  return (
    <>
      {sections.filter((s: any) => s.enabled).map((s: any) => (
        <React.Fragment key={s.id}>
          {sectionMap[s.id] || null}
        </React.Fragment>
      ))}
    </>
  );
}
