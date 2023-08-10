import React from "react";
import Link from "next/link";
import UserProfileDropdown from "./UserProfileDropdown";

function Navbar() {
  return (
    <nav className="flex flex-col flex-auto antialiased flex-shrink-0 bg-red-700">
      <div className="fixed w-full flex items-center justify-between h-14 text-white z-10 bg-blue-100">
        <div className="flex items-center justify-start md:justify-center pl-3 w-14 md:w-64 h-14 bg-indigo-700">
          <img
            className="w-7 h-7 md:w-10 md:h-10 mr-2 rounded-md overflow-hidden"
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/LEGO_logo.svg/1024px-LEGO_logo.svg.png"
          />
          <span className="hidden md:block">Admin</span>
        </div>
        <div className="flex justify-between items-center h-14 bg-blue-800 header-right">
          <div className="bg-white rounded flex items-center w-full max-w-xl mr-4 p-2 shadow-sm border border-blue-700">
            <button className="outline-none focus:outline-none">
              <svg
                className="w-5 text-gray-600 h-5 cursor-pointer"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
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
              className="w-full pl-3 text-sm text-black outline-none focus:outline-none bg-transparent"
            />
          </div>
          <ul className="flex items-center">
            <li>
              <UserProfileDropdown />
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
