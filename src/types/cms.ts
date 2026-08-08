/**
 * Content Management System (CMS) Types
 * Enterprise-grade TS schemas for website contents managed via Firestore/Local fallbacks
 */

export type LinkType = 'internal' | 'collection' | 'category' | 'custom';

export interface NavigationItem {
  id: string;
  label: string;
  linkType: LinkType;
  url: string;
  enabled: boolean;
  displayOrder: number;
  showOnDesktop: boolean;
  showOnMobile: boolean;
  hasDropdown: boolean;
  dropdownSectionIds?: string[]; // IDs of MegaMenuSection
  icon?: string;
  createdAt?: string;
}

export interface MegaMenuItem {
  id: string;
  name: string;
  slug: string;
  image?: string;
  url: string;
  displayOrder: number;
  enabled: boolean;
}

export interface MegaMenuSection {
  id: string;
  title: string;
  displayOrder: number;
  enabled: boolean;
  link?: string;
  icon?: string;
  items: MegaMenuItem[];
  createdAt?: string;
}

export interface HomepageSection {
  id: string; // e.g. 'hero', 'categories', 'trending', 'bestsellers', 'customCakes', 'collections', 'testimonials', 'gallery', 'instagram', 'faq', 'about', 'footer', 'newsletter'
  title: string;
  description?: string;
  enabled: boolean;
  order: number;
  buttonText?: string;
  buttonLink?: string;
  images?: string[]; // Slide/Gallery images
}

export interface Announcement {
  id: string;
  text: string;
  icon?: string;
  link?: string;
  enabled: boolean;
  startDate?: string;
  endDate?: string;
  displayOrder: number;
}

export interface CollectionCMSItem {
  id: string;
  title: string;
  slug: string;
  description?: string;
  bannerImage?: string;
  thumbnailImage?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  enabled: boolean;
  displayOrder: number;
}

export interface CMSWebsiteSettings {
  id: string;
  logoText: string;
  logoUrl?: string;
  faviconUrl?: string;
  websiteName: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  typography: string;
  borderRadius: string;
  footerText: string;
  businessName: string;
  address: string;
  email: string;
  phone: string;
  whatsapp: string;
  googleMapsUrl?: string;
  businessHoursMonFri: string;
  businessHoursSatSun: string;
  instagramUrl?: string;
  facebookUrl?: string;
  pinterestUrl?: string;
}

export interface CMSMediaItem {
  id: string;
  url: string;
  name: string;
  size?: number;
  folder?: string;
  altText?: string;
  createdAt?: string;
}

export interface CMSSEOMetadata {
  id: string; // page slug or 'home', 'shop', etc.
  seoTitle: string;
  metaDescription: string;
  keywords: string;
  ogImage?: string;
  canonicalUrl?: string;
  schemaMarkup?: string;
  indexPage: boolean; // Index or NoIndex
}

export interface CMSGeneralSettings {
  id: string;
  deliveryCharges: number;
  freeDeliveryThreshold: number;
  minimumOrder: number;
  serviceableZipCodes: string[];
  businessHolidays: string[]; // dates like 'YYYY-MM-DD'
  emergencyBannerEnabled: boolean;
  emergencyBannerText: string;
  popupMessageEnabled: boolean;
  popupMessageTitle: string;
  popupMessageText: string;
  couponBannerEnabled: boolean;
  couponBannerText: string;
  maintenanceMode: boolean;
}
