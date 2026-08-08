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
  AboutSectionSettings
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
  DEFAULT_ABOUT_SETTINGS
} from '@/constants/cmsDefaults';

interface CMSContextType {
  navigation: NavigationItem[];
  megaMenus: MegaMenuSection[];
  homepageSections: HomepageSection[];
  announcements: Announcement[];
  collections: CollectionCMSItem[];
  websiteSettings: CMSWebsiteSettings;
  mediaItems: CMSMediaItem[];
  seoMetadata: CMSSEOMetadata[];
  generalSettings: CMSGeneralSettings;
  aboutSettings: AboutSectionSettings;
  loading: boolean;

  // Setters
  updateNavigation: (items: NavigationItem[]) => Promise<void>;
  updateMegaMenus: (sections: MegaMenuSection[]) => Promise<void>;
  updateHomepageSections: (sections: HomepageSection[]) => Promise<void>;
  updateAnnouncements: (items: Announcement[]) => Promise<void>;
  updateCollections: (items: CollectionCMSItem[]) => Promise<void>;
  updateWebsiteSettings: (settings: CMSWebsiteSettings) => Promise<void>;
  updateMediaItems: (items: CMSMediaItem[]) => Promise<void>;
  updateSEOMetadata: (metadata: CMSSEOMetadata[]) => Promise<void>;
  updateGeneralSettings: (settings: CMSGeneralSettings) => Promise<void>;
  updateAboutSettings: (settings: AboutSectionSettings) => Promise<void>;
}

const CMSContext = createContext<CMSContextType | undefined>(undefined);

export const CMSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [navigation, setNavigation] = useState<NavigationItem[]>([]);
  const [megaMenus, setMegaMenus] = useState<MegaMenuSection[]>([]);
  const [homepageSections, setHomepageSections] = useState<HomepageSection[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [collections, setCollections] = useState<CollectionCMSItem[]>([]);
  const [websiteSettings, setWebsiteSettings] = useState<CMSWebsiteSettings>(DEFAULT_WEBSITE_SETTINGS);
  const [mediaItems, setMediaItems] = useState<CMSMediaItem[]>([]);
  const [seoMetadata, setSeoMetadata] = useState<CMSSEOMetadata[]>([]);
  const [generalSettings, setGeneralSettings] = useState<CMSGeneralSettings>(DEFAULT_GENERAL_SETTINGS);
  const [aboutSettings, setAboutSettings] = useState<AboutSectionSettings>(DEFAULT_ABOUT_SETTINGS);
  const [loading, setLoading] = useState(true);

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
      setWebsiteSettings(DEFAULT_WEBSITE_SETTINGS);
      setMediaItems(DEFAULT_MEDIA_LIBRARY);
      setSeoMetadata(DEFAULT_SEO_METADATA);
      setGeneralSettings(DEFAULT_GENERAL_SETTINGS);
      setAboutSettings(DEFAULT_ABOUT_SETTINGS);
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
      setWebsiteSettings(getStored('websiteSettings', DEFAULT_WEBSITE_SETTINGS));
      setMediaItems(getStored('mediaItems', DEFAULT_MEDIA_LIBRARY));
      setSeoMetadata(getStored('seoMetadata', DEFAULT_SEO_METADATA));
      setGeneralSettings(getStored('generalSettings', DEFAULT_GENERAL_SETTINGS));
      setAboutSettings(getStored('aboutSettings', DEFAULT_ABOUT_SETTINGS));
    } catch (e) {
      console.error("Failed to parse stored offline CMS config, falling back to static defaults:", e);
      setNavigation(DEFAULT_NAVIGATION);
      setMegaMenus(DEFAULT_MEGA_MENUS);
      setHomepageSections(DEFAULT_HOMEPAGE_SECTIONS);
      setAnnouncements(DEFAULT_ANNOUNCEMENTS);
      setCollections(DEFAULT_COLLECTIONS);
      setWebsiteSettings(DEFAULT_WEBSITE_SETTINGS);
      setMediaItems(DEFAULT_MEDIA_LIBRARY);
      setSeoMetadata(DEFAULT_SEO_METADATA);
      setGeneralSettings(DEFAULT_GENERAL_SETTINGS);
      setAboutSettings(DEFAULT_ABOUT_SETTINGS);
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

  // --- SETTER FUNCTIONS (Saves to Firestore or falls back offline) ---
  const updateNavigation = async (items: NavigationItem[]) => {
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

  const updateMegaMenus = async (sections: MegaMenuSection[]) => {
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

  const updateHomepageSections = async (sections: HomepageSection[]) => {
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

  const updateAnnouncements = async (items: Announcement[]) => {
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

  const updateCollections = async (items: CollectionCMSItem[]) => {
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

  const updateWebsiteSettings = async (settings: CMSWebsiteSettings) => {
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

  const updateMediaItems = async (items: CMSMediaItem[]) => {
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

  const updateSEOMetadata = async (metadata: CMSSEOMetadata[]) => {
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

  const updateGeneralSettings = async (settings: CMSGeneralSettings) => {
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

  const updateAboutSettings = async (settings: AboutSectionSettings) => {
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
    registerListener('media', 'createdAt', setMediaItems, DEFAULT_MEDIA_LIBRARY);
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
      websiteSettings,
      mediaItems,
      seoMetadata,
      generalSettings,
      aboutSettings,
      loading,

      updateNavigation,
      updateMegaMenus,
      updateHomepageSections,
      updateAnnouncements,
      updateCollections,
      updateWebsiteSettings,
      updateMediaItems,
      updateSEOMetadata,
      updateGeneralSettings,
      updateAboutSettings
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
