export type ReviewStatus = 'pending' | 'approved' | 'rejected';

export interface Review {
  id: string;
  rating: number;
  title: string;
  message: string;
  images: string[];
  status: ReviewStatus;
  helpfulCount: number;
  isFeatured: boolean;
  isPinned: boolean;
  adminReply?: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  orderId?: string;
  productId?: string;
  productName?: string;
  isVerified: boolean;
  isAnonymous: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: { [key: number]: number };
  recommendedPercentage: number;
}
