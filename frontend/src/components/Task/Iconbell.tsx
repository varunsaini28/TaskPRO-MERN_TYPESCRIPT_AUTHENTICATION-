// components/Task/Bell.tsx
import React, { useState, useEffect, useRef } from 'react';
import { FaBell, FaCheck, FaTrash } from 'react-icons/fa';
import { taskService } from '../../services/task.service';
import { notificationService } from '../../services/notification.service';
import type { Notification } from '../../types/notification.types';
import { formatDistanceToNow } from 'date-fns';

interface BellProps {
  userId: string;
}

const Iconbell: React.FC<BellProps> = ({ userId }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchNotifications();
    // Set up polling for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [userId]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await notificationService.getUserNotifications(userId);
      setNotifications(response.notifications);
      setUnreadCount(response.unreadCount);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications(prev =>
        prev.map(notif =>
          notif._id === notificationId ? { ...notif, read: true } : notif
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead(userId);
      setNotifications(prev =>
        prev.map(notif => ({ ...notif, read: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      await notificationService.deleteNotification(notificationId);
      setNotifications(prev => prev.filter(notif => notif._id !== notificationId));
      // Update unread count if needed
      const deletedNotif = notifications.find(n => n._id === notificationId);
      if (deletedNotif && !deletedNotif.read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'due_date':
        return '⏰';
      case 'task_completed':
        return '✅';
      case 'points_earned':
        return '🎯';
      case 'achievement':
        return '🏆';
      case 'reminder':
        return '🔔';
      default:
        return '📢';
    }
  };

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'due_date':
        return 'text-red-500';
      case 'task_completed':
        return 'text-green-500';
      case 'points_earned':
        return 'text-yellow-500';
      case 'achievement':
        return 'text-purple-500';
      case 'reminder':
        return 'text-blue-500';
      default:
        return 'text-gray-500';
    }
  };

  // Check for due date notifications (mock function - implement based on your tasks)
  const checkDueDateNotifications = async () => {
    try {
      const tasks = await taskService.getTasks();
      const today = new Date();
      const dueToday = tasks.filter(task => {
        if (!task.dueDate) return false;
        const dueDate = new Date(task.dueDate);
        return dueDate.toDateString() === today.toDateString() && task.status !== 'done';
      });

      if (dueToday.length > 0) {
        // Create notification for due tasks
        const message = dueToday.length === 1
          ? `"${dueToday[0].title}" is due today!`
          : `You have ${dueToday.length} tasks due today!`;
        
        // Here you would call your notification service to create notification
        console.log('Due today notification:', message);
      }
    } catch (error) {
      console.error('Failed to check due dates:', error);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Icon */}
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors rounded-full hover:bg-gray-100"
        aria-label="Notifications"
      >
        <FaBell className="text-xl" />
        
        {/* Unread Count Badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute right-0 mt-2 w-80 md:w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-[500px] overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-gray-50">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-800">Notifications</h3>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-2 py-1 rounded transition-colors"
                  >
                    Mark all as read
                  </button>
                )}
                <span className="text-xs text-gray-500">
                  {notifications.length} total
                </span>
              </div>
            </div>
          </div>

          {/* Notifications List */}
          <div className="overflow-y-auto max-h-[400px]">
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-2 text-sm text-gray-500">Loading notifications...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 text-gray-300">
                  <FaBell className="w-full h-full" />
                </div>
                <p className="text-gray-500">No notifications yet</p>
                <p className="text-sm text-gray-400 mt-1">You're all caught up!</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications.map((notification) => (
                  <div
                    key={notification._id}
                    className={`p-4 hover:bg-gray-50 transition-colors ${
                      !notification.read ? 'bg-blue-50/50' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Icon */}
                      <div className={`text-xl ${getNotificationColor(notification.type)}`}>
                        {getNotificationIcon(notification.type)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-medium text-gray-900 text-sm">
                            {notification.title}
                          </h4>
                          <div className="flex items-center gap-1">
                            {!notification.read && (
                              <button
                                onClick={() => markAsRead(notification._id)}
                                className="text-gray-400 hover:text-green-600 p-1"
                                title="Mark as read"
                              >
                                <FaCheck size={12} />
                              </button>
                            )}
                            <button
                              onClick={() => deleteNotification(notification._id)}
                              className="text-gray-400 hover:text-red-600 p-1"
                              title="Delete"
                            >
                              <FaTrash size={12} />
                            </button>
                          </div>
                        </div>
                        
                        <p className="text-gray-600 text-sm mt-1">
                          {notification.message}
                        </p>

                        {/* Points earned */}
                        {notification.points && (
                          <div className="inline-flex items-center gap-1 mt-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                            <span>+{notification.points} points</span>
                          </div>
                        )}

                        {/* Time */}
                        <p className="text-xs text-gray-400 mt-2">
                          {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-gray-200 bg-gray-50">
            <div className="text-center">
              <button
                onClick={checkDueDateNotifications}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Check due dates
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Iconbell;