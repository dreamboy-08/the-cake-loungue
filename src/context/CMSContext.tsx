"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { db } from '@/utils/firebase';
import { collection, onSnapshot, query, orderBy, doc, setDoc } from 'firebase/firestore';
import {
  NavigationItem,
  MegaMenuSection,
  HomepageSection,
  Announcement,
  CollectionCMSItem,
  CMSWebsiteSettings,
  CMSMediaItem,
  CMSSEOMetadata,
  CMSGeneralSettings,
  AboutSectionSettings,
  CMSCategory,
  FeaturedProductsSettings,
  CMSTestimonial
} from '@/types/cms';
import {
  DEFAULT_NAVIGATION,
  DEFAULT_MEGA_MENUS,
  DEFAULT_HOMEPAGE_SECTIONS,
  DEFAULT_ANNOUNCEMENTS,
  DEFAULT_COLLECTIONS,
  DEFAULT_WEBSITE_SETTINGS,
  DEFAULT_MEDIA_LIBRARY,
  DEFAULT_SEO_METADATA,
  DEFAULT_GENERAL_SETTINGS,
  DEFAULT_ABOUT_SETTINGS,
  DEFAULT_CATEGORIES,
  DEFAULT_FEATURED_PRODUCTS_SETTINGS,
  DEFAULT_TESTIMONIALS
} from '@/constants/cmsDefaults';

interface CMSContextType {
  navigation: NavigationItem[];
  megaMenus: MegaMenuSection[];
  homepageSections: HomepageSection[];
  announcements: Announcement[];
  collections: CollectionCMSItem[];
  categories: CMSCategory[];
  websiteSettings: CMSWebsiteSettings;
  mediaItems: CMSMediaItem[];
  seoMetadata: CMSSEOMetadata[];
  generalSettings: CMSGeneralSettings;
  aboutSettings: AboutSectionSettings;
  featuredProducts: FeaturedProductsSettings;
  testimonials: CMSTestimonial[];
  loading: boolean;

  // Setters
  updateNavigation: (items: NavigationItem[], trackHistory?: boolean) => Promise<void>;
  updateMegaMenus: (sections: MegaMenuSection[], trackHistory?: boolean) => Promise<void>;
  updateHomepageSections: (sections: HomepageSection[], trackHistory?: boolean) => Promise<void>;
  updateAnnouncements: (items: Announcement[], trackHistory?: boolean) => Promise<void>;
  updateCollections: (items: CollectionCMSItem[], trackHistory?: boolean) => Promise<void>;
  updateCategories: (items: CMSCategory[], trackHistory?: boolean) => Promise<void>;
  updateWebsiteSettings: (settings: CMSWebsiteSettings, trackHistory?: boolean) => Promise<void>;
  updateMediaItems: (items: CMSMediaItem[], trackHistory?: boolean) => Promise<void>;
  updateSEOMetadata: (metadata: CMSSEOMetadata[], trackHistory?: boolean) => Promise<void>;
  updateGeneralSettings: (settings: CMSGeneralSettings, trackHistory?: boolean) => Promise<void>;
  updateAboutSettings: (settings: AboutSectionSettings, trackHistory?: boolean) => Promise<void>;
  updateFeaturedProducts: (settings: FeaturedProductsSettings, trackHistory?: boolean) => Promise<void>;
  updateTestimonials: (items: CMSTestimonial[], trackHistory?: boolean) => Promise<void>;
  deleteTestimonialFromDB: (id: string) => Promise<void>;

  // CMS Safety / Recovery System
  hasUndo: (key: string) => boolean;
  undo: (key: string) => Promise<void>;
  restoreDefaults: (key: string) => Promise<void>;
}

const CMSContext = createContext<CMSContextType | undefined>(undefined);

