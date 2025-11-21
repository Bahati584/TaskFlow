const { pool } = require('./db');

const Task = {
    // Get all tasks with filtering and pagination
    async findAll(filters = {}) {
        const { status, priority, page = 1, limit = 10 } = filters;
        let query = "SELECT * FROM tasks WHERE 1=1";
        const params = [];

        if (status) {
            query += " AND status = ?";
            params.push(status);
        }
        if (priority) {
            query += " AND priority = ?";
            params.push(priority);
        }

        query += " ORDER BY created_at DESC LIMIT ? OFFSET ?";
        const offset = (page - 1) * limit;
        params.push(parseInt(limit), offset);

        const [rows] = await pool.execute(query, params);
        return rows;
    },

    // Get task by ID
    async findById(id) {
        const [rows] = await pool.execute("SELECT * FROM tasks WHERE id = ?", [id]);
        return rows[0] || null;
    },

    // Create new task
    async create(taskData) {
        const { title, description, status, priority, due_date, category } = taskData;

        const [result] = await pool.execute(
            "INSERT INTO tasks (title, description, status, priority, due_date, category) VALUES (?, ?, ?, ?, ?, ?)",
            [title, description || null, status || 'pending', priority || 'medium', due_date || null, category || null]
        );

        return this.findById(result.insertId);
    },

    // Update task
    async update(id, taskData) {
        const { title, description, status, priority, due_date, category } = taskData;

        const [result] = await pool.execute(
            "UPDATE tasks SET title = ?, description = ?, status = ?, priority = ?, due_date = ?, category = ? WHERE id = ?",
            [title, description, status, priority, due_date, category, id]
        );

        if (result.affectedRows === 0) {
            return null;
        }

        return this.findById(id);
    },

    // Delete task
    async delete(id) {
        const [result] = await pool.execute("DELETE FROM tasks WHERE id = ?", [id]);
        return result.affectedRows > 0;
    },

    // Get task statistics
    async getStats() {
        const [stats] = await pool.execute(`
      SELECT 
        COUNT(*) as total_tasks,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_tasks,
        SUM(CASE WHEN status = 'in-progress' THEN 1 ELSE 0 END) as in_progress_tasks,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_tasks
      FROM tasks
    `);

        const [priorityStats] = await pool.execute(`
      SELECT 
        priority,
        COUNT(*) as count
      FROM tasks 
      GROUP BY priority
    `);

        return {
            summary: stats[0],
            byPriority: priorityStats
        };
    },

    // Get total count for pagination
    async getCount(filters = {}) {
        const { status, priority } = filters;
        let query = "SELECT COUNT(*) as total FROM tasks WHERE 1=1";
        const params = [];

        if (status) {
            query += " AND status = ?";
            params.push(status);
        }
        if (priority) {
            query += " AND priority = ?";
            params.push(priority);
        }

        const [result] = await pool.execute(query, params);
        return result[0].total;
    }
};

module.exports = Task;