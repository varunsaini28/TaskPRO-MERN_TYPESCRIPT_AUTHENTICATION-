import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';
import type {
  Task,
  CreateTaskData,
  UpdateTaskData,
  TasksResponse,
  SingleTaskResponse,
  TaskMessageResponse
} from '../types/task.types';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const taskService = {
  // Create a new task
  createTask: async (taskData: CreateTaskData): Promise<TaskMessageResponse & { task?: Task }> => {
    const response = await api.post('/tasks/add', taskData);
    return response.data;
  },

  // Get all tasks
  getAllTasks: async (): Promise<TasksResponse> => {
    const response = await api.get('/tasks/all');
    return response.data;
  },

  // Get single task by ID
  getTaskById: async (taskId: string): Promise<SingleTaskResponse> => {
    const response = await api.get(`/tasks/${taskId}`);
    return response.data;
  },

  // Update task
  updateTask: async (taskId: string, updateData: UpdateTaskData): Promise<SingleTaskResponse> => {
    const response = await api.put(`/tasks/update/${taskId}`, updateData);
    return response.data;
  },

  // Delete task
  deleteTask: async (taskId: string): Promise<TaskMessageResponse> => {
    const response = await api.delete(`/tasks/delete/${taskId}`);
    return response.data;
  },

  // Optional: Get tasks by status
  getTasksByStatus: async (status: string): Promise<TasksResponse> => {
    const response = await api.get('/tasks/all');
    const filteredTasks = response.data.tasks.filter((task: Task) => task.status === status);
    return {
      ...response.data,
      tasks: filteredTasks,
      count: filteredTasks.length
    };
  },
};