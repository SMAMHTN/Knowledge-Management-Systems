"use client";
import { useState, useEffect } from "react";
import { Login, CoreAPIGET } from "../../dep/core/coreHandler";
import { KmsAPIGET } from "../../dep/kms/kmsHandler";

export default function Page() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [a, setA] = useState({
    Data:{
      CategoryID:0,
      CategoryName:"",
      CategoryParentID:0,
      CategoryDescription:"",
    }
  });
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
      KmsAPIGET("category?CategoryID=1").then((configuration) => {
        setA(configuration);
      });
      console.log(a);
      // const response = await fetch('http://code.smam.my.id:6565/login', {
      //   headers: {
      //     Authorization: `Basic ${credentials}`,
      //     Accept: '*/*',
      //   },
      // });

      if (response == true) {
        setMessage("Login successful!");
        // Perform any additional actions after successful login
      } else {
        setMessage("Login failed!");
        // Handle login failure
      }
    } catch (error) {
      setMessage("An error occurred during login.");
      // Handle error
    }
  };
  return (
    <div>
      <h2>Login</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="text-black"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="text-black"
      />
      <button onClick={handleLogin}>Login</button>
      <p>{message}</p>
      <p>{a.Data.CategoryID}</p>
      <p>{a.Data.CategoryName}</p>
      <p>{a.Data.CategoryParentID}</p>
      <p>{a.Data.CategoryDescription}</p>
      {/* <img src={`data:image/png;base64, ${a.Data.UserPhoto}`} alt="User" /> */}
    </div>
  );
}
