import { EMAIL_REGEX } from "../constants.js";
import { AUTH_COOKIE_OPTIONS } from "../configs/authCookie.config.js";
import { generateToken } from "../utils/jwt.js";
import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const handleUserSignup = asyncHandler(async (req, res) => {
  const { name, email, mobile, password } = req.body; // Add mobile to the destructuring

  if ([name, email, mobile, password].some((field) => field?.trim() === "")) {
    throw new ApiError(
      400,
      "Name, email, mobile & Password are required fields"
    );
  }

  if (!EMAIL_REGEX.test(email)) {
    throw new ApiError(400, "Enter a valid email");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, "User with email already exists");
  }

  const user = await User.create({
    name,
    email,
    mobile, // Include mobile in the user creation
    password,
  });

  const createdUser = await User.findById(user?._id).select("-password");

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while creating the user!");
  }

  const accessToken = generateToken(createdUser._id);
  return res
    .status(201)
    .cookie("accessToken", accessToken, AUTH_COOKIE_OPTIONS)
    .json(
      new ApiResponse(
        201,
        {
          user: createdUser,
        },
        "User created successfully"
      )
    );
});

const handleUserLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if ([email, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "Email & Password are required fields");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User with the email doesn't exist");
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new ApiError(401, "Password incorrect");
  }

  const loggedInUser = await User.findById(user._id).select("-password");

  const accessToken = generateToken(user._id);
  return res
    .status(200)
    .cookie("accessToken", accessToken, AUTH_COOKIE_OPTIONS)
    .json(new ApiResponse(200, { loggedInUser }, "Logged in Successfully"));
});

const handleUserLogout = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .clearCookie("accessToken", AUTH_COOKIE_OPTIONS)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

export { handleUserSignup, handleUserLogin, handleUserLogout };
