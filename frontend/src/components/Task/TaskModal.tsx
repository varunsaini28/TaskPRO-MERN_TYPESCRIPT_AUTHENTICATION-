import React, { useState, useEffect } from 'react';
import { FaTimes, FaCalendarAlt, FaTag, FaExclamationTriangle } from 'react-icons/fa';
import { useTasks } from '../../contexts/TaskContext';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTaskCreated: () => void;
  initialTask?: any;
}

const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, onTaskCreated, initialTask }) => {
  const { addTask, updateTask, loading } = useTasks();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    dueDate: '',
    category: 'general'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialTask) {
      setFormData({
        title: initialTask.title || '',
        description: initialTask.description || '',
        priority: initialTask.priority || 'medium',
        dueDate: initialTask.dueDate ? new Date(initialTask.dueDate).toISOString().split('T')[0] : '',
        category: initialTask.category || 'general'
      });
    } else {
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        dueDate: '',
        category: 'general'
      });
    }
    setErrors({});
  }, [initialTask, isOpen]);

  // Close modal when clicking outside or pressing Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    const handleOutsideClick = (e: MouseEvent) => {
      if (isOpen && e.target === document.querySelector('.modal-overlay')) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.addEventListener('click', handleOutsideClick);

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (formData.dueDate && new Date(formData.dueDate) < new Date()) {
      newErrors.dueDate = 'Due date cannot be in the past';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    try {
      if (initialTask) {
        await updateTask(initialTask._id, formData);
      } else {
        await addTask(formData);
      }
      onTaskCreated();
      onClose();
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        dueDate: '',
        category: 'general'
      });
      setErrors({});
    } catch (error) {
      console.error('Failed to save task:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const priorityOptions = [
    { value: 'low', label: 'Low', color: 'bg-green-100 text-green-800' },
    { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'high', label: 'High', color: 'bg-red-100 text-red-800' }
  ];

  const categoryOptions = [
    { value: 'general', label: 'General' },
    { value: 'school', label: 'School' },
    { value: 'college', label: 'College' },
    { value: 'work', label: 'Work' },
    { value: 'roadmaps', label: 'Roadmaps' }
  ];

  // Get min date for due date (today)
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto custom-thin-scrollbar">
        <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b flex justify-between items-center shadow-sm">
          <h2 className="text-2xl font-bold text-gray-800">
            {initialTask ? 'Edit Task' : 'Add New Task'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
            disabled={loading}
            type="button"
          >
            <FaTimes size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-5">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Task Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                  errors.title 
                    ? 'border-red-500 focus:ring-red-200' 
                    : 'border-gray-300 focus:ring-blue-200'
                } ${loading ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                placeholder="Enter task title"
                disabled={loading}
                autoFocus
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <FaExclamationTriangle size={12} />
                  {errors.title}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description (Optional)
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-blue-200 transition-all ${
                  loading ? 'bg-gray-50 cursor-not-allowed' : ''
                }`}
                rows={3}
                placeholder="Enter task description"
                disabled={loading}
              />
            </div>

            {/* Priority and Category */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaTag className="inline mr-2 text-gray-400" size={14} />
                  Priority
                </label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-blue-200 transition-all appearance-none ${
                    loading ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'
                  }`}
                  disabled={loading}
                >
                  {priorityOptions.map(option => (
                    <option key={option.value} value={option.value} className={option.color}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="flex items-center gap-2 mt-2">
                  {priorityOptions.map(option => (
                    <span
                      key={option.value}
                      className={`text-xs px-2 py-1 rounded-full ${option.color} ${
                        formData.priority === option.value ? 'ring-2 ring-opacity-50 ring-current' : ''
                      }`}
                    >
                      {option.label}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-blue-200 transition-all appearance-none ${
                    loading ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'
                  }`}
                  disabled={loading}
                >
                  {categoryOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaCalendarAlt className="inline mr-2 text-gray-400" size={14} />
                Due Date (Optional)
              </label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                min={today}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                  errors.dueDate 
                    ? 'border-red-500 focus:ring-red-200' 
                    : 'border-gray-300 focus:ring-blue-200'
                } ${loading ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                disabled={loading}
              />
              {errors.dueDate && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <FaExclamationTriangle size={12} />
                  {errors.dueDate}
                </p>
              )}
              {formData.dueDate && !errors.dueDate && (
                <p className="text-green-600 text-sm mt-1">
                  Due: {new Date(formData.dueDate).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 mt-8 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-5 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {initialTask ? 'Updating...' : 'Creating...'}
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  {initialTask ? (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Update Task
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Create Task
                    </>
                  )}
                </span>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Add custom scrollbar styles */}
      <style jsx>{`
        .custom-thin-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #cbd5e1 #f1f5f9;
        }
        
        .custom-thin-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-thin-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 3px;
        }
        
        .custom-thin-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 3px;
        }
        
        .custom-thin-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
};

export default TaskModal;