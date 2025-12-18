import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import type { Task, CreateTaskData, UpdateTaskData } from '../types/task.types';
import { taskService } from '../services/task.service';

interface TaskContextType {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
  addTask: (taskData: CreateTaskData) => Promise<void>;
  updateTask: (taskId: string, taskData: UpdateTaskData) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  getTask: (taskId: string) => Task | undefined;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const useTasks = (): TaskContextType => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};

interface TaskProviderProps {
  children: ReactNode;
}

export const TaskProvider: React.FC<TaskProviderProps> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const response = await taskService.getAllTasks();
      setTasks(response.tasks);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch tasks');
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (taskData: CreateTaskData): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await taskService.createTask(taskData);
      await fetchTasks();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create task');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async (taskId: string, taskData: UpdateTaskData): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await taskService.updateTask(taskId, taskData);
      await fetchTasks();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update task');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (taskId: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await taskService.deleteTask(taskId);
      await fetchTasks();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete task');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getTask = (taskId: string): Task | undefined => {
    return tasks.find(task => task._id === taskId);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <TaskContext.Provider
      value={{
        tasks,
        loading,
        error,
        fetchTasks,
        addTask,
        updateTask,
        deleteTask,
        getTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};