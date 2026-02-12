import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import logo from '../../assets/logo.png';
import Box from '../Auth/Box';
import { MdHome, MdDashboard, MdDateRange } from "react-icons/md";
import { LuMessageCircleMore } from "react-icons/lu";
import Iconbell from '../Task/Iconbell';
import BellBox from '../Task/BellBox';

const Navbar: React.FC = () => {
  const [showBox, setShowBox] = useState(false);
  const [showBellBox, setShowBellBox] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();
  const location = useLocation();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
        setShowBox(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setShowBox(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const navItems = [
    { 
      icon: <MdHome className="text-2xl" />, 
      label: "Home", 
      path: "/" 
    },
    { 
      icon: <MdDashboard className="text-2xl" />, 
      label: "Dashboard", 
      path: "/dashboard" 
    },
    { 
      icon: <MdDateRange className="text-2xl" />, 
      label: "Calendar", 
      path: "/calendar" 
    },
    { 
      icon: <LuMessageCircleMore className="text-2xl" />, 
      label: "Messages", 
      path: "/messages" 
    },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="bg-white shadow-md fixed top-0 w-full z-50 hidden md:block">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <img src={logo} alt="logo" className="w-10 h-10 mr-3" />
              <span className="text-xl font-bold text-gray-800">
                Task<span className="text-blue-600 italic">Pro</span>
              </span>
            </Link>

            {/* Navigation Icons - Desktop */}
            <div className="flex items-center space-x-14">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex flex-col items-center justify-center ${
                    isActive(item.path) 
                      ? 'text-blue-600' 
                      : 'text-gray-600 hover:text-blue-500'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${
                    isActive(item.path) ? 'bg-blue-50' : ''
                  }`}>
                    {item.icon}
                  </div>
                  {/* <span className="text-xs mt-1 font-medium">{item.label}</span> */}
                </Link>
              ))}
            </div>

            {/* Auth Section - Profile in navbar */}
          
      {/* Bell icon */}
      <div   onClick={() => setShowBellBox(prev => !prev)}>
        <Iconbell />
      </div>

      {/* BellBox */}
      {showBellBox && <BellBox />}
    
            {user ? (
              <div className="relative" ref={boxRef}>
                <button
                  onClick={() => setShowBox(!showBox)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition"
                >
                  <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center font-semibold text-blue-600">
                    {user.email[0].toUpperCase()}
                  </div>
                  <div className="text-left hidden lg:block">
                    <p className="text-sm font-medium text-gray-700">{user.name}</p>
                    <p className="text-xs text-gray-500 truncate max-w-[150px]">{user.email}</p>
                  </div>
                </button>

                {showBox && <Box onLogout={handleLogout} />}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/login" 
                  className="text-gray-600 hover:text-blue-600 font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 font-medium"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Navbar */}
      <nav className="bg-white shadow-md fixed top-0 w-full z-50 md:hidden">
        <div className="px-4">
          <div className="flex justify-between h-14 items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <img src={logo} alt="logo" className="w-8 h-8 mr-2" />
              <span className="text-lg font-bold text-gray-800">
                Task<span className="text-blue-600 italic">Pro</span>
              </span>
            </Link>

            {/* Mobile Auth Section - Profile in navbar */}
            {user ? (
              <div className="relative" ref={boxRef}>
                <button
                  onClick={() => setShowBox(!showBox)}
                  className="flex items-center space-x-2"
                >
                  <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center font-semibold text-blue-600">
                    {user.email[0].toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-gray-700 hidden sm:block">
                    {user.name}
                  </span>
                </button>

                {showBox && (
                  <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="p-4 border-b border-gray-100">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-semibold text-blue-600">
                          {user.email[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-700">{user.name}</p>
                          <p className="text-sm text-gray-500 truncate">{user.email}</p>
                        </div>
                      </div>
                    </div>
                    <div className="py-2">
                      <Link
                        to="/profile"
                        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={() => setShowBox(false)}
                      >
                        <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                          <span className="text-xs">👤</span>
                        </div>
                        Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center">
                          <span className="text-xs">🚪</span>
                        </div>
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link 
                  to="/login" 
                  className="text-gray-600 hover:text-blue-600 font-medium text-sm"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-500 text-white px-3 py-1.5 rounded-lg hover:bg-blue-600 font-medium text-sm"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation (Only Icons) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 md:hidden">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center flex-1 ${
                isActive(item.path) 
                  ? 'text-blue-600' 
                  : 'text-gray-600'
              }`}
            >
              <div className={`p-2 rounded-full ${
                isActive(item.path) ? 'bg-blue-50' : ''
              }`}>
                {item.icon}
              </div>
              <span className="text-xs mt-1 font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Add padding for mobile bottom nav and navbar */}
      <div className="pt-14 pb-16 md:pt-16"></div>
    </>
  );
};

export default Navbar;