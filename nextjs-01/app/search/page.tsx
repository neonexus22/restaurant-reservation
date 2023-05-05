import SearchHeader from "./components/SearchHeader";
import SearchSidebar from "./components/SearchSidebar";
import SearchRestaurantCard from "./components/SearchRestaurantCard";
import { Cuisine, PRICE, Location, Review } from "@prisma/client";
import { getDbConnection } from "../../utils/getDbConnection";

const prisma = getDbConnection();

const select = {
  id: true,
  name: true,
  main_image: true,
  price: true,
  cuisine: true,
  location: true,
  slug: true,
  reviews: true,
};

export type SearchRestaurantCardType = {
  id: number;
  name: string;
  main_image: string;
  price: PRICE;
  cuisine: Cuisine;
  location: Location;
  slug: string;
  reviews: Review[];
};

export type SearchParamsType = { city: string; cuisine: string; price: PRICE };

const fetchRestaurantsByCity = (searchParams: SearchParamsType) => {
  const where: any = {};
  if (searchParams.city) {
    where.location = { name: { equals: searchParams.city.toLowerCase() } };
  }
  if (searchParams.cuisine) {
    where.cuisine = { name: { equals: searchParams.cuisine.toLowerCase() } };
  }
  if (searchParams.price) {
    where.price = { equals: searchParams.price };
  }

  return prisma.restaurant.findMany({
    where,
    select,
  });
};

const selectIdAndName = {
  id: true,
  name: true,
};

const fetchLocations = async () => {
  const locations = await prisma.location.findMany({ select: selectIdAndName });
  return locations;
};
const fetchCuisines = async () => {
  const cuisines = await prisma.cuisine.findMany({ select: selectIdAndName });
  return cuisines;
};

export default async function page({
  searchParams,
}: {
  searchParams: SearchParamsType;
}) {
  const restaurants = await fetchRestaurantsByCity(searchParams);
  const locations = await fetchLocations();
  const cuisines = await fetchCuisines();

  return (
    <>
      <SearchHeader />
      <div className="flex py-4 m-auto w-2/3 justify-between items-start">
        <SearchSidebar
          locations={locations}
          cuisines={cuisines}
          searchParams={searchParams}
        />
        <div className="w-5/6">
          {restaurants.length > 0 ? (
            <>
              {restaurants.map((restaurant) => (
                <SearchRestaurantCard
                  key={restaurant.id}
                  restaurant={restaurant}
                />
              ))}
            </>
          ) : (
            <p>No restaurants found in {searchParams.city}</p>
          )}
        </div>
      </div>
    </>
  );
}
