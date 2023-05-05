import React from "react";
import { Cuisine, Location, PRICE } from "@prisma/client";
import Link from "next/link";
import { SearchParamsType } from "search/page";

type SearchSidebarType = {
  locations: Pick<Location, "id" | "name">[];
  cuisines: Pick<Cuisine, "id" | "name">[];
  searchParams: SearchParamsType;
};

export default function SearchSidebar({
  locations,
  cuisines,
  searchParams,
}: SearchSidebarType) {
  const prices = [
    {
      label: "$",
      price: PRICE.CHEAP,
      styles: `border rounded-l`,
    },
    {
      label: "$$",
      price: PRICE.REGULAR,
      styles: `border-r border-t border-b`,
    },
    {
      label: "$$$",
      price: PRICE.EXPENSIVE,
      styles: `border-r border-t border-b rounded-r`,
    },
  ];

  return (
    <div className="w-1/5">
      <div className="border-b pb-4 flex flex-col">
        <h1 className="mb-2">Region</h1>
        {locations.map((location) => (
          <Link
            href={{
              pathname: "/search",
              query: { ...searchParams, city: location.name },
            }}
            key={location.id}
            className="font-light text-reg capitalize"
          >
            {location.name}
          </Link>
        ))}
      </div>
      <div className="border-b pb-4 mt-3 flex flex-col">
        <h1 className="mb-2">Cuisine</h1>
        {cuisines.map((cuisine) => (
          <Link
            href={{
              pathname: "/search",
              query: { ...searchParams, cuisine: cuisine.name },
            }}
            key={cuisine.id}
            className="font-light text-reg capitalize"
          >
            {cuisine.name}
          </Link>
        ))}
      </div>
      <div className="mt-3 pb-4">
        <h1 className="mb-2">Price</h1>
        <div className="flex">
          {prices.map(({ label, price, styles }) => (
            <Link
              href={{
                pathname: "/search",
                query: { ...searchParams, price },
              }}
              key={label}
              className={`w-full text-reg text-center font-light p-2 ${styles}`}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
