/**
 * Admin Dashboard Types
 * Comprehensive type definitions for all admin features
 */

// ============= USER ROLES =============
export type UserRole = 'superadmin' | 'admin' | 'staff' | 'user';

export interface UserData {
  uid: string;
  email: string;
  displayName?: string;
  role: UserRole;
  createdAt: string;
  addresses?: Address[];
  lastLogin?: string;
}

export interface Address {
  id: string;
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
}

// ============= PRODUCTS =============
export interface ProductWeight {
  label: string;
  price: number;
}

export interface Product {
  id?: string;
  name: string;
  price: number;
  weights?: ProductWeight[];
  discountPrice?: number;
  description: string;
  category: string;
  flavor: string;
  tags: string[];
  images: string[]; // Array of image URLs
  thumbnailImage?: string;
  isAvailable: boolean;
  servings?: number;
  prepareTime?: string;
  createdAt?: string;
  updatedAt?: string;
  rating?: number;
  reviews?: number;
}

// ============= CATEGORIES =============
export interface Category {
  id?: string;
  name: string;
  description?: string;
  image?: string;
  isVisible: boolean;
  displayOrder?: number;
  createdAt?: string;
  updatedAt?: string;
}

// ============= SITE SETTINGS =============
export interface BusinessHours {
  day: string; // 'Monday', 'Tuesday', etc.
  isOpen: boolean;
  openTime: string; // HH:mm format
  closeTime: string; // HH:mm format
}

export interface SiteSettings {
  id?: string;
  shopName?: string;
  shopDescription?: string;
  businessHours?: BusinessHours[];
  deliveryCharges: number;
  minimumOrderAmount: number;
  deliveryTimeSlots?: string[]; // ['12:00 PM - 1:00 PM', etc.]
  maxDeliveryDistance?: number;
  currency?: string;
  timezone?: string;
  createdAt?: string;
  updatedAt?: string;
}

// ============= CONTACT INFORMATION =============
export interface ContactInfo {
  id?: string;
  phone: string[];
  whatsappNumber: string;
  email: string[];
  address: string;
  city: string;
  state: string;
  zipCode: string;
  googleMapsUrl?: string;
  googleMapsEmbed?: string;
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
    linkedin?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

// ============= ANNOUNCEMENT BAR =============
export interface AnnouncementBar {
  id?: string;
  text: string;
  isEnabled: boolean;
  backgroundColor?: string; // hex color
  textColor?: string;
  startDate?: string;
  endDate?: string;
  link?: string;
  icon?: 'gift' | 'star' | 'truck' | 'bell' | 'zap';
  createdAt?: string;
  updatedAt?: string;
}

// ============= HOMEPAGE CONTENT =============
export interface HeroSection {
  images: string[];
  mainText: string;
  subText?: string;
  ctaButtonText?: string;
  ctaButtonLink?: string;
  autoPlayInterval?: number; // milliseconds
}

export interface FeaturedCategory {
  categoryId: string;
  displayOrder: number;
}

export interface FeaturedProduct {
  productId: string;
  displayOrder: number;
}

export interface Testimonial {
  id: string;
  authorName: string;
  authorImage?: string;
  rating: number;
  text: string;
  displayOrder: number;
}

export interface PromotionalSection {
  id: string;
  title: string;
  description?: string;
  image?: string;
  ctaText?: string;
  ctaLink?: string;
  backgroundColor?: string;
  textColor?: string;
  displayOrder: number;
}

export interface HomepageSection {
  id: string;
  name: string; // 'hero', 'featured-categories', 'featured-products', 'testimonials', 'promotional', 'about', 'contact'
  isVisible: boolean;
  displayOrder: number;
}

export interface HomepageContent {
  id?: string;
  hero?: HeroSection;
  featuredCategories?: FeaturedCategory[];
  featuredProducts?: FeaturedProduct[];
  testimonials?: Testimonial[];
  promotionalSections?: PromotionalSection[];
  sections?: HomepageSection[]; // Order and visibility control
  aboutText?: string;
  aboutImage?: string;
  createdAt?: string;
  updatedAt?: string;
}

// ============= BANNERS =============
export interface Banner {
  id?: string;
  title: string;
  description?: string;
  image: string;
  link?: string;
  displayLocation: 'hero' | 'above-featured' | 'below-featured' | 'footer';
  startDate?: string;
  endDate?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// ============= API RESPONSE TYPES =============
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// ============= FORM STATES =============
export interface FormState {
  isLoading: boolean;
  error: string | null;
  success: boolean;
}
