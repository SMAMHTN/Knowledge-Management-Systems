'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Newspaper, Home, User, Files, Settings,
} from 'lucide-react';
import {
  menuUser, menuDoc, dashboard, systemSetting, post,
} from '@/constants/menu';
import { settingsIcon, userIcon, docIcon } from '@/constants/icon';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import HamburgerButton from './HamburgerButton';
import getSuperAdminStatus from '@/dep/core/getSuperAdminStatus';
import getThemeCookiesValue from '@/dep/core/getThemeCookiesValue';

function SuperAdminMenu() {
  return (
    <ul className="flex flex-col pr-4 pl-3 space-y-1 mr-2 mt-14">
      <li>
        <Link
          href={dashboard.link}
          className="relative flex flex-row hover:underline items-center h-11 text-bold font-medium border-b"
        >
          <span className="inline-flex justify-center items-center ml-4">
            <Home />
          </span>
          <span className="ml-2 text-sm tracking-wide truncate">
            {dashboard.title}
          </span>
        </Link>
      </li>
      <li>
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger className="w-full text-left h-11 flex items-center">
              <div className="flex items-center ml-4">
                <span className="inline-flex justify-center items-center mt-1">
                  <User />
                </span>
                <span className="ml-2 text-sm tracking-wide truncate">
                  Users
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-1 mt-2">
                {menuUser.map((menuItem) => (
                  <Link key={menuItem.id} href={menuItem.link} className="text-sm block hover:underline pl-6 pr-4 py-1">
                    {menuItem.title}
                  </Link>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

      </li>
      <li>
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger className="w-full text-left h-11 flex items-center">
              <div className="flex items-center ml-4">
                <span className="inline-flex justify-center items-center mt-1">
                  <Files />
                </span>

                <span className="ml-2 text-sm tracking-wide truncate">
                  Documents
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-1 mt-2">
                {menuDoc.map((menuItem) => (
                  <Link key={menuItem.id} href={menuItem.link} className="text-sm block hover:underline pl-6 pr-4 py-1">
                    {menuItem.title}
                  </Link>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

      </li>
      <li>
        <Link
          href={systemSetting.link}
          className="relative flex flex-row hover:underline items-center h-11 text-bold font-medium"
        >
          <span className="inline-flex justify-center items-center ml-4">
            <Settings />
          </span>
          <span className="ml-2 text-sm tracking-wide truncate">
            {systemSetting.title}
          </span>
        </Link>
      </li>
      <li />
    </ul>
  );
}

function AdminMenu() {
  return (
    <ul className="flex flex-col pr-4 pl-3 space-y-1 mr-2 mt-14">
      <li>
        <Link
          href={dashboard.link}
          className="relative flex flex-row hover:underline items-center h-11 text-bold font-medium border-b"
        >
          <span className="inline-flex justify-center items-center ml-4">
            <Home />
          </span>
          <span className="ml-2 text-sm tracking-wide truncate">
            {dashboard.title}
          </span>
        </Link>
      </li>
      <li>
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger className="w-full text-left h-11 flex items-center">
              <div className="flex items-center ml-4">
                <span className="inline-flex justify-center items-center mt-1">
                  {userIcon}
                </span>
                <span className="ml-2 text-sm tracking-wide truncate">
                  Users
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-1 mt-2">
                {menuUser.map((menuItem) => (
                  <Link key={menuItem.id} href={menuItem.link} className="text-sm block hover:underline pl-6 pr-4 py-1">
                    {menuItem.title}
                  </Link>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

      </li>
      <li>
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger className="w-full text-left h-11 flex items-center">
              <div className="flex items-center ml-4">
                <span className="inline-flex justify-center items-center mt-1">
                  {docIcon}
                </span>

                <span className="ml-2 text-sm tracking-wide truncate">
                  Documents
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-1 mt-2">
                {menuDoc.map((menuItem) => (
                  <Link key={menuItem.id} href={menuItem.link} className="text-sm block hover:underline pl-6 pr-4 py-1">
                    {menuItem.title}
                  </Link>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

      </li>
      <li>
        <Link
          href={systemSetting.link}
          className="relative flex flex-row hover:underline items-center h-11 text-bold font-medium"
        >
          <span className="inline-flex justify-center items-center ml-4">
            <Settings />
          </span>
          <span className="ml-2 text-sm tracking-wide truncate">
            {systemSetting.title}
          </span>
        </Link>
      </li>
      <li />
    </ul>
  );
}

function UserMenu() {
  return (
    <ul className="flex flex-col pr-4 pl-3 space-y-1 mr-2 mt-14">
      <li>
        <Link
          href={dashboard.link}
          className="relative flex flex-row hover:underline items-center h-11 text-bold font-medium border-b"
        >
          <span className="inline-flex justify-center items-center ml-4">
            <Home />
          </span>
          <span className="ml-2 text-sm tracking-wide truncate">
            {dashboard.title}
          </span>
        </Link>
      </li>
      <li>
        <Link
          href={post.link}
          className="relative flex flex-row hover:underline items-center h-11 text-bold font-medium border-b"
        >
          <span className="inline-flex justify-center items-center ml-4">
            <Newspaper />
          </span>
          <span className="ml-2 text-sm tracking-wide truncate">
            {post.title}
          </span>
        </Link>
      </li>
      <li />
    </ul>
  );
}

function SidebarMobile({ isSidebarOpen, toggleSidebar }) {
  const userStatus = getSuperAdminStatus();
  const [menuComponent, setMenuComponent] = useState(null);
  const theme = JSON.parse(getThemeCookiesValue());
  useEffect(() => {
    if (userStatus === 1) {
      setMenuComponent(<SuperAdminMenu />);
    } else if (userStatus === 2) {
      setMenuComponent(<AdminMenu />);
    } else {
      setMenuComponent(<UserMenu />);
    }
  }, [userStatus]);
  return (
    <>
      {isSidebarOpen && <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-40 md:hidden" onClick={toggleSidebar} />}
      <div className={`fixed ${isSidebarOpen ? '' : 'hidden'} md:hidden flex-col left-0 w-64 bg-neutral-50 text-black h-full z-50`} style={{ backgroundColor: theme.secondary_color }}>
        <div className="flex flex-col h-full">
          <div
            className="fixed z-20 flex h-14 items-center justify-between px-4 text-sm sm:px-16 md:hidden"
          >
            <div
              className="flex cursor-pointer items-center gap-2 hover:opacity-60"
            >
              <HamburgerButton onClick={toggleSidebar} />
            </div>
          </div>
          {menuComponent}

        </div>
      </div>
    </>

  );
}
export default SidebarMobile;
