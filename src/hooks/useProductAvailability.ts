import { useState, useEffect } from 'react';
import { products as staticProducts } from '@/constants/products';
import { db } from '@/utils/firebase';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { toSlug } from '@/utils/slug';

/**
 * Hook to track which product categories actually have products available.
 * Combines both static products and Firestore products.
 * Returns a Set of category slugs.
 */
export const useProductAvailability = () => {
  const [availableCategorySlugs, setAvailableCategorySlugs] = useState<Set<string>>(new Set());

  useEffect(() => {
    // 1. Get slugs from static products
    const staticSlugs = new Set(staticProducts.map(p => toSlug(p.category)));

    // Set initial state with static products
    setAvailableCategorySlugs(new Set(staticSlugs));

    // 2. Check if Firebase is configured
    const isFirebaseConfigured =
      process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
      process.env.NEXT_PUBLIC_FIREBASE_API_KEY !== "your_api_key";

    if (!isFirebaseConfigured) {
      return;
    }

    // 3. Listen to Firestore products to detect dynamic categories
    // We filter for active products to ensure availability
    const q = query(
      collection(db, 'products'),
      where('active', '==', true)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const dynamicSlugs = new Set<string>();

      snapshot.docs.forEach(doc => {
        const data = doc.data();
        if (data.category) {
          dynamicSlugs.add(toSlug(data.category));
        }
      });

      // Merge both static and dynamic slugs
      const combined = new Set([...staticSlugs, ...dynamicSlugs]);
      setAvailableCategorySlugs(combined);
    }, (error) => {
      console.error("Error fetching product availability from Firestore:", error);
      // On error, we still have the static slugs as a fallback
    });

    return () => unsubscribe();
  }, []);

  return availableCategorySlugs;
};
