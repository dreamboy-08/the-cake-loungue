'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';
import { db } from '@/utils/firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';

export interface CartItem {
  id: number;
  cartItemId: string; // Unique identifier for items with different options
  name: string;
  price: number;
  img: string;
  quantity: number;
  flavor?: string;
  weight?: string;
  message?: string;
  category?: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity' | 'cartItemId'>) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  const isInitialMount = useRef(true);
  const isUpdatingFromServer = useRef(false);

  // Persistence helper
  const persistCart = async (newCart: CartItem[]) => {
    if (!user) {
      localStorage.setItem('cakeLounge_cart', JSON.stringify(newCart));
      return;
    }

    try {
      await setDoc(doc(db, 'carts', user.uid), {
        items: newCart,
        updatedAt: new Date().toISOString(),
      }, { merge: true });
    } catch (error) {
      console.error('Error persisting cart:', error);
    }
  };

  // Sync with Firestore or LocalStorage
  useEffect(() => {
    let unsubscribe: () => void;

    const syncCart = async () => {
      setIsLoading(true);
      if (user) {
        const cartRef = doc(db, 'carts', user.uid);
        unsubscribe = onSnapshot(cartRef, { includeMetadataChanges: true }, (docSnap) => {
          // If the change came from our own local write, ignore it to prevent loops
          if (docSnap.metadata.hasPendingWrites) return;

          if (docSnap.exists()) {
            isUpdatingFromServer.current = true;
            setCart(docSnap.data().items || []);
            isUpdatingFromServer.current = false;
          } else {
            // If no Firestore cart, try to migrate from localStorage
            const localCart = localStorage.getItem('cakeLounge_cart');
            if (localCart) {
              try {
                const parsedCart = JSON.parse(localCart);
                setCart(parsedCart);
                persistCart(parsedCart);
                localStorage.removeItem('cakeLounge_cart');
              } catch (e) {
                console.error("Failed to migrate cart", e);
              }
            }
          }
          setIsLoading(false);
        }, (error) => {
          console.error("Error listening to cart:", error);
          setIsLoading(false);
        });
      } else {
        // Guest: Load from LocalStorage
        const localCart = localStorage.getItem('cakeLounge_cart');
        if (localCart) {
          try {
            setCart(JSON.parse(localCart));
          } catch (e) {
            console.error("Failed to parse local cart", e);
          }
        }
        setIsLoading(false);
      }
    };

    syncCart();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user]);

  // Handle persistence whenever cart changes, but avoid feedback loops
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // Only persist if the update was NOT from the server
    if (!isUpdatingFromServer.current && !isLoading) {
      persistCart(cart);
    }
  }, [cart, isLoading]);

  const addToCart = (item: Omit<CartItem, 'quantity' | 'cartItemId'>) => {
    // Safety check: Custom Cakes should not enter the cart
    if (item.category === 'Custom Cakes') {
      console.warn('Custom Cakes should not be added to cart. Use WhatsApp flow.');
      return;
    }

    const cartItemId = `${item.id}-${item.flavor || ''}-${item.weight || ''}-${item.message || ''}`;

    setCart((prevCart) => {
      const existingItem = prevCart.find((i) => i.cartItemId === cartItemId);
      if (existingItem) {
        return prevCart.map((i) =>
          i.cartItemId === cartItemId ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prevCart, { ...item, cartItemId, quantity: 1 }];
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.cartItemId !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.cartItemId === cartItemId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
        isLoading
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
