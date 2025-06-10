import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getMessages,
  getUsersforSidebar,
} from "../controllers/message.controller.js";

const router = express.Router();

router.get("/users", protectRoute, getUsersforSidebar);

router.get("/:id", protectRoute, getMessages);

export default router;
