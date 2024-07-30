import ApiError from "../utils/ApiError.js";

const validateExpense = (req, res, next) => {
  const { description, splitMethod, payerEmails, amounts, totalExpense } =
    req.body;

  if (
    !description ||
    !splitMethod ||
    !payerEmails ||
    !amounts ||
    !totalExpense
  ) {
    return next(new ApiError(400, "All fields are required."));
  }

  // Validate that amounts match payerEmails length
  if (payerEmails.length !== amounts.length) {
    return next(
      new ApiError(400, "Number of amounts must match number of payers.")
    );
  }

  // Validate percentages if the split method is Percentage
  if (splitMethod === "Percentage") {
    const totalPercentage = amounts.reduce((acc, amount) => acc + amount, 0);
    if (totalPercentage !== 100) {
      return next(new ApiError(400, "The percentages must add up to 100%."));
    }
  }

  next();
};

export default validateExpense;
