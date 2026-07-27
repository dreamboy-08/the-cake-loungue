'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';
import { db } from '@/utils/firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { Product } from '@/constants/products';
import { usePathname, useRouter } from 'next/navigation';
import AuthRequiredModal from '@/components/AuthRequiredModal';
import AuthReminderPopup from '@/components/AuthReminderPopup';

interface WishlistContextType {
  wishlist: Product[];
  toggleWishlist: (product: Product) => void;
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (id: number | string) => void;
  isInWishlist: (id: number | string) => boolean;
  clearWishlist: () => void;
  isLoading: boolean;
  triggerAuthModal: (type: 'toggle' | 'view_wishlist', product?: Product) => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalAction, setAuthModalAction] = useState<{ type: 'toggle' | 'view_wishlist'; product?: Product } | null>(null);
  const [isReminderOpen, setIsReminderOpen] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  // Helper to check if we are in an E2E test bypass environment
  const isBypassMode = typeof window !== 'undefined' && (
    (window.location.search.includes('bypass=true') || navigator.webdriver) &&
    !window.location.search.includes('force_auth=true')
  );

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

  // Timer for smart authentication reminder popup (approx 2 minutes)
  useEffect(() => {
    // Only if not logged in, not loading, and not in E2E bypass mode
    if (user || isLoading || isBypassMode) return;

    // Check if reminder was already dismissed or shown in this session
    const dismissed = sessionStorage.getItem('cakeLounge_authReminderDismissed');
    if (dismissed) return;

    // Do not show if another modal is currently open (e.g. AuthRequiredModal)
    if (isAuthModalOpen) return;

    const timer = setTimeout(() => {
      // Re-verify conditions after 2 minutes
      const stillDismissed = sessionStorage.getItem('cakeLounge_authReminderDismissed');
      if (stillDismissed) return;
      if (window.location.pathname === '/checkout') return;
      if (isAuthModalOpen) return;

      setIsReminderOpen(true);
    }, 120000); // 120000 ms = 2 minutes

    return () => clearTimeout(timer);
  }, [user, isLoading, isBypassMode, isAuthModalOpen]);

  // Handle executing pending wishlist action after successful authentication
  useEffect(() => {
    if (user && !isLoading) {
      const pendingActionStr = sessionStorage.getItem('pending_wishlist_action');
      if (pendingActionStr) {
        try {
          const pendingAction = JSON.parse(pendingActionStr);
          sessionStorage.removeItem('pending_wishlist_action');

          if (pendingAction.type === 'toggle' && pendingAction.product) {
            addToWishlist(pendingAction.product);
          } else if (pendingAction.type === 'view_wishlist') {
            router.push('/wishlist');
          }
        } catch (e) {
          console.error("Failed to execute pending wishlist action:", e);
        }
      }
    }
  }, [user, isLoading, router]);

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

  const triggerAuthModal = (type: 'toggle' | 'view_wishlist', product?: Product) => {
    setAuthModalAction({ type, product });
    setIsAuthModalOpen(true);
  };

  const handleCloseAuthModal = () => {
    setIsAuthModalOpen(false);
    if (pathname === '/wishlist') {
      router.push('/menu');
    }
    setAuthModalAction(null);
  };

  const handleSignIn = () => {
    if (authModalAction) {
      sessionStorage.setItem('pending_wishlist_action', JSON.stringify({
        type: authModalAction.type,
        product: authModalAction.product
      }));
    }
    setIsAuthModalOpen(false);
    router.push('/login');
  };

  const handleCreateAccount = () => {
    if (authModalAction) {
      sessionStorage.setItem('pending_wishlist_action', JSON.stringify({
        type: authModalAction.type,
        product: authModalAction.product
      }));
    }
    setIsAuthModalOpen(false);
    router.push('/signup');
  };

  const handleCloseReminder = () => {
    setIsReminderOpen(false);
    sessionStorage.setItem('cakeLounge_authReminderDismissed', 'true');
  };

  const handleReminderSignIn = () => {
    setIsReminderOpen(false);
    sessionStorage.setItem('cakeLounge_authReminderDismissed', 'true');
    router.push('/login');
  };

  const handleReminderCreateAccount = () => {
    setIsReminderOpen(false);
    sessionStorage.setItem('cakeLounge_authReminderDismissed', 'true');
    router.push('/signup');
  };

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
    if (!user && !isBypassMode) {
      triggerAuthModal('toggle', product);
      return;
    }

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
        triggerAuthModal,
      }}
    >
      {children}
      <AuthRequiredModal
        isOpen={isAuthModalOpen}
        onClose={handleCloseAuthModal}
        onSignIn={handleSignIn}
        onCreateAccount={handleCreateAccount}
      />
      <AuthReminderPopup
        isOpen={isReminderOpen}
        onClose={handleCloseReminder}
        onSignIn={handleReminderSignIn}
        onCreateAccount={handleReminderCreateAccount}
      />
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
