import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import * as jose from "jose";
import validateSignup from "../../../validationSchema/signup.validation.schema";
import { getDbConnection } from "../../../utils/getDbConnection";
import { setCookie } from "cookies-next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const prisma = getDbConnection();
    const { firstName, lastName, email, city, phone, password } = req.body;

    const errors = validateSignup(req.body);

    if (errors.length > 0) {
      return res.status(400).json({ errorMessage: errors[0] });
    }

    const userWithEmail = await prisma.user.findUnique({
      where: { email },
    });

    if (userWithEmail) {
      return res.status(400).json({ errorMessage: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        first_name: firstName,
        last_name: lastName,
        password: hashedPassword,
        email,
        city,
        phone,
      },
    });

    const alg = "HS256";
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const token = await new jose.SignJWT({ email })
      .setProtectedHeader({ alg })
      .setExpirationTime("24h")
      .sign(secret);

    setCookie("jwt", token, { req, res, maxAge: 1000 * 60 * 60 * 24 });

    return res.status(200).json({
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      phone: user.phone,
      city: user.city,
    });
  }

  return res.status(404).json("Unknown endpoint.");
}
