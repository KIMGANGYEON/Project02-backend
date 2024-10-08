import express from "express";
import session from "express-session";
import cors from "cors";
import dotenv from "dotenv";
import MongoStore from "connect-mongo";
import mongoose from "mongoose";
import userRouter from "./router/userRouter";
import path from "path";
import productRouter from "./router/productRouter";

dotenv.config();

const app = express();
const port = 4000;

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("✅mongoose connect");
  })
  .catch((error) => {
    console.error(error);
  });

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.static(path.join(__dirname, "../uploads")));
app.use(express.static(path.join(__dirname, "../edit")));
app.use(express.static(path.join(__dirname, "../uploads_temp")));

app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URL,
      collection: "sessions",
    }),
    cookie: {
      httpOnly: true,
    },
  })
);

app.get("/", (req, res) => {
  res.send("hello");
});
app.use("/user", userRouter);
app.use("/product", productRouter);

app.listen(port, () => {
  console.log(`🔥app listening on http://localhost:${port}`);
});
