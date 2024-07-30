import express from "express";
import {
  addExpense,
  getUserExpenses,
  getAllExpenses,
  downloadBalanceSheet,
} from "../controllers/expense.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const expenseRouter = express.Router();

expenseRouter.post("/", verifyJwt, addExpense);
//expenseRouter.get("/:email", verifyJwt, getUserExpenses);
// expenseRouter.get("/", verifyJwt, getAllExpenses);
// expenseRouter.get("/download", verifyJwt, downloadBalanceSheet);

export default expenseRouter;
