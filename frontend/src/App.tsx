import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { TaskProvider } from './contexts/TaskContext';
import { useAuth } from './contexts/AuthContext';
import Navbar from './components/Layout/Navbar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import Dashboard from './pages/Dashboard';

import './App.css';
import General from './pages/Dashboards/General';
import Scholl from './pages/Dashboards/Scholl';
import College from './pages/Dashboards/College';

import Roadmaps from './pages/Dashboards/Roadmaps';
import Work from './pages/Dashboards/Work';

// Main App component with providers
const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <TaskProvider>
          <AppContent />
        </TaskProvider>
      </AuthProvider>
    </Router>
  );
};

// AppContent component that uses the context
const AppContent: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {user && <Navbar user={user} onLogout={() => window.location.reload()} />}
      
      <main className={user ? "pt-16" : ""}> {/* Offset for fixed navbar */}
        <Routes>
          <Route 
            path="/" 
            element={
              user ? <Navigate to="/Home" replace /> : <Navigate to="/login" replace />
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/general" 
            element={
              <ProtectedRoute>
                <General />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/school" 
            element={
              <ProtectedRoute>
                <Scholl />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/college" 
            element={
              <ProtectedRoute>
                <College />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/work" 
            element={
              <ProtectedRoute>
                <Work />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/roadmaps" 
            element={
              <ProtectedRoute>
                <Roadmaps />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/login" 
            element={
              user ? <Navigate to="/dashboard" replace /> : <LoginPage />
            } 
          />
          <Route 
            path="/register" 
            element={
              user ? <Navigate to="/dashboard" replace /> : <RegisterPage />
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </main>
    </div>
  );
};

export default App;