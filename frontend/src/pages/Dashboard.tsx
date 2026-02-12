import React, { useState, useEffect, useMemo, useRef } from 'react';
import Taskadd from '../components/Task/Taskadd';
import TaskModal from '../components/Task/TaskModal';
import { useTasks } from '../contexts/TaskContext';
import Dashnav from '../components/Layout/Dashnav';
import { 
  FaTasks, FaCheckCircle, FaClock, FaSearch, FaFilter, 
  FaPlus, FaCalendarAlt, FaTag, FaEllipsisV, FaEdit, FaTrash,
  FaSort, FaChevronDown, FaArrowUp, FaArrowDown
} from 'react-icons/fa';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);
  const { tasks, loading, error, fetchTasks } = useTasks();
  const taskListRef = useRef<HTMLDivElement>(null);

  // Sort options
  const sortOptions = [
    { id: 'createdAt', label: 'Newest First', icon: '🆕' },
    { id: 'dueDate', label: 'Due Date', icon: '📅' },
    { id: 'priority', label: 'Priority', icon: '🎯' },
    { id: 'title', label: 'Title', icon: '🔤' },
  ];

  // Filter buttons
  const filters = [
    { id: 'all', label: 'All', icon: <FaTasks className="w-4 h-4" /> },
    { id: 'todo', label: 'To Do', icon: <FaClock className="w-4 h-4" /> },
    { id: 'in-progress', label: 'In Progress', icon: <FaClock className="w-4 h-4" /> },
    { id: 'done', label: 'Completed', icon: <FaCheckCircle className="w-4 h-4" /> },
  ];

  // Get current sort label
  const getCurrentSortLabel = () => {
    const option = sortOptions.find(opt => opt.id === sortBy);
    return option ? option.label : 'Sort By';
  };

  // Handle sort selection
  const handleSortSelect = (id: string) => {
    setSortBy(id);
    setIsSortDropdownOpen(false);
  };

  // Toggle sort order
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  // Filter and sort tasks
  const filteredTasks = useMemo(() => {
    let filtered = [...tasks];
    
    // Apply search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(term) ||
        task.description?.toLowerCase().includes(term) ||
        task.tags?.some((tag: string) => tag.toLowerCase().includes(term))
      );
    }
    
    // Apply status filter
    if (activeFilter !== 'all') {
      filtered = filtered.filter(task => task.status === activeFilter);
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'dueDate':
          const dateA = a.dueDate ? new Date(a.dueDate).getTime() : 0;
          const dateB = b.dueDate ? new Date(b.dueDate).getTime() : 0;
          comparison = dateA - dateB;
          break;
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          comparison = (priorityOrder[b.priority as keyof typeof priorityOrder] || 0) - 
                      (priorityOrder[a.priority as keyof typeof priorityOrder] || 0);
          break;
        case 'createdAt':
        default:
          comparison = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          break;
      }
      return sortOrder === 'desc' ? comparison : -comparison;
    });
    
    return filtered;
  }, [tasks, searchTerm, activeFilter, sortBy, sortOrder]);

  // Calculate stats
  const totalTasks = tasks.length;
  const todoTasks = tasks.filter(t => t.status === 'todo').length;
  const inProgressTasks = tasks.filter(t => t.status === 'in-progress').length;
  const doneTasks = tasks.filter(t => t.status === 'done').length;
  const completionRate = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  // Handle edit task
  const handleEditTask = (task: any) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  // Handle delete task
  const handleDeleteTask = async (taskId: string) => {
  if (window.confirm('Are you sure you want to delete this task?')) {
    try {
      // Call the actual delete API
      const response = await taskService.deleteTask(taskId);
      
      // Optional: Check if the delete was successful
      console.log('Delete response:', response);
      
      // Show success message
      alert(response.message || 'Task deleted successfully!');
      
      // Refresh the task list
      fetchTasks();
      
    } catch (error: any) {
      console.error('Failed to delete task:', error);
      
      // Show error message
      if (error.response?.data?.message) {
        alert(`Error: ${error.response.data.message}`);
      } else {
        alert('Failed to delete task. Please try again.');
      }
    }
  }
};
  // Close modal and reset editing task
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isSortDropdownOpen && !(event.target as Element).closest('.sort-dropdown-container')) {
        setIsSortDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isSortDropdownOpen]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="relative">
            <div className="w-12 h-12 border-3 border-transparent border-t-blue-500 border-r-blue-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <FaTasks className="text-blue-500 text-xl" />
            </div>
          </div>
          <p className="mt-4 text-gray-600 font-medium">Loading tasks...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="text-center bg-white p-6 rounded-xl shadow-lg max-w-md w-full">
          <h3 className="text-lg font-bold text-gray-800 mb-2">Connection Error</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={fetchTasks}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors w-full"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='absolute w-full top-11 fixed'>
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      {/* Main Content */}
      <div className="flex-1 flex flex-col p-4 md:p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Task Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage all your tasks in one place</p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Search and Sort Container */}
            <div className="flex items-center gap-2 sort-dropdown-container">
              {/* Search Bar */}
              <div className="relative md:w-64">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
              
              {/* Sort Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <FaSort className="text-gray-500" />
                  <span className="text-sm font-medium">{getCurrentSortLabel()}</span>
                  <FaChevronDown className={`transition-transform ${isSortDropdownOpen ? 'rotate-180' : ''} text-gray-400`} />
                </button>
                
                {isSortDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    <div className="py-2">
                      <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Sort By
                      </div>
                      {sortOptions.map(option => (
                        <button
                          key={option.id}
                          onClick={() => handleSortSelect(option.id)}
                          className={`w-full text-left px-4 py-2.5 text-sm flex items-center justify-between hover:bg-gray-50 ${
                            sortBy === option.id ? 'text-blue-600 font-medium bg-blue-50' : 'text-gray-700'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-lg">{option.icon}</span>
                            <span>{option.label}</span>
                          </div>
                          {sortBy === option.id && (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleSortOrder();
                                }}
                                className="p-1 hover:bg-blue-100 rounded"
                                title={sortOrder === 'desc' ? 'Descending' : 'Ascending'}
                              >
                                {sortOrder === 'desc' ? <FaArrowDown size={12} /> : <FaArrowUp size={12} />}
                              </button>
                              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Add Task Button */}
            <div className="hidden md:block">
              <Taskadd onClick={() => setIsModalOpen(true)} />
            </div>
          </div>
        </div>

        {/* Mobile Add Button */}
        <div className="md:hidden mb-4">
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
          >
            <FaPlus />
            Add New Task
          </button>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-0">
          {/* Left Column - Filters & Controls */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Filters */}
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
              <h3 className="text-gray-800 font-semibold mb-4 flex items-center gap-2">
                <FaFilter className="text-blue-500" />
                Quick Filters
              </h3>
              <div className="space-y-2">
                {filters.map(filter => (
                  <button
                    key={filter.id}
                    onClick={() => setActiveFilter(filter.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                      activeFilter === filter.id
                        ? 'bg-blue-50 border border-blue-200 text-blue-700'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <div className={`p-1.5 rounded ${
                      activeFilter === filter.id ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {filter.icon}
                    </div>
                    <span className="font-medium text-sm">{filter.label}</span>
                    <span className="ml-auto text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {filter.id === 'all' ? totalTasks :
                       filter.id === 'todo' ? todoTasks :
                       filter.id === 'in-progress' ? inProgressTasks :
                       doneTasks}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Progress */}
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-gray-800 font-semibold">Progress</h3>
                <span className="text-sm font-bold text-blue-600">{completionRate}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${completionRate}%` }}
                ></div>
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-500">
                <span>{doneTasks} done</span>
                <span>{totalTasks} total</span>
              </div>
            </div>
          </div>

          {/* Right Column - Task List - ALWAYS SCROLLABLE */}
          <div className="lg:col-span-3 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col overflow-hidden">
            {/* Task List Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-bold text-gray-800">Tasks</h3>
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                    {filteredTasks.length} items
                  </span>
                </div>
                
                {/* Status Info */}
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    To Do: {todoTasks}
                  </span>
                  <span className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    In Progress: {inProgressTasks}
                  </span>
                  <span className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Done: {doneTasks}
                  </span>
                </div>
              </div>
            </div>

            {/* Task List Content - ALWAYS SCROLLABLE */}
            <div className="flex-1 overflow-hidden">
              <div 
                ref={taskListRef}
                className="h-full overflow-y-auto custom-thin-scrollbar p-4"
                style={{ 
                  maxHeight: 'calc(100vh - 300px)', // Dynamic height based on viewport
                  minHeight: '200px'
                }}
              >
                {filteredTasks.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center py-12 px-4">
                    <div className="w-16 h-16 mx-auto mb-6 text-gray-300">
                      <FaTasks className="w-full h-full" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                      {searchTerm ? 'No tasks found' : 'No tasks yet'}
                    </h3>
                    <p className="text-gray-500 mb-6 text-center">
                      {searchTerm 
                        ? `No tasks match "${searchTerm}"` 
                        : 'Create your first task to get started'
                      }
                    </p>
                    <button
                      onClick={() => {
                        if (searchTerm) {
                          setSearchTerm('');
                          setActiveFilter('all');
                        } else {
                          setIsModalOpen(true);
                        }
                      }}
                      className="px-6 py-2.5 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center gap-2"
                    >
                      <FaPlus />
                      {searchTerm ? 'Clear Search' : 'Create First Task'}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3 pb-4">
                    {filteredTasks.map((task, index) => (
                      <motion.div
                        key={task._id || index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="group bg-gray-50 hover:bg-white rounded-lg border border-gray-200 hover:border-blue-300 p-4 transition-all hover:shadow-sm"
                      >
                        <div className="flex items-start justify-between">
                          {/* Left side - Task info */}
                          <div className="flex items-start gap-3 flex-1 min-w-0">
                            {/* Status indicator */}
                            <div className="mt-1">
                              <div className={`w-3 h-3 rounded-full ${
                                task.status === 'done' ? 'bg-green-500' :
                                task.status === 'in-progress' ? 'bg-blue-500' :
                                'bg-yellow-500'
                              }`} />
                            </div>
                            
                            {/* Task content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className={`text-base font-semibold truncate ${
                                  task.status === 'done' ? 'line-through text-gray-500' : 'text-gray-800'
                                }`}>
                                  {task.title}
                                </h4>
                                <span className={`px-2 py-0.5 text-xs rounded-full flex items-center gap-1 ${
                                  task.priority === 'high' ? 'bg-red-100 text-red-700' :
                                  task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                  'bg-green-100 text-green-700'
                                }`}>
                                  {task.priority === 'high' ? '🔥' : 
                                   task.priority === 'medium' ? '⚡' : '🌿'}
                                  <span className="capitalize">{task.priority}</span>
                                </span>
                              </div>
                              
                              {task.description && (
                                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                  {task.description}
                                </p>
                              )}
                              
                              {/* Task metadata */}
                              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                                <span className="flex items-center gap-1.5">
                                  {task.status === 'done' ? <FaCheckCircle className="text-green-500" /> :
                                   task.status === 'in-progress' ? <FaClock className="text-blue-500" /> :
                                   <FaClock className="text-yellow-500" />}
                                  <span className="capitalize">{task.status.replace('-', ' ')}</span>
                                </span>
                                
                                {task.dueDate && (
                                  <span className="flex items-center gap-1.5">
                                    <FaCalendarAlt />
                                    <span>
                                      {new Date(task.dueDate).toLocaleDateString('en-US', { 
                                        month: 'short', 
                                        day: 'numeric' 
                                      })}
                                    </span>
                                  </span>
                                )}
                                
                                {task.tags && task.tags.length > 0 && (
                                  <span className="flex items-center gap-1.5">
                                    <FaTag />
                                    <span>{task.tags[0]}</span>
                                    {task.tags.length > 1 && (
                                      <span className="text-xs bg-gray-200 px-1.5 py-0.5 rounded">
                                        +{task.tags.length - 1}
                                      </span>
                                    )}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          {/* Right side - Actions */}
                          <div className="flex items-center gap-1 ml-3">
                            <button
                              onClick={() => handleEditTask(task)}
                              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                              title="Edit task"
                            >
                              <FaEdit size={14} />
                            </button>
                            <button
                              onClick={() => handleDeleteTask(task._id)}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                              title="Delete task"
                            >
                              <FaTrash size={14} />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                              <FaEllipsisV size={14} />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="sticky bottom-0 z-20">
        <Dashnav />
      </div>

      {/* Task Modal */}
      <TaskModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal}
        onTaskCreated={() => {
          fetchTasks();
          setEditingTask(null);
        }}
        initialTask={editingTask}
      />

      {/* Custom Scrollbar CSS */}
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
    </div>
  );
};

export default Dashboard;