"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  User,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import { auth, db } from '@/utils/firebase';
import { doc, setDoc, getDoc, updateDoc, arrayUnion, arrayRemove, onSnapshot } from 'firebase/firestore';

export interface Address {
  id: string;
  name: string;
  phone: string;
  houseNumber: string;
  street: string;
  landmark?: string;
  area: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
}

interface AuthContextType {
  user: User | null;
  role: 'admin' | 'staff' | 'user' | null;
  isAdmin: boolean;
  isStaff: boolean;
  loading: boolean;
  userData: any;
  logout: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  addAddress: (address: Omit<Address, 'id'>) => Promise<void>;
  updateAddress: (id: string, address: Partial<Address>) => Promise<void>;
  deleteAddress: (id: string) => Promise<void>;
  setDefaultAddress: (id: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<'admin' | 'staff' | 'user' | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isStaff, setIsStaff] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    let unsubscribeSnapshot: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      // Clear previous snapshot listener if it exists
      if (unsubscribeSnapshot) {
        unsubscribeSnapshot();
        unsubscribeSnapshot = null;
      }

      setUser(firebaseUser);

      if (firebaseUser) {
        setLoading(true);
        const userDocRef = doc(db, 'users', firebaseUser.uid);

        // Setup real-time listener for user data
        unsubscribeSnapshot = onSnapshot(userDocRef, async (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.data();
            const userRole = data?.role === 'super_admin' ? 'admin' : (data?.role || 'user');
            setRole(userRole);
            setIsAdmin(userRole === 'admin');
            setIsStaff(userRole === 'staff' || userRole === 'admin');
            setUserData(data);
            setLoading(false);
          } else {
            // Create user document if it doesn't exist (e.g., first Google Sign-In)
            try {
              const newUserData = {
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                displayName: firebaseUser.displayName,
                createdAt: new Date().toISOString(),
                role: 'user',
                addresses: []
              };
              await setDoc(userDocRef, newUserData);
              // onSnapshot will fire again after setDoc
            } catch (err) {
              console.error("Error creating user document:", err);
              setLoading(false);
            }
          }
        }, (error) => {
          console.error("User data snapshot error:", error);
          setLoading(false);
        });
      } else {
        setRole(null);
        setIsAdmin(false);
        setIsStaff(false);
        setUserData(null);
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeSnapshot) unsubscribeSnapshot();
    };
  }, []);

  const logout = async () => {
    await signOut(auth);
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signup = async (email: string, password: string, name: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, {
      displayName: name
    });

    // Create user document in Firestore
    const newUserData = {
      uid: userCredential.user.uid,
      email: userCredential.user.email,
      displayName: name,
      createdAt: new Date().toISOString(),
      role: 'user',
      addresses: []
    };
    await setDoc(doc(db, 'users', userCredential.user.uid), newUserData);
    setUserData(newUserData);
  };

  const addAddress = async (address: Omit<Address, 'id'>) => {
    if (!user) throw new Error("User not authenticated");

    try {
      const userDocRef = doc(db, 'users', user.uid);
      const newAddress = {
        ...address,
        id: Math.random().toString(36).substring(2, 9)
      };

      // If it's the first address or set as default, handle default logic
      const currentAddresses = userData?.addresses || [];
      let updatedAddresses: Address[] = [];

      if (newAddress.isDefault || currentAddresses.length === 0) {
        newAddress.isDefault = true;
        updatedAddresses = [
          ...currentAddresses.map((a: Address) => ({ ...a, isDefault: false })),
          newAddress
        ];
      } else {
        updatedAddresses = [...currentAddresses, newAddress];
      }

      console.log("Saving address to Firestore for user:", user.uid);
      await setDoc(userDocRef, { addresses: updatedAddresses }, { merge: true });
      console.log("Address saved successfully in Firestore");
    } catch (error: any) {
      console.error("Firestore save error:", error);
      throw error;
    }
  };

  const updateAddress = async (id: string, updatedFields: Partial<Address>) => {
    if (!user || !userData) throw new Error("User not authenticated or data missing");

    try {
      const userDocRef = doc(db, 'users', user.uid);
      const updatedAddresses = userData.addresses.map((addr: Address) => {
        if (addr.id === id) {
          return { ...addr, ...updatedFields };
        }
        if (updatedFields.isDefault && addr.id !== id) {
          return { ...addr, isDefault: false };
        }
        return addr;
      });

      console.log("Updating address in Firestore for user:", user.uid);
      await setDoc(userDocRef, { addresses: updatedAddresses }, { merge: true });
      console.log("Address updated successfully in Firestore");
    } catch (error: any) {
      console.error("Firestore update error:", error);
      throw error;
    }
  };

  const deleteAddress = async (id: string) => {
    if (!user || !userData) throw new Error("User not authenticated or data missing");

    try {
      const userDocRef = doc(db, 'users', user.uid);
      let updatedAddresses = userData.addresses.filter((addr: Address) => addr.id !== id);

      // If we deleted the default, set the first remaining as default if any
      if (updatedAddresses.length > 0 && !updatedAddresses.some((a: Address) => a.isDefault)) {
        updatedAddresses[0].isDefault = true;
      }

      console.log("Deleting address from Firestore for user:", user.uid);
      await setDoc(userDocRef, { addresses: updatedAddresses }, { merge: true });
      console.log("Address deleted successfully in Firestore");
    } catch (error: any) {
      console.error("Firestore delete error:", error);
      throw error;
    }
  };

  const setDefaultAddress = async (id: string) => {
    if (!user || !userData) throw new Error("User not authenticated or data missing");

    try {
      const userDocRef = doc(db, 'users', user.uid);
      const updatedAddresses = userData.addresses.map((addr: Address) => ({
        ...addr,
        isDefault: addr.id === id
      }));

      console.log("Setting default address in Firestore for user:", user.uid);
      await setDoc(userDocRef, { addresses: updatedAddresses }, { merge: true });
      console.log("Default address set successfully in Firestore");
    } catch (error: any) {
      console.error("Firestore set default error:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      role,
      isAdmin,
      isStaff,
      loading,
      userData,
      logout,
      signInWithGoogle,
      resetPassword,
      login,
      signup,
      addAddress,
      updateAddress,
      deleteAddress,
      setDefaultAddress
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
