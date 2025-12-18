import React, { useState, useMemo, useEffect } from 'react';
import Search from '../components/Task/Search';
import Taskadd from '../components/Task/Taskadd';
import TaskList from '../components/Task/TaskList';
import TaskModal from '../components/Task/TaskModal';
import { useTasks } from '../contexts/TaskContext';

const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTasks, setFilteredTasks] = useState([]);
  const { tasks, loading, error, fetchTasks } = useTasks();

  // Filter tasks based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredTasks(tasks);
      return;
    }
    
    const term = searchTerm.toLowerCase();
    const filtered = tasks.filter(task =>
      task.title.toLowerCase().includes(term) ||
      task.description?.toLowerCase().includes(term) ||
      task.priority.toLowerCase().includes(term) ||
      task.status.toLowerCase().includes(term)
    );
    setFilteredTasks(filtered);
  }, [tasks, searchTerm]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading tasks...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-500 text-2xl">!</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Something went wrong</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={fetchTasks}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium shadow-md hover:shadow-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Calculate stats based on filtered tasks
  const totalTasks = filteredTasks.length;
  const todoTasks = filteredTasks.filter(t => t.status === 'todo').length;
  const inProgressTasks = filteredTasks.filter(t => t.status === 'in-progress').length;
  const doneTasks = filteredTasks.filter(t => t.status === 'done').length;
  const highPriorityTasks = filteredTasks.filter(t => t.priority === 'high').length;
  const lowPriorityTasks = filteredTasks.filter(t => t.priority === 'low').length;

  return (
    <div className='w-full h-screen absolute top-[45px]'>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="pt-0">
          <div className="p-4 md:p-6">
            {/* Header Section */}
            <div className="mb-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">
                    Task Dashboard
                  </h1>
                  <p className="text-gray-600">
                    Manage your tasks efficiently and stay organized
                  </p>
                </div>
                
                {/* Stats */}
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Total Tasks</p>
                    <p className="text-2xl font-bold text-gray-800">{totalTasks}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-500">To Do</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {todoTasks}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Search Bar - Fixed with onSearch prop */}
              <div className="max-w-xl">
                <Search onSearch={handleSearch} />
                {searchTerm && (
                  <div className="mt-2 text-sm text-gray-600">
                    Showing {filteredTasks.length} of {tasks.length} tasks matching "{searchTerm}"
                  </div>
                )}
              </div>
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Side - Quick Actions & Stats */}
              <div className="lg:col-span-3 space-y-6">
                {/* Add Task Button */}
                <div className="bg-white rounded-xl shadow p-5">
                  <h2 className="text-lg font-semibold text-gray-700 mb-4">Create New Task</h2>
                  <Taskadd onClick={() => setIsModalOpen(true)} />
                </div>
                
                {/* Stats Overview */}
                <div className="bg-white rounded-xl shadow p-5">
                  <h3 className="font-medium text-gray-700 mb-4">Task Overview</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-600">To Do</span>
                        <span className="text-sm font-medium text-gray-700">
                          {todoTasks}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{ 
                            width: `${tasks.length ? (todoTasks / tasks.length * 100) : 0}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-600">In Progress</span>
                        <span className="text-sm font-medium text-gray-700">
                          {inProgressTasks}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-yellow-500 h-2 rounded-full" 
                          style={{ 
                            width: `${tasks.length ? (inProgressTasks / tasks.length * 100) : 0}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-600">Done</span>
                        <span className="text-sm font-medium text-gray-700">
                          {doneTasks}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{ 
                            width: `${tasks.length ? (doneTasks / tasks.length * 100) : 0}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Quick Stats */}
                <div className="bg-white rounded-xl shadow p-5">
                  <h3 className="font-medium text-gray-700 mb-4">Quick Stats</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">
                        {highPriorityTasks}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">High Priority</p>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">
                        {lowPriorityTasks}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">Low Priority</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Task List (Main Area) */}
              <div className="lg:col-span-9">
                <div className="bg-white rounded-xl shadow overflow-hidden h-full">
                  <div className="p-5 border-b bg-gray-50">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <h2 className="text-xl font-bold text-gray-800">All Tasks</h2>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-600">
                          Showing {filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''}
                          {searchTerm && ` for "${searchTerm}"`}
                        </span>
                        <button
                          onClick={() => setIsModalOpen(true)}
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium text-sm flex items-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                          Add Task
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-5">
                    {filteredTasks.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="w-24 h-24 mx-auto mb-4 text-gray-300">
                          <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-700 mb-2">
                          {searchTerm ? 'No tasks found' : 'No tasks yet'}
                        </h3>
                        <p className="text-gray-500 mb-6">
                          {searchTerm 
                            ? `No tasks match "${searchTerm}"` 
                            : 'Get started by creating your first task'
                          }
                        </p>
                        <button
                          onClick={() => setIsModalOpen(true)}
                          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                        >
                          {searchTerm ? 'Clear Search' : 'Create Your First Task'}
                        </button>
                        {searchTerm && (
                          <button
                            onClick={() => setSearchTerm('')}
                            className="ml-3 px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                          >
                            Clear Search
                          </button>
                        )}
                      </div>
                    ) : (
                      <TaskList 
                        tasks={filteredTasks} 
                        onTaskUpdate={fetchTasks}
                        searchTerm={searchTerm}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <TaskModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)}
        />
      </div>
    </div>
  );
};

export default Dashboard;