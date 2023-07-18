"use server";
import { readConf } from "../others/confHandler";
import { generateCoreCred } from "../others/generateCred";
import { cookies } from "next/headers";

export async function Login(Username, Password) {
  const conf = readConf("frontend_conf.json");
  const credentials = generateCoreCred(Username, Password);
  try {
    const response = await fetch(conf.core_link + "login", {
      method: 'GET',
      headers: {
        Authorization: `Basic ${credentials}`,
        Accept: "*/*",
        Connection: "keep-alive",
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

export async function CoreAPI(method,path,data) {
  const conf = readConf("frontend_conf.json");
  const cookieStore = cookies();
  const un = cookieStore.get("username").value;
  const pwd = cookieStore.get("password").value;
  const credentials = generateCoreCred(un, pwd);
  try {
    const response = await fetch(conf.core_link + path, {
      method: method,
      headers: {
        Authorization: `Basic ${credentials}`,
        Accept: "*/*",
        Connection: "keep-alive",
        "Content-Type": "application/json", 
      },
      body: JSON.stringify(data),
    });
    return response.headers,await response.json();
  } catch (error) {
    throw error;
  }
}

export async function CoreAPIGET(path) {
  const conf = readConf("frontend_conf.json");
  const cookieStore = cookies();
  const un = cookieStore.get("username").value;
  const pwd = cookieStore.get("password").value;
  const credentials = generateCoreCred(un, pwd);
  try {
    const response = await fetch(conf.core_link + path, {
      method: "GET",
      headers: {
        Authorization: `Basic ${credentials}`,
        Accept: "*/*",
        Connection: "keep-alive",
      },
    });
    return response.headers,await response.json();
  } catch (error) {
    throw error;
  }
}