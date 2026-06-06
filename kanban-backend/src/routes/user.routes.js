import express from "express";
import {
  getUsers,
  registerUser,
  loginUser,
  getMe
} from "../controllers/user.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getMe);
router.get("/", protect, getUsers);

export default router;
