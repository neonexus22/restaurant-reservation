"use client";
import React from "react";
import { Review } from "@prisma/client";
import StarOutlinedIcon from "@mui/icons-material/StarOutlined";
import StarHalfOutlinedIcon from "@mui/icons-material/StarHalfOutlined";
import StarBorderOutlinedIcon from "@mui/icons-material/StarBorderOutlined";

import { calculateReviewRatingAverage } from "../../utils/calculateReviewRatingAverage";

export default function Stars({
  reviews,
  rating,
}: {
  reviews: Review[];
  rating?: number;
}) {
  const reviewRating = rating || calculateReviewRatingAverage(reviews);
  const renderStars = () => {
    const stars: any[] = [];
    for (let i = 0; i < 5; i++) {
      const diff = parseFloat((reviewRating - i).toFixed(1));
      if (diff >= 1) stars.push(<StarOutlinedIcon color="error" />);
      else if (diff > 0 && diff < 1) {
        if (diff <= 0.2) stars.push(<StarBorderOutlinedIcon color="error" />);
        else if (diff > 0.2 && diff <= 0.6)
          stars.push(<StarHalfOutlinedIcon color="error" />);
        else stars.push(<StarOutlinedIcon color="error" />);
      } else stars.push(<StarBorderOutlinedIcon color="error" />);
    }
    return stars;
  };

  return <div className="flex items-center">{renderStars()}</div>;
}
