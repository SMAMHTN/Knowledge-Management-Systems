'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image'; // Import the Next.js Image component
import { getUserData, Logout } from '../dep/core/coreHandler';

function UserProfile({ maxWidth, maxHeight }) {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState('');
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        console.log('Fetching user data...');
        const data = await getUserData();
        console.log('User data fetched:', data);
        setUserData(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }

    fetchData();
  }, []);

  // Function to check if a string is a valid base64 string
  const isValidBase64 = (str) => {
    try {
      // Attempt to decode the base64 string
      atob(str);
      return true; // If successful, it's a valid base64 string
    } catch (e) {
      return false; // If an error occurs, it's not a valid base64 string
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
    // Return a placeholder image or alternative UI here
    return (
      <div className="flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-800">
        <span className="text-gray-500 dark:text-gray-400 text-sm">No Photo</span>
      </div>
    );
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  const handleLogout = async () => {
    const success = await Logout();
  };
  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          type="button"
          onClick={toggleDropdown}
          className="group w-9 h-9 my-2 mr-4 md:mr-7 transition-colors duration-200 rounded-full shadow-md bg-blue-200 hover:bg-blue-200 dark:bg-gray-50 dark:hover:bg-gray-200 text-gray-900 focus:outline-none relative"
        >
          {renderUserPhoto()}
        </button>
      </div>
      {isOpen && (
        <div className="absolute right-0 group-focus:block my-1 mr-4 md:mr-7 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600">
          <div className="px-4 py-3">
            {userData ? (
              <div>
                <span className="block text-sm text-gray-900 dark:text-white">
                  {' '}
                  {userData.Name}
                </span>
                <span className="block text-sm text-gray-500 truncate dark:text-gray-400">
                  {' '}
                  {userData.Email}
                </span>
              </div>
            ) : (
              <p>Loading user data...</p>
            )}
          </div>
          <ul className="py-2" aria-labelledby="user-menu-button">
            <li>
              <Link
                href="/dashboard"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/settings"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
              >
                Settings
              </Link>
            </li>
            <li>
              <Link
                href="/earnings"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
              >
                Earnings
              </Link>
            </li>
            <li>
              <button onClick={handleLogout} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">
                Log out
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

function CustomLink({ href, text }) {
  return (
    <Link href={href}>
      <div
        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        role="menuitem"
      >
        {text}
      </div>
    </Link>
  );
}

function UserProfileDropdown() {
  return (
    <div className="flex justify-center items-center">
      <UserProfile username="John Doe" />
    </div>
  );
}

export default UserProfileDropdown;
