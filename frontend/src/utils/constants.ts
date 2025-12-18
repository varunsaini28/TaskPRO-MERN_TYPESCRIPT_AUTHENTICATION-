export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

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