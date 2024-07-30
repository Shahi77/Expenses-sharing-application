import express from "express";
import {
  addExpense,
  getUserExpenses,
  getAllExpenses,
  downloadBalanceSheet,
} from "../controllers/expense.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const expenseRouter = express.Router();

expenseRouter.get("/download", verifyJwt, downloadBalanceSheet);

expenseRouter.post("/", verifyJwt, addExpense);
expenseRouter.get("/:email", verifyJwt, getUserExpenses);
expenseRouter.get("/", verifyJwt, getAllExpenses);

export default expenseRouter;
