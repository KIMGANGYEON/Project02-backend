import express from "express";
import {
  getProductUpload,
  postProductImage,
  postProductUpload,
} from "../controller/productController";
import { Auth } from "../middleware/auth";

const productRouter = express.Router();

productRouter
  .route("/upload")
  .all(Auth)
  .get(getProductUpload)
  .post(postProductUpload);
productRouter.post("/image", postProductImage);

export default productRouter;
