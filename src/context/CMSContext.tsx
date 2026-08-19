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
  CMSTestimonial,
  CMSGalleryItem,
  CMSDecorationItem
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
  DEFAULT_TESTIMONIALS,
  DEFAULT_GALLERY,
  DEFAULT_DECORATIONS
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
  galleryItems: CMSGalleryItem[];
  decorations: CMSDecorationItem[];
  loading: boolean;

  // Setters
  updateNavigation: (items: NavigationItem[], saveHistory?: boolean) => Promise<void>;
  updateMegaMenus: (sections: MegaMenuSection[], saveHistory?: boolean) => Promise<void>;
  updateHomepageSections: (sections: HomepageSection[], saveHistory?: boolean) => Promise<void>;
  updateAnnouncements: (items: Announcement[], saveHistory?: boolean) => Promise<void>;
  updateCollections: (items: CollectionCMSItem[], saveHistory?: boolean) => Promise<void>;
  updateCategories: (items: CMSCategory[], saveHistory?: boolean) => Promise<void>;
  updateWebsiteSettings: (settings: CMSWebsiteSettings, saveHistory?: boolean) => Promise<void>;
  updateMediaItems: (items: CMSMediaItem[], saveHistory?: boolean) => Promise<void>;
  updateSEOMetadata: (metadata: CMSSEOMetadata[], saveHistory?: boolean) => Promise<void>;
  updateGeneralSettings: (settings: CMSGeneralSettings, saveHistory?: boolean) => Promise<void>;
  updateAboutSettings: (settings: AboutSectionSettings, saveHistory?: boolean) => Promise<void>;
  updateFeaturedProducts: (settings: FeaturedProductsSettings, saveHistory?: boolean) => Promise<void>;
  updateTestimonials: (items: CMSTestimonial[], saveHistory?: boolean) => Promise<void>;
  deleteTestimonialFromDB: (id: string) => Promise<void>;
  updateGalleryItems: (items: CMSGalleryItem[], saveHistory?: boolean) => Promise<void>;
  deleteGalleryItemFromDB: (id: string) => Promise<void>;
  updateDecorations: (items: CMSDecorationItem[], saveHistory?: boolean) => Promise<void>;
  deleteDecorationFromDB: (id: string) => Promise<void>;

  // CMS Safety / Recovery Actions
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
  const [galleryItems, setGalleryItems] = useState<CMSGalleryItem[]>([]);
  const [decorations, setDecorations] = useState<CMSDecorationItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Deep state snapshot history tracking via previousStates mapping
  const [previousStates, setPreviousStates] = useState<Record<string, any>>({});

  const isFirebaseConfigured =
    typeof process !== 'undefined' &&
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY !== "your_api_key";

  // --- LOAD CACHED CMS AS FAST FALLBACK ---
  // If fallbackToDefaults is true (e.g. offline/non-Firebase mode or when cache is expected as absolute fallback),
  // we fall back to DEFAULT_* constants. If false (e.g. online Firestore mode), we only load from localStorage if present
  // so fresh users do NOT get populated with old static defaults while waiting for Firestore.
  const loadCachedCMS = useCallback((fallbackToDefaults = false) => {
    if (typeof window === 'undefined') {
      if (fallbackToDefaults) {
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
        setGalleryItems(DEFAULT_GALLERY);
        setDecorations(DEFAULT_DECORATIONS);
      }
      return;
    }

    try {
      const getStored = <T,>(key: string, fallback: T | null): T | null => {
        const stored = localStorage.getItem(`cakeLounge_cms_${key}`);
        return stored ? JSON.parse(stored) : fallback;
      };

      const storedNav = getStored<NavigationItem[]>('navigation', fallbackToDefaults ? DEFAULT_NAVIGATION : null);
      if (storedNav !== null) setNavigation(storedNav);

      const storedMega = getStored<MegaMenuSection[]>('megaMenus', fallbackToDefaults ? DEFAULT_MEGA_MENUS : null);
      if (storedMega !== null) setMegaMenus(storedMega);

      const storedSections = getStored<HomepageSection[]>('homepageSections', fallbackToDefaults ? DEFAULT_HOMEPAGE_SECTIONS : null);
      if (storedSections !== null) setHomepageSections(storedSections);

      const storedAnnouncements = getStored<Announcement[]>('announcements', fallbackToDefaults ? DEFAULT_ANNOUNCEMENTS : null);
      if (storedAnnouncements !== null) setAnnouncements(storedAnnouncements);

      const storedCollections = getStored<CollectionCMSItem[]>('collections', fallbackToDefaults ? DEFAULT_COLLECTIONS : null);
      if (storedCollections !== null) setCollections(storedCollections);

      const storedCategories = getStored<CMSCategory[]>('categories', fallbackToDefaults ? DEFAULT_CATEGORIES : null);
      if (storedCategories !== null) setCategories(storedCategories);

      const storedWebsite = getStored<CMSWebsiteSettings>('websiteSettings', fallbackToDefaults ? DEFAULT_WEBSITE_SETTINGS : null);
      if (storedWebsite !== null) setWebsiteSettings(storedWebsite);

      const storedMedia = getStored<CMSMediaItem[]>('mediaItems', fallbackToDefaults ? DEFAULT_MEDIA_LIBRARY : null);
      if (storedMedia !== null) setMediaItems(storedMedia);

      const storedSEO = getStored<CMSSEOMetadata[]>('seoMetadata', fallbackToDefaults ? DEFAULT_SEO_METADATA : null);
      if (storedSEO !== null) setSeoMetadata(storedSEO);

      const storedGeneral = getStored<CMSGeneralSettings>('generalSettings', fallbackToDefaults ? DEFAULT_GENERAL_SETTINGS : null);
      if (storedGeneral !== null) setGeneralSettings(storedGeneral);

      const storedAbout = getStored<AboutSectionSettings>('aboutSettings', fallbackToDefaults ? DEFAULT_ABOUT_SETTINGS : null);
      if (storedAbout !== null) setAboutSettings(storedAbout);

      const storedFeatured = getStored<FeaturedProductsSettings>('featuredProducts', fallbackToDefaults ? DEFAULT_FEATURED_PRODUCTS_SETTINGS : null);
      if (storedFeatured !== null) setFeaturedProducts(storedFeatured);

      const storedTestimonials = getStored<CMSTestimonial[]>('testimonials', fallbackToDefaults ? DEFAULT_TESTIMONIALS : null);
      if (storedTestimonials !== null) setTestimonials(storedTestimonials);

      const storedGallery = getStored<CMSGalleryItem[]>('galleryItems', fallbackToDefaults ? DEFAULT_GALLERY : null);
      if (storedGallery !== null) setGalleryItems(storedGallery);

      const storedDecorations = getStored<CMSDecorationItem[]>('decorations', fallbackToDefaults ? DEFAULT_DECORATIONS : null);
      if (storedDecorations !== null) setDecorations(storedDecorations);

    } catch (e) {
      console.error("Failed to parse stored offline CMS config:", e);
      if (fallbackToDefaults) {
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
        setGalleryItems(DEFAULT_GALLERY);
        setDecorations(DEFAULT_DECORATIONS);
      }
    }
  }, []);

  // --- LOCAL OFFLINE FALLBACK LOADER ---
  const loadOfflineCMS = useCallback(() => {
    loadCachedCMS(true);
    setLoading(false);
  }, [loadCachedCMS]);

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

  // Helper to save history before modifications
  const saveStateHistory = (key: string, currentState: any) => {
    setPreviousStates(prev => ({
      ...prev,
      [key]: JSON.parse(JSON.stringify(currentState))
    }));
  };

  // --- SETTER FUNCTIONS (Saves to Firestore or falls back offline) ---
  const updateNavigation = async (items: NavigationItem[], saveHistory = true) => {
    if (saveHistory) saveStateHistory('navigation', navigation);
    setNavigation(items);
    if (!isFirebaseConfigured) {
      saveOfflineCMS('navigation', items);
      return;
    }
    try {
      await Promise.all(items.map(item =>
        setDoc(doc(db, 'navigation', item.id), item)
      ));
    } catch (err) {
      console.error("Failed to update navigation in Firestore:", err);
      saveOfflineCMS('navigation', items);
    }
  };

  const updateMegaMenus = async (sections: MegaMenuSection[], saveHistory = true) => {
    if (saveHistory) saveStateHistory('megaMenus', megaMenus);
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

  const updateHomepageSections = async (sections: HomepageSection[], saveHistory = true) => {
    if (saveHistory) saveStateHistory('homepageSections', homepageSections);
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

  const updateAnnouncements = async (items: Announcement[], saveHistory = true) => {
    if (saveHistory) saveStateHistory('announcements', announcements);
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

  const updateCollections = async (items: CollectionCMSItem[], saveHistory = true) => {
    if (saveHistory) saveStateHistory('collections', collections);
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

  const updateCategories = async (items: CMSCategory[], saveHistory = true) => {
    if (saveHistory) saveStateHistory('categories', categories);
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

  const updateWebsiteSettings = async (settings: CMSWebsiteSettings, saveHistory = true) => {
    if (saveHistory) saveStateHistory('websiteSettings', websiteSettings);
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

  const updateMediaItems = async (items: CMSMediaItem[], saveHistory = true) => {
    if (saveHistory) saveStateHistory('mediaItems', mediaItems);
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

  const updateSEOMetadata = async (metadata: CMSSEOMetadata[], saveHistory = true) => {
    if (saveHistory) saveStateHistory('seoMetadata', seoMetadata);
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

  const updateGeneralSettings = async (settings: CMSGeneralSettings, saveHistory = true) => {
    if (saveHistory) saveStateHistory('generalSettings', generalSettings);
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

  const updateAboutSettings = async (settings: AboutSectionSettings, saveHistory = true) => {
    if (saveHistory) saveStateHistory('aboutSettings', aboutSettings);
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

  const updateFeaturedProducts = async (settings: FeaturedProductsSettings, saveHistory = true) => {
    if (saveHistory) saveStateHistory('featuredProducts', featuredProducts);
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

  const updateTestimonials = async (items: CMSTestimonial[], saveHistory = true) => {
    if (saveHistory) saveStateHistory('testimonials', testimonials);
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

  const updateGalleryItems = async (items: CMSGalleryItem[], saveHistory = true) => {
    if (saveHistory) saveStateHistory('galleryItems', galleryItems);
    setGalleryItems(items);
    if (!isFirebaseConfigured) {
      saveOfflineCMS('galleryItems', items);
      return;
    }
    try {
      await Promise.all(items.map(item =>
        setDoc(doc(db, 'gallery', item.id), item)
      ));
    } catch (err) {
      console.error("Failed to update gallery items in Firestore:", err);
      saveOfflineCMS('galleryItems', items);
    }
  };

  const deleteGalleryItemFromDB = async (id: string) => {
    if (!isFirebaseConfigured) {
      return;
    }
    try {
      const { deleteDoc } = await import('firebase/firestore');
      await deleteDoc(doc(db, 'gallery', id));
    } catch (err) {
      console.error("Failed to delete gallery item from Firestore:", err);
    }
  };

  const updateDecorations = async (items: CMSDecorationItem[], saveHistory = true) => {
    if (saveHistory) saveStateHistory('decorations', decorations);
    setDecorations(items);
    if (!isFirebaseConfigured) {
      saveOfflineCMS('decorations', items);
      return;
    }
    try {
      await Promise.all(items.map(item =>
        setDoc(doc(db, 'decorations', item.id), item)
      ));
    } catch (err) {
      console.error("Failed to update decorations in Firestore:", err);
      saveOfflineCMS('decorations', items);
    }
  };

  const deleteDecorationFromDB = async (id: string) => {
    if (!isFirebaseConfigured) {
      return;
    }
    try {
      const { deleteDoc } = await import('firebase/firestore');
      await deleteDoc(doc(db, 'decorations', id));
    } catch (err) {
      console.error("Failed to delete decoration from Firestore:", err);
    }
  };

  // --- CMS Safety / Recovery Actions ---
  const hasUndo = useCallback((key: string) => {
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
      case 'galleryItems':
        await updateGalleryItems(prevState, false);
        break;
      case 'decorations':
        await updateDecorations(prevState, false);
        break;
    }

    setPreviousStates(prev => {
      const next = { ...prev };
      delete next[normalizedKey];
      return next;
    });
  }, [
    previousStates,
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
    galleryItems,
    decorations
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
      case 'galleryItems':
        await updateGalleryItems(DEFAULT_GALLERY);
        break;
      case 'decorations':
        await updateDecorations(DEFAULT_DECORATIONS);
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
    updateTestimonials,
    updateGalleryItems
  ]);

  // --- INITIAL LOAD & REAL-TIME LISTENERS ---
  useEffect(() => {
    if (!isFirebaseConfigured) {
      loadOfflineCMS();

      const handleCmsUpdate = () => {
        loadCachedCMS();
      };
      const handleStorageUpdate = (e: StorageEvent) => {
        if (e.key && e.key.startsWith('cakeLounge_cms_')) {
          loadCachedCMS();
        }
      };

      window.addEventListener('cms_updated', handleCmsUpdate);
      window.addEventListener('storage', handleStorageUpdate);

      return () => {
        window.removeEventListener('cms_updated', handleCmsUpdate);
        window.removeEventListener('storage', handleStorageUpdate);
      };
    }

    console.log("Loading cached CMS and subscribing to real-time Firestore CMS configurations...");

    // First, load cached content from local storage immediately as a fast fallback to prevent layout shift or empty lists
    loadCachedCMS();

    const unsubs: (() => void)[] = [];
    const loadedListeners = new Set<string>();

    const markListenerLoaded = (key: string) => {
      loadedListeners.add(key);
      if (loadedListeners.size === 15) {
        setLoading(false);
      }
    };

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
            // Update local storage cache to match authoritative Firestore data
            saveOfflineCMS(collectionName, items);
          } else {
            setter(fallback);
            saveOfflineCMS(collectionName, fallback);
          }
          markListenerLoaded(collectionName);
        },
        (error) => {
          console.error(`Real-time fetch failed for ${collectionName}, using fallback:`, error);
          setter(fallback);
          markListenerLoaded(collectionName);
        }
      );
      unsubs.push(unsub);
    };

    // Listen to arrays (11 listeners now with decorations)
    registerListener('navigation', 'displayOrder', setNavigation, DEFAULT_NAVIGATION);
    registerListener('megaMenus', 'displayOrder', setMegaMenus, DEFAULT_MEGA_MENUS);
    registerListener('homepageSections', 'order', setHomepageSections, DEFAULT_HOMEPAGE_SECTIONS);
    registerListener('announcements', 'displayOrder', setAnnouncements, DEFAULT_ANNOUNCEMENTS);
    registerListener('collections', 'displayOrder', setCollections, DEFAULT_COLLECTIONS);
    registerListener('categories', 'displayOrder', setCategories, DEFAULT_CATEGORIES);
    registerListener('media', 'createdAt', setMediaItems, DEFAULT_MEDIA_LIBRARY);
    registerListener('testimonials', 'displayOrder', setTestimonials, DEFAULT_TESTIMONIALS);
    registerListener('gallery', 'displayOrder', setGalleryItems, DEFAULT_GALLERY);
    registerListener('decorations', 'displayOrder', setDecorations, DEFAULT_DECORATIONS);
    registerListener('seo', null, setSeoMetadata, DEFAULT_SEO_METADATA);

    // Listen to individual config documents in 'settings' collection (4 listeners)
    const unsubGlobal = onSnapshot(doc(db, 'settings', 'global_settings'), (snap) => {
      if (snap.exists()) {
        const data = snap.data() as CMSWebsiteSettings;
        setWebsiteSettings(data);
        saveOfflineCMS('websiteSettings', data);
      } else {
        setWebsiteSettings(DEFAULT_WEBSITE_SETTINGS);
        saveOfflineCMS('websiteSettings', DEFAULT_WEBSITE_SETTINGS);
      }
      markListenerLoaded('global_settings');
    }, (error) => {
      console.error("Failed to read global website settings, using default:", error);
      setWebsiteSettings(DEFAULT_WEBSITE_SETTINGS);
      markListenerLoaded('global_settings');
    });
    unsubs.push(unsubGlobal);

    const unsubGeneral = onSnapshot(doc(db, 'settings', 'general_cms_config'), (snap) => {
      if (snap.exists()) {
        const data = snap.data() as CMSGeneralSettings;
        setGeneralSettings(data);
        saveOfflineCMS('generalSettings', data);
      } else {
        setGeneralSettings(DEFAULT_GENERAL_SETTINGS);
        saveOfflineCMS('generalSettings', DEFAULT_GENERAL_SETTINGS);
      }
      markListenerLoaded('general_cms_config');
    }, (error) => {
      console.error("Failed to read general settings, using default:", error);
      setGeneralSettings(DEFAULT_GENERAL_SETTINGS);
      markListenerLoaded('general_cms_config');
    });
    unsubs.push(unsubGeneral);

    const unsubAbout = onSnapshot(doc(db, 'settings', 'about_settings'), (snap) => {
      if (snap.exists()) {
        const data = snap.data() as AboutSectionSettings;
        setAboutSettings(data);
        saveOfflineCMS('aboutSettings', data);
      } else {
        setAboutSettings(DEFAULT_ABOUT_SETTINGS);
        saveOfflineCMS('aboutSettings', DEFAULT_ABOUT_SETTINGS);
      }
      markListenerLoaded('about_settings');
    }, (error) => {
      console.error("Failed to read about settings, using default:", error);
      setAboutSettings(DEFAULT_ABOUT_SETTINGS);
      markListenerLoaded('about_settings');
    });
    unsubs.push(unsubAbout);

    const unsubFeatured = onSnapshot(doc(db, 'settings', 'featured_products'), (snap) => {
      if (snap.exists()) {
        const data = snap.data() as FeaturedProductsSettings;
        setFeaturedProducts(data);
        saveOfflineCMS('featuredProducts', data);
      } else {
        setFeaturedProducts(DEFAULT_FEATURED_PRODUCTS_SETTINGS);
        saveOfflineCMS('featuredProducts', DEFAULT_FEATURED_PRODUCTS_SETTINGS);
      }
      markListenerLoaded('featured_products');
    }, (error) => {
      console.error("Failed to read featured products settings, using default:", error);
      setFeaturedProducts(DEFAULT_FEATURED_PRODUCTS_SETTINGS);
      markListenerLoaded('featured_products');
    });
    unsubs.push(unsubFeatured);

    return () => {
      unsubs.forEach(unsub => unsub());
    };
  }, [isFirebaseConfigured, loadOfflineCMS, loadCachedCMS, saveOfflineCMS]);

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
      galleryItems,
      decorations,
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
      updateGalleryItems,
      deleteGalleryItemFromDB,
      updateDecorations,
      deleteDecorationFromDB,

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
