"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  User,
  signOut,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import { auth, db } from '@/utils/firebase';
import { doc, setDoc, getDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';

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
  role: 'super_admin' | 'admin' | 'staff' | 'user' | null;
  isAdmin: boolean;
  isStaff: boolean;
  isSuperAdmin: boolean;
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
  updateUserRole: (uid: string, newRole: 'admin' | 'user' | 'staff' | 'super_admin') => Promise<void>;
  mapAuthError: (error: any) => string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<'super_admin' | 'admin' | 'staff' | 'user' | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isStaff, setIsStaff] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    // Handle redirect result for Google Sign-In
    const checkRedirect = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          console.log("Redirect sign-in successful");
        }
      } catch (error) {
        console.error("Redirect sign-in error:", error);
      }
    };
    checkRedirect();

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      try {
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
              lastLogin: new Date().toISOString(),
              role: 'user',
              addresses: []
            };
            await setDoc(userDocRef, newUserData);
            setRole('user');
            setIsAdmin(false);
            setIsStaff(false);
            setIsSuperAdmin(false);
            setUserData(newUserData);
          } else {
            const data = userDoc.data();
            const userRole = data?.role || 'user';

            // Update lastLogin
            await updateDoc(userDocRef, {
              lastLogin: new Date().toISOString()
            });

            setRole(userRole);
            setIsAdmin(userRole === 'admin' || userRole === 'super_admin');
            setIsStaff(userRole === 'staff' || userRole === 'admin' || userRole === 'super_admin');
            setIsSuperAdmin(userRole === 'super_admin');
            setUserData({ ...data, lastLogin: new Date().toISOString() });
          }
        } else {
          setRole(null);
          setIsAdmin(false);
          setIsStaff(false);
          setIsSuperAdmin(false);
          setUserData(null);
        }
      } catch (error) {
        console.error("Auth state change error:", error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await signOut(auth);
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      // Try popup first
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      console.error("Popup sign-in error:", error);
      // Fallback to redirect if popup is blocked
      if (error.code === 'auth/popup-blocked' || error.code === 'auth/cancelled-popup-request') {
        await signInWithRedirect(auth, provider);
      } else {
        throw error;
      }
    }
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

      await setDoc(userDocRef, { addresses: updatedAddresses }, { merge: true });

      // Update local state immediately
      setUserData({ ...userData, addresses: updatedAddresses });
      console.log("Address added successfully:", newAddress.id);
    } catch (error) {
      console.error("Error adding address:", error);
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

      await setDoc(userDocRef, { addresses: updatedAddresses }, { merge: true });
      setUserData({ ...userData, addresses: updatedAddresses });
      console.log("Address updated successfully:", id);
    } catch (error) {
      console.error("Error updating address:", error);
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

      await setDoc(userDocRef, { addresses: updatedAddresses }, { merge: true });
      setUserData({ ...userData, addresses: updatedAddresses });
      console.log("Address deleted successfully:", id);
    } catch (error) {
      console.error("Error deleting address:", error);
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

      await setDoc(userDocRef, { addresses: updatedAddresses }, { merge: true });
      setUserData({ ...userData, addresses: updatedAddresses });
      console.log("Default address set successfully:", id);
    } catch (error) {
      console.error("Error setting default address:", error);
      throw error;
    }
  };

  const updateUserRole = async (uid: string, newRole: 'admin' | 'user' | 'staff' | 'super_admin') => {
    if (!isAdmin && !isSuperAdmin) {
      throw new Error("Unauthorized: Only admins can change roles");
    }

    try {
      const userDocRef = doc(db, 'users', uid);
      await updateDoc(userDocRef, {
        role: newRole,
        updatedAt: new Date().toISOString()
      });

      // If the current user's role was changed, update local state
      if (user?.uid === uid) {
        setRole(newRole);
        setIsAdmin(newRole === 'admin' || newRole === 'super_admin');
        setIsStaff(newRole === 'staff' || newRole === 'admin' || newRole === 'super_admin');
      }
    } catch (error) {
      console.error("Error updating user role:", error);
      throw error;
    }
  };

  const mapAuthError = (error: any): string => {
    const errorCode = error.code || '';

    switch (errorCode) {
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'Invalid email or password. Please try again.';
      case 'auth/email-already-in-use':
        return 'An account with this email already exists.';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters.';
      case 'auth/popup-blocked':
        return 'Sign-in popup was blocked by your browser. Please try again.';
      case 'auth/network-request-failed':
        return 'Network error. Please check your internet connection.';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later.';
      case 'auth/user-disabled':
        return 'This account has been disabled.';
      case 'auth/operation-not-allowed':
        return 'Operation not allowed. Please contact support.';
      default:
        return error.message || 'An unexpected error occurred. Please try again.';
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      role,
      isAdmin,
      isStaff,
      isSuperAdmin,
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
      setDefaultAddress,
      updateUserRole,
      mapAuthError
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
