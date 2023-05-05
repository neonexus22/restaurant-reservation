import { Review } from "@prisma/client";

export const calculateReviewRatingAverage = (reviews: Review[]): number => {
  if (reviews.length === 0) return 0;
  return (
    reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
  );
};
