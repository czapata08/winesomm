import dbConnect from "../../utils/db/dbConnect";
import User from "../../utils/db/models/user";
import jwt from "jsonwebtoken";
import { setCookie } from "cookies-next";
import { verifyPassword } from "../../utils/db/auth";

export default async function handler(req, res) {
  await dbConnect();

  let { email, password } = req.body;
  console.log("email" + email);

  if (req.method === "POST") {
    //find email
    const user = await User.findOne({ email });
    console.log(`authenticated user ${JSON.stringify(user)}`);

    if (!user) return res.status(422).json({ message: "Wrong email!" });

    const isValid = await verifyPassword(password, user.password);

    if (!isValid) {
      return res.status(422).json({ message: "Wrong Password!" });
    }
    const token = jwt.sign({ userId: user._id }, process.env.TOKEN_SECRET, {
      expiresIn: "1d",
    });

    console.log(`user created with ${token}`);

    setCookie("token", token, {
      req,
      res,
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    });

    res.status(200).json(user);
  } else {
    res.status(424).json({ message: "Invalid method!" });
  }
}
