import Expense from "../models/expense.model.js";
import User from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import ExcelJS from "exceljs";
import { fileURLToPath } from "url";
import { dirname } from "path";
import fs from "fs";
import path from "path";

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

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Balance Sheet");

  // Set up headers
  worksheet.columns = [
    { header: "Description", key: "description", width: 30 },
    { header: "Split Method", key: "splitMethod", width: 15 },
    { header: "Total Expense", key: "totalExpense", width: 15 },
    { header: "Payers", key: "payers", width: 30 },
    { header: "Amounts", key: "amounts", width: 20 },
  ];

  // Add individual expenses
  expenses.forEach((expense) => {
    worksheet.addRow({
      description: expense.description,
      splitMethod: expense.splitMethod,
      totalExpense: expense.totalExpense,
      payers: expense.payers.map((payer) => payer.name).join(", "),
      amounts: expense.amounts.join(", "),
    });
  });

  // Calculate overall expenses for all users
  const overallExpenses = {};
  expenses.forEach((expense) => {
    expense.payers.forEach((payer, index) => {
      if (!overallExpenses[payer.name]) {
        overallExpenses[payer.name] = 0;
      }
      overallExpenses[payer.name] =
        Number(expense.amounts[index]) + Number(overallExpenses[payer.name]);
    });
  });

  // Add a blank row for separation
  worksheet.addRow([]);

  // Add overall expenses section
  worksheet.addRow(["Overall Expenses"]);
  worksheet.addRow(["User", "Total Amount"]);
  Object.entries(overallExpenses).forEach(([user, amount]) => {
    worksheet.addRow([user, amount]);
  });

  // Style the worksheet
  worksheet.getRow(1).font = { bold: true };
  worksheet.getRow(
    worksheet.rowCount - Object.keys(overallExpenses).length - 1
  ).font = { bold: true };

  // Prepare file for download
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const tempDir = path.join(__dirname, "..", "..", "temp");
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  const excelFilePath = path.join(tempDir, "balance_sheet.xlsx");

  await workbook.xlsx.writeFile(excelFilePath);

  const fileContent = fs.readFileSync(excelFilePath);

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=balance_sheet.xlsx"
  );

  res.send(fileContent);

  console.log(`Excel file saved at: ${excelFilePath}`);
});

export { addExpense, getUserExpenses, getAllExpenses, downloadBalanceSheet };
