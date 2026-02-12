import React, { useState } from 'react';
import { MdAdd, MdSchool, MdBusinessCenter, MdMoreHoriz } from 'react-icons/md';
import { FaGraduationCap, FaHome } from 'react-icons/fa';
import { GiRoad } from 'react-icons/gi';
import { useNavigate, useLocation } from 'react-router-dom';

const Dashnav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showAddMore, setShowAddMore] = useState(false);

  // Extract active category from path
  const getActiveCategory = () => {
    const path = location.pathname.split('/')[1];
    return path || 'general';
  };

  const categories = [
    { 
      id: 'general', 
      label: 'General', 
      icon: <FaHome className="text-lg" />,
      color: 'bg-blue-500 hover:bg-blue-600',
      textColor: 'text-white',
      path: '/general'
    },
    { 
      id: 'school', 
      label: 'School', 
      icon: <MdSchool className="text-lg" />,
      color: 'bg-green-500 hover:bg-green-600',
      textColor: 'text-white',
      path: '/school'
    },
    { 
      id: 'college', 
      label: 'College', 
      icon: <FaGraduationCap className="text-lg" />,
      color: 'bg-purple-500 hover:bg-purple-600',
      textColor: 'text-white',
      path: '/college'
    },
    { 
      id: 'work', 
      label: 'Work', 
      icon: <MdBusinessCenter className="text-lg" />,
      color: 'bg-orange-500 hover:bg-orange-600',
      textColor: 'text-white',
      path: '/work'
    },
    { 
      id: 'roadmaps', 
      label: 'Roadmaps', 
      icon: <GiRoad className="text-lg" />,
      color: 'bg-indigo-500 hover:bg-indigo-600',
      textColor: 'text-white',
      path: '/roadmaps'
    },
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: <MdMoreHoriz className="text-lg" />,
      color: 'bg-gray-400 hover:bg-gray-500',
      textColor: 'text-white',
      path: '/dashboard'
    },
  ];

  const additionalCategories = [
    { id: 'personal', label: 'Personal', color: 'bg-pink-500' },
    { id: 'fitness', label: 'Fitness', color: 'bg-red-500' },
    { id: 'learning', label: 'Learning', color: 'bg-teal-500' },
    { id: 'projects', label: 'Projects', color: 'bg-amber-500' },
    { id: 'shopping', label: 'Shopping', color: 'bg-cyan-500' },
    { id: 'travel', label: 'Travel', color: 'bg-lime-500' },
  ];

  const handleCategoryClick = (path: string) => {
    navigate(path);
    setShowAddMore(false);
  };

  const handleAddCategory = (category: any) => {
    console.log(`Added ${category.label} category`);
    setShowAddMore(false);
  };

  const activeCategory = getActiveCategory();

  return (
    <div className='fixed left-1/2 -translate-x-1/2 bottom-4 w-[95%] max-w-4xl z-40'>
      {/* Main Navigation Bar */}
      <div className='h-19 md:h-19 rounded-full bg-gray-800 shadow-2xl flex items-center px-4 md:px-6 relative backdrop-blur-sm bg-opacity-90'>
        {/* Category Ovals */}
        <div className='flex items-center space-x-2 md:space-x-3 w-full justify-between'>
          {categories.map((category) => (
            <button 
              key={category.id}
              onClick={() => handleCategoryClick(category.path)}
              className={`flex flex-col items-center justify-center transition-all duration-300 ${
                activeCategory === category.id 
                  ? 'transform -translate-y-2' 
                  : 'opacity-90 hover:opacity-100'
              }`}
            >
              {/* Oval Container */}
              <div className={`w-12 h-12 md:w-14 md:h-14 rounded-full ${category.color} flex items-center justify-center shadow-lg transition-transform ${
                activeCategory === category.id ? 'scale-110 ring-2 ring-white ring-offset-2 ring-offset-gray-800' : ''
              }`}>
                <span className={category.textColor}>
                  {category.icon}
                </span>
              </div>
              
              {/* Label */}
              <span className={`text-xs md:text-sm font-medium mt-1 ${
                activeCategory === category.id 
                  ? 'text-white font-bold' 
                  : 'text-gray-300'
              }`}>
                {category.label}
              </span>
            </button>
          ))}
        </div>

        {/* Add More Dropdown */}
        {showAddMore && (
          <div className='absolute bottom-full right-0 mb-2 w-64 bg-gray-900 rounded-2xl shadow-2xl p-4 z-50 border border-gray-700'>
            <div className='flex items-center justify-between mb-3'>
              <h3 className='text-white font-semibold'>Add Categories</h3>
              <button 
                onClick={() => setShowAddMore(false)}
                className='text-gray-400 hover:text-white'
              >
                ×
              </button>
            </div>
            
            <div className='grid grid-cols-2 gap-3'>
              {additionalCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleAddCategory(category)}
                  className={`${category.color} rounded-xl p-3 flex flex-col items-center justify-center hover:opacity-90 transition-opacity`}
                >
                  <span className='text-white font-medium text-sm'>{category.label}</span>
                  <span className='text-white text-xs mt-1'>+ Add</span>
                </button>
              ))}
            </div>
            
            <div className='mt-4 pt-3 border-t border-gray-700'>
              <button className='w-full py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors'>
                Create Custom Category
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashnav;