import React, { useState } from 'react';
import { HiMiniBars3BottomLeft, HiXMark } from "react-icons/hi2";

const Slider = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Hamburger (Mobile Only) */}
      <HiMiniBars3BottomLeft
        onClick={() => setOpen(true)}
        className="text-3xl cursor-pointer md:hidden"
      />

      {/* Overlay (Mobile Only) */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 md:hidden ${
          open ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      />

      {/* Sidebar */}
      <div
        className={`
          fixed top-16 left-0 z-50
          w-[300px] h-[93%]
          bg-gray-400 text-white p-4

          transform transition-transform duration-300 ease-in-out
          ${open ? 'translate-x-0' : '-translate-x-full'}

          md:translate-x-0
        `}
      >
        {/* Close icon (Mobile Only) */}
        <HiXMark
          onClick={() => setOpen(false)}
          className="text-2xl cursor-pointer mb-4 md:hidden"
        />

        <p>Slider Content</p>
      </div>
    </>
  );
};

export default Slider;
