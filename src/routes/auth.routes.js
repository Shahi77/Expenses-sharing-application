import { Router } from "express";
import {
  handleUserSignup,
  handleUserLogin,
  handleUserLogout,
} from "../controllers/auth.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const authRouter = Router();

authRouter.post("/signup", handleUserSignup);
authRouter.post("/login", handleUserLogin);
authRouter.post("/logout", verifyJwt, handleUserLogout);

export default authRouter;
