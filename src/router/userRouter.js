import express from "express";
import {
  addToCart,
  getAddToCart,
  getAddUsedCart,
  getAddUsedToCart,
  getCart,
  getJoin,
  getLogin,
  getLogout,
  getUserEdit,
  postAddToCart,
  postAddUsedCart,
  postAddUsedToCart,
  postDeleteNewCart,
  postDeleteUsedCart,
  postEditNewCart,
  postEditUsedCart,
  postJoin,
  postLogin,
  postLogout,
  postUserEdit,
} from "../controller/userController";
import { alreadyAuth, Auth } from "../middleware/auth";

const userRouter = express.Router();

userRouter.route("/join").all(alreadyAuth).get(getJoin).post(postJoin);
userRouter.route("/login").all(alreadyAuth).get(getLogin).post(postLogin);
userRouter.route("/logout").get(getLogout).post(postLogout);
userRouter.route("/editprofile").all(Auth).get(getUserEdit).post(postUserEdit);
userRouter.route("/cart").all(Auth).get(getCart);

userRouter.route("/add/cart").get(getAddToCart).post(postAddToCart);
userRouter
  .route("/add/used/cart/:id")
  .get(getAddUsedToCart)
  .post(postAddUsedToCart);

userRouter.route("/used/cart/edit").post(postEditUsedCart);
userRouter.route("/new/cart/edit").post(postEditNewCart);

userRouter.route("/used/cart/delete").post(postDeleteUsedCart);
userRouter.route("/new/cart/delete").post(postDeleteNewCart);

export default userRouter;
