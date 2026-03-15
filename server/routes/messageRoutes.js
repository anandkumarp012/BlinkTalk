import express from 'express';
import { getMessages, getUserForSiderbar } from '../controllers/messageController.js';
import { protectRoute } from '../middleware/authMiddleware.js';

const messageRouter = express.Router();

messageRouter.get("/users", protectRoute, getUserForSiderbar);
messageRouter.get("/:id", protectRoute, getMessages);
messageRouterget("mark/:id", protectRoute, markMessagesAsSeen);

