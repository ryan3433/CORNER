import express from "express";
import {
  getJoin,
  postJoin,
  getLogin,
  postLogin,
  githubLogin,
  logout,
  userProfile,
  googleLogin
} from "../controllers/userControllers";
import {} from "../middlewares";

const userRouter = express.Router();

userRouter.get("/join", getJoin);

userRouter.post("/join", postJoin, postLogin);

userRouter.get("/login", getLogin);

userRouter.post("/login", postLogin);

userRouter.get("/auth/google", googleLogin);

userRouter.get("/auth/github", githubLogin);

userRouter.post("/logout", logout);

userRouter.get("/profile/:id", userProfile);

export default userRouter;
