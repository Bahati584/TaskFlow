const express = require('express');
const router = express.Router();
const taskRoutes = require('./taskRoutes');
// const userRoutes = require('./userRoutes'); // We'll create this next

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
// router.use('/users', userRoutes);

// Root endpoint
router.get('/', (req, res) => {
    res.json({
        message: "TaskFlow API with MySQL is running!",
        version: "1.0.0",
        endpoints: {
            tasks: "/api/tasks",
            health: "/api/health"
        }
    });
});

module.exports = router;