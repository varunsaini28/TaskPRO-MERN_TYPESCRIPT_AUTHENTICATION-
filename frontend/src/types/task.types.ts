export interface Task {
  _id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  user: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskData {
  title: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: string;
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  status?: 'todo' | 'in-progress' | 'done';
  priority?: 'low' | 'medium' | 'high';
  dueDate?: string;
}

export interface TasksResponse {
  success: boolean;
  count: number;
  tasks: Task[];
}

export interface SingleTaskResponse {
  success: boolean;
  task: Task;
}

export interface TaskMessageResponse {
  success: boolean;
  message: string;
}

// In task.types.ts
export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
}

export interface Task {
  _id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  subtasks?: Subtask[];
  attachments?: Attachment[];
  tags?: string[];
  assignedTo?: string;
  user: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

// types/notification.types.ts
export interface Notification {
  _id: string;
  userId: string;
  type: 'due_date' | 'task_completed' | 'points_earned' | 'achievement' | 'reminder';
  title: string;
  message: string;
  taskId?: string;
  points?: number;
  read: boolean;
  createdAt: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: Record<string, any>;
}

// types/user.types.ts (update)
export interface UserStats {
  totalPoints: number;
  completedTasks: number;
  overdueTasks: number;
  streak: number;
  level: number;
  achievements: string[];
}

export interface User {
  _id: string;
  name: string;
  email: string;
  stats: UserStats;
  createdAt: string;
  updatedAt: string;
}