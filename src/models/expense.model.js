const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
      unique: true,
    },
    splitMethod: {
      type: String,
      enum: ["Equal", "Exact", "Percentage"],
      required: true,
    },
    payers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    amounts: [
      {
        type: mongoose.Types.Decimal128,
        required: true,
      },
    ],
    totalExpense: {
      type: mongoose.Types.Decimal128,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Expense = mongoose.model("Expense", expenseSchema);

module.exports = Expense;
