import jwt from "jsonwebtoken";
import prisma from "../utils/prisma.js";

export const AuthMiddleware = async (req, res, next) => {
  const JWTSECRET = process.env.JWT_SECRET;

  try {
    const headers = req.headers.authorization;

    if (!headers) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = headers.split("Bearer ")[1];
    const decode = jwt.verify(token, JWTSECRET);

    const currentUser = await prisma.user.findUnique({
      where: {
        id: decode.id,
      },
    });

    req.user = {
      id: currentUser.id,
      fullname: currentUser.fullname,
      username: currentUser.username,
      email: currentUser.email,
      bio: currentUser.bio,
      image: currentUser.image,
    };

    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
