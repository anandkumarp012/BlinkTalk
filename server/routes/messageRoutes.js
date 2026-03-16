import express from 'express';
import { getMessages, getUserForSiderbar, sendMessage } from '../controllers/messageController.js';
import { protectRoute } from '../middleware/auth.js';

const messageRouter = express.Router();

messageRouter.get("/users", protectRoute, getUserForSiderbar);
messageRouter.get("/:id", protectRoute, getMessages);
messageRouter.put("/mark-as-read/:id", protectRoute, sendMessage);
messageRouter.post("/send/:id", protectRoute, sendMessage);

export default messageRouter;

