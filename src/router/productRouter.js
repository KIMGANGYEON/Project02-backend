import express from "express";
import {
  getProductEdit,
  getProductEditDetail,
  getProductUpload,
  getUsedProduct,
  postProductDelete,
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
productRouter.delete("/delete/:id", postProductDelete);

//USED
productRouter.route("/used").get(getUsedProduct);

export default productRouter;
