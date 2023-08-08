"use client";
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation'
import { CoreAPI, CoreAPIGET } from "../../../../dep/core/coreHandler";
// import { KmsAPIGET, KmsAPI } from "../../dep/kms/kmsHandler";

export default function Page({ params }) {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [nextlink, setNextlink] = useState("/tes");
  const router = useRouter();
  const [UserData, setUserData] = useState({
    body:{Data:{
      Username:"",
      Password:"",
      Name:"",
    }}
  });
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await CoreAPIGET("user?UserID=" + params.id);
        setUserData(response); // Assuming the response is an object that represents the user data.
        console.log(response);
        setName(response.body.Data.Name)
        setUsername(response.body.Data.Username)
        setPassword(response.body.Data.Password)
      } catch (error) {
        // Handle errors here
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [params.id]);
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
    try {
      // let EdittedUserData = UserData.body.Data;
      // EdittedUserData.Username = username;
      // EdittedUserData.Password = password;
      // EdittedUserData.Name = name;
      // console.log(EdittedUserData)
      // const response2 = await CoreAPI("PUT","user",EdittedUserData);
      let DelUserData = {
        UserID: parseInt(params.id)
      }
      console.log(typeof(params.id))
      const response2 = await CoreAPI("DELETE","user",DelUserData)
    } catch (error) {
      console.log(error);
      console.log("Ada error anjg")
      setMessage("An error occurred during login.");
      // Handle error
    }
  };
  return (
    <>
      <div class="min-h-screen flex flex-col items-center justify-center bg-gray-300">
        <div class="flex flex-col bg-white shadow-md px-4 sm:px-6 md:px-8 lg:px-10 py-8 rounded-md w-full max-w-md">
          <div id="logo" className="flex flex-col mb-6 mx-auto">
            <img
              className=" object-scale-down h-24 w-24"
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/LEGO_logo.svg/1024px-LEGO_logo.svg.png"
            />
          </div>
          <div class="font-medium self-center text-xl sm:text-2xl uppercase text-gray-800">
            Login
          </div>
          <div class="mt-10">
            <form action={handleLogin}>
              <div class="flex flex-col mb-6">
                <label
                  for="name"
                  class="mb-1 text-xs sm:text-sm tracking-wide text-gray-600"
                >
                  Name:
                </label>
                <div class="relative">
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    class="text-sm sm:text-base placeholder-gray-500 pl-4 pr-4 rounded-lg border border-gray-400 w-full py-2 focus:outline-none focus:border-blue-400"
                    placeholder="Password"
                  />
                </div>
              </div>
              <div class="flex flex-col mb-6">
                <label
                  for="email"
                  class="mb-1 text-xs sm:text-sm tracking-wide text-gray-600"
                >
                  Username
                </label>
                <div class="relative">
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    class="text-sm sm:text-base placeholder-gray-500 pl-4 pr-4 rounded-lg border border-gray-400 w-full py-2 focus:outline-none focus:border-blue-400"
                    placeholder="Username"
                  />
                </div>
              </div>
              <div class="flex flex-col mb-6">
                <label
                  for="password"
                  class="mb-1 text-xs sm:text-sm tracking-wide text-gray-600"
                >
                  Password:
                </label>
                <div class="relative">
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    class="text-sm sm:text-base placeholder-gray-500 pl-4 pr-4 rounded-lg border border-gray-400 w-full py-2 focus:outline-none focus:border-blue-400"
                    placeholder="Password"
                  />
                </div>
              </div>

              <div class="flex items-center mb-6 -mt-4">
                <div class="flex ml-auto">
                  <a
                    href="#"
                    class="inline-flex text-xs sm:text-sm text-blue-500 hover:text-blue-700"
                  >
                    Forgot Your Password?
                  </a>
                </div>
              </div>

              <div class="flex w-full">
                <button
                  type="submit"
                  href={nextlink}
                  class="flex items-center justify-center focus:outline-none text-white text-sm sm:text-base bg-blue-600 hover:bg-blue-700 rounded py-2 w-full transition duration-150 ease-in"
                >
                  <span class="mr-2 uppercase">Login</span>
                </button>
              </div>
            </form>
          </div>
          <div class="flex justify-center items-center mt-6">
            <a
              href="#"
              target="_blank"
              class="inline-flex items-center font-bold text-blue-500 hover:text-blue-700 text-xs text-center"
            >
              <span class="ml-2">You don't have an account?</span>
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
