'use client';

import React, { useState } from 'react';
import UserProfileDropdown from './UserProfileDropdown';
import SidebarMobile from './SidebarMobile';

function NavbarMobile() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <nav
        className="fixed z-20 flex h-14 w-full items-center justify-between bg-white border-b border-gray-100 shadow px-4 text-sm sm:px-16 md:hidden"
      >
        <div
          className="flex cursor-pointer items-center gap-2 hover:opacity-60"
        >
          <button
            onClick={toggleSidebar}
            className="ml-3 text-black hover:text-gray-300 focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
        <div className="flex items-center gap-3 sm:gap-5">
          <UserProfileDropdown />
        </div>
      </nav>
      <SidebarMobile isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
    </>
  );
}

export default NavbarMobile;
