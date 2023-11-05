'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  MoreHorizontal,
  Users, Tag,
} from 'lucide-react';

import {
  CoreAPI, CoreAPIGET, getUserData, Logout,
} from '@/dep/core/coreHandler';
import { searchIcon } from '@/constants/icon';
import { Separator } from '@/components/SmComponent';
import WidgetActivityLog from './widget/WidgetActivityLog';
import WidgetArticleList from './widget/WidgetArticleList';
import WidgetUser from './widget/WidgetUser';
import WidgetRole from './widget/WidgetRole';
import UserGreetings from './UserGreetings';
import getSuperAdminStatus from '@/dep/core/getSuperAdminStatus';
import DashboardUser from './DashboardUser';
import WidgetCategory from './widget/WidgetCategory';
import WidgetArticle from './widget/WidgetArticle';
import WidgetDropdown from './widget/WidgetDropdown';
import getThemeCookiesValue from '@/dep/core/getThemeCookiesValue';

function DashboardSuperAdmin() {
  return (
    <>
      {' '}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-2">
        <div className="bg-white shadow-lg rounded-md flex items-center justify-between p-3 font-medium group">
          <WidgetUser />
        </div>
        <div className="bg-white shadow-lg rounded-md flex items-center justify-between p-3 font-medium group">
          <WidgetRole />
        </div>
        <div className="bg-white shadow-lg rounded-md flex items-center justify-between p-3 font-medium group">
          <WidgetCategory />
        </div>
        <div className="bg-white shadow-lg rounded-md flex items-center justify-between p-3 font-medium group">
          <WidgetArticle />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-2">
        <div className="bg-white p-4 shadow-lg lg:col-span-3 rounded-lg flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h1 className="hidden lg:flex text-l font-semibold">Recent Article</h1>
            <h1 className="flex lg:hidden text-l font-semibold">Article</h1>
            <WidgetDropdown viewListLink="/article" />
          </div>
          <WidgetArticleList />
        </div>
        <div className="bg-white p-4 shadow-lg lg:col-span-2 rounded-lg flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-l font-semibold">Recent Activity </h1>
            <WidgetDropdown viewListLink="/activity-log" />
          </div>
          <div className="overflow-y-auto">
            <div className="max-h-screen-md">
              <WidgetActivityLog />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
function DashboardAdmin() {
  return (
    <>
      {' '}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-2">
        <div className="bg-white shadow-lg rounded-md flex items-center justify-between p-3 font-medium group">
          <WidgetUser />
        </div>
        <div className="bg-white shadow-lg rounded-md flex items-center justify-between p-3 font-medium group">
          <WidgetRole />
        </div>
        <div className="bg-white shadow-lg rounded-md flex items-center justify-between p-3 font-medium group">
          <WidgetCategory />
        </div>
        <div className="bg-white shadow-lg rounded-md flex items-center justify-between p-3 font-medium group">
          <WidgetArticle />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-2">
        <div className="bg-white p-4 shadow-lg lg:col-span-3 rounded-lg flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h1 className="hidden lg:flex text-l font-semibold">Recent Article</h1>
            <h1 className="flex lg:hidden text-l font-semibold">Article</h1>
            <WidgetDropdown viewListLink="/article" />
          </div>
          <WidgetArticleList />
        </div>
        <div className="bg-white p-4 shadow-lg lg:col-span-2 rounded-lg flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-l font-semibold">Recent Activity </h1>
            <WidgetDropdown viewListLink="/activity-log" />
          </div>
          <div className="overflow-y-auto">
            <div className="max-h-screen-md">
              <WidgetActivityLog />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function Home() {
  const userStatus = getSuperAdminStatus();
  const [menuComponent, setMenuComponent] = useState(null);

  useEffect(() => {
    if (userStatus === 1) {
      setMenuComponent(<DashboardSuperAdmin />);
    } else if (userStatus === 2) {
      setMenuComponent(<DashboardAdmin />);
    } else {
      setMenuComponent(<DashboardUser />);
    }
  }, [userStatus]);

  return (
    <section className="w-full mb-10">
      <div className=" flex flex-auto w-full h-fit">
        <div className="flex flex-col w-full">
          <UserGreetings />
          {menuComponent}
        </div>

      </div>
    </section>
  );
}
export default Home;
