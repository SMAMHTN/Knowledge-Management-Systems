'use client';

import React, { useState } from 'react';
import UserProfileDropdown from './UserProfileDropdown';
import SidebarMobile from './SidebarMobile';
import { hamburgerIcon } from '@/constants/icon';

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
            {hamburgerIcon}
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
