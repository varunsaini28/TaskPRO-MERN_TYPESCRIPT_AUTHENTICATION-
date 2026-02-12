<<<<<<< HEAD
import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
=======
// contexts/AuthContext.tsx - COMPLETE FIXED VERSION
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
>>>>>>> f866ce487164c3fa1e4d5dbf8182daa6a891affd
import { authService } from '../services/auth.service';
import type { 
  User, 
  LoginFormData, 
  RegisterFormData, 
  AuthContextType 
} from '../types/auth.types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // ✅ Initialize axios with token from localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Set default header for all future requests
      const axios = require('axios').default;
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);

  const checkAuth = async (): Promise<void> => {
    try {
      const { user } = await authService.getProfile();
      setUser(user);
      console.log('✅ Auth check successful, user:', user);
    } catch (err: any) {
      console.log('Auth check failed (normal if not logged in):', err.response?.status || err.message);
      setUser(null);
      
      // Clear token if 401
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        const axios = require('axios').default;
        delete axios.defaults.headers.common['Authorization'];
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (credentials: LoginFormData): Promise<void> => {
    try {
      const response = await authService.login(credentials);
      
      // ✅ CRITICAL: Save token from response
      if (response.token) {
        localStorage.setItem('token', response.token);
        console.log('Token saved:', response.token.substring(0, 20) + '...');
        
        // Set axios header
        const axios = require('axios').default;
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.token}`;
      }
      
      // ✅ Save user data
      if (response.user) {
        localStorage.setItem('user', JSON.stringify(response.user));
        setUser(response.user);
      }
      
      console.log('✅ Login successful');
    } catch (error: any) {
      console.error('Login failed:', error.response?.data || error.message);
      throw error;
    }
  };

  const register = async (credentials: RegisterFormData): Promise<void> => {
    try {
      const response = await authService.register(credentials);
      
      // ✅ Save token if registration includes auto-login
      if (response.token) {
        localStorage.setItem('token', response.token);
        const axios = require('axios').default;
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.token}`;
      }
      
      if (response.user) {
        localStorage.setItem('user', JSON.stringify(response.user));
        setUser(response.user);
      }
      
      console.log('✅ Registration successful');
    } catch (error: any) {
      console.error('Registration failed:', error.response?.data || error.message);
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      // ✅ ALWAYS clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      
      // Clear axios header
      const axios = require('axios').default;
      delete axios.defaults.headers.common['Authorization'];
      
      console.log('✅ Logout successful');
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    logout,
    register,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
