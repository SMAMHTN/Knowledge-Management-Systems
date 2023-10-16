'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { MoreHorizontal } from 'lucide-react';
import {
  CoreAPI, CoreAPIGET, getUserData, Logout,
} from '@/dep/core/coreHandler';
import { searchIcon, dashboardIcon } from '@/constants/icon';
import { Separator } from '@/components/SmComponent';
import listhistory from '../(user)/activity-log/page';
import { URLParamsBuilder } from '@/dep/others/HandleParams';
import { KmsAPIGET } from '@/dep/kms/kmsHandler';

function Home() {
  const [error, setError] = useState('');
  const [userData, setUserData] = useState('');
  const [logData, setLogData] = useState([]);
  const [articleData, setArticleData] = useState([]);
  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getUserData();
        setUserData(data);
        const log = await CoreAPIGET(URLParamsBuilder('listhistory'));
        setLogData(log.body.Data);
        const article = await KmsAPIGET(URLParamsBuilder('listarticle'));
        setArticleData(article.body.Data);
        console.log(articleData);
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
          {userData && (
          <p className="mb-4 font-medium">
            Welcome &nbsp;
            {userData.Name}
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
            <div className="bg-blue-200 col-span-2 row-span-2 p-4 rounded-lg flex flex-col">
              <div className="flex items-center justify-between">
                <h1 className="hidden lg:flex text-l font-semibold">Category | This Month</h1>
                <h1 className="flex lg:hidden text-l font-semibold">Category</h1>
                <MoreHorizontal size={24} color="gray" />
              </div>
              <p className="text-l font-bold">$3,264</p>
              <p className="text-green-600">8% increase</p>
            </div>
            <div className="bg-green-200 col-span-2 row-span-2 col-start-3 p-4 rounded-lg flex flex-col">
              <div className="flex items-center justify-between">
                <h1 className="hidden lg:flex text-l font-semibold">Article | This Month</h1>
                <h1 className="flex lg:hidden text-l font-semibold">Article</h1>
                <MoreHorizontal size={24} color="gray" />
              </div>
              {articleData.map((item) => (
                <p className="text-sm px-1" key={item.ArticleID}>
                  -
                  {' '}
                  {item.Title}
                </p>
              ))}
            </div>
            <div className="bg-red-200 col-span-2 row-span-4 col-start-5 p-4 rounded-lg flex flex-col">
              <div className="flex items-center justify-between">
                <h1 className="hidden lg:flex text-l font-semibold"> Recent Activity | This Month</h1>
                <h1 className="flex lg:hidden text-l font-semibold">Recent Activity </h1>
                <MoreHorizontal size={24} color="gray" />
              </div>
              {logData.map((item) => (
                <p className="text-sm px-1" key={item.HistoryID}>
                  -
                  {' '}
                  {item.Changes}
                </p>
              ))}
            </div>
            <div className="bg-yellow-200 col-span-4 row-span-2 row-start-3 p-4 rounded-lg flex flex-col">
              <div className="flex items-center justify-between">
                <h1 className="hidden lg:flex text-l font-semibold">Revenue | This Month</h1>
                <h1 className="flex lg:hidden text-l font-semibold">Revenue</h1>
                <MoreHorizontal size={24} color="gray" />
              </div>
              <p className="text-l font-bold">$3,264</p>
              <p className="text-green-600">8% increase</p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
export default Home;
