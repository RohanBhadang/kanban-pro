import {
  createTaskService,
  getTasksService,
  updateTaskService,
  deleteTaskService,
  moveTaskService
} from "../services/task.service.js";
import { asyncHandler } from "../middlewares/async.middleware.js";
import { Task } from "../models/task.model.js";
import { Board } from "../models/board.model.js";
import { ApiError } from "../utils/apiError.js";

const checkTaskAccess = async (taskId, userId, requiredRoles = ["admin", "editor"]) => {
  const task = await Task.findById(taskId);
  if (!task) throw new ApiError(404, "Task not found");

  const board = await Board.findById(task.boardId);
  if (!board) throw new ApiError(404, "Board not found");

  const isAdmin = board.createdBy.toString() === userId.toString();
  const member = board.members.find(m => m.user.toString() === userId.toString());

  if (!isAdmin && (!member || !requiredRoles.includes(member.role))) {
    throw new ApiError(403, "Insufficient permissions");
  }

  return { task, board };
};

export const createTask = asyncHandler(async (req, res) => {
  const task = await createTaskService({
    ...req.body,
    activityLog: [{ user: req.user._id, action: "Task created" }]
  });
  
  const io = req.app.get("io");
  io.to(task.boardId.toString()).emit("task_created", task);
  
  res.status(201).json({ success: true, data: task });
});

export const getTasks = asyncHandler(async (req, res) => {
  const tasks = await getTasksService(req.params.boardId);
  res.json({ success: true, data: tasks });
});

export const updateTask = asyncHandler(async (req, res) => {
  await checkTaskAccess(req.params.id, req.user._id);
  
  const task = await updateTaskService(req.params.id, {
    ...req.body,
    $push: {
      activityLog: { user: req.user._id, action: "Task updated" }
    }
  });

  const io = req.app.get("io");
  io.to(task.boardId.toString()).emit("task_updated", task);

  res.json({ success: true, data: task });
});

export const deleteTask = asyncHandler(async (req, res) => {
  const { task } = await checkTaskAccess(req.params.id, req.user._id);
  const boardId = task.boardId.toString();
  
  await deleteTaskService(req.params.id);

  const io = req.app.get("io");
  io.to(boardId).emit("task_deleted", { taskId: req.params.id, boardId });

  res.json({ success: true, message: "Task deleted" });
});

export const moveTask = asyncHandler(async (req, res) => {
  const { task: existingTask } = await checkTaskAccess(req.body.taskId, req.user._id);

  const task = await moveTaskService({
    ...req.body,
    userId: req.user._id
  });

  const io = req.app.get("io");
  io.to(task.boardId.toString()).emit("task_moved", {
    taskId: task._id,
    status: task.status,
    position: task.position,
    boardId: task.boardId
  });

  res.json({ success: true, data: task });
});