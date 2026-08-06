/**
 * Cake Decoration & Party Essentials Types
 */

export type DecorationStatus = 'Active' | 'Draft' | 'Out of Stock';

export interface ImageItem {
  url: string;
  altText?: string;
  displayOrder: number;
}

export interface DecorationVisibility {
  showOnHomepage: boolean;
  showInProductPageSuggestions: boolean;
  showInCartSuggestions: boolean;
  showInCheckoutPage: boolean;
  showInRelatedProducts: boolean;
  showInBirthdayCollection: boolean;
  showInSearchResults: boolean;
  showInFeaturedProducts: boolean;
  showInNewArrivals: boolean;
  showInFestivalCollection: boolean;
  hideEverywhere: boolean;
}

export interface RecommendationSettings {
  recommendWithCakes: boolean;
  recommendWithPastries: boolean;
  recommendWithCupcakes: boolean;
  recommendWithHampers: boolean;
  recommendWithCustomCakes: boolean;
  specificProductIds: string[]; // manual overrides
}

export interface UpsellSettings {
  frequentlyBoughtTogether: boolean;
  customersAlsoBought: boolean;
  recommendedAddons: boolean;
  popularWithThisCake: boolean;
}

export interface DecorationProduct {
  id?: string;
  name: string;
  category: string; // matches Category name or ID
  brand?: string;
  shortDescription: string;
  fullDescription: string;
  images: ImageItem[]; // multiple images with sorting and alt text
  thumbnailImage: string; // main image url
  price: number;
  discountPrice?: number;
  sku: string;
  stockQuantity: number;
  reservedStock: number;
  soldQuantity: number;
  lowStockWarning: number;
  status: DecorationStatus;
  sortOrder: number;
  tags: string[];

  // Controls
  visibility: DecorationVisibility;
  recommendations: RecommendationSettings;
  upsell: UpsellSettings;
  autoDisableWhenOutOfStock: boolean;

  createdAt?: string;
  updatedAt?: string;
}

export interface DecorationCategory {
  id?: string;
  name: string;
  description?: string;
  image?: string;
  active: boolean;
  slug: string;
  displayOrder: number;
  createdAt?: string;
  updatedAt?: string;
}
