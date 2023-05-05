import { NextApiRequest, NextApiResponse } from "next";
import { times } from "../../../../data";
import { getDbConnection } from "../../../../utils/getDbConnection";
import { findAvailableTables } from "../../../../services/restaurant/findAvailableTables";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const prisma = getDbConnection();

    const { slug, day, time, partySize } = req.query as {
      slug: string;
      day: string;
      time: string;
      partySize: string;
    };

    if (!day || !time || !partySize) {
      return res.status(404).json({ errorMessage: "Invalid data provided." });
    }

    const restaurant = await prisma.restaurant.findUnique({
      where: {
        slug,
      },
      select: {
        tables: true,
        open_time: true,
        close_time: true,
      },
    });

    if (!restaurant) {
      return res.status(404).json({ errorMessage: "Invalid data provided." });
    }

    const searchTimewithTables = await findAvailableTables({
      restaurant,
      day,
      time,
      res,
    });

    if (!searchTimewithTables) {
      return res.status(404).json({ errorMessage: "Invalid data provided." });
    }

    const availabilities = searchTimewithTables
      .map((t) => {
        const sumSeats = t.tables.reduce((acc, table) => acc + table.seats, 0);
        return {
          time: t.time,
          available: sumSeats >= parseInt(partySize),
        };
      })
      .filter((available) => {
        const isAfterOpeningHour =
          new Date(`${day}T${available.time}`) >=
          new Date(`${day}T${restaurant.open_time}`);

        const isBeforeClosingHour =
          new Date(`${day}T${available.time}`) <=
          new Date(`${day}T${restaurant.close_time}`);

        return isAfterOpeningHour && isBeforeClosingHour;
      });

    res.json(availabilities);
  }
}

//vivaan-fine-indian-cuisine-ottawa
