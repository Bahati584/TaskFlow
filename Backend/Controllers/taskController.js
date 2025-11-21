const Task = require('../models/taskModel');

const taskController = {
    // Get all tasks
    async getAllTasks(req, res) {
        try {
            const { status, priority, page = 1, limit = 10 } = req.query;

            const tasks = await Task.findAll({ status, priority, page, limit });
            const total = await Task.getCount({ status, priority });

            res.json({
                success: true,
                data: tasks,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total: total,
                    totalPages: Math.ceil(total / limit)
                }
            });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },

    // Get single task
    async getTask(req, res) {
        try {
            const task = await Task.findById(req.params.id);

            if (!task) {
                return res.status(404).json({ success: false, error: "Task not found" });
            }

            res.json({ success: true, data: task });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },

    // Create new task
    async createTask(req, res) {
        try {
            const { title, description, status, priority, due_date, category } = req.body;

            if (!title) {
                return res.status(400).json({ success: false, error: "Title is required" });
            }

            const newTask = await Task.create(req.body);

            res.status(201).json({
                success: true,
                message: "Task created successfully",
                data: newTask
            });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },

    // Update task
    async updateTask(req, res) {
        try {
            const updatedTask = await Task.update(req.params.id, req.body);

            if (!updatedTask) {
                return res.status(404).json({ success: false, error: "Task not found" });
            }

            res.json({
                success: true,
                message: "Task updated successfully",
                data: updatedTask
            });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },

    // Delete task
    async deleteTask(req, res) {
        try {
            const deleted = await Task.delete(req.params.id);

            if (!deleted) {
                return res.status(404).json({ success: false, error: "Task not found" });
            }

            res.json({ success: true, message: "Task deleted successfully" });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },

    // Get task statistics
    async getStats(req, res) {
        try {
            const stats = await Task.getStats();

            res.json({
                success: true,
                data: stats
            });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
};

module.exports = taskController;