// App.tsx - COMPLETE FIXED VERSION
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { TaskProvider } from './contexts/TaskContext';
import Navbar from './components/Layout/Navbar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import Dashboard from './pages/Dashboard';

<<<<<<< HEAD
import './App.css';
import General from './pages/Dashboards/General';
import Scholl from './pages/Dashboards/Scholl';
import College from './pages/Dashboards/College';

import Roadmaps from './pages/Dashboards/Roadmaps';
import Work from './pages/Dashboards/Work';

// Main App component with providers
=======
// Main App component
>>>>>>> f866ce487164c3fa1e4d5dbf8182daa6a891affd
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
<<<<<<< HEAD
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
=======
  // This is fine - AppContent is inside AuthProvider
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar will handle its own user state */}
      <NavbarWrapper />
>>>>>>> f866ce487164c3fa1e4d5dbf8182daa6a891affd
      
      <main className={user ? "pt-16" : ""}> {/* Offset for fixed navbar */}
        <Routes>
<<<<<<< HEAD
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
=======
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
>>>>>>> f866ce487164c3fa1e4d5dbf8182daa6a891affd
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
