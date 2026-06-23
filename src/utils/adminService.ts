import { db } from './firebase';
import {
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  query,
  orderBy,
  updateDoc
} from 'firebase/firestore';

/**
 * CMS Interfaces
 */

export interface SiteSettings {
  logoText?: string;
  copyrightText?: string;
  announcementBar?: {
    enabled?: boolean;
    text?: string;
    link?: string;
    startDate?: string;
    endDate?: string;
  };
  deliveryCharges?: number;
  minOrderAmount?: number;
  deliveryTiming?: string;
}

export interface ContactInfo {
  phone: string;
  email: string;
  address: string;
  whatsapp: string;
  googleMaps?: string;
  socialLinks?: {
    instagram?: string;
    facebook?: string;
    pinterest?: string;
  };
}

export interface CustomSection {
  id: string;
  title: string;
  description?: string;
  image?: string;
  ctaText?: string;
  ctaLink?: string;
  backgroundColor?: string;
  textColor?: string;
}

export interface HomepageContent {
  hero: {
    title?: string;
    subtitle?: string;
    ctaPrimary?: { text: string; link: string };
    ctaSecondary?: { text: string; link: string };
    images?: string[];
  };
  about: {
    title?: string;
    description?: string;
  };
  gallery?: { src: string; label: string }[];
  testimonials?: { id: number; name: string; role: string; text: string; rating: number }[];
  sections: { id: string; title: string; enabled: boolean; order: number; isCustom?: boolean }[];
  customSections?: CustomSection[];
}

export interface BusinessHours {
  mon_fri: string;
  sat_sun: string;
  delivery?: string;
  opening?: string;
  closing?: string;
}

// Document names in their respective collections
const SETTINGS_DOC = 'general';
const HOMEPAGE_DOC = 'main';
const CONTACT_DOC = 'primary';
const HOURS_DOC = 'standard';

/**
 * CMS Default Values
 */
export const CMS_DEFAULTS = {
  siteSettings: {
    logoText: 'Cake Lounge',
    copyrightText: '© 2025 Cake Lounge Patisserie. All rights reserved.',
    announcementBar: {
      enabled: true,
      text: 'Free Delivery Above ₹999',
      link: '/menu',
      startDate: '',
      endDate: ''
    },
    deliveryCharges: 0,
    minOrderAmount: 0,
    deliveryTiming: '45 - 60 mins'
  } as SiteSettings,
  contactInfo: {
    phone: '',
    email: '',
    address: '',
    whatsapp: '',
    googleMaps: '',
    socialLinks: {
      instagram: '',
      facebook: '',
      pinterest: ''
    }
  } as ContactInfo,
  homepageContent: {
    hero: {
      title: 'Exquisite Cakes Delivered Fresh',
      subtitle: 'Handcrafted with love using only the finest ingredients.',
      ctaPrimary: { text: 'Order Now', link: '/menu' },
      ctaSecondary: { text: 'View Menu', link: '/menu' },
      images: []
    },
    about: {
      title: 'Baked with Passion, Served with Love',
      description: 'Cake Lounge was born from a grandmother\'s kitchen in 2015. What started as late-night baking sessions and recipes passed down through generations has blossomed into a beloved patisserie trusted by thousands.'
    },
    gallery: [],
    testimonials: [
      { id: 1, name: 'Priya Sharma', role: 'Birthday Celebration', text: 'The cake was absolutely beautiful and tasted even better!', rating: 5 },
      { id: 2, name: 'Rahul Verma', role: 'Anniversary', text: 'Best red velvet cake in town. Highly recommended!', rating: 5 }
    ],
    sections: [
      { id: 'hero', title: 'Hero Banner', enabled: true, order: 0 },
      { id: 'offers', title: 'Offers Bar', enabled: true, order: 1 },
      { id: 'categories', title: 'Featured Categories', enabled: true, order: 2 },
      { id: 'featured', title: 'Featured Products', enabled: true, order: 3 },
      { id: 'about', title: 'Our Story', enabled: true, order: 4 },
      { id: 'testimonials', title: 'Testimonials', enabled: true, order: 5 },
      { id: 'contact', title: 'Contact Section', enabled: true, order: 6 }
    ]
  } as HomepageContent,
  businessHours: {
    mon_fri: '10:00 AM - 10:00 PM',
    sat_sun: '09:00 AM - 11:00 PM',
    delivery: '11:00 AM - 09:00 PM',
    opening: '10:00 AM',
    closing: '10:00 PM'
  } as BusinessHours
};

