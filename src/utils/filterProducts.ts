import { Product } from '@/constants/products';

export const filterProducts = (products: Product[], searchQuery: string) => {
  const query = searchQuery.toLowerCase().trim();
  if (!query) return products;

  return products.filter((product) => {
    // Search by name, category, flavor, tag, description
    if (
      product.name.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query) ||
      product.flavor.toLowerCase().includes(query) ||
      (product.tag && product.tag.toLowerCase().includes(query)) ||
      (product.description && product.description.toLowerCase().includes(query))
    ) {
      return true;
    }

    // Search across all flavors array entries
    if (Array.isArray(product.flavors)) {
      if (product.flavors.some(f => typeof f === 'string' && f.toLowerCase().includes(query))) {
        return true;
      }
    }

    return false;
  });
};
