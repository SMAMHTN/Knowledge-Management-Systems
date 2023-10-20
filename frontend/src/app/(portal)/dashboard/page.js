'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import {
  MoreHorizontal, Check, X,
  Users, Tag,
} from 'lucide-react';

import {
  CoreAPI, CoreAPIGET, getUserData, Logout,
} from '@/dep/core/coreHandler';
import { searchIcon, dashboardIcon } from '@/constants/icon';
import { Separator } from '@/components/SmComponent';
import listhistory from '../(user)/activity-log/page';
import { URLParamsBuilder } from '@/dep/others/HandleParams';
import { KmsAPIGET } from '@/dep/kms/kmsHandler';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import WidgetActivityLog from './widget/WidgetActivityLog';
import WidgetArticle from './widget/WidgetArticle';
import WidgetUser from './widget/WidgetUser';
import WidgetRole from './widget/WidgetRole';

function Home() {
  const [error, setError] = useState('');
  const [userData, setUserData] = useState('');
  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getUserData();
        setUserData(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }

    fetchData();
  }, []);

  return (
    <section className="w-full">
      <div className=" flex flex-auto w-full h-screen">
        <div className="flex flex-col w-full">

          <h2 className="text-2xl font-semibold mb-1">Dashboard</h2>
          {userData ? (
            <p className="mb-4 font-medium">
              Welcome &nbsp;
              {userData.Name ? userData.Name : 'User'}
            </p>
          ) : (
            <p className="mb-4 font-medium">
              Welcome &nbsp;
              User
            </p>
          )}

          <Separator className="mb-4" />
          <div className="space-y-4 mb-4">

            <div className="rounded-l shadow-3xl">
              {/* <form className="flex py-2 px-2 md:px-20 mb-14">
              <span className="flex bg-white border-r-0 border rounded-tl rounded-bl pl-2 pr-3 shadow-md">{ searchIcon }</span>
              <input
                type="text"
                placeholder=" Search Document here..."
                className=" w-full text-[14px] outline-none pr-2 py-2 shadow-md"
              />
              <button
                type="submit"
                className=" text-light text-white shadow-md rounded-tr rounded-br bg-blue-500 hover:bg-blue-600 px-2 md:px-4"
              >
                Search
              </button>
            </form> */}
            </div>
            {/* {userData && (
          <>
            <Link href="/settings" className="block bg-blue-500 hover:bg-blue-600 text-white rounded px-4 py-2">
              Settings
            </Link>
            <Link href="/documents" className="block bg-blue-500 hover:bg-blue-600 text-white rounded px-4 py-2">
              Management Dokumen
            </Link>
            <Link href="/management-s-admin" className="block bg-blue-500 hover:bg-blue-600 text-white rounded px-4 py-2">
              Management S.Admin
            </Link>
          </>
          )} */}

          </div>
          <div className="grid grid-cols-6 grid-rows-4 gap-4 w-full h-full">
            <div className="bg-white col-span-2 row-span-2 p-4 rounded-lg flex flex-col">
              <div className="flex items-center justify-between">
                <div>
                  <Users size={48} />
                  <h1 className="text-gray-500 text-sm font-semibold">User Stats </h1>
                </div>
              </div>
              <WidgetUser />
            </div>
            <div className="bg-white col-span-2 row-span-2 col-start-3 p-4 rounded-lg flex flex-col">
              <div className="flex items-center justify-between">
                <div>
                  <Tag size={48} />
                  <h1 className="text-gray-500 text-sm font-semibold">Role Stats </h1>
                </div>
              </div>
              <WidgetRole />
            </div>
            <div className="bg-white col-span-2 row-span-4 col-start-5 p-4 rounded-lg flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-l font-semibold">Recent Activity </h1>
                <MoreHorizontal size={24} color="gray" />
              </div>
              <WidgetActivityLog />
            </div>
            <div className="bg-white col-span-4 row-span-2 row-start-3 p-4 rounded-lg flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h1 className="hidden lg:flex text-l font-semibold">Recent Article</h1>
                <h1 className="flex lg:hidden text-l font-semibold">Article</h1>
                <MoreHorizontal size={24} color="gray" />
              </div>
              <WidgetArticle />
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
export default Home;
