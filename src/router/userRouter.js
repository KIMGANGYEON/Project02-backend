import express from "express";
import { postJoin, postLogin, postLogout } from "../controller/userController";
import { Auth } from "../middleware/auth";

const userRouter = express.Router();

userRouter.post("/join", postJoin);
userRouter.post("/login", postLogin);
userRouter.post("/logout", postLogout);

export default userRouter;
