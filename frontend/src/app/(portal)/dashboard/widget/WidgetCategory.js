'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Pencil, Settings, MoreHorizontal, Layers,
} from 'lucide-react';
import { KmsAPIGET } from '@/dep/kms/kmsHandler';
import { URLParamsBuilder, HandleSortParams } from '@/dep/others/HandleParams';
import { Button } from '@/components/ui/button';

function WidgetCategory() {
  const [catStats, setCatStats] = useState('');
  const [lastRole, setLastRole] = useState([]);
  const newSortField = 'CategoryID';
  const newSortParams = HandleSortParams(newSortField, false);
  useEffect(() => {
    async function fetchData() {
      try {
        const log = await KmsAPIGET(URLParamsBuilder('listcategory', null, 1, null, newSortParams));
        setLastRole(log.body.Data);
        setCatStats(log.body.Info);
      } catch (error) {
        console.error('Error fetching role data:', error);
      }
    }
    fetchData();
  }, []);

  return (
    <>
      <div className="flex justify-center items-center w-14 h-14 bg-white rounded-full transition-all duration-300 transform group-hover:scale-110">
        <Layers size={30} />
      </div>

      <div className="text-right">

        {catStats ? (
          <>
            <p className="text-2xl">
              {catStats.TotalRow}
            </p>
            <p className="text-sm">Category</p>
          </>
        ) : (
          <div className="flex items-center">
            <MoreHorizontal color="gray" className="animate-pulse mr-2" />
          </div>
        )}

      </div>
      {/* <div className="grid grid-cols-2 grid-rows-3 gap-1 h-full mt-2">
      <div className=" p-2 col-span-2 text-2xl font-semibold flex flex-col-reverse">
        {roleStats ? (
          <span>
            {roleStats.TotalRow}
            {' '}
            Roles
          </span>
        ) : (
          <div className="flex items-center">
            <MoreHorizontal color="gray" className="animate-bounce mr-2" />
            {' '}
            <span>Roles</span>
          </div>
        )}

      </div>
      <div className="col-span-2 p-2 flex flex-col-reverse">
        <hr className="w-full border-t-2 border-gray-600 mt-4" />
        <p>
          {lastRole.length > 0 ? (lastRole.map((item) => (
            <span key={item.RoleID}>
              <span>{item.RoleName}</span>
            </span>
          ))) : (
            <MoreHorizontal color="gray" className="animate-bounce" />
          )}
        </p>
        <p className="text-xs text-gray-500">Last role Added</p>

      </div>

      <div className=" p-2">
        <Button variant="ghost" className="w-full h-full hover:bg-gray-100">
          <Link href={URLParamsBuilder('/roles')} className="text-gray-700">
            <Settings size={28} className="mx-auto" />
            <span className="hidden xl:flex">Manage</span>

          </Link>

        </Button>
      </div>
      <div className=" p-2">
        {' '}
        <Button variant="ghost" className="w-full h-full hover:bg-gray-100">
          { lastRole.length > 0 ? (lastRole.map((item) => (
            <span key={item.RoleID}>
              <Link href={`/roles/${item.RoleID}`} className="text-gray-700">
                <Pencil size={28} className="mx-auto" />
                <span className="hidden xl:flex ">Edit last role</span>
              </Link>
            </span>
          ))) : (
            <span>
              <Pencil size={28} className="mx-auto text-gray-700" />
              <span className="hidden xl:flex text-gray-700">Edit last Role</span>
            </span>
          )}
        </Button>

      </div>
    </div> */}
    </>
  );
}

export default WidgetCategory;
