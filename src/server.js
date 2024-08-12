import express from "express";
import session from "express-session";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRouter from "./router/userRouter";
dotenv.config();

const app = express();
const port = 4000;

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("✅mongoose connect");
  })
  .catch((error) => {
    console.error(error);
  });

app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.get("/", (req, res) => {
  res.send("hello");
});

app.use("/user", userRouter);

app.listen(port, () => {
  console.log(`🔥app listening on http://localhost:${port}`);
});
