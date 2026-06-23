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
 * Generic fetch for a specific document in a collection
 */
export const getCMSDoc = async <T>(collectionName: string, docId: string): Promise<T | null> => {
  try {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as T;
    }
    return null;
  } catch (error) {
    console.error(`Error fetching CMS doc from ${collectionName}/${docId}:`, error);
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
    const snapshot = await getDocs(q);
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
