export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://taskpro-backend-0fr6.onrender.com';

export const AUTH_ENDPOINTS = {
  REGISTER: '/auth/register',
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  PROFILE: '/auth/me',
} as const;

export const TASK_ENDPOINTS = {
  CREATE: '/tasks/add',
  GET_ALL: '/tasks/all',
  GET_BY_ID: '/tasks/',
  UPDATE: '/tasks/update/',
  DELETE: '/tasks/delete/',
} as const;
