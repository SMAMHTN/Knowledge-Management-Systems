"use server";
import { readConf } from "../others/confHandler";
import { generateKmsCred } from "../others/generateCred";
import { cookies } from "next/headers";

export async function KmsAPI(method,path,data) {
    const conf = readConf("frontend_conf.json");
    const cookieStore = cookies();
    const un = cookieStore.get("username").value;
    const pwd = cookieStore.get("password").value;
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
      console.log(JSON.stringify(data))
      return response.headers,await response.json();
    } catch (error) {
      throw error;
    }
  }
  
  export async function KmsAPIGET(path) {
    const conf = readConf("frontend_conf.json");
    const cookieStore = cookies();
    const un = cookieStore.get("username").value;
    const pwd = cookieStore.get("password").value;
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
      return response.headers,await response.json();
    } catch (error) {
      throw error;
    }
  }