'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getUserData, Logout } from '../../dep/core/coreHandler';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

function UserProfile({ maxWidth, maxHeight }) {
  const [error, setError] = useState('');
  const [userData, setUserData] = useState(null);

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

  const isValidBase64 = (str) => {
    try {
      atob(str);
      return true;
    } catch (e) {
      return false;
    }
  };

  const renderUserPhoto = () => {
    if (userData && userData.UserPhoto && isValidBase64(userData.UserPhoto)) {
      return (
        <Image
          src={`data:image;base64,${userData.UserPhoto}`}
          alt="UserPhoto"
          height={500}
          width={500}
          className="flex rounded-full"
          style={{
            maxWidth: maxWidth || '100%',
            maxHeight: maxHeight || '100%',
            objectFit: 'contain',
          }}
        />
      );
    }
    return (
      <div className="flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-800">
        <span className="text-gray-500 dark:text-gray-400 text-sm">No Photo</span>
      </div>
    );
  };

  const handleLogout = async () => {
    const success = await Logout();
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage />
            <AvatarFallback>{renderUserPhoto()}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-white rounded " align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          {userData ? (
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{userData.Name}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {userData.Email}
              </p>
            </div>
          ) : (
            <p>Loading user data...</p>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="mx-1 bg-neutral-200" />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Link
              href="/dashboard/settings"
              className="w-full hover:underline"
            >
              Profile
            </Link>

          </DropdownMenuItem>
          {/* <DropdownMenuItem>
            Billing

          </DropdownMenuItem>
          <DropdownMenuItem>
            Settings

          </DropdownMenuItem>
          <DropdownMenuItem>New Team</DropdownMenuItem> */}
        </DropdownMenuGroup>
        <DropdownMenuSeparator className="mx-1 bg-neutral-200" />
        <DropdownMenuItem className="hover:underline cursor-pointer" onClick={handleLogout}>
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function UserProfileDropdown() {
  return (
    <div className="flex justify-center items-center">
      <UserProfile />
    </div>
  );
}

export default UserProfileDropdown;
