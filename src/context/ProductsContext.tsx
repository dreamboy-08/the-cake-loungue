"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { db } from '@/utils/firebase';
import { collection, onSnapshot, query, orderBy, getDocsFromServer } from 'firebase/firestore';
import { products as staticProducts, Product } from '@/constants/products';

interface ProductsContextType {
  products: Product[];
  loading: boolean;
  refreshProducts: () => Promise<void>;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export const ProductsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const loadOfflineProducts = useCallback((fallbackToStatic = false) => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('cakeLounge_cms_products');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            setProducts(parsed);
            if (fallbackToStatic) setLoading(false);
            return true;
          }
        }
      } catch (e) {
        console.error("Error reading cakeLounge_cms_products from localStorage:", e);
      }
      if (fallbackToStatic) {
        setProducts(staticProducts);
        setLoading(false);
      }
    } else if (fallbackToStatic) {
      setProducts(staticProducts);
      setLoading(false);
    }
    return false;
  }, []);

  const refreshProducts = useCallback(async () => {
    const isFirebaseConfigured =
      process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
      process.env.NEXT_PUBLIC_FIREBASE_API_KEY !== "your_api_key";

    if (!isFirebaseConfigured) {
      loadOfflineProducts();
      return;
    }

    try {
      const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocsFromServer(q);
      const fetched = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      })) as unknown as Product[];
      setProducts(fetched);
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('cakeLounge_cms_products', JSON.stringify(fetched));
        } catch (error) {
          console.error('Failed to cache Firestore products locally:', error);
        }
      }
    } catch (err) {
      console.error("Failed to refresh products from Firestore:", err);
    } finally {
      setLoading(false);
    }
  }, [loadOfflineProducts]);

  useEffect(() => {
    const isFirebaseConfigured =
      process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
      process.env.NEXT_PUBLIC_FIREBASE_API_KEY !== "your_api_key";

    if (!isFirebaseConfigured) {
      console.warn("Firebase not configured, utilizing offline product state in ProductsProvider.");
      loadOfflineProducts(true);

      // Listen to a custom event for local updates so that multiple tabs or components can stay in sync
      const handleLocalUpdate = () => {
        loadOfflineProducts(true);
      };
      const handleStorageUpdate = (e: StorageEvent) => {
        if (e.key === 'cakeLounge_cms_products') {
          loadOfflineProducts(true);
        }
      };

      window.addEventListener('admin_products_updated', handleLocalUpdate);
      window.addEventListener('cms_updated', handleLocalUpdate);
      window.addEventListener('storage', handleStorageUpdate);
      return () => {
        window.removeEventListener('admin_products_updated', handleLocalUpdate);
        window.removeEventListener('cms_updated', handleLocalUpdate);
        window.removeEventListener('storage', handleStorageUpdate);
      };
    }

    console.log("Subscribing to real-time Firestore products...");
    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));

    // Unblock the storefront if Firestore cannot establish a subscription.
    const safetyTimeout = setTimeout(() => {
      setLoading(false);
    }, 5000);

    const unsubscribe = onSnapshot(
      q,
      { includeMetadataChanges: true },
      (snapshot) => {
        if (snapshot.metadata.fromCache) return;

        const fetched = snapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id
        })) as unknown as Product[];
        setProducts(fetched);
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem('cakeLounge_cms_products', JSON.stringify(fetched));
          } catch (error) {
            console.error('Failed to cache Firestore products locally:', error);
          }
        }
        setLoading(false);
      },
      (error) => {
        console.error("Firestore onSnapshot subscription failed:", error);
        setLoading(false);
      }
    );

    return () => {
      clearTimeout(safetyTimeout);
      unsubscribe();
    };
  }, [loadOfflineProducts, refreshProducts]);

  return (
    <ProductsContext.Provider value={{ products, loading, refreshProducts }}>
      {children}
    </ProductsContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  return context;
};
