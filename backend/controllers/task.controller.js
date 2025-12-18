import Task from "../models/task.js";

// Add task
export const addTask = async (req, res) => {
    try {
        const { title, description, priority, dueDate } = req.body;

        if (!title) {
            return res.status(400).json({ message: "Title is required" });
        }

        const task = await Task.create({
            title,
            description,
            priority,
            dueDate,
            user: req.user.id, // comes from auth middleware
        });

        res.status(201).json({
            success: true,
            message: "Task created successfully",
            task // Send back the created task
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create task",
            error: error.message,
        });
    }
};

// Get all tasks - CORRECTED FUNCTION NAME
export const getMyTasks = async (req, res) => {
    try {
        const tasks = await Task.find({
            user: req.user.id,
            isDeleted: false,
        }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: tasks.length, // Fixed variable name
            tasks,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch tasks",
            error: error.message,
        });
    }
};

// Update task 
export const updateTask = async (req, res) => {
    try {
        const task = await Task.findOne({
            _id: req.params.id,
            user: req.user.id,
            isDeleted: false,
        });

        if (!task) {
            return res.status(404).json({ 
                success: false,
                message: "Task not found" 
            });
        }

        // Only update allowed fields
        const allowedUpdates = ['title', 'description', 'status', 'priority', 'dueDate'];
        const updates = Object.keys(req.body);
        
        const isValidOperation = updates.every(update => 
            allowedUpdates.includes(update)
        );

        if (!isValidOperation) {
            return res.status(400).json({ 
                success: false,
                message: "Invalid updates" 
            });
        }

        updates.forEach(update => task[update] = req.body[update]);
        await task.save();

        res.status(200).json({
            success: true,
            message: "Task updated successfully",
            task,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update task",
            error: error.message,
        });
    }
};

// Delete task (soft delete)
export const deleteTask = async (req, res) => {
    try {
        const task = await Task.findOne({
            _id: req.params.id,
            user: req.user.id,
            isDeleted: false,
        });

        if (!task) {
            return res.status(404).json({ 
                success: false,
                message: "Task not found" 
            });
        }

        task.isDeleted = true;
        await task.save();

        res.status(200).json({
            success: true,
            message: "Task deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete task",
            error: error.message,
        });
    }
};

// Optional: Get single task
export const getTask = async (req, res) => {
    try {
        const task = await Task.findOne({
            _id: req.params.id,
            user: req.user.id,
            isDeleted: false,
        });

        if (!task) {
            return res.status(404).json({ 
                success: false,
                message: "Task not found" 
            });
        }

        res.status(200).json({
            success: true,
            task,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch task",
            error: error.message,
        });
    }
};