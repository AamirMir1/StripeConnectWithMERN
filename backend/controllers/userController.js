import { User } from "../models/userModel.js";
import { ErrorHandler, TryCatch } from "../utils/ErrorHandler.js";
import jwt from "jsonwebtoken";

const registerUser = TryCatch(async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return next(new ErrorHandler("Please fill all the fields", 400));

  const findExisitingUser = await User.findOne({ email });

  if (findExisitingUser)
    return next(new ErrorHandler("User already exists", 400));

  const newUser = await User.create({ name, email, password });

  const token = await jwt.sign(
    { _id: newUser._id },
    "32o58j3298jrt309a8u5j09w8j50923",
    {
      expiresIn: 90 * 24 * 60 * 60 * 1000,
    }
  );

  res.cookie("stripe-connect", token, {
    httpOnly: true,
  });

  return res.status(201).json({
    success: true,
    message: "User created successfully",
    newUser,
  });
});

const loginUser = TryCatch(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password)
    return next(new ErrorHandler("Please fill all the fields", 400));

  const findUser = await User.findOne({ email });

  if (!findUser) return next(new ErrorHandler("Invalid login details", 400));

  const comparePassword = await findUser.comparePassword(password);

  if (!comparePassword)
    return next(new ErrorHandler("Invalid login details", 400));

  const token = await jwt.sign(
    { _id: findUser._id },
    "32o58j3298jrt309a8u5j09w8j50923",
    {
      expiresIn: 90 * 24 * 60 * 60 * 1000,
    }
  );

  res.cookie("stripe-connect", token, {
    httpOnly: true,
  });

  return res.status(200).json({
    success: true,
    message: "Logged in successfully",
    user: findUser,
  });
});

const getMyProfile = TryCatch(async (req, res) => {
  const user = await User.findById(req.user._id);

  return res.status(200).json({
    success: true,
    user,
  });
});

const logout = TryCatch(async (req, res) => {
  res.cookie("stripe-connect", null);

  return res.status(200).json({
    success: true,
    message: "Logged Out Successfully",
  });
});

export { registerUser, loginUser, getMyProfile, logout };
