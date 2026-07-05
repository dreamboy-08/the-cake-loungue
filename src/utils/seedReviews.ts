import { db } from './firebase';
import { collection, doc, writeBatch } from 'firebase/firestore';

const seedReviewsData = [
  {
    rating: 5,
    title: "Absolutely Delicious!",
    message: "The Belgian Chocolate Cake was amazing. Fresh, beautiful and delivered exactly on time. Everyone at the party loved it!",
    images: [],
    status: 'approved',
    helpfulCount: 12,
    isFeatured: true,
    isPinned: true,
    userId: "seed_user_1",
    userName: "Ananya Sharma",
    userAvatar: "https://i.pravatar.cc/150?u=Ananya",
    orderId: "ORD-12345",
    productId: "1",
    productName: "Belgian Chocolate Cake",
    isVerified: true,
    isAnonymous: false,
  },
  {
    rating: 5,
    title: "Best Red Velvet ever",
    message: "I've tried red velvet cakes from many places, but The Cake Lounge is on another level. The cream cheese frosting is perfect, not too sweet.",
    images: [],
    status: 'approved',
    helpfulCount: 8,
    isFeatured: true,
    isPinned: false,
    userId: "seed_user_2",
    userName: "Rohan Gupta",
    userAvatar: "https://i.pravatar.cc/150?u=Rohan",
    orderId: "ORD-67890",
    productId: "3",
    productName: "Red Velvet Cake",
    isVerified: true,
    isAnonymous: false,
  },
  {
    rating: 4,
    title: "Very good, but slight delay",
    message: "The Pineapple Cake was super fresh and tasty. The only reason for 4 stars is that the delivery was 15 minutes late, but the quality made up for it.",
    images: [],
    status: 'approved',
    helpfulCount: 5,
    isFeatured: false,
    isPinned: false,
    userId: "seed_user_3",
    userName: "Priya Patel",
    userAvatar: "https://i.pravatar.cc/150?u=Priya",
    orderId: "ORD-11223",
    productId: "5",
    productName: "Fresh Pineapple Cake",
    isVerified: true,
    isAnonymous: false,
  }
];

export const seedReviews = async () => {
  try {
    const batch = writeBatch(db);
    const reviewsCol = collection(db, 'reviews');

    seedReviewsData.forEach((reviewData) => {
      const reviewRef = doc(reviewsCol);
      const now = new Date().toISOString();
      batch.set(reviewRef, {
        ...reviewData,
        id: reviewRef.id,
        createdAt: now,
        updatedAt: now,
      });
    });

    await batch.commit();
    console.log("Successfully seeded reviews!");
    return true;
  } catch (error) {
    console.error("Error seeding reviews:", error);
    return false;
  }
};
