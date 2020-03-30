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
const passport = require("passport");

const userRouter = express.Router();

userRouter.get("/join", getJoin);

userRouter.post("/join", postJoin, postLogin);

userRouter.get("/login", getLogin);

userRouter.post("/login", postLogin);

userRouter.get("/auth/google", googleLogin);

userRouter.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  function(req, res) {
    res.redirect(req.session.returnTo || "/");
    delete req.session.returnTo;
  }
);

userRouter.get("/auth/github", githubLogin);

userRouter.get(
  "/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  function(req, res) {
    res.redirect(req.session.returnTo || "/");
    delete req.session.returnTo;
  }
);

userRouter.post("/logout", logout);

userRouter.get("/profile/:id", userProfile);

export default userRouter;
