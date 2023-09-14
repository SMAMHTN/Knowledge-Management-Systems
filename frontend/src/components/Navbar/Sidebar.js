'use client';

import React from 'react';
import Link from 'next/link';
import DateTimeTrue from '@/components/Navbar/DateTime.js';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

function Sidebar({ initialTime }) {
  return (
    <div className="fixed hidden md:flex flex-col top-14 left-0 w-14 md:w-64 bg-neutral-50 text-black h-full transition-all duration-300 ease-in-out border-none z-10">
      <div className="overflow-y-auto overflow-x-hidden flex flex-col justify-between flex-grow mr-2">
        <ul className="flex flex-col py-4 space-y-1">

          <li>
            <Link
              href="/dashboard"
              className="relative flex flex-row hover:underline items-center h-11 text-bold font-medium border-b
              "
            >
              <span className="inline-flex justify-center items-center ml-4">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
              </span>
              <span className="ml-2 text-sm tracking-wide truncate">
                Dashboard
              </span>
            </Link>
          </li>
          <li>
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger className="w-full text-left h-11 flex items-center">
                  <div className="flex items-center ml-4">
                    <span className="inline-flex justify-center items-center mt-1">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </span>
                    <span className="ml-2 text-sm tracking-wide truncate">
                      Users
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-1 mt-2">
                    <Link href="/user" className="text-sm block hover:underline pl-6 pr-4 py-1">
                      {' '}
                      Users
                    </Link>
                    <Link href="/roles" className="text-sm  block hover:underline pl-6 pr-4 py-1">
                      {' '}
                      Roles
                    </Link>
                    <Link href="/activity-log" className="text-sm hover:underline block pl-6 pr-4 py-1">
                      {' '}

                      Activity Log
                    </Link>
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
                      <svg fill="#000000" className="w-5 h-5" viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg">
                        <path d="M 15.5547 53.125 L 40.4453 53.125 C 45.2969 53.125 47.7109 50.6640 47.7109 45.7890 L 47.7109 24.5078 C 47.7109 21.4844 47.3828 20.1718 45.5078 18.2500 L 32.5703 5.1015 C 30.7891 3.2734 29.3359 2.8750 26.6875 2.8750 L 15.5547 2.8750 C 10.7266 2.8750 8.2891 5.3594 8.2891 10.2344 L 8.2891 45.7890 C 8.2891 50.6875 10.7266 53.125 15.5547 53.125 Z M 15.7422 49.3515 C 13.3281 49.3515 12.0625 48.0625 12.0625 45.7187 L 12.0625 10.3047 C 12.0625 7.9844 13.3281 6.6484 15.7656 6.6484 L 26.1718 6.6484 L 26.1718 20.2656 C 26.1718 23.2187 27.6718 24.6718 30.5781 24.6718 L 43.9375 24.6718 L 43.9375 45.7187 C 43.9375 48.0625 42.6953 49.3515 40.2578 49.3515 Z M 31.0000 21.1328 C 30.0859 21.1328 29.7109 20.7578 29.7109 19.8203 L 29.7109 7.3750 L 43.2109 21.1328 Z" />
                      </svg>
                    </span>

                    <span className="ml-2 text-sm tracking-wide truncate">
                      Documents
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-1 mt-2">
                    <Link href="/article" className="text-sm hover:underline block pl-6 pr-4 py-1">
                      {' '}
                      Article
                    </Link>
                    <Link href="/category" className="text-sm hover:underline block pl-6 pr-4 py-1">
                      {' '}
                      Category
                    </Link>
                    <Link href="/permission" className="text-sm hover:underline block pl-6 pr-4 py-1">
                      {' '}
                      Permission
                    </Link>
                    <Link href="/document" className="text-sm hover:underline block pl-6 pr-4 py-1">
                      {' '}
                      File List
                    </Link>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

          </li>
          <li>
            <Link
              href="/settings"
              className="relative flex flex-row hover:underline items-center h-11 text-bold font-medium"
            >
              <span className="inline-flex justify-center items-center ml-4">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </span>
              <span className="ml-2 text-sm tracking-wide truncate">
                Settings
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
