import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import Dashboard from './components/Dashboard';
import { healthCheck } from './services/api';
import './App.css';

function App() {
    const [apiStatus, setApiStatus] = useState('checking');

    useEffect(() => {
        checkAPIHealth();
    }, []);

    const checkAPIHealth = async () => {
        try {
            await healthCheck();
            setApiStatus('connected');
        } catch (error) {
            setApiStatus('disconnected');
        }
    };

    return (
        <Router>
            <div className="app">
                <header className="app-header">
                    <div className="container">
                        <div className="logo-container">
                            <img
                                src="/TaskFlow.png"
                                alt="TaskFlow Logo"
                                className="app-logo"
                            />
                            <h1>TaskFlow</h1>
                        </div>
                        <nav>
                            <Link to="/">Dashboard</Link>
                            <Link to="/tasks">All Tasks</Link>
                            <Link to="/create">New Task</Link>
                        </nav>
                        <div className={`status ${apiStatus}`}>
                            API: {apiStatus === 'connected' ? '✅' : '❌'} {apiStatus}
                        </div>
                    </div>
                </header>

                <main className="container">
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/tasks" element={<TaskList />} />
                        <Route path="/create" element={<TaskForm />} />
                        <Route path="/edit/:id" element={<TaskForm />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;