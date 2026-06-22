import { db } from './firebase';
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  doc,
  getDoc,
  limit
} from 'firebase/firestore';
import { Product } from '@/constants/products';

export const getProducts = async (options?: {
  category?: string;
  featured?: boolean;
  limitCount?: number;
}) => {
  try {
    let q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));

    if (options?.category && options.category !== 'All') {
      q = query(collection(db, 'products'), where('category', '==', options.category), orderBy('createdAt', 'desc'));
    }

    if (options?.featured) {
      // If we had a 'featured' field in Firestore, we'd filter by it.
      // For now, let's just use limit if requested.
    }

    if (options?.limitCount) {
      q = query(q, limit(options.limitCount));
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any)) as (Product & { id: string | number })[];
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

export const getProductById = async (id: string) => {
  try {
    const docRef = doc(db, 'products', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as any;
    }
    return null;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
};

export const getCategories = async () => {
  try {
    const q = query(collection(db, 'categories'), orderBy('name', 'asc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};
