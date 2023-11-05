'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Newspaper, Home, User, Files, Settings,
} from 'lucide-react';
import DateTimeTrue from '@/components/Navbar/DateTime.js';
import {
  menuUser, menuDoc, dashboard, systemSetting, post,
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
import getSuperAdminStatus from '@/dep/core/getSuperAdminStatus';
import getThemeCookiesValueAsync from '@/dep/core/getThemeCookiesValueAsync';
import getThemeCookiesValue from '@/dep/core/getThemeCookiesValue';
// if nilai 1 2 99 buat misahin menunya antara sa, admin, user, admin gaada artucle, user cuma ada artikel
function SuperAdminMenu() {
  return (
    <ul className="flex flex-col py-4 space-y-1">
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

function AdminMenu() {
  return (
    <ul className="flex flex-col py-4 space-y-1">
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

function UserMenuCUD() {
  return (
    <ul className="flex flex-col py-4 space-y-1">
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
    </ul>
  );
}
function UserMenuR() {
  return (
    <ul className="flex flex-col py-4 space-y-1">
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
    </ul>
  );
}

function Sidebar({ initialTime }) {
  const userStatus = getSuperAdminStatus();
  const [menuComponent, setMenuComponent] = useState(null);
  const theme = JSON.parse(getThemeCookiesValue());
  useEffect(() => {
    if (userStatus === 1) {
      setMenuComponent(<SuperAdminMenu />);
    } else if (userStatus === 2) {
      setMenuComponent(<AdminMenu />);
    } else if (userStatus === 3) {
      setMenuComponent(<UserMenuCUD />);
    } else {
      setMenuComponent(<UserMenuR />);
    }
  }, [userStatus]);

  return (
    <div className="fixed hidden md:flex flex-col top-14 left-0 w-14 md:w-64 bg-neutral-50 text-black h-full z-10 border-r" style={{ backgroundColor: theme.secondary_color }}>
      <div className="overflow-y-auto overflow-x-hidden flex flex-col justify-between flex-grow mr-2">
        {menuComponent}
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
