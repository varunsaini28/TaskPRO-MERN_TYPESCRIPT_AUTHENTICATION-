// App.tsx - COMPLETE FIXED VERSION
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { TaskProvider } from './contexts/TaskContext';
import Navbar from './components/Layout/Navbar';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import './App.css';
import Dashboard from './pages/Dashboard';

// Main App component
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

// Separate component that uses the Auth hook
const AppContent: React.FC = () => {
  // This is fine - AppContent is inside AuthProvider
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar will handle its own user state */}
      <NavbarWrapper />
      
      <main className="pt-16"> {/* Offset for fixed navbar */}
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginOrRedirect />} />
          <Route path="/register" element={<RegisterOrRedirect />} />
          
          {/* Protected Routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />
          
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/profile" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />
          
          {/* Fallback redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
};

// Separate component for Navbar with user logic
const NavbarWrapper: React.FC = () => {
  const { user, logout } = useAuth(); // Import this at top
  
  return <Navbar user={user} onLogout={logout} />;
};

// Separate component for Login page logic
const LoginOrRedirect: React.FC = () => {
  const { user } = useAuth();
  
  if (user) {
    return <Navigate to="/" replace />;
  }
  
  return <LoginPage />;
};

// Separate component for Register page logic
const RegisterOrRedirect: React.FC = () => {
  const { user } = useAuth();
  
  if (user) {
    return <Navigate to="/" replace />;
  }
  
  return <RegisterPage />;
};

// Import hooks - Add this at the top
import { useAuth } from './contexts/AuthContext';

export default App;
