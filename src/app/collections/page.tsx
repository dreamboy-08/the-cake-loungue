"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCMS } from '@/context/CMSContext';
import BackButton from '@/components/BackButton';
import PageWrapper from '@/components/PageWrapper';
import { Loader2, ArrowRight } from 'lucide-react';

const CollectionsDirectoryPage = () => {
  const { collections, loading } = useCMS();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Filter only enabled collections and sort by displayOrder
  const enabledCollections = React.useMemo(() => {
    return collections
      .filter((c) => c.enabled !== false)
      .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  }, [collections]);

  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-rose-deep" size={48} />
        <p className="text-sm text-gray-400 font-bold uppercase tracking-widest animate-pulse">Loading Collections...</p>
      </div>
    );
  }

  return (
    <PageWrapper>
      <div className="container mx-auto px-6 pb-24">
        <div className="mb-6">
          <BackButton fallbackRoute="/" ariaLabel="Go back to home" />
        </div>

        <section className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-rose text-sm font-bold uppercase tracking-widest mb-4 block animate-fade-in">
            Premium Curated Catalogue
          </span>
          <h1 className="section-title text-4xl md:text-5xl lg:text-6xl mb-6">
            Curated Milestone Collections
          </h1>
          <p className="text-text-mid text-lg md:text-xl leading-relaxed">
            Explore our themed selections designed to elevate and sweeten every milestone celebration in your lifetime journey.
          </p>
        </section>

        {enabledCollections.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl border border-cream-dark p-8 max-w-xl mx-auto">
            <h3 className="text-xl font-playfair font-bold text-chocolate mb-2">No collections found</h3>
            <p className="text-text-soft">There are currently no active collections published.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {enabledCollections.map((col, index) => {
              const imageSrc = col.thumbnailImage || col.bannerImage || '/images/categories/Birthday Cakes.jpg';
              return (
                <Link
                  href={`/collections/${col.slug}`}
                  key={col.id}
                  className="group relative flex flex-col md:flex-row bg-white rounded-[24px] overflow-hidden border border-cream-dark shadow-sm hover:shadow-md hover:scale-[1.01] transition-all duration-500 animate-fade-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Thumbnail Container */}
                  <div className="relative w-full md:w-2/5 aspect-[4/3] md:aspect-auto overflow-hidden bg-cream-dark min-h-[220px]">
                    <Image
                      src={imageSrc}
                      alt={col.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 30vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>

                  {/* Body Details */}
                  <div className="p-8 flex-1 flex flex-col justify-between">
                    <div className="space-y-3">
                      <h3 className="font-playfair text-2xl font-bold text-chocolate group-hover:text-rose-deep transition-colors">
                        {col.title}
                      </h3>
                      {col.description && (
                        <p className="text-text-mid text-sm leading-relaxed line-clamp-3 font-poppins">
                          {col.description}
                        </p>
                      )}
                    </div>

                    <div className="mt-6 flex items-center gap-2 text-rose-deep font-bold text-sm">
                      <span>Explore Collection</span>
                      <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </PageWrapper>
  );
};

export default CollectionsDirectoryPage;
