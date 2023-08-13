"use client";
import React, { useState, useEffect, useRef } from "react";
import { CoreAPI,CoreAPIGET } from "../../../dep/core/coreHandler";

function SettingUser ({ imageUrl, username }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  // useEffect(() => {
  //   const fetchUserData = async () => {
  //     try {
  //       const response = await CoreAPIGET("user?UserID=" + params.id);
  //       console.log(response);
  //       const jsonData = response.body.Data;

  //       setData(jsonData);
  //       console.log(data);
  //     } catch (error) {
  //       // Handle errors here
  //       console.error("Error fetching user data:", error);
  //     }
  //   };

  //   fetchUserData();
  // }, [params.id]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    

    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  return (
    <>
      <section className="max-w-screen-xl h-screen relative mt-9">
      <div className="max-w-md mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">User Settings</h2>
      <form className="space-y-4">
        <div>
          <label className="block mb-1 font-semibold" htmlFor="username">
            Username:
          </label>
          <input
            type="text"
            id="username"
            name="username"
            className="w-full border rounded px-2 py-1"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold" htmlFor="fullName">
            Full Name:
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            className="w-full border rounded px-2 py-1"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold" htmlFor="email">
            Email:
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="w-full border rounded px-2 py-1"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold" htmlFor="phoneNumber">
            Phone Number:
          </label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            className="w-full border rounded px-2 py-1"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold" htmlFor="password">
            Password:
          </label>
          <input
            type="password"
            id="password"
            name="password"
            className="w-full border rounded px-2 py-1"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold" htmlFor="theme">
            Theme:
          </label>
          <select
            id="theme"
            name="theme"
            className="w-full border rounded px-2 py-1"
            required
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white rounded px-4 py-2"
        >
          Save Settings
        </button>
      </form>
    </div>
        {/* <div className="h-full mx-auto mt-14">
          <div className="fixed w-full ml-1">
            <h1 className="text-white text-2xl font-bold mb-4">Settings</h1>
          </div>
          <div className="container fixed mt-11 max-h-full w-5/6 md:w-3/4 overflow-y-auto overscroll-none bg-green-500">
            <div className="rounded-lg bg-yellow-500 mb-48 mx-1 my-1 md:mx-4">
              <div className="">Basic Info</div>
              <div className="grid grid-cols-2 gap-4 my-2">
                <div className="border border-white p-4">hormal block</div>
                <form>
                  <div class="mb-6">
                    <label
                      for="email"
                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Nama Pengguna
                    </label>
                    <input
                      type="email"
                      id="email"
                      class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                      placeholder="name@flowbite.com"
                      required
                    />
                  </div>
                  <div class="mb-6">
                    <label
                      for="email"
                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Nama user
                    </label>
                    <input
                      type="email"
                      id="email"
                      class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                      placeholder="name@flowbite.com"
                      required
                    />
                  </div>
                  <div class="mb-6">
                    <label
                      for="email"
                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      email
                    </label>
                    <input
                      type="email"
                      id="email"
                      class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                      placeholder="name@flowbite.com"
                      required
                    />
                  </div>
                  <div class="mb-6">
                    <label
                      for="email"
                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      no telp
                    </label>
                    <input
                      type="email"
                      id="email"
                      class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                      placeholder="name@flowbite.com"
                      required
                    />
                  </div>
                  <div class="mb-6">
                    <label
                      for="password"
                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Your password
                    </label>
                    <input
                      type="password"
                      id="password"
                      class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                      required
                    />
                  </div>
                  <div class="mb-6">
                    <label
                      for="repeat-password"
                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Repeat password
                    </label>
                    <input
                      type="password"
                      id="repeat-password"
                      class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                      required
                    />
                  </div>
                  <div class="flex items-start mb-6"></div>
                  <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-600 text-white rounded px-4 py-2"
                  >
                    Save
                  </button>
                </form>
              </div>
            </div>
            <div className="relative rounded-lg bg-yellow-500 mb-48 mx-1 my-1 md:mx-4">
              <div className="">Customization</div>
              <div className="grid grid-cols-2 gap-4 my-2">
                <div className="border border-white p-4">hormal block</div>
                <form>
                  <div class="mb-6" ref={dropdownRef}>
                    <label
                      for="email"
                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Theme
                    </label>

                    <button
                      class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                      type="button"
                      onClick={toggleDropdown}
                    >
                      Dropdown button{" "}
                      <svg
                        class="w-2.5 h-2.5 ml-2.5"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 10 6"
                      >
                        <path
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="m1 1 4 4 4-4"
                        />
                      </svg>
                    </button>
                    {isOpen && (
                      <div
                        id="dropdown"
                        class="absolute z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700"
                      >
                        <ul
                          class="py-2 text-sm text-gray-700 dark:text-gray-200"
                          aria-labelledby="dropdownDefaultButton"
                        >
                          <li>
                            <a
                              href="#"
                              class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                            >
                              Dashboard
                            </a>
                          </li>
                          <li>
                            <a
                              href="#"
                              class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                            >
                              Settings
                            </a>
                          </li>
                          <li>
                            <a
                              href="#"
                              class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                            >
                              Earnings
                            </a>
                          </li>
                          <li>
                            <a
                              href="#"
                              class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                            >
                              Sign out
                            </a>
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div> */}
      </section>
    </>
  );
};

export default SettingUser;
