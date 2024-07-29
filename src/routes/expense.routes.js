import express from "express";

const expenseRouter = express.Router();

expenseRouter.post("/", addExpense);
expenseRouter.get("/:userId", getUserExpense);
expenseRouter.get("/", getOverallExpense);
expenseRouter.get("/download", downloadBalanceSheet);

export default expenseRouter;
