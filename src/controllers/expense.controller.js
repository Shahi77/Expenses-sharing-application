import Expense from "../models/expense.model.js";
import User from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { createObjectCsvWriter } from "csv-writer";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import fs from "fs";

// Add an expense
const addExpense = asyncHandler(async (req, res) => {
  const { description, splitMethod, payerEmails, amounts, totalExpense } =
    req.body;

  if (
    !description ||
    !splitMethod ||
    !payerEmails ||
    !amounts ||
    !totalExpense
  ) {
    throw new ApiError(400, "All fields are required.");
  }

  const payers = [];
  for (const email of payerEmails) {
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new ApiError(404, `User with email ${email} not found.`);
    }
    payers.push(user._id);
  }
  try {
    const expense = await Expense.create({
      description,
      splitMethod,
      payers,
      amounts,
      totalExpense,
    });

    return res.status(201).json({
      success: true,
      message: "Expense created successfully",
      expense,
    });
  } catch (error) {
    if (error.code === 11000) {
      throw new ApiError(
        409,
        "An expense with this description already exists."
      );
    }
    throw new ApiError(500, "Something went wrong.");
  }
});

// Get individual user expenses
const getUserExpenses = asyncHandler(async (req, res) => {
  const { email } = req.params;
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  const expenses = await Expense.find({ payers: user._id });

  res
    .status(200)
    .json(
      new ApiResponse(200, expenses, "User expenses retrieved successfully")
    );
});

// Get all expenses
const getAllExpenses = asyncHandler(async (req, res) => {
  const expenses = await Expense.find();
  res
    .status(200)
    .json(
      new ApiResponse(200, expenses, "All expenses retrieved successfully")
    );
});

// Download Balance Sheet
const downloadBalanceSheet = asyncHandler(async (req, res) => {
  const expenses = await Expense.find().populate("payers", "name email");

  if (!expenses || expenses.length === 0) {
    throw new ApiError(404, "No expenses found.");
  }

  const csvData = expenses.map((expense) => ({
    description: expense.description,
    splitMethod: expense.splitMethod,
    totalExpense: expense.totalExpense.toString(),
    payers: expense.payers.map((payer) => payer.name).join(", "),
    amounts: expense.amounts.map((amount) => amount.toString()).join(", "),
  }));

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const tempDir = path.join(__dirname, "..", "..", "temp");
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  const csvFilePath = path.join(tempDir, "balance_sheet.csv");

  const csvWriter = createObjectCsvWriter({
    path: csvFilePath,
    header: [
      { id: "description", title: "Description" },
      { id: "splitMethod", title: "Split Method" },
      { id: "totalExpense", title: "Total Expense" },
      { id: "payers", title: "Payers" },
      { id: "amounts", title: "Amounts" },
    ],
  });
  await csvWriter.writeRecords(csvData);

  const fileContent = fs.readFileSync(csvFilePath);

  res.setHeader("Content-Type", "text/csv");
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=balance_sheet.csv"
  );

  res.send(fileContent);

  console.log(`CSV file saved at: ${csvFilePath}`);
});

export { addExpense, getUserExpenses, getAllExpenses, downloadBalanceSheet };
