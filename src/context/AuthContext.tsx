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
import { doc, setDoc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

export interface Address {
  id: string;
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
}

interface AuthContextType {
  user: User | null;
  role: string | null;
  isAdmin: boolean;
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
  const [role, setRole] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      setUser(firebaseUser);

      if (firebaseUser) {
        // Ensure user document exists in Firestore (especially for Google Sign-In)
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        let userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
          const newUserData = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            createdAt: new Date().toISOString(),
            role: 'user',
            addresses: []
          };
          await setDoc(userDocRef, newUserData);
          setRole('user');
          setIsAdmin(false);
          setUserData(newUserData);
        } else {
          const data = userDoc.data();
          setRole(data?.role || 'user');
          setIsAdmin(data?.role === 'admin');
          setUserData(data);
        }
      } else {
        setRole(null);
        setIsAdmin(false);
        setUserData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
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
    if (!user) return;
    const userDocRef = doc(db, 'users', user.uid);
    const newAddress = {
      ...address,
      id: Math.random().toString(36).substring(2, 9)
    };

    // If it's the first address or set as default, handle default logic
    const currentAddresses = userData?.addresses || [];
    if (newAddress.isDefault || currentAddresses.length === 0) {
      newAddress.isDefault = true;
      const updatedAddresses = currentAddresses.map((a: Address) => ({ ...a, isDefault: false }));
      await updateDoc(userDocRef, {
        addresses: [...updatedAddresses, newAddress]
      });
    } else {
      await updateDoc(userDocRef, {
        addresses: arrayUnion(newAddress)
      });
    }

    // Refresh user data
    const updatedDoc = await getDoc(userDocRef);
    setUserData(updatedDoc.data());
  };

  const updateAddress = async (id: string, updatedFields: Partial<Address>) => {
    if (!user || !userData) return;
    const userDocRef = doc(db, 'users', user.uid);

    let updatedAddresses = userData.addresses.map((addr: Address) => {
      if (addr.id === id) {
        return { ...addr, ...updatedFields };
      }
      if (updatedFields.isDefault && addr.id !== id) {
        return { ...addr, isDefault: false };
      }
      return addr;
    });

    await updateDoc(userDocRef, { addresses: updatedAddresses });
    setUserData({ ...userData, addresses: updatedAddresses });
  };

  const deleteAddress = async (id: string) => {
    if (!user || !userData) return;
    const userDocRef = doc(db, 'users', user.uid);
    const updatedAddresses = userData.addresses.filter((addr: Address) => addr.id !== id);

    // If we deleted the default, set the first remaining as default if any
    if (updatedAddresses.length > 0 && !updatedAddresses.some((a: Address) => a.isDefault)) {
      updatedAddresses[0].isDefault = true;
    }

    await updateDoc(userDocRef, { addresses: updatedAddresses });
    setUserData({ ...userData, addresses: updatedAddresses });
  };

  const setDefaultAddress = async (id: string) => {
    if (!user || !userData) return;
    const userDocRef = doc(db, 'users', user.uid);
    const updatedAddresses = userData.addresses.map((addr: Address) => ({
      ...addr,
      isDefault: addr.id === id
    }));

    await updateDoc(userDocRef, { addresses: updatedAddresses });
    setUserData({ ...userData, addresses: updatedAddresses });
  };

  return (
    <AuthContext.Provider value={{
      user,
      role,
      isAdmin,
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
