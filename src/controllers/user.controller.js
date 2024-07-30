import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

// Function to create a new user
const createUser = asyncHandler(async (req, res) => {
  const { name, email, mobile, password } = req.body;

  if ([name, email, mobile, password].some((field) => field?.trim() === "")) {
    throw new ApiError(
      400,
      "Name, email, mobile & Password are required fields"
    );
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, "User with email already exists");
  }

  const user = await User.create({ name, email, mobile, password });

  const createdUser = await User.findById(user._id).select("-password");
  return res
    .status(201)
    .json(
      new ApiResponse(201, { user: createdUser }, "User created successfully")
    );
});

// Function to retrieve user details by email
const getUserDetails = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.params.email }).select(
    "-password"
  );

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, { user }, "User details retrieved successfully")
    );
});

export { createUser, getUserDetails };
