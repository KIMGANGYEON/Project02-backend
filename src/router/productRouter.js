import express from "express";
import {
  getProductEdit,
  getProductUpload,
  postProductEdit,
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

productRouter
  .route("/edit")
  .all(Auth)
  .get(getProductEdit)
  .post(postProductEdit);

productRouter.post("/image", postProductImage);

export default productRouter;
