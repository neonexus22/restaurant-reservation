import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import { getDbConnection } from "../../../utils/getDbConnection";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const prisma = getDbConnection();
    const bearerToken = req.headers.authorization;
    const token = bearerToken?.split(" ")[1] as string;

    const payload = jwt.decode(token) as { email: string };
    if (!payload || !payload?.email) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await prisma.user.findFirst({
      where: {
        email: payload.email,
      },
    });

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { password, created_at, updated_at, ...me } = user;

    res.status(200).json({
      id: me.id,
      firstName: me.first_name,
      lastName: me.last_name,
      email: me.email,
      city: me.city,
      phone: me.phone,
    });
  }

  return res.status(404).json({ errorMessage: "No route found" });
}
