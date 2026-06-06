import express from "express";
import {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  moveTask
} from "../controllers/task.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { checkBoardAccess } from "../middlewares/boardAccess.middleware.js";

const router = express.Router();

router.use(protect);

router.get("/:boardId", checkBoardAccess(["admin", "editor", "viewer"]), getTasks);
router.post("/", checkBoardAccess(["admin", "editor"]), createTask);
router.put("/move", moveTask); // Specific board check might be needed inside controller or by passing boardId in body
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

export default router;