import express from "express";
import {
  getUserEdit,
  postJoin,
  postLogin,
  postLogout,
  postUserEdit,
} from "../controller/userController";
import { Auth } from "../middleware/auth";

const userRouter = express.Router();

userRouter.post("/join", postJoin);
userRouter.post("/login", postLogin);
userRouter.post("/logout", postLogout);
userRouter.route("/editprofile").all(Auth).get(getUserEdit).post(postUserEdit);

export default userRouter;
