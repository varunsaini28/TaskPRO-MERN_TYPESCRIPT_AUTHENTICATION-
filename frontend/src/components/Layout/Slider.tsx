import React, { useState } from 'react';
import { HiMiniBars3BottomLeft, HiXMark } from "react-icons/hi2";

const Slider = () => {
  const [open, setOpen] = useState(false);

  const handleSlide = () => {
    setOpen(prev => !prev); // toggle open/close
  };

  return (
    <div className='absolute top-18'>
      {/* Menu Icon */}
      <HiMiniBars3BottomLeft
        onClick={handleSlide}
        className="text-3xl cursor-pointer"
      />

      {/* Slider */}
      {open && (
        <div className="fixed top-16 left-0 w-[300px] h-[93%] bg-gray-600 text-white p-4 transition-all">
          
          {/* Close Icon */}
          <HiXMark
            onClick={handleSlide}
            className="text-2xl cursor-pointer mb-4"
          />

          <p>Slider Opened</p>
        </div>
      )}
    </div>
  );
};

export default Slider;
