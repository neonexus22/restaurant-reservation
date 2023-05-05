"use client";
import DatePicker from "react-datepicker";
import { partySize as partySizes, times } from "../../../../data";
import { useState } from "react";
import useAvailabilities from "../../../../hooks/useAvailabilities";
import { CircularProgress } from "@mui/material";
import Link from "next/link";
import { convertToDisplayTime } from "../../../../utils/convertToDisplayTime";

type ReservationCardType = {
  openTime: string;
  closeTime: string;
  slug: string;
};

export default function ReservationCard({
  openTime,
  closeTime,
  slug,
}: ReservationCardType) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [time, setTime] = useState(openTime);
  const [partySize, setPartySize] = useState("2");
  const [day, setDay] = useState(new Date().toISOString().split("T")[0]);
  const { data, loading, error, fetchAvailabilities } = useAvailabilities();
  console.log({ data });

  const handleChangeDate = (date: Date | null) => {
    if (date) {
      setDay(date.toISOString().split("T")[0]);
      return setSelectedDate(date);
    }
    setSelectedDate(null);
  };

  const handleFindTime = () => {
    fetchAvailabilities({
      slug,
      day,
      time,
      partySize,
    });
  };

  const filterTimeByRestaurantOpenWindow = () => {
    const timesWithinWindow: typeof times = [];
    let isWithinWindow = false;

    times.forEach((time) => {
      if (time.time === openTime) {
        isWithinWindow = true;
      }
      if (isWithinWindow) {
        timesWithinWindow.push(time);
      }
      if (time.time === closeTime) {
        isWithinWindow = false;
      }
    });
    return timesWithinWindow;
  };

  return (
    <div className="fixed w-[15%] bg-white rounded p-3 shadow">
      <div className="text-center border-b pb-2 font-bold">
        <h4 className="mr-7 text-lg">Make a Reservation</h4>
      </div>
      <div className="my-3 flex flex-col">
        <label htmlFor="">Party size</label>
        <select
          name=""
          className="py-3 border-b font-light"
          id=""
          value={partySize}
          onChange={(e) => setPartySize(e.target.value)}
        >
          {partySizes.map((size) => (
            <option key={size.value} value={size.value}>
              {size.label}
            </option>
          ))}
        </select>
      </div>
      <div className="flex justify-between">
        <div className="flex flex-col w-[48%]">
          <label htmlFor="">Date</label>
          <DatePicker
            selected={selectedDate}
            onChange={handleChangeDate}
            className="py-3 border-b font-light w-28"
            dateFormat="MMMM d"
            wrapperClassName="w-[48%]"
          />
        </div>
        <div className="flex flex-col w-[48%]">
          <label htmlFor="">Time</label>
          <select
            name=""
            id=""
            className="py-3 border-b font-light"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          >
            {filterTimeByRestaurantOpenWindow().map((time) => (
              <option key={time.time} value={time.time}>
                {time.displayTime}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="mt-5">
        <button
          className="bg-red-600 rounded w-full px-4 text-white font-bold h-16 disabled:bg-slate-600"
          onClick={handleFindTime}
          disabled={loading}
        >
          {loading ? <CircularProgress color="inherit" /> : "Find a Time"}
        </button>
      </div>

      {data && data?.length > 0 && (
        <div className="mt-4">
          <p>Select a time</p>
          <div className="flex flex-wrap mt-2">
            {data.map((time) =>
              time.available ? (
                <Link
                  key={time.time}
                  href={`/reserve/${slug}?date=${day}T${time.time}&partySize=${partySize}`}
                  className="bg-red-600 cursor-pointer p-2 w-24 text-center text-white mb-3 mr-3 rounded "
                >
                  <p className="text-sm font-bold">
                    {convertToDisplayTime(time.time)}
                  </p>
                </Link>
              ) : (
                <div
                  key={time.time}
                  className="bg-slate-500 cursor-pointer p-2 w-24 text-center text-white mb-3 mr-3 rounded "
                >
                  <p className="text-sm font-bold">
                    {convertToDisplayTime(time.time)}
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}
