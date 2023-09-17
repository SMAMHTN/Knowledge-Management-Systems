'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getUserData, Logout } from '@/dep/core/coreHandler';
import { searchIcon, dashboardIcon } from '@/constants/icon';

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
    <section className="h-screen flex flex-col flex-auto">
      <div className=" flex flex-col">
        <div className="px-4 py-2 bg-gray-300 tracking-wide font-medium shadow rounded mb-4">
          <Link href="/dashboard" className="text-blue-500 hover:text-blue-800">
            Dashboard
          </Link>
          / Overview
        </div>
        <div className="space-y-4 mb-4">
          {userData && (
          <h1 className="mx-4 mb-8">
            Selamat datang
            {' '}
            {userData.Name}
          </h1>
          )}
          <div className="rounded-2xl shadow-3xl">
            <form className="flex py-2 px-2 md:px-20 mb-14">
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
            </form>
          </div>
          {userData && (
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
          )}
        </div>
      </div>
    </section>
  );
}
export default Home;
