'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Login, CoreAPIGET } from '../../dep/core/coreHandler';
import ShowLogo from '@/components/Navbar/ShowLogo';

export default function Page() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [nextlink, setNextlink] = useState('/');
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const response = await Login(username, password);
      console.log(response);
      if (response === true) {
        const response2 = await CoreAPIGET('loginuser');

        router.push('/dashboard/');
        setMessage('Login successful!');
      } else {
        setMessage('Login failed!');
      }
    } catch (error) {
      setMessage('An error occurred during login.');
    }
  };
  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-300">
        <div className="flex flex-col bg-white shadow-md px-4 md:px-8 py-8 rounded-lg w-full max-w-md">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="md:col-span-1">
              <div id="logo" className="flex flex-col mb-6 pr-2 mx-auto items-end">
                <ShowLogo maxWidth="40px" maxHeight="40px" className="" />
              </div>
            </div>
            <div className="md:col-span-1">
              <div className="font-medium self-center text-xl sm:text-2xl text-gray-800">
                |
                {' '}
                {' '}
                Login
              </div>

            </div>
          </div>

          <div className="mt-10">
            <form action={handleLogin}>
              <div className="flex flex-col mb-6">
                <div className="relative">
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="text-sm sm:text-base placeholder-gray-500 pl-4 pr-4 rounded-md border border-gray-400 w-full py-2 focus:outline-none focus:border-blue-400"
                    placeholder="Username"
                  />
                </div>
              </div>
              <div className="flex flex-col mb-6">
                <div className="relative">
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="text-sm sm:text-base placeholder-gray-500 pl-4 pr-4 rounded-md border border-gray-400 w-full py-2 focus:outline-none focus:border-blue-400"
                    placeholder="Password"
                  />
                </div>
              </div>

              <div className="flex w-full mt-10">
                <button
                  type="submit"
                  href={nextlink}
                  className="flex items-center justify-center focus:outline-none text-white text-sm sm:text-base bg-blue-600 hover:bg-blue-700 rounded-md py-2 w-full transition duration-150 ease-in"
                >
                  <span className="mr-2 ">Login</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div />
    </>
  );
}
