import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
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

app.get("/", (req, res) => {
  res.send("Hello World!!!!");
});

app.listen(port, () => {
  console.log(`🔥app listening on http://localhost:${port}`);
});
