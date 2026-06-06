import { Server } from "socket.io";

export const initSocket = (server) => {
  const io = new Server(server, {
    cors: { origin: "*" }
  });

  io.on("connection", (socket) => {
    socket.on("join_board", (boardId) => {
      socket.join(boardId);
    });

    socket.on("task_moved", (data) => {
      socket.to(data.boardId).emit("task_updated", data.task);
    });

    socket.on("typing", (data) => {
      socket.to(data.boardId).emit("typing", data.user);
    });
  });

  return io;
};