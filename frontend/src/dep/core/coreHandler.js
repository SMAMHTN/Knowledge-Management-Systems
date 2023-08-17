'use server';

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { readConf } from '../others/confHandler';
import { generateCoreCred } from '../others/generateCred';

const LoginDynamicpath = '/';

export async function Login(Username, Password) {
  const conf = readConf('frontend_conf.json');
  const credentials = generateCoreCred(Username, Password);
  try {
    const response = await fetch(`${conf.core_link}login`, {
      method: 'GET',
      headers: {
        Authorization: `Basic ${credentials}`,
        Accept: '*/*',
        Connection: 'keep-alive',
      },
    });

    if (response.ok) {
      cookies().set({
        name: 'username',
        value: Username,
        sameSite: 'lax',
        path: '/',
      });
      cookies().set({
        name: 'password',
        value: Password,
        sameSite: 'lax',
        path: '/',
      });
      return true;
    }
    return false;
  } catch (error) {
    throw error;
  }
}

export async function Logout() {
  cookies().set({
    name: 'username',
    value: '',
    sameSite: 'lax',
    path: '/',
  });
  cookies().set({
    name: 'password',
    value: '',
    sameSite: 'lax',
    path: '/',
  });
  return true;
}

export async function CoreAPI(method, path, data) {
  const conf = readConf('frontend_conf.json');
  const cookieStore = cookies();
  let un; let
    pwd;
  try {
    un = cookieStore.get('username')?.value;
    pwd = cookieStore.get('password')?.value;

    if (un === undefined || pwd === undefined) {
      un = '';
      pwd = '';
    }
  } catch (error) {
    throw error;
  }
  const credentials = generateCoreCred(un, pwd);
  try {
    const response = await fetch(conf.core_link + path, {
      method,
      headers: {
        Authorization: `Basic ${credentials}`,
        Accept: '*/*',
        Connection: 'keep-alive',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (response.status === 401) {
      redirect(LoginDynamicpath);
    }
    const responseBody = await response.json();

    return {
      head: response.headers,
      body: responseBody,
    };
  } catch (error) {
    throw error;
  }
}

export async function CoreAPIGET(path) {
  const conf = readConf('frontend_conf.json');
  const cookieStore = cookies();
  let un; let
    pwd;
  try {
    un = cookieStore.get('username')?.value;
    pwd = cookieStore.get('password')?.value;
    if (un === undefined || pwd === undefined) {
      un = '';
      pwd = '';
    }
  } catch (error) {
    throw error;
  }
  const credentials = generateCoreCred(un, pwd);
  try {
    const response = await fetch(conf.core_link + path, {
      method: 'GET',
      headers: {
        Authorization: `Basic ${credentials}`,
        Accept: '*/*',
        Connection: 'keep-alive',
      },
    });
    if (response.status === 401) {
      redirect(LoginDynamicpath);
    }
    const responseBody = await response.json();

    return {
      head: response.headers,
      body: responseBody,
    };
  } catch (error) {
    throw error;
  }
}

export async function CoreAPIBlob(method, path, CategoryID, File) {
  const conf = readConf('frontend_conf.json');
  const cookieStore = cookies();
  let un; let
    pwd;
  try {
    un = cookieStore.get('username')?.value;
    pwd = cookieStore.get('password')?.value;

    if (un === undefined || pwd === undefined) {
      un = '';
      pwd = '';
    }
  } catch (error) {
    throw error;
  }
  const credentials = generateCoreCred(un, pwd);
  try {
    const headers = {
      Authorization: `Basic ${credentials}`,
      Accept: '*/*',
      Connection: 'keep-alive',
    };

    let response;
    if (method === 'GET') {
      response = await fetch(conf.core_link + path, {
        method,
        headers,
      });
      if (response.status === 401) {
        redirect(LoginDynamicpath);
      }

      const fileBlob = await response.blob();

      return {
        head: response.headers,
        body: fileBlob,
      };
    } if (method === 'POST') {
      const formData = new FormData();
      formData.append('CategoryID', CategoryID);
      formData.append('File', File);

      response = await fetch(conf.core_link + path, {
        method,
        headers,
        body: formData,
      });
      if (response.status === 401) {
        redirect(LoginDynamicpath);
      }

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

export async function getUserData() {
  try {
    const loginResponse = await CoreAPIGET('loginuser');
    const userId = loginResponse.body.Data.UserID;

    const userResponse = await CoreAPIGET(`user?UserID=${userId}`);
    return userResponse.body.Data;
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error; // Re-throw the error to handle it in the component
  }
}
