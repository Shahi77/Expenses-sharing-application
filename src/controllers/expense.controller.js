import Expense from "../models/expense.model.js";
import User from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

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

// TODO: Download balance sheet
const downloadBalanceSheet = asyncHandler(async (req, res) => {
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {},
        "Balance sheet download feature not implemented yet"
      )
    );
});

export { addExpense, getUserExpenses, getAllExpenses, downloadBalanceSheet };
