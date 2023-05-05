import { Review } from "@prisma/client";
import React from "react";
import ReviewCard from "./ReviewCard";

export default function RestaurantReviews({ reviews }: { reviews: Review[] }) {
  return (
    <div>
      <h1 className="font-bold text-3xl mt-10 mb-7 borber-b pb-5">
        What {reviews.length} {reviews.length > 0 ? "people are" : "person is"}{" "}
        saying
      </h1>
      <div>
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </div>
  );
}
