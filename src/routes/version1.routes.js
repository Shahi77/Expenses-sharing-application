import { Router } from "express";
import userRouter from "./user.routes.js";
import expenseRouter from "./expense.routes.js";
import authRouter from "./auth.routes.js";

const v1Router = Router();

v1Router.use("/auth", authRouter);
v1Router.use("/user", userRouter);
v1Router.use("/expense", expenseRouter);

export default v1Router;
