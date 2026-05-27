"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { doc, setDoc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '@/utils/firebase';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  img: string;
  quantity: number;
  flavor?: string;
  weight?: string;
  message?: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  // Load cart from localStorage or Firestore
  useEffect(() => {
    let unsubscribe: () => void;

    const loadCart = async () => {
      setIsLoading(true);
      if (user) {
        // If logged in, sync with Firestore
        const cartDocRef = doc(db, 'carts', user.uid);

        // Listen for real-time updates
        unsubscribe = onSnapshot(cartDocRef, (doc) => {
          if (doc.exists()) {
            setCart(doc.data().items || []);
          } else {
            // If no firestore cart, try to migrate from local storage
            const savedCart = localStorage.getItem('cakeLounge_cart');
            if (savedCart) {
              try {
                const items = JSON.parse(savedCart);
                setCart(items);
                // Save to firestore immediately
                setDoc(cartDocRef, { items, updatedAt: new Date().toISOString() });
              } catch (e) {
                console.error("Failed to parse cart from localStorage", e);
              }
            }
          }
          setIsLoading(false);
        });
      } else {
        // If not logged in, use localStorage
        const savedCart = localStorage.getItem('cakeLounge_cart');
        if (savedCart) {
          try {
            setCart(JSON.parse(savedCart));
          } catch (e) {
            console.error("Failed to parse cart from localStorage", e);
          }
        }
        setIsLoading(false);
      }
    };

    loadCart();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user]);

  // Save cart to localStorage/Firestore whenever it changes
  useEffect(() => {
    if (!user) {
      localStorage.setItem('cakeLounge_cart', JSON.stringify(cart));
    } else {
      // For logged in users, sync with Firestore
      // We use a small delay or debouncing here if needed, but for now simple setDoc
      const syncCart = async () => {
        const cartDocRef = doc(db, 'carts', user.uid);
        await setDoc(cartDocRef, {
          items: cart,
          updatedAt: new Date().toISOString()
        }, { merge: true });
      };

      syncCart();
    }
  }, [cart, user]);

  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((i) => i.id === item.id);
      if (existingItem) {
        return prevCart.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    if (!user) {
      localStorage.removeItem('cakeLounge_cart');
    }
  };

  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartCount,
      cartTotal,
      isLoading
    }}>
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
