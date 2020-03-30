import "@babel/polyfill";
import AWS from "aws-sdk";
import express from "express";
import morgan from "morgan";
import methodOverride from "method-override";
import bodyParser from "body-parser";
import { localsMiddleware } from "./middlewares";
import session from "express-session";
import helmet from "helmet";
import path from "path";
import passport from "passport";
import flash from "connect-flash";
const MySQLStore = require("express-mysql-session")(session);
import "./passport";
import userRouter from "./routers/userRouter";
import boardRouter from "./routers/boardRouter";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const ssm = new AWS.SSM();
const params = {
  Name: "config",
  WithDecryption: false
};

app.use(helmet());
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
app.use("/static", express.static(path.join(__dirname, "static")));
app.use(methodOverride());
app.use(morgan("dev"));
app.use(flash());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  ssm.getParameter(params, (err, data) => {
    if (err) {
      console.log(err, err.stack);
    } else {
      const config = JSON.parse(data.Parameter.Value);

      session({
        //key: "ryuniCookie",
        secret: config.SASSION_PW,
        resave: false,
        saveUninitialized: false,
        store: new MySQLStore({
          host: "localhost",
          port: 3306,
          user: config.DB_USER,
          password: config.DB_PASSWORD,
          database: "mozo"
        })
      });
    }
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(localsMiddleware);
app.use(userRouter);
app.use(boardRouter);

const handleListen = () => console.log("✅ good job");

app.listen(5000, handleListen);
