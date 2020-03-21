import express from "express";
import morgan from "morgan";
import bodyParser from "body-parser";
import { localsMiddleware } from "./middlewares";
import session from "express-session";
import passport from "passport";
import flash from "connect-flash";
const MySQLStore = require("express-mysql-session")(session);
import "./passport";
import userRouter from "./routers/userRouter";
import boardRouter from "./routers/boardRouter";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.set("view engine", "pug");

app.use("/static", express.static("static"));
app.use(morgan("dev"));
app.use(flash());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    //key: "ryuniCookie",
    secret: process.env.SASSION_PW,
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore({
      host: "localhost",
      port: 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: "mozo"
    })
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(localsMiddleware);
app.use(userRouter);
app.use(boardRouter);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  function(req, res) {
    res.redirect("/");
  }
);

app.get(
  "/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  (req, res) => {
    // Successful authentication, redirect home.
    res.redirect("/");
  }
);

const handleListen = () => console.log("✅ good job");

app.listen(5000, handleListen);
