import express from "express";
import { postProductUpload } from "../controller/productController";

const productRouter = express.Router();

productRouter.post("/upload", postProductUpload);

export default productRouter;
