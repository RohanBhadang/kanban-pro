import http from "http";
import app from "./app.js";
import { connectDB } from "./config/db.config.js";
import { initSocket } from "./config/socket.config.js";

import dotenv from "dotenv";
dotenv.config();

connectDB();

const server = http.createServer(app);

// socket init
const io = initSocket(server);
app.set("io", io);

const PORT = process.env.PORT || 9000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});