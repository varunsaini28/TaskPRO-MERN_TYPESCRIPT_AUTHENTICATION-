// services/auth.service.ts - FIXED VERSION
import axios from 'axios';
import { API_BASE_URL, AUTH_ENDPOINTS } from '../config/endpoints'; // ✅ Use correct import
import type { LoginFormData, RegisterFormData, AuthResponse, User } from '../types/auth.types';

// ✅ Create axios instance with interceptors
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Response interceptor to handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token and redirect
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Redirect to login if not already there
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authService = {
  register: async (data: RegisterFormData): Promise<AuthResponse> => {
    const response = await api.post(AUTH_ENDPOINTS.REGISTER, data);
    console.log('Register response:', response.data);
    return response.data;
  },

  login: async (data: LoginFormData): Promise<AuthResponse> => {
    const response = await api.post(AUTH_ENDPOINTS.LOGIN, data);
    console.log('Login response:', {
      hasToken: !!response.data.token,
      hasUser: !!response.data.user,
      message: response.data.message
    });
    return response.data;
  },

  logout: async (): Promise<AuthResponse> => {
    const response = await api.post(AUTH_ENDPOINTS.LOGOUT);
    return response.data;
  },

  getProfile: async (): Promise<{ user: User }> => {
    const response = await api.get(AUTH_ENDPOINTS.PROFILE);
    console.log('Profile response:', response.data);
    return response.data;
  },
};
