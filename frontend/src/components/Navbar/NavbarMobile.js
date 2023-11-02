'use client';

import React, { useState } from 'react';
import UserProfileDropdown from './UserProfileDropdown';
import SidebarMobile from './SidebarMobile';
import HamburgerButton from './HamburgerButton';
import getThemeCookiesValue from '@/dep/core/getThemeCookiesValue';

function NavbarMobile() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const theme = JSON.parse(getThemeCookiesValue());
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <nav
        className="fixed z-20 flex h-14 w-full items-center justify-between bg-white border-b border-gray-100 shadow px-4 text-sm sm:px-16 md:hidden"
        style={{ backgroundColor: theme.secondary_color }}
      >
        <div
          className="flex cursor-pointer items-center gap-2 hover:opacity-60"
        >
          <HamburgerButton onClick={toggleSidebar} />
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
