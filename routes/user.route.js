import express from "express";
import {
  getSearchUser,
  getUserByUsername,
} from "../controllers/user.controller.js";

const userRouter = express.Router();

userRouter.get("/search", getSearchUser);

userRouter.get("/:username", getUserByUsername);

export default userRouter;
