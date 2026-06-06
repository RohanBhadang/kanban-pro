import { Board } from "../models/board.model.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "./async.middleware.js";

export const checkBoardAccess = (requiredRoles = ["admin", "editor", "viewer"]) => {
  return asyncHandler(async (req, res, next) => {
    const boardId = req.params.boardId || req.body.boardId || req.query.boardId;

    if (!boardId) {
      throw new ApiError(400, "Board ID is required");
    }

    const board = await Board.findById(boardId);

    if (!board) {
      throw new ApiError(404, "Board not found");
    }

    // Check if user is the creator (always admin)
    if (board.createdBy.toString() === req.user._id.toString()) {
      req.board = board;
      req.userBoardRole = "admin";
      return next();
    }

    // Check if user is a member
    const member = board.members.find(
      (m) => m.user.toString() === req.user._id.toString()
    );

    if (!member) {
      throw new ApiError(403, "You are not a member of this board");
    }

    if (!requiredRoles.includes(member.role)) {
      throw new ApiError(403, "Insufficient permissions on this board");
    }

    req.board = board;
    req.userBoardRole = member.role;
    next();
  });
};
