import { Product } from '@/constants/products';

export interface RecommendationConfig {
  categoryWeight?: number;
  flavorWeight?: number;
  priceWeight?: number;
  bestsellerWeight?: number;
  limit?: number;
}

/**
 * Reusable, configurable recommendation engine that scores and returns recommended products.
 * Prioritizes:
 * 1. Same category
 * 2. Same flavour
 * 3. Similar price range
 * 4. Bestsellers / Fallbacks
 *
 * Excludes the current product itself.
 */
export const getRecommendations = (
  currentProduct: Product,
  allProducts: Product[],
  config: RecommendationConfig = {}
): Product[] => {
  const {
    categoryWeight = 10,
    flavorWeight = 8,
    priceWeight = 5,
    bestsellerWeight = 2,
    limit = 12,
  } = config;

  if (!currentProduct || !allProducts || allProducts.length === 0) {
    return [];
  }

  // Filter out the current product
  const candidates = allProducts.filter((product) => product.id !== currentProduct.id);

  // Score each candidate product
  const scoredProducts = candidates.map((candidate) => {
    let score = 0;

    // 1. Same category match
    if (candidate.category === currentProduct.category) {
      score += categoryWeight;
    }

    // 2. Same flavor match
    if (candidate.flavor && currentProduct.flavor && candidate.flavor === currentProduct.flavor) {
      score += flavorWeight;
    }

    // 3. Price proximity score
    // Difference relative to current product's price
    const maxPrice = Math.max(currentProduct.price, candidate.price);
    if (maxPrice > 0) {
      const priceRatio = 1 - Math.abs(currentProduct.price - candidate.price) / maxPrice;
      score += priceRatio * priceWeight;
    }

    // 4. Bestseller fallback bonus
    if (candidate.tag && candidate.tag.toLowerCase() === 'bestseller') {
      score += bestsellerWeight;
    }

    return {
      product: candidate,
      score,
    };
  });

  // Sort by score in descending order, then by rating as fallback, and finally by reviews count
  scoredProducts.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    if (b.product.rating !== a.product.rating) {
      return b.product.rating - a.product.rating;
    }
    return b.product.reviews - a.product.reviews;
  });

  // Extract the products and limit the output list size
  const result = scoredProducts.map((sp) => sp.product);

  // Intelligently pad with other items if we have very few recommendations
  if (result.length < limit) {
    const fallbackPool = allProducts.filter(
      (p) => p.id !== currentProduct.id && !result.some((r) => r.id === p.id)
    );
    // Sort fallbacks by tag (bestseller first), then rating
    fallbackPool.sort((a, b) => {
      const aBest = a.tag && a.tag.toLowerCase() === 'bestseller' ? 1 : 0;
      const bBest = b.tag && b.tag.toLowerCase() === 'bestseller' ? 1 : 0;
      if (bBest !== aBest) return bBest - aBest;
      return b.rating - a.rating;
    });
    result.push(...fallbackPool);
  }

  return result.slice(0, limit);
};
