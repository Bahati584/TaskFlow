const express = require('express');
const router = express.Router();
const taskRoutes = require('./taskRoutes');
const authRoutes = require('./authRoutes');

// Health check
router.get('/health', async (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        message: 'TaskFlow API is running!'
    });
});

// API routes
router.use('/tasks', taskRoutes);
router.use('/auth', authRoutes);

// Root endpoint
router.get('/', (req, res) => {
    res.json({
        message: "TaskFlow API with MySQL is running!",
        version: "1.0.0",
        endpoints: {
            tasks: "/api/tasks",
            auth: "/api/auth",
            health: "/api/health"
        }
    });
});

module.exports = router;