import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import boardRoutes from "./routes/board.routes.js";
import taskRoutes from "./routes/task.routes.js";
import userRoutes from "./routes/user.routes.js";

// IMPORTANT: error middleware import
import { errorMiddleware } from "./middlewares/error.middleware.js";

const app = express();

// middlewares
app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(morgan("dev"));

// routes
app.use("/api/boards", boardRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/users", userRoutes);

// error handler (LAST middleware always)
app.use(errorMiddleware);

export default app;