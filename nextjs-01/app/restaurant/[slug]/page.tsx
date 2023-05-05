import { Review } from "@prisma/client";
import RestaurantNavbar from "./components/RestaurantNavbar";
import RestaurantTitle from "./components/RestaurantTitle";
import RestaurantRating from "./components/RestaurantRating";
import RestaurantDescription from "./components/RestaurantDescription";
import RestaurantImages from "./components/RestaurantImages";
import RestaurantReviews from "./components/RestaurantReviews";
import ReservationCard from "./components/ReservationCard";
import { getDbConnection } from "../../../utils/getDbConnection";
import { notFound } from "next/navigation";

const prisma = getDbConnection();

interface Restaurant {
  id: number;
  name: string;
  slug: string;
  images: string[];
  description: string;
  reviews: Review[];
  open_time: string;
  close_time: string;
}

const fetchRestaurantBySlug = async (slug: string): Promise<Restaurant> => {
  const restaurant = await prisma.restaurant.findUnique({
    where: { slug },
    select: {
      id: true,
      name: true,
      slug: true,
      images: true,
      description: true,
      reviews: true,
      open_time: true,
      close_time: true,
    },
  });
  if (!restaurant) {
    // throw new Error("No Restaurant Found");
    notFound();
  }
  return restaurant;
};

async function RestaurantDetails({ params }: { params: { slug: string } }) {
  const restaurant = await fetchRestaurantBySlug(params.slug);

  return (
    <>
      <div className="bg-white w-[70%] rounded p-3 shadow">
        <RestaurantNavbar slug={restaurant.slug} />
        <RestaurantTitle title={restaurant.name} />
        <RestaurantRating reviews={restaurant.reviews} />
        <RestaurantDescription description={restaurant.description} />
        <RestaurantImages images={restaurant.images} />
        <RestaurantReviews reviews={restaurant.reviews} />
      </div>
      <div className="w-[27%] relative text-reg">
        <ReservationCard
          openTime={restaurant.open_time}
          closeTime={restaurant.close_time}
          slug={restaurant.slug}
        />
      </div>
    </>
  );
}

export default RestaurantDetails;
