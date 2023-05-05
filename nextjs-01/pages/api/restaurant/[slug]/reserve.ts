import { NextApiRequest, NextApiResponse } from "next";
import { getDbConnection } from "../../../../utils/getDbConnection";
import { findAvailableTables } from "../../../../services/restaurant/findAvailableTables";

// this is my test note
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const prisma = getDbConnection();
    const { slug, day, time, partySize } = req.query as {
      slug: string;
      day: string;
      time: string;
      partySize: string;
    };

    const {
      bookerEmail,
      bookerPhone,
      bookerFirstName,
      bookerLastName,
      bookerOccasion,
      bookerRequest,
    } = req.body;

    const restaurant = await prisma.restaurant.findUnique({
      where: {
        slug,
      },
      select: {
        id: true,
        tables: true,
        open_time: true,
        close_time: true,
      },
    });

    if (!restaurant) {
      return res.status(404).json({ errorMessage: "Restaurant not found." });
    }

    if (
      new Date(`${day}T${time}`) < new Date(`${day}T${restaurant.open_time}`) ||
      new Date(`${day}T${time}`) > new Date(`${day}T${restaurant.close_time}`)
    ) {
      return res
        .status(404)
        .json({ errorMessage: "Restaurant is not open at that time." });
    }

    const searchTimeswithTables = await findAvailableTables({
      restaurant,
      day,
      time,
      res,
    });

    if (!searchTimeswithTables) {
      return res.status(404).json({ errorMessage: "Invalid data provided." });
    }

    const searchTimeWithTables = searchTimeswithTables.find(
      (t) => t.date.toISOString() === new Date(`${day}T${time}`).toISOString()
    );

    const tablesCount: {
      2: number[];
      4: number[];
    } = {
      2: [],
      4: [],
    };

    searchTimeWithTables?.tables.forEach((t) => {
      if (t.seats === 2) {
        tablesCount[2].push(t.id);
      } else {
        tablesCount[4].push(t.id);
      }
    });

    const tablesToBook: number[] = [];
    let seatsRemaining = parseInt(partySize);

    while (seatsRemaining > 0) {
      if (seatsRemaining >= 3) {
        if (tablesCount[4].length > 0) {
          tablesToBook.push(tablesCount[4][0]);
          tablesCount[4].shift();
          seatsRemaining -= 4;
        } else {
          tablesToBook.push(tablesCount[2][0]);
          tablesCount[2].shift();
          seatsRemaining -= 2;
        }
      } else {
        if (tablesCount[2].length > 0) {
          tablesToBook.push(tablesCount[2][0]);
          tablesCount[2].shift();
          seatsRemaining -= 2;
        } else {
          tablesToBook.push(tablesCount[4][0]);
          tablesCount[4].shift();
          seatsRemaining -= 4;
        }
      }
    }

    const booking = await prisma.booking.create({
      data: {
        number_of_people: parseInt(partySize),
        booking_time: new Date(`${day}T${time}`),
        booker_email: bookerEmail,
        booker_phone: bookerPhone,
        booker_first_name: bookerFirstName,
        booker_last_name: bookerLastName,
        restaurant_id: restaurant.id,
        booker_occasion: bookerOccasion,
        booker_request: bookerRequest,
      },
    });

    const bookingsOnTableData = tablesToBook.map((table_id) => ({
      table_id,
      booking_id: booking.id,
    }));

    await prisma.bookingsOnTables.createMany({
      data: bookingsOnTableData,
    });

    res.send({ booking });
  }
}
