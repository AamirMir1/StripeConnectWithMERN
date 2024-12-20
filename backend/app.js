import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { errorHandler } from "./middleware/errorHandler.js";
import { connectDb } from "./config/connectDb.js";
import userRoutes from "./routes/userRoutes.js";
import stripeRoutes from "./routes/stripeRoutes.js";

import Stripe from "stripe";
import dotenv from "dotenv";

const app = express();

connectDb();

dotenv.config();

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
    methods: ["GET", "PUT", "POST", "PATCH", "DELETE"],
  })
);

app.use(cookieParser());

app.use(express.json());

app.use("/user", userRoutes);
app.use("/stripe", stripeRoutes);

app.use(errorHandler);

app.listen(3000, () => {
  console.log(`Server is working on port:${3000}`);
});

export default app;
