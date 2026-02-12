import React from 'react';
import type { Task } from '../../types/task.types';
import { FaCalendarAlt, FaTag, FaClock, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

interface TaskListProps {
  tasks: Task[];
  onTaskUpdate: () => void;
  onEdit: (task: Task) => void;
}

const TaskList: React.FC<TaskListProps> = ({ 
  tasks, 
  onTaskUpdate, 
  onEdit 
}) => {
  if (tasks.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8">
        <div className="w-16 h-16 mb-4 text-gray-300">
          <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-700 mb-2">No tasks</h3>
        <p className="text-gray-500 text-center">Create your first task to get started</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Outer container with overflow hidden */}
      <div className="flex-1 overflow-hidden">
        {/* Inner container with scrollbar */}
        <div className="h-full overflow-y-auto pr-2 custom-thin-scrollbar">
          <div className="space-y-3 pb-4">
            {tasks.map((task) => (
              <div
                key={task._id}
                className="bg-white rounded-lg border border-gray-200 p-4 hover:border-blue-300 hover:shadow-sm transition-all"
              >
                <div className="flex items-start justify-between">
                  {/* Task content */}
                  <div className="flex items-start gap-3 flex-1">
                    {/* Status indicator */}
                    <div className={`mt-1 w-2 h-2 rounded-full ${
                      task.status === 'done' ? 'bg-green-500' :
                      task.status === 'in-progress' ? 'bg-blue-500' :
                      'bg-yellow-500'
                    }`} />
                    
                    <div className="flex-1 min-w-0">
                      {/* Title and priority */}
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className={`text-sm font-medium truncate ${
                          task.status === 'done' ? 'line-through text-gray-500' : 'text-gray-800'
                        }`}>
                          {task.title}
                        </h4>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          task.priority === 'high' ? 'bg-red-100 text-red-700' :
                          task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {task.priority}
                        </span>
                      </div>
                      
                      {/* Description */}
                      {task.description && (
                        <p className="text-gray-600 text-xs line-clamp-2 mb-2">
                          {task.description}
                        </p>
                      )}
                      
                      {/* Metadata */}
                      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                        {/* Status */}
                        <span className="flex items-center gap-1">
                          {task.status === 'done' ? <FaCheckCircle size={10} /> :
                           task.status === 'in-progress' ? <FaClock size={10} /> :
                           <FaClock size={10} />}
                          {task.status}
                        </span>
                        
                        {/* Due date */}
                        {task.dueDate && (
                          <span className="flex items-center gap-1">
                            <FaCalendarAlt size={10} />
                            {new Date(task.dueDate).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </span>
                        )}
                        
                        {/* Tags */}
                        {task.tags && task.tags.length > 0 && (
                          <span className="flex items-center gap-1">
                            <FaTag size={10} />
                            {task.tags[0]}
                            {task.tags.length > 1 && ` +${task.tags.length - 1}`}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Action buttons */}
                  <div className="flex items-center gap-1 ml-2">
                    <button
                      onClick={() => onEdit(task)}
                      className="p-1 text-gray-400 hover:text-blue-500 rounded"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .custom-thin-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #cbd5e1 #f1f5f9;
        }
        
        .custom-thin-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        
        .custom-thin-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 2px;
        }
        
        .custom-thin-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 2px;
        }
        
        .custom-thin-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
};

export default TaskList;