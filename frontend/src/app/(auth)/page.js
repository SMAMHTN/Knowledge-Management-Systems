'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { Login, CoreAPIGET } from '../../dep/core/coreHandler';
import ShowLogo from '@/components/Navbar/ShowLogo';
import { alertLogin } from '@/components/Feature';
import getThemeCookiesValue from '@/dep/core/getThemeCookiesValue';

export default function Page() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [message, setMessage] = useState('');
  const [nextlink, setNextlink] = useState('/');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const theme = JSON.parse(getThemeCookiesValue());
  const handleLogin = async (event) => {
    event.preventDefault();
    setUsernameError('');
    setPasswordError('');

    if (!username) {
      setUsernameError('Username is required');
    }

    if (!password) {
      setPasswordError('Password is required');
    }

    if (username && password) {
      setLoading(true);
      setTimeout(async () => {
        try {
          const response = await Login(username, password);
          if (response === true) {
            const response2 = await CoreAPIGET('loginuser');

            setTimeout(() => {
              router.push('/dashboard/');
              setMessage('Login successful!');
            }, 1000);
          } else {
            alertLogin(response);
          }
        } catch (error) {
          setMessage('An error occurred during login.');
        } finally {
          setLoading(false);
        }
      }, 1000);
    }
  };
  return (
    <>
      <div
        className="min-h-screen flex flex-col items-center justify-center "
        style={{
          background: `linear-gradient(75deg, ${theme.primary_color} 0%, ${theme.secondary_color} 90%)`,
          width: '100%',
          height: '100vh',
        }}
      >
        <div className="flex flex-col bg-white shadow-md px-4 md:px-8 py-8 rounded-lg w-full max-w-md">
          <div className="grid grid-cols-2">
            <div className="col-span-1">
              <div id="logo" className="flex flex-col mb-6 pr-2 mx-auto items-end">
                <ShowLogo maxWidth="40px" maxHeight="40px" className="" />
              </div>
            </div>
            <div className="col-span-1">
              <div className="font-medium self-center text-xl sm:text-2xl text-gray-800">
                |
                {' '}
                {' '}
                Login
              </div>

            </div>
          </div>

          <div className="mt-10">
            <form onSubmit={handleLogin}>
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
                  {usernameError && <p className="text-red-600 text-xs absolute">{usernameError}</p>}
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
                  {usernameError && <p className="text-red-600 text-xs absolute">{passwordError}</p>}
                </div>

              </div>

              <div className="flex w-full mt-10">
                <button
                  type="submit"
                  className="flex items-center justify-center focus:outline-none text-white text-sm sm:text-base bg-blue-600 hover-bg-blue-700 rounded-md py-2 w-full transition duration-150 ease-in"
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="animate-spin h-5 w-5 text-white mr-2 my-0.5" size={30} />
                  ) : (
                    <span>Login</span>
                  )}
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
