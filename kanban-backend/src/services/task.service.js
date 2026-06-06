import { Task } from "../models/task.model.js";
import { User } from "../models/user.model.js";

const resolveAssignedUser = async (assignedTo, assignedToName) => {
  if (assignedTo) {
    return await User.findById(assignedTo);
  }

  if (assignedToName) {
    return await User.findOne({
      $or: [{ name: assignedToName }, { username: assignedToName }]
    });
  }

  return null;
};

export const createTaskService = async (data) => {
  const { assignedTo, assignedToName, ...payload } = data;
  let user = null;

  if (assignedTo || assignedToName) {
    user = await resolveAssignedUser(assignedTo, assignedToName);
    if (!user) {
      throw new Error("Assigned user not found");
    }

    payload.assignedTo = user._id;
    payload.assignedToName = user.name || user.username;
  }

  return await Task.create(payload);
};

export const getTasksService = async (boardId) => {
  return await Task.find({ boardId })
    .populate("assignedTo", "name username email")
    .sort({ position: 1 });
};

export const updateTaskService = async (taskId, data) => {
  const task = await Task.findById(taskId);
  if (!task) throw new Error("Task not found");

  const { assignedTo, assignedToName, ...updates } = data;

  if (assignedTo || assignedToName) {
    const user = await resolveAssignedUser(assignedTo, assignedToName);
    if (!user) {
      throw new Error("Assigned user not found");
    }

    task.assignedTo = user._id;
    task.assignedToName = user.name || user.username;
  } else if (assignedTo === "" || assignedTo == null) {
    task.assignedTo = undefined;
    task.assignedToName = undefined;
  }

  Object.entries(updates).forEach(([key, value]) => {
    if (value !== undefined) {
      task[key] = value;
    }
  });

  return await task.save();
};

export const deleteTaskService = async (taskId) => {
  const task = await Task.findByIdAndDelete(taskId);
  if (!task) throw new Error("Task not found");
  return task;
};

export const moveTaskService = async ({ taskId, status, position, userId }) => {
  const task = await Task.findById(taskId);

  if (!task) throw new Error("Task not found");

  const oldStatus = task.status;
  task.status = status;
  task.position = position;

  if (userId) {
    task.activityLog.push({
      user: userId,
      action: `Moved from ${oldStatus} to ${status}`
    });
  }

  return await task.save();
};