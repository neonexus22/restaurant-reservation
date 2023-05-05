import { NextApiResponse } from "next";
import { times } from "../../data";
import { getDbConnection } from "../../utils/getDbConnection";
import { Table } from "@prisma/client";

type FindAvailableTablesType = {
  restaurant: {
    tables: Table[];
    open_time: string;
    close_time: string;
  };
  day: string;
  time: string;
  res: NextApiResponse;
};

export const findAvailableTables = async ({
  restaurant,
  day,
  time,
  res,
}: FindAvailableTablesType) => {
  const prisma = getDbConnection();

  const searchTimes = times.find((t) => t.time === time)?.searchTimes;
  if (!searchTimes) {
    return res.status(404).json({ errorMessage: "Invalid data provided." });
  }

  const bookings = await prisma.booking.findMany({
    where: {
      booking_time: {
        gte: new Date(`${day}T${searchTimes[0]}`),
        lte: new Date(`${day}T${searchTimes[searchTimes.length - 1]}`),
      },
    },
    select: {
      number_of_people: true,
      booking_time: true,
      tables: true,
    },
  });

  const bookingTablesObj: { [key: string]: { [key: number]: true } } = {};

  bookings.forEach((booking) => {
    bookingTablesObj[booking.booking_time.toISOString()] =
      booking.tables.reduce(
        (obj, table) => ({
          ...obj,
          [table.table_id]: true,
        }),
        {}
      );
  });

  const tables = restaurant.tables;

  const searchTimewithTables = searchTimes.map((searchTime) => ({
    date: new Date(`${day}T${searchTime}`),
    time: searchTime,
    tables,
  }));

  searchTimewithTables.forEach((t) => {
    t.tables = t.tables.filter((table) => {
      const dateTime = t.date.toISOString();
      if (bookingTablesObj[dateTime]) {
        if (bookingTablesObj[dateTime][table.id]) return false;
      }
      return true;
    });
  });

  return searchTimewithTables;
};
