// services/notification.service.ts
import api from './api';

export const notificationService = {
  getUserNotifications: async (userId: string) => {
    const response = await api.get(`/notifications/user/${userId}`);
    return response.data;
  },

  markAsRead: async (notificationId: string) => {
    const response = await api.patch(`/notifications/${notificationId}/read`);
    return response.data;
  },

  markAllAsRead: async (userId: string) => {
    const response = await api.patch(`/notifications/user/${userId}/read-all`);
    return response.data;
  },

  deleteNotification: async (notificationId: string) => {
    const response = await api.delete(`/notifications/${notificationId}`);
    return response.data;
  },

  createNotification: async (notificationData: {
    userId: string;
    type: string;
    title: string;
    message: string;
    taskId?: string;
    points?: number;
  }) => {
    const response = await api.post('/notifications', notificationData);
    return response.data;
  }
};