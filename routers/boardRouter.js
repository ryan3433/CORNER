import express from "express";
import {
  boardList,
  boardDetail,
  getWrite,
  postUpdate,
  getUpdate,
  deleteBoard,
  postWrite,
  search
} from "../controllers/boardControllers";
import {
  ensureAuthenticated,
  logoutRedirect,
  loginRedirect
} from "../middlewares";

const boardRouter = express.Router();

boardRouter.get("/search", search);

boardRouter.get("/", loginRedirect, logoutRedirect, (req, res) => {
  res.render("home");
});

boardRouter.get(
  "/board/:nation/pg:page",
  loginRedirect,
  logoutRedirect,
  boardList
);

boardRouter.get(
  "/board/:nation/idx:idx",
  loginRedirect,
  logoutRedirect,
  boardDetail
);

boardRouter.get("/write", logoutRedirect, ensureAuthenticated, getWrite);

boardRouter.post("/write_process", postWrite);

boardRouter.get(
  "/board/:nation/:idx/update",
  logoutRedirect,
  ensureAuthenticated,
  getUpdate
);

boardRouter.post("/update_process/:idx", postUpdate);

boardRouter.post("/board/:idx/delete", deleteBoard);

export default boardRouter;
