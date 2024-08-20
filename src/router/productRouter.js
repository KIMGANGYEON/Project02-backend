import express from "express";
import {
  getProductEdit,
  getProductEditDetail,
  getProductUpload,
  postProductEdit,
  postProductEditDetail,
  postProductImage,
  postProductImageDelete,
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

productRouter
  .route("/edit/detail/:id")
  .all(Auth)
  .get(getProductEditDetail)
  .post(postProductEditDetail);

productRouter.post("/delete/image", postProductImageDelete);
productRouter.post("/image", postProductImage);

export default productRouter;
