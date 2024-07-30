import mongoose, { Schema } from "mongoose";
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
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Expense = mongoose.model("Expense", expenseSchema);
export default Expense;
