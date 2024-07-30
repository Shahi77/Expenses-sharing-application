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

export { addExpense };
