'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';
import { db } from '@/utils/firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { Product } from '@/constants/products';

interface WishlistContextType {
  wishlist: Product[];
  toggleWishlist: (product: Product) => void;
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (id: number | string) => void;
  isInWishlist: (id: number | string) => boolean;
  clearWishlist: () => void;
  isLoading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  const isInitialMount = useRef(true);
  const isUpdatingFromServer = useRef(false);
  const lastSyncedWishlistRef = useRef<string>('');

  // Persistence helper
  const persistWishlist = async (newWishlist: Product[]) => {
    if (!user) {
      localStorage.setItem('cakeLounge_wishlist', JSON.stringify(newWishlist));
      return;
    }

    try {
      await setDoc(doc(db, 'users', user.uid), {
        wishlist: newWishlist,
        updatedAt: new Date().toISOString(),
      }, { merge: true });
    } catch (error) {
      console.error('Error persisting wishlist:', error);
    }
  };

  // Sync with Firestore or LocalStorage
  useEffect(() => {
    let unsubscribe: () => void;

    const syncWishlist = async () => {
      setIsLoading(true);
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        unsubscribe = onSnapshot(userRef, { includeMetadataChanges: true }, (docSnap) => {
          // If the change came from our own local write, ignore it to prevent loops
          if (docSnap.metadata.hasPendingWrites) return;

          if (docSnap.exists()) {
            isUpdatingFromServer.current = true;
            const items = docSnap.data().wishlist || [];
            lastSyncedWishlistRef.current = JSON.stringify(items);
            setWishlist(items);
            isUpdatingFromServer.current = false;
          } else {
            // Migrate from localStorage
            const localWishlist = localStorage.getItem('cakeLounge_wishlist');
            if (localWishlist) {
              try {
                const parsed = JSON.parse(localWishlist);
                setWishlist(parsed);
                persistWishlist(parsed);
                localStorage.removeItem('cakeLounge_wishlist');
              } catch (e) {
                console.error("Failed to migrate wishlist", e);
              }
            }
          }
          setIsLoading(false);
        }, (error) => {
          console.error("Error listening to wishlist:", error);
          setIsLoading(false);
        });
      } else {
        // Guest: Load from LocalStorage
        const localWishlist = localStorage.getItem('cakeLounge_wishlist');
        if (localWishlist) {
          try {
            setWishlist(JSON.parse(localWishlist));
          } catch (e) {
            console.error("Failed to parse local wishlist", e);
          }
        }
        setIsLoading(false);
      }
    };

    syncWishlist();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user]);

  // Handle local changes persistence, avoiding loops
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (!isUpdatingFromServer.current && !isLoading) {
      const currentWishlistStr = JSON.stringify(wishlist);
      if (currentWishlistStr !== lastSyncedWishlistRef.current) {
        lastSyncedWishlistRef.current = currentWishlistStr;
        persistWishlist(wishlist);
      }
    }
  }, [wishlist, isLoading]);

  const addToWishlist = (product: Product) => {
    setWishlist((prev) => {
      if (prev.some((p) => p.id === product.id)) {
        return prev;
      }
      return [...prev, product];
    });
  };

  const removeFromWishlist = (id: number | string) => {
    setWishlist((prev) => prev.filter((p) => p.id !== id));
  };

  const toggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        return prev.filter((p) => p.id !== product.id);
      }
      return [...prev, product];
    });
  };

  const isInWishlist = (id: number | string) => {
    return wishlist.some((p) => p.id === id);
  };

  const clearWishlist = () => {
    setWishlist([]);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        toggleWishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        clearWishlist,
        isLoading,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
