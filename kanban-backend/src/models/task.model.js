import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    boardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Board",
      required: true
    },
    title: String,
    description: String,
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"]
    },
    dueDate: Date,
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    assignedToName: String,
    status: {
      type: String,
      enum: ["Todo", "InProgress", "Review", "Done"],
      default: "Todo"
    },
    position: Number,
    comments: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        text: String,
        createdAt: { type: Date, default: Date.now }
      }
    ],
    activityLog: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        action: String,
        timestamp: { type: Date, default: Date.now }
      }
    ]
  },
  { timestamps: true }
);

export const Task = mongoose.model("Task", taskSchema);