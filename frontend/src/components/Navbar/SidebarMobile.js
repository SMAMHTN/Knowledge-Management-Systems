'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  menuUser, menuDoc, dashboard, systemSetting,
} from '@/constants/menu';
import {
  dashboardIcon, settingsIcon, userIcon, docIcon,
} from '@/constants/icon';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import HamburgerButton from './HamburgerButton';

function SidebarMobile({ isSidebarOpen, toggleSidebar }) {
  return (
    <>
      {isSidebarOpen && <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-40 md:hidden" onClick={toggleSidebar} />}
      <div className={`fixed ${isSidebarOpen ? '' : 'hidden'} md:hidden flex-col left-0 w-64 bg-neutral-50 text-black h-full z-50`}>
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
          <ul className="flex flex-col pr-4 pl-3 space-y-1 mr-2 mt-14">
            <li>
              <Link
                href={dashboard.link}
                className="relative flex flex-row hover:underline items-center h-11 text-bold font-medium border-b"
              >
                <span className="inline-flex justify-center items-center ml-4">
                  {dashboardIcon}
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
                  {settingsIcon}
                </span>
                <span className="ml-2 text-sm tracking-wide truncate">
                  {systemSetting.title}
                </span>
              </Link>
            </li>
            <li />
          </ul>

        </div>
      </div>
    </>

  );
}
export default SidebarMobile;
