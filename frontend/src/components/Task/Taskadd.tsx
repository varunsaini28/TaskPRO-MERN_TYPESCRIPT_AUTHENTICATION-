import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface TaskaddProps {
  onClick: () => void;
}

const Taskadd: React.FC<TaskaddProps> = ({ onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="relative"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <button
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative"
        aria-label="Add new task"
      >
        {/* Main button */}
        <div className="relative flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-blue-500 hover:bg-blue-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
          {/* Plus icon */}
          <svg 
            className={`relative w-5 h-5 md:w-6 md:h-6 text-white transition-transform duration-300 ${
              isHovered ? 'rotate-90 scale-110' : ''
            }`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2.5} 
              d="M12 4v16m8-8H4" 
            />
          </svg>
          
          {/* Ring animation on hover */}
          {isHovered && (
            <motion.div
              className="absolute inset-0 border-2 border-blue-400 rounded-full"
              initial={{ scale: 1, opacity: 0.5 }}
              animate={{ scale: 1.3, opacity: 0 }}
              transition={{ duration: 0.5 }}
            />
          )}
        </div>

        {/* Tooltip */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden md:block"
        >
          <div className="bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap shadow-lg">
            Add Task
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
          </div>
        </motion.div>
      </button>
    </motion.div>
  );
};

export default Taskadd;