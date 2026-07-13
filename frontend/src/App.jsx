import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
  useNavigate,
} from "react-router-dom";
import TaskList from "./components/TaskList";
import TaskForm from "./components/TaskForm";
import Dashboard from "./components/Dashboard";
import LoginPage from "./components/LoginPage";
import { healthCheck } from "./services/api";
import "./App.css";

// Redirects to /login if there's no auth token
function ProtectedRoute({ isAuthenticated, children }) {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function AppContent() {
  const [apiStatus, setApiStatus] = useState("checking");
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("authToken"),
  );
  const navigate = useNavigate();

  useEffect(() => {
    checkAPIHealth();
  }, []);

  const checkAPIHealth = async () => {
    try {
      await healthCheck();
      setApiStatus("connected");
    } catch (error) {
      setApiStatus("disconnected");
    }
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    navigate("/");
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setIsAuthenticated(false);
    navigate("/login");
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="container">
          <div className="logo-container">
            <img src="/TaskFlow.png" alt="TaskFlow Logo" className="app-logo" />
            <h1>TaskFlow</h1>
          </div>

          {isAuthenticated && (
            <nav>
              <Link to="/">Dashboard</Link>
              <Link to="/tasks">All Tasks</Link>
              <Link to="/create">New Task</Link>
            </nav>
          )}

          <div className="app-header-right">
            <div className={`status ${apiStatus}`}>
              API: {apiStatus === "connected" ? "✅" : "❌"} {apiStatus}
            </div>
            {isAuthenticated && (
              <button className="btn btn-secondary" onClick={handleLogout}>
                Log Out
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="container">
        <Routes>
          <Route
            path="/login"
            element={<LoginPage onLoginSuccess={handleLoginSuccess} />}
          />
          <Route
            path="/"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tasks"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <TaskList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <TaskForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit/:id"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <TaskForm />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;