import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import * as jose from "jose";
import validateSignIn from "../../../validationSchema/signin.validation.schema";
import { getDbConnection } from "../../../utils/getDbConnection";
import { setCookie } from "cookies-next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const prisma = getDbConnection();
  if (req.method === "POST") {
    const { email, password } = req.body;
    const errors = validateSignIn(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ errorMessage: errors[0] });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res
        .status(401)
        .json({ errorMessage: "Email or password is incorrect" });
    }

    const hasPasswordMatch = await bcrypt.compare(password, user.password);
    if (!hasPasswordMatch) {
      return res
        .status(401)
        .json({ errorMessage: "Email or password is incorrect" });
    }

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
