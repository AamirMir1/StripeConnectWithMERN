import express from "express";
import {
  getMyProfile,
  loginUser,
  logout,
  registerUser,
} from "../controllers/userController.js";
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/me").get(isAuthenticated, getMyProfile);
router.route("/logout").post(isAuthenticated, logout);

export default router;
