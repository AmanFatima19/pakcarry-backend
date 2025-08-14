import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import path from "path";
import { fileURLToPath } from "url";
import userRouter from "./routes/userRouter.js";
import contactRouter from "./routes/contact.js";
import tripRouter from "./routes/trip.js";
import feedbackRouter from "./routes/feedback.js";
import orderRouter from "./routes/orderRouter.js";
dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(express.json());
app.use(cors());
app.use("/", userRouter);
app.use("/contact", contactRouter);
app.use("/feedback", feedbackRouter);
app.use("/trip", tripRouter);
app.use("/orders", orderRouter);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error("Nodemailer connection failed:", error);
  } else {
    console.log("Nodemailer connected now");
  }
});

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDb database connected");
  } catch (err) {
    console.log("MongoDb database connection failed");
    console.log(err);
  }
};

app.listen(process.env.PORT, () => {
  connect();
  console.log(`Server is running on port ${process.env.PORT}`);
});
