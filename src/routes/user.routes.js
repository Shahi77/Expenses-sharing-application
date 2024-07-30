import express from "express";
import { createUser, getUserDetails } from "../controllers/user.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
const userRouter = express.Router();

userRouter.post("/", createUser);
userRouter.get("/:email", verifyJwt, getUserDetails);

export default userRouter;
