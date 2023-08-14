"use client";
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation'
import { Login, CoreAPIGET } from "../../dep/core/coreHandler";
// import { KmsAPIGET, KmsAPI } from "../../dep/kms/kmsHandler";

export default function Page() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [nextlink, setNextlink] = useState("/tes");
  const router = useRouter()
  // const [a, setA] = useState({
  //   Data: {
  //     CategoryID: 0,
  //     CategoryName: "",
  //     CategoryParentID: 0,
  //     CategoryDescription: "",
  //   },
  // });
  // const [statuscode, setStatusCode] = useState("");
  // const jsonRequestData = {
  //   UserID:1,
  // }

  // useEffect(() => {
  //   CoreAPIGET("user?UserID=1").then(configuration => {
  //     setA(configuration);
  //   });
  // }, []);
  const handleLogin = async () => {
    // const credentials = btoa(`aldim:${username}&&${password}`);

    try {
      const response = await Login(username, password);
      // KmsAPIGET("category?CategoryID=1").then((configuration) => {
      //   setA(configuration);
      // });
      // let datasent = {
      //   CategoryID: 13,
      // };
      // const response2 = await KmsAPI("DELETE", "category",datasent);
      // setA(response2.body);
      // console.log(response2);
      // const response = await fetch('http://code.smam.my.id:6565/login', {
      //   headers: {
      //     Authorization: `Basic ${credentials}`,
      //     Accept: '*/*',
      //   },
      // });

      if (response == true) {
        const response2 = await CoreAPIGET("loginuser")
        // setNextlink("/tes/tes2/" + response2.body.Data.UserID)
        router.push("/tes/tes2/" + response2.body.Data.UserID)
        setMessage("Login successful!");
        // Perform any additional actions after successful login
      } else {
        // setNextlink("/tes")
        setMessage("Login failed!");
        // Handle login failure
      }
    } catch (error) {
      // console.log(error);
      setMessage("An error occurred during login.");
      // Handle error
    }
  };
  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-300">
        <div className="flex flex-col bg-white shadow-md px-4 sm:px-6 md:px-8 lg:px-10 py-8 rounded-md w-full max-w-md">
          <div id="logo" className="flex flex-col mb-6 mx-auto">
            <Image
              className=" object-scale-down h-24 w-24"
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/LEGO_logo.svg/1024px-LEGO_logo.svg.png"
              alt="Test2"
            />
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
                    className="text-sm sm:text-base placeholder-gray-500 pl-4 pr-4 rounded-lg border border-gray-400 w-full py-2 focus:outline-none focus:border-blue-400"
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
                    className="text-sm sm:text-base placeholder-gray-500 pl-4 pr-4 rounded-lg border border-gray-400 w-full py-2 focus:outline-none focus:border-blue-400"
                    placeholder="Password"
                  />
                </div>
              </div>

              <div className="flex items-center mb-6 -mt-4">
                <div className="flex ml-auto">
                  <a
                    href="#"
                    className="inline-flex text-xs sm:text-sm text-blue-500 hover:text-blue-700"
                  >
                    Forgot Your Password?
                  </a>
                </div>
              </div>

              <div className="flex w-full">
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
          <div className="flex justify-center items-center mt-6">
            <a
              href="#"
              target="_blank"
              className="inline-flex items-center font-bold text-blue-500 hover:text-blue-700 text-xs text-center"
            >
              <span className="ml-2">You don&apos;t have an account?</span>
            </a>
          </div>
        </div>
      </div>
      <div>
        {/* <p>{message}</p>
        <p>{a.Data.CategoryID}</p>
        <p>{a.Data.CategoryName}</p>
        <p>{a.Data.CategoryParentID}</p>
        <p>{a.Data.CategoryDescription}</p>
        <img src={`data:image/png;base64, ${a.Data.UserPhoto}`} alt="User" /> */}
      </div>
    </>
  );
}
