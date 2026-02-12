import React from 'react'
import { FaBell } from "react-icons/fa";

const Iconbell = () => {
  return (
    <div className="relative absolute right-[-10rem] inline-block ">
      <FaBell className="text-2xl text-gray-500 drop-shadow-lg cursor-pointer"  />

      {/* Notification Badge */}
      <span className="absolute -bottom-1 -right-1 bg-red-600 text-white text-[10px] 
                       rounded-full h-4 w-4 flex items-center justify-center">
        5
      </span>
    </div>
  );
};

export default Iconbell;
