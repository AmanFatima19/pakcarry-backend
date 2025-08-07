const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const userRouter = require("./routes/userRouter");
const app = express();
const nodemailer = require("nodemailer"); // Add this line

// Middlewares
app.use(express.json());
app.use(cors());

// Routes
app.use("/", userRouter);

// Nodemailer setup and connection check
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify(function (error, success) {
  if (error) {
    console.error("Nodemailer connection failed:", error);
  } else {
    console.log("Nodemailer connected now"); // This will show in your terminal
  }
});

// Database connection
const connect = () => {
  try {
    mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDb database connected");
  } catch (err) {
    console.log("MongoDb database connection failed");
    console.log(err);
  }
};
// Server listening
app.listen(process.env.PORT, () => {
  connect();
  console.log(`Server is running on port ${process.env.PORT}`);
});
