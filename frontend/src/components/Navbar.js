'use client';

import React, { useState } from 'react';
import UserProfileDropdown from '../UserProfileDropdown';
import ShowLogo from './ShowLogo';

function Navbar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <nav className="flex flex-col flex-auto antialiased flex-shrink-0">
      <div className="fixed w-full flex items-center justify-between h-14 text-white z-20 bg-white border-b border-gray-100 shadow">
        <div className="flex items-center justify-start md:justify-center ml-2 w-14 md:w-64 h-14">
          <button
            onClick={toggleSidebar}
            className="ml-3 text-black hover:text-gray-300 focus:outline-none md:hidden"
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
          <ShowLogo maxWidth="40px" maxHeight="40px" />
        </div>
        <div className="flex justify-between items-center h-14 header-right">

          <ul className="flex items-center">
            <li>
              <UserProfileDropdown />
            </li>
          </ul>
        </div>
      </div>
      {isSidebarOpen && <Sidebar />}
    </nav>
  );
}

export default Navbar;
