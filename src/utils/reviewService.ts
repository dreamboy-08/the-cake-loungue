import { db } from './firebase';
import {
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  updateDoc,
  increment,
  deleteDoc,
  limit,
  startAfter,
  Timestamp
} from 'firebase/firestore';
import { Review, ReviewStatus } from '@/types/review';

const REVIEWS_COLLECTION = 'reviews';

export const addReview = async (reviewData: Omit<Review, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'helpfulCount' | 'isFeatured' | 'isPinned'>) => {
  try {
    const reviewRef = doc(collection(db, REVIEWS_COLLECTION));
    const now = new Date().toISOString();
    const newReview: Review = {
      ...reviewData,
      id: reviewRef.id,
      status: 'pending',
      helpfulCount: 0,
      isFeatured: false,
      isPinned: false,
      createdAt: now,
      updatedAt: now
    };
    await setDoc(reviewRef, newReview);
    return reviewRef.id;
  } catch (error) {
    console.error("Error adding review:", error);
    throw error;
  }
};

export const getReviews = async (options: {
  status?: ReviewStatus;
  limitCount?: number;
  lastVisible?: any;
  productId?: string;
  featuredOnly?: boolean;
  orderByField?: string;
  orderDirection?: 'asc' | 'desc';
} = {}) => {
  try {
    let q = query(collection(db, REVIEWS_COLLECTION));

    if (options.status) {
      q = query(q, where('status', '==', options.status));
    }

    if (options.productId) {
      q = query(q, where('productId', '==', options.productId));
    }

    if (options.featuredOnly) {
      q = query(q, where('isFeatured', '==', true));
    }

    const field = options.orderByField || 'createdAt';
    const direction = options.orderDirection || 'desc';
    q = query(q, orderBy(field, direction));

    if (options.lastVisible) {
      q = query(q, startAfter(options.lastVisible));
    }

    if (options.limitCount) {
      q = query(q, limit(options.limitCount));
    }

    const snapshot = await getDocs(q);
    const reviews = snapshot.docs.map(doc => doc.data() as Review);
    return {
      reviews,
      lastVisible: snapshot.docs[snapshot.docs.length - 1]
    };
  } catch (error) {
    console.error("Error fetching reviews:", error);
    throw error;
  }
};

export const updateReviewStatus = async (reviewId: string, status: ReviewStatus) => {
  try {
    const reviewRef = doc(db, REVIEWS_COLLECTION, reviewId);
    await updateDoc(reviewRef, {
      status,
      updatedAt: new Date().toISOString()
    });
    return true;
  } catch (error) {
    console.error("Error updating review status:", error);
    return false;
  }
};

export const deleteReview = async (reviewId: string) => {
  try {
    await deleteDoc(doc(db, REVIEWS_COLLECTION, reviewId));
    return true;
  } catch (error) {
    console.error("Error deleting review:", error);
    return false;
  }
};

export const updateHelpfulCount = async (reviewId: string) => {
  try {
    const reviewRef = doc(db, REVIEWS_COLLECTION, reviewId);
    await updateDoc(reviewRef, {
      helpfulCount: increment(1)
    });
    return true;
  } catch (error) {
    console.error("Error updating helpful count:", error);
    return false;
  }
};

export const addAdminReply = async (reviewId: string, reply: string) => {
  try {
    const reviewRef = doc(db, REVIEWS_COLLECTION, reviewId);
    await updateDoc(reviewRef, {
      adminReply: reply,
      updatedAt: new Date().toISOString()
    });
    return true;
  } catch (error) {
    console.error("Error adding admin reply:", error);
    return false;
  }
};

export const toggleFeatureReview = async (reviewId: string, isFeatured: boolean) => {
  try {
    const reviewRef = doc(db, REVIEWS_COLLECTION, reviewId);
    await updateDoc(reviewRef, {
      isFeatured,
      updatedAt: new Date().toISOString()
    });
    return true;
  } catch (error) {
    console.error("Error toggling feature review:", error);
    return false;
  }
};

export const togglePinReview = async (reviewId: string, isPinned: boolean) => {
  try {
    const reviewRef = doc(db, REVIEWS_COLLECTION, reviewId);
    await updateDoc(reviewRef, {
      isPinned,
      updatedAt: new Date().toISOString()
    });
    return true;
  } catch (error) {
    console.error("Error toggling pin review:", error);
    return false;
  }
};
