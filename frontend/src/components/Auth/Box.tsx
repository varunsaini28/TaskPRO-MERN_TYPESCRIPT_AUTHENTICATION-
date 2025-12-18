import React from 'react';
import { authService } from '../../services/auth.service';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser } from "react-icons/fa";
import { IoLogOut } from "react-icons/io5";

interface BoxProps {
  onLogout: () => void;
}

const Box: React.FC<BoxProps> = ({ onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authService.logout();
      onLogout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50 overflow-hidden">
      <div className="py-1">
        <Link
          to="/profile"
          className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors border-b border-gray-100"
        >
          <FaUser className="text-gray-500" />
          Profile
        </Link>
        
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
        >
          <IoLogOut className="text-lg" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Box;