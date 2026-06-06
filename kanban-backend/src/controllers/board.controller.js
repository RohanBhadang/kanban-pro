import { Board } from "../models/board.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../middlewares/async.middleware.js";

// @desc    Create board
// @route   POST /api/boards
// @access  Private
export const createBoard = asyncHandler(async (req, res) => {
  const { title } = req.body;

  const board = await Board.create({
    title,
    createdBy: req.user._id,
    members: [{ user: req.user._id, role: "admin" }]
  });

  res.status(201).json({
    success: true,
    data: board
  });
});

// @desc    Get all boards for user
// @route   GET /api/boards
// @access  Private
export const getBoards = asyncHandler(async (req, res) => {
  const boards = await Board.find({
    $or: [{ createdBy: req.user._id }, { "members.user": req.user._id }]
  }).populate("createdBy", "name username avatar");

  res.json({
    success: true,
    data: boards
  });
});

// @desc    Get single board
// @route   GET /api/boards/:boardId
// @access  Private (checked by middleware)
export const getBoardById = asyncHandler(async (req, res) => {
  const board = await Board.findById(req.params.boardId)
    .populate("createdBy", "name username avatar")
    .populate("members.user", "name username email avatar");

  res.json({
    success: true,
    data: board
  });
});

// @desc    Invite member to board
// @route   POST /api/boards/:boardId/invite
// @access  Private (Admin/Editor only)
export const inviteMember = asyncHandler(async (req, res) => {
  const { emailOrUsername, role } = req.body;
  const board = req.board;

  const userToInvite = await User.findOne({
    $or: [{ email: emailOrUsername }, { username: emailOrUsername }]
  });

  if (!userToInvite) {
    throw new ApiError(404, "User not found");
  }

  // Check if user is already a member
  const isMember = board.members.some(
    (m) => m.user.toString() === userToInvite._id.toString()
  );

  if (isMember) {
    throw new ApiError(400, "User is already a member of this board");
  }

  board.members.push({ user: userToInvite._id, role: role || "editor" });
  await board.save();

  res.json({
    success: true,
    message: "Member added successfully"
  });
});