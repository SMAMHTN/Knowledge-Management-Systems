import React from "react";
import Link from "next/link";

function Navbar() {
  return (
    <nav className="flex flex-col flex-auto antialiased flex-shrink-0 bg-red-700">
      <div className="fixed w-full flex items-center justify-between h-14 text-white z-10 bg-blue-100">
        <div className="flex items-center justify-start md:justify-center pl-3 w-14 md:w-64 h-14 bg-indigo-700">
          <img
            className="w-7 h-7 md:w-10 md:h-10 mr-2 rounded-md overflow-hidden"
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/LEGO_logo.svg/1024px-LEGO_logo.svg.png"
          />
          <span class="hidden md:block">Admin</span>
        </div>
        <div className="flex justify-between items-center h-14 bg-blue-800 header-right">
          <div className="bg-white rounded flex items-center w-full max-w-xl mr-4 p-2 shadow-sm border border-blue-700">
            <button className="outline-none focus:outline-none">
              <svg
                class="w-5 text-gray-600 h-5 cursor-pointer"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </button>
            <input
              type="search"
              name=""
              id=""
              placeholder="Search"
              class="w-full pl-3 text-sm text-black outline-none focus:outline-none bg-transparent"
            />
          </div>
          <ul class="flex items-center">
            <li>
              <button
                aria-hidden="true"
                class="group w-9 h-9 my-2 mr-4 md:mr-7 transition-colors duration-200 rounded-full shadow-md bg-blue-200 hover:bg-blue-200 dark:bg-gray-50 dark:hover:bg-gray-200 text-gray-900 focus:outline-none"
              >
                <img
                  class="flex rounded-full"
                  src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                  alt="Rounded avatar"
                />
                <div class="absolute right-0 group-focus:block hidden my-1 mr-4  md:mr-7 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600">
                  <div class="px-4 py-3 ">
                    <span class="block text-sm text-gray-900 dark:text-white">
                      Bonnie Green
                    </span>
                    <span class="block text-sm  text-gray-500 truncate dark:text-gray-400">
                      name@flowbite.com
                    </span>
                  </div>
                  <ul class="py-2" aria-labelledby="user-menu-button">
                    <li>
                      <a
                        href="/"
                        class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                      >
                        Dashboard
                      </a>
                    </li>
                    <li>
                      <Link href="/ "
                         class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                         >settings</Link>
                      <a
                        href="/"
                        class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                      >
                        Settings
                      </a>
                    </li>
                    <li>
                      <a
                        href="/"
                        class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                      >
                        Earnings
                      </a>
                    </li>
                    <li>
                      <a
                        href="/"
                        class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                      >
                        Sign out
                      </a>
                    </li>
                  </ul>
                </div>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;