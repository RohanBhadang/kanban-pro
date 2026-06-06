import express from "express";
import {
  createBoard,
  getBoards,
  getBoardById,
  inviteMember
} from "../controllers/board.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { checkBoardAccess } from "../middlewares/boardAccess.middleware.js";

const router = express.Router();

router.use(protect);

router.post("/", createBoard);
router.get("/", getBoards);
router.get("/:boardId", checkBoardAccess(["admin", "editor", "viewer"]), getBoardById);
router.post("/:boardId/invite", checkBoardAccess(["admin", "editor"]), inviteMember);

export default router;