// src/middlewares/attachUser.js
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const attachUserIfTokenExists = async (req, res, next) => {
  const auth = req.headers.authorization || "";      // ← look in Authorization header
  if (auth.startsWith("Bearer ")) {
    const token = auth.slice("Bearer ".length).trim();
    try {
      const { userId } = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      req.user = await User.findById(userId);
    } catch (err) {
      // invalid token → just leave req.user undefined
      console.warn("attachUser: invalid token", err.message);
      req.user = null;
    }
  }
  next();
};
