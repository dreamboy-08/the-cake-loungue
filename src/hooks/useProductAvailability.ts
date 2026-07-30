import { useState, useEffect } from 'react';
import { useProducts } from '@/context/ProductsContext';
import { toSlug } from '@/utils/slug';

export const useProductAvailability = () => {
  const { products } = useProducts();
  const [availableSlugs, setAvailableSlugs] = useState<Set<string>>(new Set());

  useEffect(() => {
    const slugs = new Set(products.map(p => toSlug(p.category)));
    setAvailableSlugs(slugs);
  }, [products]);

  return availableSlugs;
};
