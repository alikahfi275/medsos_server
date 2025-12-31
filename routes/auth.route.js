import express from "express";
import { GetUser, Login, Register } from "../controllers/auth.controller.js";
import { AuthMiddleware } from "../middleware/auth.middleware.js";

const AuthRouter = express.Router();

AuthRouter.post("/register", Register);

AuthRouter.post("/login", Login);

export default AuthRouter;
