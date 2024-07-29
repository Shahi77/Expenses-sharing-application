import express from "express";

const userRouter = express.Router();

userRouter.post("/", createUser);
userRouter.get("/:userId", getUserDetails);

export default userRouter;
