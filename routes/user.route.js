import express from "express";
import {
  getSearchUser,
  getUserByUsername,
  putUpdateUser,
  putUpdateAvatar,
} from "../controllers/user.controller.js";
import { AuthMiddleware } from "../middleware/auth.middleware.js";
import uploadPhoto from "../middleware/upload.middleware.js";

const userRouter = express.Router();

userRouter.get("/search", getSearchUser);

userRouter.get("/:username", getUserByUsername);

userRouter.put("/update-user", AuthMiddleware, putUpdateUser, putUpdateAvatar);

userRouter.put(
  "/update-user-photo",
  AuthMiddleware,
  uploadPhoto.single("image")
);

export default userRouter;