/**
 * Helper to wrap a promise with a timeout
 */
const withTimeout = <T>(promise: Promise<T>, timeoutMs: number): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('Firestore operation timed out')), timeoutMs)
    ),
  ]);
};

/**
 * Generic fetch for a specific document in a collection
 */
export const getCMSDoc = async <T>(collectionName: string, docId: string): Promise<T | null> => {
  try {
    const docRef = doc(db, collectionName, docId);
    // Use 5 second timeout for Firestore fetch
    const docSnap = await withTimeout(getDoc(docRef), 5000);

    if (docSnap.exists()) {
      return docSnap.data() as T;
    }

    // Return a deep copy of default if not found in Firestore
    const defaults = CMS_DEFAULTS[collectionName as keyof typeof CMS_DEFAULTS];
    if (defaults) {
      return JSON.parse(JSON.stringify(defaults)) as T;
    }

    return null;
  } catch (error) {
    console.error(`Error fetching CMS doc from ${collectionName}/${docId}:`, error);
    // Return a deep copy of default even on error to prevent UI crash
    const defaults = CMS_DEFAULTS[collectionName as keyof typeof CMS_DEFAULTS];
    if (defaults) {
      return JSON.parse(JSON.stringify(defaults)) as T;
    }
    return null;
  }
};

/**
 * Generic update/set for a specific document
 */
export const updateCMSDoc = async <T>(collectionName: string, docId: string, data: T) => {
  try {
    const docRef = doc(db, collectionName, docId);
    await setDoc(docRef, {
      ...data,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    return true;
  } catch (error) {
    console.error(`Error updating CMS doc ${collectionName}/${docId}:`, error);
    return false;
  }
};

/**
 * Specific helpers for the required collections
 */

export const getSiteSettings = () => getCMSDoc<SiteSettings>('siteSettings', SETTINGS_DOC);
export const updateSiteSettings = (data: Partial<SiteSettings>) => updateCMSDoc('siteSettings', SETTINGS_DOC, data);

export const getHomepageContent = () => getCMSDoc<HomepageContent>('homepageContent', HOMEPAGE_DOC);
export const updateHomepageContent = (data: Partial<HomepageContent>) => updateCMSDoc('homepageContent', HOMEPAGE_DOC, data);

export const getContactInfo = () => getCMSDoc<ContactInfo>('contactInfo', CONTACT_DOC);
export const updateContactInfo = (data: Partial<ContactInfo>) => updateCMSDoc('contactInfo', CONTACT_DOC, data);

export const getBusinessHours = () => getCMSDoc<BusinessHours>('businessHours', HOURS_DOC);
export const updateBusinessHours = (data: Partial<BusinessHours>) => updateCMSDoc('businessHours', HOURS_DOC, data);

/**
 * Banners can be multiple, so we fetch as a collection
 */
export interface Banner {
  id: string;
  text: string;
  enabled?: boolean;
  createdAt?: string;
}

export const getBanners = async (): Promise<Banner[]> => {
  try {
    const q = query(collection(db, 'banners'), orderBy('createdAt', 'desc'));
    const snapshot = await withTimeout(getDocs(q), 5000);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Banner));
  } catch (error) {
    console.error("Error fetching banners:", error);
    return [];
  }
};

export const updateBanner = async (id: string, data: Partial<Banner>) => {
  try {
    const docRef = doc(db, 'banners', id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: new Date().toISOString()
    });
    return true;
  } catch (error) {
    console.error("Error updating banner:", error);
    return false;
  }
};
