import { User } from "../models/userModel.js";
import { ErrorHandler } from "../utils/ErrorHandler.js";
import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies["stripe-connect"];

    if (!token) return next(new ErrorHandler("Please login first", 401));

    const decodeToken = jwt.verify(token, "32o58j3298jrt309a8u5j09w8j50923");

    const findUser = await User.findById(decodeToken._id);

    if (!findUser) return next(new ErrorHandler("Please login first", 400));

    req.user = findUser;
    next();
  } catch (error) {
    return next(new ErrorHandler("Please login first", 401));
  }
};

export { isAuthenticated };
