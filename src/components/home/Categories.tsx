import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { db } from '@/utils/firebase';
import { collection, onSnapshot, query, where, limit } from 'firebase/firestore';

const Categories = () => {
  const [cats, setCats] = useState<any[]>([]);

  useEffect(() => {
    // We prioritize featured or specifically chosen categories for the home page
    const q = query(
      collection(db, 'categories'),
      where('active', '==', true),
      limit(4)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedCats = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          name: data.name,
          designs: data.productCount ? `${data.productCount}+` : 'Explore',
          tag: data.isFeatured ? 'Featured' : data.isBestSeller ? 'Bestseller' : null,
          img: data.image || `/images/categories/${data.name}.jpg`,
          href: `/shop/${data.slug}`
        };
      });

      // Fallback if Firestore is empty (initial state)
      if (fetchedCats.length === 0) {
        setCats([
          { name: 'Birthday Cakes', designs: '80+', tag: 'Popular', img: '/images/categories/Birthday Cakes.jpg', href: '/shop/birthday-cakes' },
          { name: 'Wedding Cakes', designs: '45+', tag: null, img: '/images/categories/Wedding Cakes.jpg', href: '/shop/wedding-cakes' },
          { name: 'Chocolate Cakes', designs: '60+', tag: 'Bestseller', img: '/images/categories/Chocolate Cakes.jpg', href: '/shop/chocolate-cakes' },
          { name: 'Custom Cakes', designs: 'Design Your Own', tag: 'Open', img: '/images/categories/Custom Cakes.png', href: '/custom-cake' },
        ]);
      } else {
        setCats(fetchedCats);
      }
    });

    return () => unsubscribe();
  }, []);

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
            <Link
              key={i}
              href={cat.href}
              className="group bg-white rounded-[22px] overflow-hidden border border-cream-dark shadow-sm transition-all duration-500 hover:scale-[1.01] hover:shadow-md animate-fade-up flex flex-col"
              style={{ animationDelay: `${i * 0.1}s` }}
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
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
