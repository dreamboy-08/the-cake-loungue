import { useState, useEffect } from 'react';
import { db } from '@/utils/firebase';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { products as staticProducts } from '@/constants/products';
import { toSlug } from '@/utils/slug';

export const useProductAvailability = () => {
  const [availableSlugs, setAvailableSlugs] = useState<Set<string>>(new Set());

  useEffect(() => {
    // 1. Get static available slugs
    const staticSlugs = new Set(staticProducts.map(p => toSlug(p.category)));

    // Initial set from static data
    setAvailableSlugs(new Set(staticSlugs));

    // If Firebase is not configured, skip onSnapshot setup
    if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY || process.env.NEXT_PUBLIC_FIREBASE_API_KEY === "your_api_key") {
      return;
    }

    // 2. Real-time sync with Firestore products to get additional categories
    // We only need to know which categories HAVE products.
    // However, to keep it simple and real-time, we listen to all active products.
    const q = query(
      collection(db, 'products'),
      where('status', '==', 'available')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const dynamicSlugs = new Set<string>();
      snapshot.docs.forEach(doc => {
        const data = doc.data();
        if (data.category) {
          dynamicSlugs.add(toSlug(data.category));
        }
      });

      // Combine static and dynamic
      const combined = new Set([...Array.from(staticSlugs), ...Array.from(dynamicSlugs)]);
      setAvailableSlugs(combined);
    }, (error) => {
      console.error("Error listening to product availability:", error);
    });

    return () => unsubscribe();
  }, []);

  return availableSlugs;
};
