import React, { useState, useEffect, useCallback } from 'react';
import { taskAPI } from '../services/api';

function TaskList() {
    const [tasks, setTasks] = useState([]);
    const [filter, setFilter] = useState('all');
    const [loading, setLoading] = useState(true);

    const fetchTasks = useCallback(async () => {
        try {
            setLoading(true);
            const response = await taskAPI.getAll();
            setTasks(response.data.data);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    const handleDelete = async (taskId) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            try {
                await taskAPI.delete(taskId);
                fetchTasks();
            } catch (error) {
                console.error('Error deleting task:', error);
            }
        }
    };

    const handleStatusChange = async (taskId, newStatus) => {
        try {
            const task = tasks.find(t => t.id === taskId);

            const backendData = {
                title: task.title,
                description: task.description,
                status: newStatus,
                priority: task.priority,
                due_date: task.due_date, // Use backend field name
                category: task.category
            };

            await taskAPI.update(taskId, backendData);
            fetchTasks();
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };

    const filteredTasks = tasks.filter(task => {
        if (filter === 'all') return true;
        return task.status === filter;
    });

    if (loading) {
        return <div className="loading">Loading tasks...</div>;
    }

    return (
        <div>
            <div className="dashboard-header">
                <h2>All Tasks</h2>
                <div className="filters">
                    <button
                        className={filter === 'all' ? 'active' : ''}
                        onClick={() => setFilter('all')}
                    >
                        All
                    </button>
                    <button
                        className={filter === 'pending' ? 'active' : ''}
                        onClick={() => setFilter('pending')}
                    >
                        Pending
                    </button>
                    <button
                        className={filter === 'in-progress' ? 'active' : ''}
                        onClick={() => setFilter('in-progress')}
                    >
                        In Progress
                    </button>
                    <button
                        className={filter === 'completed' ? 'active' : ''}
                        onClick={() => setFilter('completed')}
                    >
                        Completed
                    </button>
                </div>
            </div>

            {filteredTasks.length === 0 ? (
                <div className="empty-state">
                    No tasks found. <a href="/create">Create your first task</a>
                </div>
            ) : (
                <div className="tasks-grid">
                    {filteredTasks.map(task => (
                        <div key={task.id} className="task-card">
                            <div className="task-header">
                                <h3>{task.title}</h3>
                                <span className={`status-badge ${task.status}`}>
                                    {task.status}
                                </span>
                            </div>
                            <p className="task-description">{task.description}</p>
                            <div className="task-meta">
                                <span>Due: {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No due date'}</span>
                                <span className={`priority-${task.priority}`}>
                                    {task.priority} priority
                                </span>
                            </div>
                            <div className="task-actions">
                                <select
                                    value={task.status}
                                    onChange={(e) => handleStatusChange(task.id, e.target.value)}
                                    className="btn"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="in-progress">In Progress</option>
                                    <option value="completed">Completed</option>
                                </select>
                                <a href={`/edit/${task.id}`} className="btn btn-secondary">
                                    Edit
                                </a>
                                <button
                                    onClick={() => handleDelete(task.id)}
                                    className="btn btn-danger"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default TaskList;