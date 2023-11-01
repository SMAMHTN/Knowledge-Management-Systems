'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Pencil, UserCog2, Loader2, MoreHorizontal, Users,
} from 'lucide-react';
import { CoreAPIGET } from '@/dep/core/coreHandler';
import { URLParamsBuilder, HandleSortParams } from '@/dep/others/HandleParams';
import { Button } from '@/components/ui/button';

function WidgetUser() {
  const [userStats, setUserStats] = useState('');
  const [latestUser, setLatestUser] = useState([]);
  const newSortField = 'UserID';
  const newSortParams = HandleSortParams(newSortField, false);
  useEffect(() => {
    async function fetchData() {
      try {
        const log = await CoreAPIGET(URLParamsBuilder('listuser', null, 1, null, newSortParams));
        setLatestUser(log.body.Data);
        setUserStats(log.body.Info);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }
    fetchData();
  }, []);

  return (
    <>

      <div className="flex justify-center items-center w-14 h-14 bg-white rounded-full transition-all duration-300 transform group-hover:scale-110">
        <Users size={30} />
      </div>

      <div className="text-right">

        {userStats ? (
          <>
            <p className="text-2xl">
              {userStats.TotalRow}
            </p>
            <p className="text-sm">Users</p>
          </>
        ) : (
          <div className="flex items-center">
            <MoreHorizontal color="gray" className="animate-pulse mr-2" />
          </div>
        )}

      </div>
      {/*
<div className="grid grid-cols-2 grid-rows-3 gap-1 h-full mt-2">
      <div className=" p-2 col-span-2 text-2xl font-semibold flex flex-col-reverse">
        {userStats ? (
          <span>
            {userStats.TotalRow}
            {' '}
            Users
          </span>
        ) : (
          <div className="flex items-center">
            <MoreHorizontal color="gray" className="animate-bounce mr-2" />
            {' '}
            <span>Users</span>
          </div>
        )}

      </div>
      <div className="col-span-2 p-2 flex flex-col-reverse">
        <hr className="w-full border-t-2 border-gray-600 mt-4" />
        <p>
          {latestUser.length > 0 ? (latestUser.map((user) => (
            <span key={user.UserID}>
              <span>{user.Name}</span>
            </span>
          ))) : (
            <MoreHorizontal color="gray" className="animate-bounce" />
          )}
        </p>
        <p className="text-xs text-gray-500">Last user Added</p>

      </div>

      <div className=" p-2">
        <Button variant="ghost" className="w-full h-full hover:bg-gray-100">
          <Link href={URLParamsBuilder('/user')} className="text-gray-700">
            <UserCog2 size={28} className="mx-auto" />
            <span className="hidden xl:flex">Manage</span>

          </Link>

        </Button>
      </div>
      <div className=" p-2">
        {' '}
        <Button variant="ghost" className="w-full h-full hover:bg-gray-100">
          { latestUser.length > 0 ? (latestUser.map((user) => (
            <span key={user.UserID}>
              <Link href={`/user/${user.UserID}`} className="text-gray-700">
                <Pencil size={28} className="mx-auto" />
                <span className="hidden xl:flex ">Edit last User</span>
              </Link>
            </span>
          ))) : (
            <span>
              <Pencil size={28} className="mx-auto text-gray-700" />
              <span className="hidden xl:flex text-gray-700">Edit last User</span>
            </span>
          )}
        </Button>

      </div>
    </div> */}
    </>
  );
}

export default WidgetUser;
