import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { taskAPI } from '../services/api';

function Dashboard() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        inProgress: 0,
        completed: 0
    });

    const fetchTasks = useCallback(async () => {
        try {
            setLoading(true);
            const response = await taskAPI.getAll();
            const tasksData = response.data.data;

            setTasks(tasksData);

            // Calculate stats
            const total = tasksData.length;
            const pending = tasksData.filter(task => task.status === 'pending').length;
            const inProgress = tasksData.filter(task => task.status === 'in-progress').length;
            const completed = tasksData.filter(task => task.status === 'completed').length;

            setStats({ total, pending, inProgress, completed });
        } catch (error) {
            console.error('Error fetching tasks:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    const recentTasks = tasks.slice(0, 4); // Show last 4 tasks

    if (loading) {
        return <div className="loading">Loading dashboard...</div>;
    }

    return (
        <div className="dashboard">
            {/* Welcome Header */}
            <div className="welcome-section">
                <h1>Welcome to TaskFlow! </h1>
                <p>Manage your tasks efficiently and stay productive</p>
                <Link to="/create" className="btn btn-primary btn-large">
                    + Create New Task
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon"></div>
                    <h3>Total Tasks</h3>
                    <div className="stat-number">{stats.total}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon"></div>
                    <h3>Pending</h3>
                    <div className="stat-number pending">{stats.pending}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon"></div>
                    <h3>In Progress</h3>
                    <div className="stat-number in-progress">{stats.inProgress}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon"></div>
                    <h3>Completed</h3>
                    <div className="stat-number completed">{stats.completed}</div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="quick-actions">
                <h2>Quick Actions</h2>
                <div className="actions-grid">
                    <Link to="/create" className="action-card">
                        <div className="action-icon"></div>
                        <h4>Add Task</h4>
                        <p>Create a new task</p>
                    </Link>
                    <Link to="/tasks" className="action-card">
                        <div className="action-icon"></div>
                        <h4>View All</h4>
                        <p>See all tasks</p>
                    </Link>
                    <div className="action-card" onClick={() => fetchTasks()}>
                        <div className="action-icon"></div>
                        <h4>Refresh</h4>
                        <p>Update tasks</p>
                    </div>
                </div>
            </div>

            {/* Recent Tasks */}
            <div className="recent-tasks">
                <div className="section-header">
                    <h2>Recent Tasks</h2>
                    <Link to="/tasks" className="btn btn-secondary">View All</Link>
                </div>

                {recentTasks.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon"></div>
                        <h3>No tasks yet</h3>
                        <p>Create your first task to get started!</p>
                        <Link to="/create" className="btn btn-primary">Create Task</Link>
                    </div>
                ) : (
                    <div className="tasks-grid compact">
                        {recentTasks.map(task => (
                            <div key={task.id} className="task-card">
                                <div className="task-header">
                                    <h3>{task.title}</h3>
                                    <span className={`status-badge ${task.status}`}>
                                        {task.status}
                                    </span>
                                </div>
                                <p className="task-description">{task.description}</p>
                                <div className="task-meta">
                                    <span className={`priority-${task.priority}`}>
                                        {task.priority} priority
                                    </span>
                                    {task.due_date && (
                                        <span className="due-date">
                                            {new Date(task.due_date).toLocaleDateString()}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Dashboard;