export const CMSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [navigation, setNavigation] = useState<NavigationItem[]>([]);
  const [megaMenus, setMegaMenus] = useState<MegaMenuSection[]>([]);
  const [homepageSections, setHomepageSections] = useState<HomepageSection[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [collections, setCollections] = useState<CollectionCMSItem[]>([]);
  const [categories, setCategories] = useState<CMSCategory[]>([]);
  const [websiteSettings, setWebsiteSettings] = useState<CMSWebsiteSettings>(DEFAULT_WEBSITE_SETTINGS);
  const [mediaItems, setMediaItems] = useState<CMSMediaItem[]>([]);
  const [seoMetadata, setSeoMetadata] = useState<CMSSEOMetadata[]>([]);
  const [generalSettings, setGeneralSettings] = useState<CMSGeneralSettings>(DEFAULT_GENERAL_SETTINGS);
  const [aboutSettings, setAboutSettings] = useState<AboutSectionSettings>(DEFAULT_ABOUT_SETTINGS);
  const [featuredProducts, setFeaturedProducts] = useState<FeaturedProductsSettings>(DEFAULT_FEATURED_PRODUCTS_SETTINGS);
  const [testimonials, setTestimonials] = useState<CMSTestimonial[]>([]);
  const [loading, setLoading] = useState(true);

  // Undo / Safety System State
  const [previousStates, setPreviousStates] = useState<Record<string, any>>({});

  const isFirebaseConfigured =
    typeof process !== 'undefined' &&
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY !== "your_api_key";

  // --- LOCAL OFFLINE FALLBACK LOADER ---
  const loadOfflineCMS = useCallback(() => {
    if (typeof window === 'undefined') {
      setNavigation(DEFAULT_NAVIGATION);
      setMegaMenus(DEFAULT_MEGA_MENUS);
      setHomepageSections(DEFAULT_HOMEPAGE_SECTIONS);
      setAnnouncements(DEFAULT_ANNOUNCEMENTS);
      setCollections(DEFAULT_COLLECTIONS);
      setCategories(DEFAULT_CATEGORIES);
      setWebsiteSettings(DEFAULT_WEBSITE_SETTINGS);
      setMediaItems(DEFAULT_MEDIA_LIBRARY);
      setSeoMetadata(DEFAULT_SEO_METADATA);
      setGeneralSettings(DEFAULT_GENERAL_SETTINGS);
      setAboutSettings(DEFAULT_ABOUT_SETTINGS);
      setFeaturedProducts(DEFAULT_FEATURED_PRODUCTS_SETTINGS);
      setTestimonials(DEFAULT_TESTIMONIALS);
      setLoading(false);
      return;
    }

    try {
      const getStored = <T,>(key: string, fallback: T): T => {
        const stored = localStorage.getItem(`cakeLounge_cms_${key}`);
        return stored ? JSON.parse(stored) : fallback;
      };

      setNavigation(getStored('navigation', DEFAULT_NAVIGATION));
      setMegaMenus(getStored('megaMenus', DEFAULT_MEGA_MENUS));
      setHomepageSections(getStored('homepageSections', DEFAULT_HOMEPAGE_SECTIONS));
      setAnnouncements(getStored('announcements', DEFAULT_ANNOUNCEMENTS));
      setCollections(getStored('collections', DEFAULT_COLLECTIONS));
      setCategories(getStored('categories', DEFAULT_CATEGORIES));
      setWebsiteSettings(getStored('websiteSettings', DEFAULT_WEBSITE_SETTINGS));
      setMediaItems(getStored('mediaItems', DEFAULT_MEDIA_LIBRARY));
      setSeoMetadata(getStored('seoMetadata', DEFAULT_SEO_METADATA));
      setGeneralSettings(getStored('generalSettings', DEFAULT_GENERAL_SETTINGS));
      setAboutSettings(getStored('aboutSettings', DEFAULT_ABOUT_SETTINGS));
      setFeaturedProducts(getStored('featuredProducts', DEFAULT_FEATURED_PRODUCTS_SETTINGS));
      setTestimonials(getStored('testimonials', DEFAULT_TESTIMONIALS));
    } catch (e) {
      console.error("Failed to parse stored offline CMS config, falling back to static defaults:", e);
      setNavigation(DEFAULT_NAVIGATION);
      setMegaMenus(DEFAULT_MEGA_MENUS);
      setHomepageSections(DEFAULT_HOMEPAGE_SECTIONS);
      setAnnouncements(DEFAULT_ANNOUNCEMENTS);
      setCollections(DEFAULT_COLLECTIONS);
      setCategories(DEFAULT_CATEGORIES);
      setWebsiteSettings(DEFAULT_WEBSITE_SETTINGS);
      setMediaItems(DEFAULT_MEDIA_LIBRARY);
      setSeoMetadata(DEFAULT_SEO_METADATA);
      setGeneralSettings(DEFAULT_GENERAL_SETTINGS);
      setAboutSettings(DEFAULT_ABOUT_SETTINGS);
      setFeaturedProducts(DEFAULT_FEATURED_PRODUCTS_SETTINGS);
      setTestimonials(DEFAULT_TESTIMONIALS);
    } finally {
      setLoading(false);
    }
  }, []);

  // --- SAVE STATE OFFLINE HELPER ---
  const saveOfflineCMS = useCallback((key: string, data: any) => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(`cakeLounge_cms_${key}`, JSON.stringify(data));
      window.dispatchEvent(new Event('cms_updated'));
    } catch (e) {
      console.error(`Failed to persist offline CMS state for ${key}`, e);
    }
  }, []);

  // --- SAVE PREVIOUS STATE HELPER ---
  const savePreviousState = useCallback((key: string, currentState: any) => {
    if (currentState === undefined || currentState === null) return;
    setPreviousStates(prev => ({
      ...prev,
      [key]: JSON.parse(JSON.stringify(currentState))
    }));
  }, []);

  // --- SETTER FUNCTIONS (Saves to Firestore or falls back offline) ---
  const updateNavigation = async (items: NavigationItem[], trackHistory = true) => {
    if (trackHistory) {
      savePreviousState('navigation', navigation);
    }
    setNavigation(items);
    if (!isFirebaseConfigured) {
      saveOfflineCMS('navigation', items);
      return;
    }
    try {
      // Save collection doc by doc
      await Promise.all(items.map(item =>
        setDoc(doc(db, 'navigation', item.id), item)
      ));
    } catch (err) {
      console.error("Failed to update navigation in Firestore:", err);
      saveOfflineCMS('navigation', items);
    }
  };

  const updateMegaMenus = async (sections: MegaMenuSection[], trackHistory = true) => {
    if (trackHistory) {
      savePreviousState('megaMenus', megaMenus);
    }
    setMegaMenus(sections);
    if (!isFirebaseConfigured) {
      saveOfflineCMS('megaMenus', sections);
      return;
    }
    try {
      await Promise.all(sections.map(section =>
        setDoc(doc(db, 'megaMenus', section.id), section)
      ));
    } catch (err) {
      console.error("Failed to update megaMenus in Firestore:", err);
      saveOfflineCMS('megaMenus', sections);
    }
  };

  const updateHomepageSections = async (sections: HomepageSection[], trackHistory = true) => {
    if (trackHistory) {
      savePreviousState('homepageSections', homepageSections);
    }
    setHomepageSections(sections);
    if (!isFirebaseConfigured) {
      saveOfflineCMS('homepageSections', sections);
      return;
    }
    try {
      await Promise.all(sections.map(section =>
        setDoc(doc(db, 'homepageSections', section.id), section)
      ));
    } catch (err) {
      console.error("Failed to update homepageSections in Firestore:", err);
      saveOfflineCMS('homepageSections', sections);
    }
  };

  const updateAnnouncements = async (items: Announcement[], trackHistory = true) => {
    if (trackHistory) {
      savePreviousState('announcements', announcements);
    }
    setAnnouncements(items);
    if (!isFirebaseConfigured) {
      saveOfflineCMS('announcements', items);
      return;
    }
    try {
      await Promise.all(items.map(item =>
        setDoc(doc(db, 'announcements', item.id), item)
      ));
    } catch (err) {
      console.error("Failed to update announcements in Firestore:", err);
      saveOfflineCMS('announcements', items);
    }
  };

  const updateCollections = async (items: CollectionCMSItem[], trackHistory = true) => {
    if (trackHistory) {
      savePreviousState('collections', collections);
    }
    setCollections(items);
    if (!isFirebaseConfigured) {
      saveOfflineCMS('collections', items);
      return;
    }
    try {
      await Promise.all(items.map(item =>
        setDoc(doc(db, 'collections', item.id), item)
      ));
    } catch (err) {
      console.error("Failed to update collections in Firestore:", err);
      saveOfflineCMS('collections', items);
    }
  };

  const updateCategories = async (items: CMSCategory[], trackHistory = true) => {
    if (trackHistory) {
      savePreviousState('categories', categories);
    }
    setCategories(items);
    if (!isFirebaseConfigured) {
      saveOfflineCMS('categories', items);
      return;
    }
    try {
      await Promise.all(items.map(item =>
        setDoc(doc(db, 'categories', item.id), item)
      ));
    } catch (err) {
      console.error("Failed to update categories in Firestore:", err);
      saveOfflineCMS('categories', items);
    }
  };

  const updateWebsiteSettings = async (settings: CMSWebsiteSettings, trackHistory = true) => {
    if (trackHistory) {
      savePreviousState('websiteSettings', websiteSettings);
    }
    setWebsiteSettings(settings);
    if (!isFirebaseConfigured) {
      saveOfflineCMS('websiteSettings', settings);
      return;
    }
    try {
      await setDoc(doc(db, 'settings', 'global_settings'), settings);
    } catch (err) {
      console.error("Failed to update websiteSettings in Firestore:", err);
      saveOfflineCMS('websiteSettings', settings);
    }
  };

  const updateMediaItems = async (items: CMSMediaItem[], trackHistory = true) => {
    if (trackHistory) {
      savePreviousState('mediaItems', mediaItems);
    }
    setMediaItems(items);
    if (!isFirebaseConfigured) {
      saveOfflineCMS('mediaItems', items);
      return;
    }
    try {
      await Promise.all(items.map(item =>
        setDoc(doc(db, 'media', item.id), item)
      ));
    } catch (err) {
      console.error("Failed to update media items in Firestore:", err);
      saveOfflineCMS('mediaItems', items);
    }
  };

  const updateSEOMetadata = async (metadata: CMSSEOMetadata[], trackHistory = true) => {
    if (trackHistory) {
      savePreviousState('seoMetadata', seoMetadata);
    }
    setSeoMetadata(metadata);
    if (!isFirebaseConfigured) {
      saveOfflineCMS('seoMetadata', metadata);
      return;
    }
    try {
      await Promise.all(metadata.map(item =>
        setDoc(doc(db, 'seo', item.id), item)
      ));
    } catch (err) {
      console.error("Failed to update SEO metadata in Firestore:", err);
      saveOfflineCMS('seoMetadata', metadata);
    }
  };

  const updateGeneralSettings = async (settings: CMSGeneralSettings, trackHistory = true) => {
    if (trackHistory) {
      savePreviousState('generalSettings', generalSettings);
    }
    setGeneralSettings(settings);
    if (!isFirebaseConfigured) {
      saveOfflineCMS('generalSettings', settings);
      return;
    }
    try {
      await setDoc(doc(db, 'settings', 'general_cms_config'), settings);
    } catch (err) {
      console.error("Failed to update generalSettings in Firestore:", err);
      saveOfflineCMS('generalSettings', settings);
    }
  };

  const updateAboutSettings = async (settings: AboutSectionSettings, trackHistory = true) => {
    if (trackHistory) {
      savePreviousState('aboutSettings', aboutSettings);
    }
    setAboutSettings(settings);
    if (!isFirebaseConfigured) {
      saveOfflineCMS('aboutSettings', settings);
      return;
    }
    try {
      await setDoc(doc(db, 'settings', 'about_settings'), settings);
    } catch (err) {
      console.error("Failed to update aboutSettings in Firestore:", err);
      saveOfflineCMS('aboutSettings', settings);
    }
  };

  const updateFeaturedProducts = async (settings: FeaturedProductsSettings, trackHistory = true) => {
    if (trackHistory) {
      savePreviousState('featuredProducts', featuredProducts);
    }
    setFeaturedProducts(settings);
    if (!isFirebaseConfigured) {
      saveOfflineCMS('featuredProducts', settings);
      return;
    }
    try {
      await setDoc(doc(db, 'settings', 'featured_products'), settings);
    } catch (err) {
      console.error("Failed to update featuredProducts settings in Firestore:", err);
      saveOfflineCMS('featuredProducts', settings);
    }
  };

  const updateTestimonials = async (items: CMSTestimonial[], trackHistory = true) => {
    if (trackHistory) {
      savePreviousState('testimonials', testimonials);
    }
    setTestimonials(items);
    if (!isFirebaseConfigured) {
      saveOfflineCMS('testimonials', items);
      return;
    }
    try {
      await Promise.all(items.map(item =>
        setDoc(doc(db, 'testimonials', item.id), item)
      ));
    } catch (err) {
      console.error("Failed to update testimonials in Firestore:", err);
      saveOfflineCMS('testimonials', items);
    }
  };

  const deleteTestimonialFromDB = async (id: string) => {
    if (!isFirebaseConfigured) {
      return;
    }
    try {
      const { deleteDoc } = await import('firebase/firestore');
      await deleteDoc(doc(db, 'testimonials', id));
    } catch (err) {
      console.error("Failed to delete testimonial from Firestore:", err);
    }
  };

  // --- CMS Safety / Recovery Actions ---
  const hasUndo = useCallback((key: string) => {
    // Standardize key mappings
    const normalizedKey = key === 'hero' ? 'homepageSections' : key;
    return !!previousStates[normalizedKey];
  }, [previousStates]);

  const undo = useCallback(async (key: string) => {
    const normalizedKey = key === 'hero' ? 'homepageSections' : key;
    const prevState = previousStates[normalizedKey];
    if (!prevState) return;

    switch (normalizedKey) {
      case 'navigation':
        await updateNavigation(prevState, false);
        break;
      case 'megaMenus':
        await updateMegaMenus(prevState, false);
        break;
      case 'homepageSections':
        await updateHomepageSections(prevState, false);
        break;
      case 'announcements':
        await updateAnnouncements(prevState, false);
        break;
      case 'collections':
        await updateCollections(prevState, false);
        break;
      case 'categories':
        await updateCategories(prevState, false);
        break;
      case 'websiteSettings':
        await updateWebsiteSettings(prevState, false);
        break;
      case 'mediaItems':
        await updateMediaItems(prevState, false);
        break;
      case 'seoMetadata':
        await updateSEOMetadata(prevState, false);
        break;
      case 'generalSettings':
        await updateGeneralSettings(prevState, false);
        break;
      case 'aboutSettings':
        await updateAboutSettings(prevState, false);
        break;
      case 'featuredProducts':
        await updateFeaturedProducts(prevState, false);
        break;
      case 'testimonials':
        await updateTestimonials(prevState, false);
        break;
    }

    setPreviousStates(prev => {
      const next = { ...prev };
      delete next[normalizedKey];
      return next;
    });
  }, [
    previousStates,
    updateNavigation,
    updateMegaMenus,
    updateHomepageSections,
    updateAnnouncements,
    updateCollections,
    updateCategories,
    updateWebsiteSettings,
    updateMediaItems,
    updateSEOMetadata,
    updateGeneralSettings,
    updateAboutSettings,
    updateFeaturedProducts,
    updateTestimonials
  ]);

  const restoreDefaults = useCallback(async (key: string) => {
    const normalizedKey = key === 'hero' ? 'homepageSections' : key;
    switch (normalizedKey) {
      case 'navigation':
        await updateNavigation(DEFAULT_NAVIGATION);
        break;
      case 'megaMenus':
        await updateMegaMenus(DEFAULT_MEGA_MENUS);
        break;
      case 'homepageSections':
        await updateHomepageSections(DEFAULT_HOMEPAGE_SECTIONS);
        break;
      case 'announcements':
        await updateAnnouncements(DEFAULT_ANNOUNCEMENTS);
        break;
      case 'collections':
        await updateCollections(DEFAULT_COLLECTIONS);
        break;
      case 'categories':
        await updateCategories(DEFAULT_CATEGORIES);
        break;
      case 'websiteSettings':
        await updateWebsiteSettings(DEFAULT_WEBSITE_SETTINGS);
        break;
      case 'mediaItems':
        await updateMediaItems(DEFAULT_MEDIA_LIBRARY);
        break;
      case 'seoMetadata':
        await updateSEOMetadata(DEFAULT_SEO_METADATA);
        break;
      case 'generalSettings':
        await updateGeneralSettings(DEFAULT_GENERAL_SETTINGS);
        break;
      case 'aboutSettings':
        await updateAboutSettings(DEFAULT_ABOUT_SETTINGS);
        break;
      case 'featuredProducts':
        await updateFeaturedProducts(DEFAULT_FEATURED_PRODUCTS_SETTINGS);
        break;
      case 'testimonials':
        await updateTestimonials(DEFAULT_TESTIMONIALS);
        break;
    }
  }, [
    updateNavigation,
    updateMegaMenus,
    updateHomepageSections,
    updateAnnouncements,
    updateCollections,
    updateCategories,
    updateWebsiteSettings,
    updateMediaItems,
    updateSEOMetadata,
    updateGeneralSettings,
    updateAboutSettings,
    updateFeaturedProducts,
    updateTestimonials
  ]);

  // --- INITIAL LOAD & REAL-TIME LISTENERS ---
  useEffect(() => {
    if (!isFirebaseConfigured) {
      loadOfflineCMS();

      const handleCmsUpdate = () => {
        loadOfflineCMS();
      };
      window.addEventListener('cms_updated', handleCmsUpdate);
      return () => {
        window.removeEventListener('cms_updated', handleCmsUpdate);
      };
    }

    console.log("Subscribing to real-time Firestore CMS configurations...");

    const unsubs: (() => void)[] = [];

    // Helper to query and order
    const registerListener = <T,>(
      collectionName: string,
      orderField: string | null,
      setter: React.Dispatch<React.SetStateAction<T[]>>,
      fallback: T[]
    ) => {
      const q = orderField
        ? query(collection(db, collectionName), orderBy(orderField, 'asc'))
        : collection(db, collectionName);

      const unsub = onSnapshot(
        q,
        (snapshot) => {
          if (!snapshot.empty) {
            const items = snapshot.docs.map(doc => ({
              ...doc.data(),
              id: doc.id
            })) as unknown as T[];
            setter(items);
          } else {
            setter(fallback);
          }
        },
        (error) => {
          console.error(`Real-time fetch failed for ${collectionName}, using fallback:`, error);
          setter(fallback);
        }
      );
      unsubs.push(unsub);
    };

    // Listen to arrays
    registerListener('navigation', 'displayOrder', setNavigation, DEFAULT_NAVIGATION);
    registerListener('megaMenus', 'displayOrder', setMegaMenus, DEFAULT_MEGA_MENUS);
    registerListener('homepageSections', 'order', setHomepageSections, DEFAULT_HOMEPAGE_SECTIONS);
    registerListener('announcements', 'displayOrder', setAnnouncements, DEFAULT_ANNOUNCEMENTS);
    registerListener('collections', 'displayOrder', setCollections, DEFAULT_COLLECTIONS);
    registerListener('categories', 'displayOrder', setCategories, DEFAULT_CATEGORIES);
    registerListener('media', 'createdAt', setMediaItems, DEFAULT_MEDIA_LIBRARY);
    registerListener('testimonials', 'displayOrder', setTestimonials, DEFAULT_TESTIMONIALS);
    registerListener('seo', null, setSeoMetadata, DEFAULT_SEO_METADATA);

    // Listen to individual config documents in 'settings' collection
    const unsubGlobal = onSnapshot(doc(db, 'settings', 'global_settings'), (snap) => {
      if (snap.exists()) {
        setWebsiteSettings(snap.data() as CMSWebsiteSettings);
      } else {
        setWebsiteSettings(DEFAULT_WEBSITE_SETTINGS);
      }
    }, (error) => {
      console.error("Failed to read global website settings, using default:", error);
      setWebsiteSettings(DEFAULT_WEBSITE_SETTINGS);
    });
    unsubs.push(unsubGlobal);

    const unsubGeneral = onSnapshot(doc(db, 'settings', 'general_cms_config'), (snap) => {
      if (snap.exists()) {
        setGeneralSettings(snap.data() as CMSGeneralSettings);
      } else {
        setGeneralSettings(DEFAULT_GENERAL_SETTINGS);
      }
    }, (error) => {
      console.error("Failed to read general settings, using default:", error);
      setGeneralSettings(DEFAULT_GENERAL_SETTINGS);
    });
    unsubs.push(unsubGeneral);

    const unsubAbout = onSnapshot(doc(db, 'settings', 'about_settings'), (snap) => {
      if (snap.exists()) {
        setAboutSettings(snap.data() as AboutSectionSettings);
      } else {
        setAboutSettings(DEFAULT_ABOUT_SETTINGS);
      }
    }, (error) => {
      console.error("Failed to read about settings, using default:", error);
      setAboutSettings(DEFAULT_ABOUT_SETTINGS);
    });
    unsubs.push(unsubAbout);

    const unsubFeatured = onSnapshot(doc(db, 'settings', 'featured_products'), (snap) => {
      if (snap.exists()) {
        setFeaturedProducts(snap.data() as FeaturedProductsSettings);
      } else {
        setFeaturedProducts(DEFAULT_FEATURED_PRODUCTS_SETTINGS);
      }
    }, (error) => {
      console.error("Failed to read featured products settings, using default:", error);
      setFeaturedProducts(DEFAULT_FEATURED_PRODUCTS_SETTINGS);
    });
    unsubs.push(unsubFeatured);

    setLoading(false);

    return () => {
      unsubs.forEach(unsub => unsub());
    };
  }, [isFirebaseConfigured, loadOfflineCMS]);

  return (
    <CMSContext.Provider value={{
      navigation,
      megaMenus,
      homepageSections,
      announcements,
      collections,
      categories,
      websiteSettings,
      mediaItems,
      seoMetadata,
      generalSettings,
      aboutSettings,
      featuredProducts,
      testimonials,
      loading,

      updateNavigation,
      updateMegaMenus,
      updateHomepageSections,
      updateAnnouncements,
      updateCollections,
      updateCategories,
      updateWebsiteSettings,
      updateMediaItems,
      updateSEOMetadata,
      updateGeneralSettings,
      updateAboutSettings,
      updateFeaturedProducts,
      updateTestimonials,
      deleteTestimonialFromDB,

      hasUndo,
      undo,
      restoreDefaults
    }}>
      {children}
    </CMSContext.Provider>
  );
};

export const useCMS = () => {
  const context = useContext(CMSContext);
  if (context === undefined) {
    throw new Error('useCMS must be used within a CMSProvider');
  }
  return context;
};
