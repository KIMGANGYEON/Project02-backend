import express from "express";
import {
  getJoin,
  getLogin,
  getLogout,
  getUserEdit,
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

export default userRouter;
