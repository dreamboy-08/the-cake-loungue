'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toSlug } from '@/utils/slug';
import { sortCategories } from '@/utils/categorySorting';
import { useProductAvailability } from '@/hooks/useProductAvailability';
import Toast from '@/components/Toast';
import { useCMS } from '@/context/CMSContext';

const Categories = () => {
  const router = useRouter();
  const availableSlugs = useProductAvailability();
  const { categories, loading } = useCMS();
  const [cats, setCats] = useState<any[]>([]);
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({
    message: '',
    visible: false
  });

  useEffect(() => {
    if (loading) return;

    // Filter active categories
    const activeCats = categories.filter(c => c.active !== false);

    // Map categories to match storefront structure
    const mapped = activeCats.map(cat => ({
      name: cat.name,
      designs: cat.designs || (cat.productCount ? `${cat.productCount}+` : 'Explore'),
      tag: cat.tag || null,
      img: cat.image || `/images/categories/${cat.name}.jpg`,
      slug: cat.slug || toSlug(cat.name),
      displayOrder: cat.displayOrder,
      link: cat.link || (cat.slug === 'custom-cakes' ? '/custom-cake' : `/menu?category=${cat.slug || toSlug(cat.name)}`)
    }));

    // Sort by displayOrder
    const sorted = sortCategories(mapped);
    setCats(sorted);
  }, [categories, loading]);

  const handleCategoryClick = (cat: any) => {
    if (cat.link) {
      router.push(cat.link);
      return;
    }

    const slug = cat.slug || toSlug(cat.name);

    // Special case: Custom Cakes card always goes to the builder
    if (slug === 'custom-cakes') {
      router.push('/custom-cake');
      return;
    }

    if (availableSlugs.has(slug)) {
      router.push(`/menu?category=${slug}`);
    } else {
      router.push(`/menu?category=${slug}`);
    }
  };

  return (
    <section id="categories" className="py-[90px] bg-cream">
      <div className="container mx-auto px-6">
        <div className="text-center mb-[50px]">
          <p className="section-label">Browse By Category</p>
          <h2 className="section-title">What Are You Celebrating?</h2>
          <p className="section-sub mx-auto">From birthdays to weddings, we have the perfect cake for every special moment in your life.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {cats.map((cat, i) => (
            <div
              key={i}
              onClick={() => handleCategoryClick(cat)}
              className="group bg-white rounded-[22px] overflow-hidden border border-cream-dark shadow-sm transition-all duration-500 hover:scale-[1.01] hover:shadow-md animate-fade-up flex flex-col cursor-pointer"
              style={{ animationDelay: `${i * 0.1}s` }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleCategoryClick(cat);
                }
              }}
            >
              <div className="relative aspect-square overflow-hidden bg-cream-dark m-3 rounded-[18px]">
                <Image
                  src={cat.img}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 640px) 100vw, 50vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {cat.tag && (
                  <div className="absolute top-3 right-3 bg-rose-deep text-white text-[0.65rem] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-sm">
                    {cat.tag}
                  </div>
                )}
              </div>

              <div className="p-6 pt-2 text-center flex-1 flex flex-col justify-center">
                <h3 className="font-playfair text-[1.25rem] font-bold text-chocolate mb-1 group-hover:text-rose transition-colors">
                  {cat.name}
                </h3>
                <p className="text-[0.8rem] text-text-soft font-medium uppercase tracking-[0.05em]">
                  {cat.designs} Designs
                </p>
                <div className="mt-4 inline-flex items-center justify-center gap-2 text-rose-deep font-bold text-[0.85rem] opacity-0 group-hover:opacity-100 transition-opacity">
                  Explore <span className="text-lg">→</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Toast
        message={toast.message}
        isVisible={toast.visible}
        onClose={() => setToast(prev => ({ ...prev, visible: false }))}
        type="info"
      />
    </section>
  );
};

export default Categories;
