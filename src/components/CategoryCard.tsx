import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Category } from '@/types';

interface CategoryCardProps {
  category: Category;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  return (
    <Link href={`/menu#${category.name.toLowerCase().replace(/\s+/g, '-')}`} className="block relative rounded-lg overflow-hidden cursor-pointer aspect-[3/4] shadow-sm hover:shadow-lg hover:-translate-y-2 transition-all duration-350 group">
      <Image
        src={category.img}
        alt={category.name}
        fill
        className="object-cover transition-transform duration-600 group-hover:scale-108"
        sizes="(max-width: 768px) 50vw, 25vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-chocolate/85 via-transparent to-transparent" />
      <div className="absolute bottom-[22px] left-0 right-0 text-center text-white">
        <h3 className="text-[1.1rem] font-semibold mb-1">{category.name}</h3>
        <span className="text-[0.78rem] text-gold-light font-medium">{category.count}</span>
      </div>
      {category.tag && (
        <div className="absolute top-4 right-4 bg-rose-deep text-white text-[0.7rem] font-bold py-1 px-2.5 rounded-full uppercase tracking-wider">
          {category.tag}
        </div>
      )}
    </Link>
  );
};
