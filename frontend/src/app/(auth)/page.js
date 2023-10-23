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
        <div className="flex flex-col bg-white shadow-md px-4 md:px-8 py-8 rounded w-full max-w-md">
          <div id="logo" className="flex flex-col mb-6 mx-auto">
            <ShowLogo maxWidth="80px" maxHeight="80px" />
          </div>
          <div className="font-medium self-center text-xl sm:text-2xl uppercase text-gray-800">
            Login
          </div>
          <div className="mt-10">
            <form action={handleLogin}>
              <div className="flex flex-col mb-6">
                <label
                  type="email"
                  className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600"
                >
                  Username
                </label>
                <div className="relative">
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="text-sm sm:text-base placeholder-gray-500 pl-4 pr-4 rounded border border-gray-400 w-full py-2 focus:outline-none focus:border-blue-400"
                    placeholder="Username"
                  />
                </div>
              </div>
              <div className="flex flex-col mb-6">
                <label
                  type="password"
                  className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600"
                >
                  Password:
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="text-sm sm:text-base placeholder-gray-500 pl-4 pr-4 rounded border border-gray-400 w-full py-2 focus:outline-none focus:border-blue-400"
                    placeholder="Password"
                  />
                </div>
              </div>

              <div className="flex w-full mt-10">
                <button
                  type="submit"
                  href={nextlink}
                  className="flex items-center justify-center focus:outline-none text-white text-sm sm:text-base bg-blue-600 hover:bg-blue-700 rounded py-2 w-full transition duration-150 ease-in"
                >
                  <span className="mr-2 uppercase">Login</span>
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
