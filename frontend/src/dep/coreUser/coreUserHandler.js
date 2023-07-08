"use server";
import { readConf } from "../others/confHandler";
import { generateCoreCred } from "../others/generateCred";
import { cookies } from "next/headers";

export async function Login(Username, Password) {
  const conf = readConf("frontend_conf.json");
  const credentials = generateCoreCred(Username, Password);
  const cookieStore = cookies();
  const un = cookieStore.get("username");
  const pwd = cookieStore.get("password");
  console.log("-----------------------------------");
  console.log(un);
  console.log(pwd);
  console.log("-----------------------------------");
  try {
    const response = await fetch(conf.core_link + "login", {
      headers: {
        Authorization: `Basic ${credentials}`,
        Accept: "*/*",
      },
    });

    if (response.ok) {
      cookies().set({
        name: "username",
        value: Username,
        sameSite: "lax",
        path: "/",
      });
      cookies().set({
        name: "password",
        value: Password,
        sameSite: "lax",
        path: "/",
      });
      return true;
    } else {
      return false;
    }
  } catch (error) {
    throw error;
  }
}

export async function Logout() {
  cookies().set({
    name: "username",
    value: '',
    sameSite: "lax",
    path: "/",
  });
  cookies().set({
    name: "password",
    value: '',
    sameSite: "lax",
    path: "/",
  });
  return true;
}