"use server";
import { readConf } from "../others/confHandler";
import { generateKmsCred } from "../others/generateCred";
import { cookies } from "next/headers";

export async function KmsAPI(method, path, data) {
  const conf = readConf("frontend_conf.json");
  const cookieStore = cookies();
  let un, pwd;
  try {
    un = cookieStore.get("username")?.value;
    pwd = cookieStore.get("password")?.value;

    if (un == undefined || pwd == undefined) {
      throw new Error("You must log in.");
    }
  } catch (error) {
    throw error;
  }
  const credentials = generateKmsCred(un, pwd);
  try {
    const response = await fetch(conf.kms_link + path, {
      method: method,
      headers: {
        Authorization: `Basic ${credentials}`,
        Accept: "*/*",
        Connection: "keep-alive",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const responseBody = await response.json();

    return {
      head: response.headers,
      body: responseBody,
    };
  } catch (error) {
    throw error;
  }
}

export async function KmsAPIGET(path) {
  const conf = readConf("frontend_conf.json");
  const cookieStore = cookies();
  let un, pwd;
  try {
    un = cookieStore.get("username")?.value;
    pwd = cookieStore.get("password")?.value;

    if (un == undefined || pwd == undefined) {
      throw new Error("You must log in.");
    }
  } catch (error) {
    throw error;
  }
  const credentials = generateKmsCred(un, pwd);
  try {
    const response = await fetch(conf.kms_link + path, {
      method: "GET",
      headers: {
        Authorization: `Basic ${credentials}`,
        Accept: "*/*",
        Connection: "keep-alive",
      },
    });
    const responseBody = await response.json();

    return {
      head: response.headers,
      body: responseBody,
    };
  } catch (error) {
    throw error;
  }
}
