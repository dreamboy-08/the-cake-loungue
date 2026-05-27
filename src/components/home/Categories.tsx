import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const Categories = () => {
  const cats = [
    { name: 'Birthday Cakes', designs: '80+', tag: 'Popular', img: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?w=500&q=80', href: '/shop/birthday-cakes' },
    { name: 'Wedding Cakes', designs: '45+', tag: null, img: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=500&q=80', href: '/shop/wedding-cakes' },
    { name: 'Chocolate Cakes', designs: '60+', tag: 'Bestseller', img: 'https://images.unsplash.com/photo-1548365328-8c6db3220e4c?w=500&q=80', href: '/shop/chocolate-cakes' },
    { name: 'Custom Cakes', designs: 'Design Your Own', tag: 'Open', img: 'https://images.unsplash.com/photo-1561758033-7e924f619b47?w=500&q=80', href: '/custom-cake' },
  ];

  return (
    <section id="categories" className="py-[90px] bg-cream">
      <div className="container mx-auto px-6">
        <div className="text-center mb-[50px]">
          <p className="section-label">Browse By Category</p>
          <h2 className="section-title">What Are You Celebrating?</h2>
          <p className="section-sub mx-auto">From birthdays to weddings, we have the perfect cake for every special moment in your life.</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {cats.map((cat, i) => (
            <Link
              key={i}
              href={cat.href}
              className="group block relative rounded-lg overflow-hidden cursor-pointer aspect-[3/4] shadow-sm transition-all duration-350 hover:translate-y-[-8px] hover:shadow-lg animate-fade-up"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <Image
                src={cat.img}
                alt={cat.name}
                fill
                className="object-cover transition-transform duration-600 group-hover:scale-108"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[rgba(61,31,16,0.85)] to-transparent opacity-100 transition-opacity duration-300"></div>
              <div className="absolute bottom-[22px] left-0 right-0 text-center text-white">
                <h3 className="text-[1.1rem] font-semibold mb-1">{cat.name}</h3>
                <span className="text-[0.78rem] text-gold-light font-medium">{cat.designs}</span>
              </div>
              {cat.tag && (
                <div className="absolute top-4 right-4 bg-rose-deep text-white text-[0.7rem] font-bold px-2.5 py-1 rounded-[50px] uppercase tracking-wider">
                  {cat.tag}
                </div>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
