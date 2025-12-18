import React, { useState, useMemo } from 'react';
import TaskCard from './TaskCard';
import Search from './Search';
import type { Task } from '../../types/task.types';

interface TaskListProps {
  tasks: Task[];
  onTaskUpdate: () => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onTaskUpdate }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter tasks based on search term
  const filteredTasks = useMemo(() => {
    if (!searchTerm.trim()) return tasks;
    
    const term = searchTerm.toLowerCase();
    return tasks.filter(task =>
      task.title.toLowerCase().includes(term) ||
      task.description?.toLowerCase().includes(term) ||
      task.priority.toLowerCase().includes(term) ||
      task.status.toLowerCase().includes(term)
    );
  }, [tasks, searchTerm]);

  const todoTasks = filteredTasks.filter(task => task.status === 'todo');
  const inProgressTasks = filteredTasks.filter(task => task.status === 'in-progress');
  const doneTasks = filteredTasks.filter(task => task.status === 'done');

  const renderColumn = (title: string, tasks: Task[], color: string) => (
    <div className="flex-1 min-w-[300px]">
      <div className={`${color} text-white px-4 py-2 rounded-t-lg font-medium`}>
        {title} ({tasks.length})
      </div>
      <div className="bg-white rounded-b-lg shadow p-4 min-h-[400px]">
        {tasks.length === 0 ? (
          <div className="text-gray-400 text-center py-8">
            {searchTerm ? 'No matching tasks' : `No tasks in ${title.toLowerCase()}`}
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.map(task => (
              <TaskCard 
                key={task._id} 
                task={task} 
                onTaskUpdate={onTaskUpdate}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="p-4 space-y-6">
      {/* Search Bar */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">My Tasks</h2>
        <div className="w-80">
          <Search 
            onSearch={setSearchTerm}
            placeholder="Search by title, description, priority..."
          />
        </div>
      </div>

      {/* Task Columns */}
      <div className="flex flex-col lg:flex-row gap-6">
        {renderColumn('To Do', todoTasks, 'bg-gray-500')}
        {renderColumn('In Progress', inProgressTasks, 'bg-blue-500')}
        {renderColumn('Done', doneTasks, 'bg-green-500')}
      </div>

      {/* Search Results Info */}
      {searchTerm && (
        <div className="text-center text-gray-600">
          Found {filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''} 
          matching "{searchTerm}"
        </div>
      )}
    </div>
  );
};

export default TaskList;