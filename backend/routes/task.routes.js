import express from 'express';
import { addTask, deleteTask, getMyTasks, updateTask, getTask } from '../controllers/task.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

// Protect all task routes with authentication
router.use(authMiddleware);

router.post("/add", addTask);
router.get("/all", getMyTasks);
router.get("/:id", getTask); // Add this for single task
router.put("/update/:id", updateTask);
router.delete("/delete/:id", deleteTask);

export default router; // Make sure this is default export