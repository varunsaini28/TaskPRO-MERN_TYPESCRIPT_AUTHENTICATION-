import React, { useState } from 'react';
import { taskService } from '../../services/task.service';
import type { Task } from '../../types/task.types';
import { 
  FaEdit, 
  FaTrash, 
  FaUndo, 
  FaClock, 
  FaCalendarAlt,
  FaTag,
  FaUserCircle,
  FaEllipsisV,
  FaCheckCircle,
  FaExclamationTriangle,
  FaRegCalendarCheck,
  FaPaperclip
} from 'react-icons/fa';
import { formatDistanceToNow, format } from 'date-fns';

interface TaskCardProps {
  task: Task;
  onTaskUpdate: () => void;
  onEdit: (task: Task) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onTaskUpdate, onEdit }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleStatusChange = async (newStatus: Task['status']) => {
    try {
      await taskService.updateTask(task._id, { status: newStatus });
      onTaskUpdate();
    } catch (error) {
      console.error('Failed to update task status:', error);
    }
  };

  const handleDelete = async () => {
    if (isDeleting) {
      // Undo delete
      try {
        await taskService.restoreTask(task._id);
        setIsDeleted(false);
        onTaskUpdate();
      } catch (error) {
        console.error('Failed to restore task:', error);
      }
      setIsDeleting(false);
      setShowMenu(false);
      return;
    }

    setIsDeleting(true);
    // Auto undo after 5 minutes
    const deleteTimer = setTimeout(() => {
      if (isDeleting) {
        handleConfirmDelete();
      }
    }, 5 * 60 * 1000); // 5 minutes
    return () => clearTimeout(deleteTimer);
  };

  const handleConfirmDelete = async () => {
    try {
      await taskService.deleteTask(task._id);
      setIsDeleted(true);
      onTaskUpdate();
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
    setIsDeleting(false);
  };

  const getPriorityConfig = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return {
          color: 'bg-red-50 border-red-200',
          text: 'text-red-700',
          icon: <FaExclamationTriangle className="text-red-500" />,
          label: 'High Priority'
        };
      case 'medium':
        return {
          color: 'bg-yellow-50 border-yellow-200',
          text: 'text-yellow-700',
          icon: <FaClock className="text-yellow-500" />,
          label: 'Medium Priority'
        };
      case 'low':
        return {
          color: 'bg-green-50 border-green-200',
          text: 'text-green-700',
          icon: <FaCheckCircle className="text-green-500" />,
          label: 'Low Priority'
        };
      default:
        return {
          color: 'bg-gray-50 border-gray-200',
          text: 'text-gray-700',
          icon: <FaTag className="text-gray-500" />,
          label: 'Normal'
        };
    }
  };

  const getStatusConfig = (status: Task['status']) => {
    switch (status) {
      case 'todo':
        return {
          color: 'bg-gray-100 text-gray-800',
          icon: '○'
        };
      case 'in-progress':
        return {
          color: 'bg-blue-100 text-blue-800',
          icon: '⟳'
        };
      case 'done':
        return {
          color: 'bg-green-100 text-green-800',
          icon: '✓'
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800',
          icon: '○'
        };
    }
  };

  const priorityConfig = getPriorityConfig(task.priority);
  const statusConfig = getStatusConfig(task.status);

  // Check if task is overdue
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done';

  return (
    <div className={`
      bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300
      border-l-4 ${priorityConfig.color.split(' ')[0].replace('bg-', 'border-')}
      ${isDeleting ? 'border-red-300 bg-red-50' : 'border-gray-100'}
      ${isDeleted ? 'opacity-50' : ''}
      transform hover:-translate-y-0.5
    `}>
      <div className="p-4">
        {/* Header with menu */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2 flex-1">
            <button
              onClick={() => handleStatusChange(
                task.status === 'done' ? 'todo' : 'done'
              )}
              className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors
                ${task.status === 'done' 
                  ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                  : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                }`}
              title={task.status === 'done' ? 'Mark as not done' : 'Mark as done'}
            >
              {task.status === 'done' ? '✓' : ''}
            </button>
            
            <div className="flex-1">
              <h3 className={`font-semibold ${task.status === 'done' ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                {task.title}
              </h3>
              
              {/* Labels */}
              <div className="flex items-center gap-2 mt-1">
                <span className={`px-2 py-0.5 text-xs rounded-full ${statusConfig.color}`}>
                  {statusConfig.icon} {task.status.replace('-', ' ')}
                </span>
                
                <span className={`px-2 py-0.5 text-xs rounded-full ${priorityConfig.color} ${priorityConfig.text} flex items-center gap-1`}>
                  {priorityConfig.icon}
                  {task.priority}
                </span>
                
                {isOverdue && (
                  <span className="px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-700 flex items-center gap-1">
                    <FaExclamationTriangle size={10} />
                    Overdue
                  </span>
                )}
              </div>
            </div>
          </div>
          
          {/* Menu */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FaEllipsisV />
            </button>
            
            {showMenu && (
              <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                <div className="py-1">
                  <button
                    onClick={() => {
                      onEdit(task);
                      setShowMenu(false);
                    }}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <FaEdit size={14} />
                    Edit Task
                  </button>
                  
                  <button
                    onClick={handleDelete}
                    className={`flex items-center gap-2 w-full px-4 py-2 text-sm ${
                      isDeleting 
                        ? 'text-green-600 hover:bg-green-50' 
                        : 'text-red-600 hover:bg-red-50'
                    }`}
                  >
                    {isDeleting ? <FaUndo size={14} /> : <FaTrash size={14} />}
                    {isDeleting ? 'Undo Delete' : 'Delete Task'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Description with expand/collapse */}
        {task.description && (
          <div className="mb-3">
            <p className={`text-gray-600 text-sm ${!isExpanded && 'line-clamp-2'}`}>
              {task.description}
            </p>
            {task.description.length > 100 && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-blue-500 text-xs mt-1 hover:text-blue-600"
              >
                {isExpanded ? 'Show less' : 'Show more'}
              </button>
            )}
          </div>
        )}
        
        {/* Metadata */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-3">
            {/* Due Date */}
            {task.dueDate && (
              <div className={`flex items-center gap-1 ${isOverdue ? 'text-red-500' : ''}`}>
                <FaCalendarAlt size={12} />
                <span>
                  {format(new Date(task.dueDate), 'MMM d')}
                  {isOverdue && ` (${formatDistanceToNow(new Date(task.dueDate))} ago)`}
                </span>
              </div>
            )}
            
            {/* Created time */}
            <div className="flex items-center gap-1">
              <FaClock size={12} />
              <span>
                Created {formatDistanceToNow(new Date(task.createdAt), { addSuffix: true })}
              </span>
            </div>
          </div>
          
          {/* Status dropdown */}
          <div className="relative">
            <select
              value={task.status}
              onChange={(e) => handleStatusChange(e.target.value as Task['status'])}
              className={`
                text-xs border rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-200
                appearance-none bg-white pr-8
                ${isDeleting ? 'border-red-300' : 'border-gray-300'}
              `}
              disabled={isDeleting || isDeleted}
            >
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
        
        {/* Attachments or subtasks placeholder */}
        {(task.attachments || task.subtasks) && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-3">
              {task.attachments && task.attachments.length > 0 && (
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <FaPaperclip size={12} />
                  <span>{task.attachments.length} attachment(s)</span>
                </div>
              )}
              
              {task.subtasks && task.subtasks.length > 0 && (
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <FaRegCalendarCheck size={12} />
                  <span>
                    {task.subtasks.filter(st => st.completed).length}/{task.subtasks.length} completed
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Delete confirmation banner */}
        {isDeleting && (
          <div className="mt-3 p-3 bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <FaExclamationTriangle className="text-red-500" />
                <span className="text-sm font-medium text-red-700">
                  Task scheduled for deletion
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDelete}
                  className="px-3 py-1 text-xs bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
                >
                  <FaUndo className="inline mr-1" size={10} />
                  Undo
                </button>
                <button
                  onClick={() => setIsDeleting(false)}
                  className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
            
            {/* Progress bar */}
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block text-red-600">
                    Time remaining: 4:59
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block text-red-600">
                    5:00
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-1.5 text-xs flex rounded bg-red-200">
                <div
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-red-500 animate-countdown"
                  style={{ animationDuration: '300s' }}
                ></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;