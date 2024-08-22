import express from "express";
import {
  addToCart,
  getAddToCart,
  getCart,
  getJoin,
  getLogin,
  getLogout,
  getUserEdit,
  postAddToCart,
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

export default userRouter;
