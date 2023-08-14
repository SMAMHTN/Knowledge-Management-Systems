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

    if (!un || !pwd) {
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

    if (!un || !pwd) {
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

export async function KmsAPIBlob(method, path, CategoryID, File) {
  const conf = readConf("frontend_conf.json");
  const cookieStore = cookies();
  let un, pwd;
  try {
    un = cookieStore.get("username")?.value;
    pwd = cookieStore.get("password")?.value;

    if (!un || !pwd) {
      throw new Error("You must log in.");
    }
  } catch (error) {
    throw error;
  }
  const credentials = generateKmsCred(un, pwd);
  try {
    const headers = {
      Authorization: `Basic ${credentials}`,
      Accept: "*/*",
      Connection: "keep-alive",
    };

    let response;
    if (method === "GET") {
      response = await fetch(conf.kms_link + path, {
        method: method,
        headers: headers,
      });

      const fileBlob = await response.blob();

      return {
        head: response.headers,
        body: fileBlob,
      };
    } else if (method === "POST") {
      const formData = new FormData();
      formData.append('CategoryID', CategoryID);
      formData.append('File', File);

      response = await fetch(conf.kms_link + path, {
        method: method,
        headers: headers,
        body: formData,
      });

      const responseBody = await response.json();

      return {
        head: response.headers,
        body: responseBody,
      };
    }
  } catch (error) {
    throw error;
  }
}