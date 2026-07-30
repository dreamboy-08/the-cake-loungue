'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, products as staticProducts } from '@/constants/products';
import { db } from '@/utils/firebase';
import { collection, onSnapshot, query } from 'firebase/firestore';

interface ProductsContextType {
  products: Product[];
  loading: boolean;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export const ProductsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(staticProducts);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If Firebase is not configured, fallback immediately
    if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY || process.env.NEXT_PUBLIC_FIREBASE_API_KEY === "your_api_key") {
      setProducts(staticProducts);
      setLoading(false);
      return;
    }

    const q = query(collection(db, 'products'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (snapshot.empty) {
        setProducts(staticProducts);
      } else {
        const fetchedProducts = snapshot.docs.map(doc => {
          const data = doc.data();
          const docId = doc.id;
          // Parse id as number if it's numeric to match standard types
          const parsedId = /^\d+$/.test(docId) ? parseInt(docId, 10) : docId;
          return {
            ...data,
            id: parsedId,
          } as unknown as Product;
        });

        // Filter: we want active !== false
        const activeProducts = fetchedProducts.filter(p => p.active !== false);

        // Sort: numeric IDs first, then alphabetical/string Firestore IDs
        const sorted = [...activeProducts].sort((a, b) => {
          const aIsNum = typeof a.id === 'number';
          const bIsNum = typeof b.id === 'number';
          if (aIsNum && bIsNum) {
            return (a.id as number) - (b.id as number);
          }
          if (aIsNum) return -1;
          if (bIsNum) return 1;
          return 0;
        });

        setProducts(sorted);
      }
      setLoading(false);
    }, (error) => {
      console.error("Error fetching products:", error);
      setProducts(staticProducts);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <ProductsContext.Provider value={{ products, loading }}>
      {children}
    </ProductsContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  return context;
};
