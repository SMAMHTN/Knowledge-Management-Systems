'use client';

import React from 'react';
import Link from 'next/link';
import DateTimeTrue from '@/components/Navbar/DateTime.js';
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

function Sidebar({ initialTime }) {
  return (
    <div className="fixed hidden md:flex flex-col top-14 left-0 w-14 md:w-64 bg-neutral-50 text-black h-full z-10">
      <div className="overflow-y-auto overflow-x-hidden flex flex-col justify-between flex-grow mr-2">
        <ul className="flex flex-col py-4 space-y-1">

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
      <div className="mb-14 px-5 py-3 hidden md:block text-center text-xs">
        <DateTimeTrue initialTime={initialTime} />
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  return {
    props: {
      initialTime: new Date().toISOString(),
    },
  };
}

export default Sidebar;
