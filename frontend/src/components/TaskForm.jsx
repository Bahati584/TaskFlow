import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { taskAPI } from '../services/api';

function TaskForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = !!id;

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        status: 'pending',
        priority: 'medium',
        dueDate: ''
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const fetchTask = useCallback(async () => {
        if (isEditing && id) {
            try {
                setLoading(true);
                const response = await taskAPI.getById(id);
                const task = response.data.data;

                // Format date for input field (YYYY-MM-DD)
                const dueDate = task.due_date ? new Date(task.due_date).toISOString().split('T')[0] : '';
                setFormData({
                    title: task.title,
                    description: task.description || '',
                    status: task.status,
                    priority: task.priority,
                    dueDate: dueDate
                });
            } catch (error) {
                console.error('Error fetching task:', error);
                alert('Error loading task');
            } finally {
                setLoading(false);
            }
        }
    }, [isEditing, id]);

    useEffect(() => {
        fetchTask();
    }, [fetchTask]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Title is required';
        }

        if (formData.dueDate && new Date(formData.dueDate) < new Date().setHours(0, 0, 0, 0)) {
            newErrors.dueDate = 'Due date cannot be in the past';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {

            const backendData = {
                title: formData.title,
                description: formData.description,
                status: formData.status,
                priority: formData.priority,
                due_date: formData.dueDate || null,
                category: null // Add category if needed
            };

            if (isEditing) {
                await taskAPI.update(id, backendData);
            } else {
                await taskAPI.create(backendData);
            }
            navigate('/');
        } catch (error) {
            console.error('Error saving task:', error);
            alert('Error saving task: ' + (error.response?.data?.error || error.message));
        } finally {
            setLoading(false);
        }
    };

    if (loading && isEditing) {
        return <div className="loading">Loading task...</div>;
    }

    return (
        <div>
            <div className="dashboard-header">
                <h2>{isEditing ? 'Edit Task' : 'Create New Task'}</h2>
                <a href="/" className="btn btn-secondary">Back to Dashboard</a>
            </div>

            <form onSubmit={handleSubmit} className="task-form">
                <div className="form-group">
                    <label htmlFor="title">Title *</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        placeholder="Enter task title"
                        className={errors.title ? 'error' : ''}
                    />
                    {errors.title && <span className="error-message">{errors.title}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="4"
                        placeholder="Enter task description"
                    />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="status">Status</label>
                        <select
                            id="status"
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                        >
                            <option value="pending">Pending</option>
                            <option value="in-progress">In Progress</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="priority">Priority</label>
                        <select
                            id="priority"
                            name="priority"
                            value={formData.priority}
                            onChange={handleChange}
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="dueDate">Due Date</label>
                    <input
                        type="date"
                        id="dueDate"
                        name="dueDate"
                        value={formData.dueDate}
                        onChange={handleChange}
                        className={errors.dueDate ? 'error' : ''}
                    />
                    {errors.dueDate && <span className="error-message">{errors.dueDate}</span>}
                </div>

                <div className="form-actions">
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                    >
                        {loading ? 'Saving...' : (isEditing ? 'Update Task' : 'Create Task')}
                    </button>
                    <a href="/" className="btn btn-secondary">Cancel</a>
                </div>
            </form>
        </div>
    );
}

export default TaskForm;