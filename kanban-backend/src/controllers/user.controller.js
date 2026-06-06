import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../middlewares/async.middleware.js";

// @desc    Register user
// @route   POST /api/users/register
// @access  Public
export const registerUser = asyncHandler(async (req, res) => {
  const { name, username, email, password, role } = req.body;

  if (!name || !username || !email || !password) {
    throw new ApiError(400, "Please provide all required fields: name, username, email, password");
  }

  // Check if user exists
  const userExists = await User.findOne({ $or: [{ email }, { username }] });
  if (userExists) {
    throw new ApiError(400, "User already exists");
  }

  // First user registered becomes admin automatically
  const isFirstUser = (await User.countDocuments({})) === 0;
  const finalRole = isFirstUser ? "admin" : (role || "user");

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const user = await User.create({
    name,
    username,
    email,
    password: hashedPassword,
    role: finalRole
  });

  if (user) {
    res.status(201).json({
      success: true,
      token: generateToken(user._id),
      data: {
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } else {
    throw new ApiError(400, "Invalid user data");
  }
});

// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check for user email
  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      success: true,
      token: generateToken(user._id),
      data: {
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } else {
    throw new ApiError(401, "Invalid credentials");
  }
});

// @desc    Get current user
// @route   GET /api/users/me
// @access  Private
export const getMe = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: req.user
  });
});

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d"
  });
};

export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password");
  res.json({
    success: true,
    data: users
  });
});
