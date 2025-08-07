require("dotenv").config();
const express = require("express");
const connectDB = require("./database/connect");

const app = express();
const cors = require("cors");
const port = process.env.PORT;
const authRouter = require("./routes/userRouter");
const contactRouter = require("./routes/contact");
const feedbackRouter = require("./routes/feedback");
const tripRouter = require ("./routes/trip")
connectDB();

app.use(express.json());
app.use(cors());
app.use("/", authRouter);
app.use("/contact",contactRouter)
app.use("/feedback",feedbackRouter)
app.use("/trip",tripRouter)


app.listen(port, () => {
  console.log(`Server is up and listening on port ${port}`);
});
