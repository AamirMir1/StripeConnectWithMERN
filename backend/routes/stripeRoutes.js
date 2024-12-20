import express from "express";
import {
  checkAccountStatusAndUpdate,
  createAccountLink,
  payoutToSellers,
  processPayment,
} from "../controllers/stripeController.js";
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router();

router.route("/createAccountLink").post(isAuthenticated, createAccountLink);
router.route("/process/payment").post(isAuthenticated, processPayment);
router.route("/payoutToSellers").post(isAuthenticated, payoutToSellers);

router
  .route("/checkAndUpdateStatus")
  .put(isAuthenticated, checkAccountStatusAndUpdate);

export default router;
