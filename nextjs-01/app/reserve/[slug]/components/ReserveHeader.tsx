import React from "react";
import { format } from "date-fns";
import {
  Time,
  convertToDisplayTime,
} from "../../../../utils/convertToDisplayTime";

type ReserveHeaderProps = {
  name: string;
  image: string;
  date: string;
  partySize: string;
};

export default function ReserveHeader({
  name,
  image,
  date,
  partySize,
}: ReserveHeaderProps) {
  const [day, time] = date.split("T");

  return (
    <div>
      <h3 className="font-bold">You are almost done!</h3>
      <div className="mt-5 flex">
        <img src={image} alt={name} className="w-32 h-24 rounded" />
        <div className="ml-4">
          <h1 className="text-3xl font-bold">{name}</h1>
          <div className="flex mt-3">
            <p className="mr-6">{format(new Date(day), "ccc, LLL d ")}</p>
            <p className="mr-6">{convertToDisplayTime(time as Time)}</p>
            <p className="mr-6">
              {partySize} {parseInt(partySize) > 1 ? "people" : "person"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
