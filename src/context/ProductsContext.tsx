"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { db } from '@/utils/firebase';
import { collection, onSnapshot, query, orderBy, getDocs } from 'firebase/firestore';
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

  const loadOfflineProducts = useCallback(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('cakeLounge_cms_products');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setProducts(parsed);
            setLoading(false);
            return;
          }
        }
      } catch (e) {
        console.error("Error reading cakeLounge_cms_products from localStorage:", e);
      }
      setProducts(staticProducts);
    } else {
      setProducts(staticProducts);
    }
    setLoading(false);
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
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const fetched = snapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id
        })) as unknown as Product[];
        setProducts(fetched);
      } else {
        setProducts(staticProducts);
      }
    } catch (err) {
      console.error("Failed to refresh products from Firestore, falling back to offline/static:", err);
      loadOfflineProducts();
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
      loadOfflineProducts();

      // Listen to a custom event for local updates so that multiple tabs or components can stay in sync
      const handleLocalUpdate = () => {
        loadOfflineProducts();
      };
      const handleStorageUpdate = (e: StorageEvent) => {
        if (e.key === 'cakeLounge_cms_products') {
          loadOfflineProducts();
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

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const fetched = snapshot.docs.map(doc => ({
            ...doc.data(),
            id: doc.id
          })) as unknown as Product[];
          setProducts(fetched);
          if (typeof window !== 'undefined') {
            try {
              localStorage.setItem('cakeLounge_cms_products', JSON.stringify(fetched));
            } catch (e) {}
          }
        } else {
          console.warn("Firestore products collection is empty. Falling back to static products.");
          setProducts(staticProducts);
        }
        setLoading(false);
      },
      (error) => {
        console.error("Firestore onSnapshot subscription failed, falling back to getDocs or static:", error);
        // Fallback to manual load as backup
        refreshProducts();
      }
    );

    return () => {
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
