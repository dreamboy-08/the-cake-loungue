import { Product } from '@/constants/products';

export const filterProducts = (products: Product[], searchQuery: string) => {
  const query = searchQuery.toLowerCase().trim();
  if (!query) return products;

  return products.filter((product) => {
    return (
      product.name.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query) ||
      product.flavor.toLowerCase().includes(query) ||
      (product.tag && product.tag.toLowerCase().includes(query))
    );
  });
};
