'use server';

// import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { readConf } from '../others/confHandler';
// eslint-disable-next-line import/named
import { generateCoreCred } from '../others/generateCred';
import { KmsAPIGET } from '../kms/kmsHandler';

// const LoginDynamicpath = '/';

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
  cookies().set({
    name: 'adminstatus',
    value: '',
    sameSite: 'lax',
    path: '/',
  });
  cookies().set({
    name: 'theme',
    value: '',
    sameSite: 'lax',
    path: '/',
  });
  cookies().set({
    name: 'cudpermission',
    value: '',
    sameSite: 'lax',
    path: '/',
  });
  cookies().set({
    name: 'cpermission',
    value: '',
    sameSite: 'lax',
    path: '/',
  });
  return true;
}

export async function CoreAPI(method, path, data) {
  const conf = readConf('frontend_conf.json');
  const cookieStore = cookies();
  let un;
  let pwd;
  un = cookieStore.get('username')?.value;
  pwd = cookieStore.get('password')?.value;

  if (un === undefined || pwd === undefined) {
    un = '';
    pwd = '';
  }
  const credentials = generateCoreCred(un, pwd);
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
  // if (response.status === 401) {
  //   redirect(LoginDynamicpath);
  // }
  const responseBody = await response.json();

  return {
    status: response.status,
    head: response.headers,
    body: responseBody,
  };
}

export async function CoreAPIGET(path) {
  const conf = readConf('frontend_conf.json');
  const cookieStore = cookies();
  let un; let pwd;
  un = cookieStore.get('username')?.value;
  pwd = cookieStore.get('password')?.value;
  if (un === undefined || pwd === undefined) {
    un = '';
    pwd = '';
  }
  const credentials = generateCoreCred(un, pwd);
  const response = await fetch(conf.core_link + path, {
    method: 'GET',
    headers: {
      Authorization: `Basic ${credentials}`,
      Accept: '*/*',
      Connection: 'keep-alive',
    },
  });
  // if (response.status === 401) {
  //   redirect(LoginDynamicpath);
  // }
  const responseBody = await response.json();

  return {
    status: response.status,
    head: response.headers,
    body: responseBody,
  };
}

export async function CoreAPIBlob(method, path, CategoryID, File) {
  const conf = readConf('frontend_conf.json');
  const cookieStore = cookies();
  let un; let
    pwd;
  un = cookieStore.get('username')?.value;
  pwd = cookieStore.get('password')?.value;

  if (un === undefined || pwd === undefined) {
    un = '';
    pwd = '';
  }
  const credentials = generateCoreCred(un, pwd);
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
    // if (response.status === 401) {
    //   redirect(LoginDynamicpath);
    // }

    const fileBlob = await response.blob();

    return {
      status: response.status,
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
    // if (response.status === 401) {
    //   redirect(LoginDynamicpath);
    // }

    const responseBody = await response.json();

    return {
      status: response.status,
      head: response.headers,
      body: responseBody,
    };
  }
}

export async function SetThemeCookies() {
  const response = await CoreAPIGET('loginuser');
  const response2 = await CoreAPIGET('setting');
  const ThemeID = (response.status !== 401) ? response.body.Data.AppthemeID : response2.body.Data.AppthemeID;
  const responseTheme = await CoreAPIGET(`theme?AppthemeID=${ThemeID}`);
  const themevaluestring = JSON.stringify(responseTheme.body.Data.AppthemeValue);
  // const encodedurl = encodeURI(themevaluestring);
  // const base64EncodedValueTheme = btoa(themevaluestring);
  // console.log('-------------------------------------------------------------------------------------');
  // console.log(base64EncodedValueTheme);
  cookies().set({
    name: 'theme',
    value: themevaluestring,
    sameSite: 'lax',
    path: '/',
  });
  return true;
}

export async function Login(Username, Password) {
  const conf = readConf('frontend_conf.json');
  const credentials = generateCoreCred(Username, Password);
  const response = await fetch(`${conf.core_link}loginuser`, {
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
    const responseBody = await response.json();
    if (responseBody.Data.IsSuperAdmin === true) {
      cookies().set({
        name: 'adminstatus',
        value: 'SuperAdmin',
        sameSite: 'lax',
        path: '/',
      });
    } else {
      cookies().set({
        name: 'adminstatus',
        value: 'User',
        sameSite: 'lax',
        path: '/',
      });
    }
    await SetThemeCookies();
    const response3 = await KmsAPIGET('cudpermission');
    cookies().set({
      name: 'cudpermission',
      value: response3.body.Data,
      sameSite: 'lax',
      path: '/',
    });
    const response4 = await KmsAPIGET('cpermission');
    cookies().set({
      name: 'cpermission',
      value: response4.body.Data,
      sameSite: 'lax',
      path: '/',
    });
    return true;
  }
  await SetThemeCookies();
  return false;
}

export async function getUserData() {
  const loginResponse = await CoreAPIGET('loginuser');
  const userId = loginResponse.body.Data.UserID;

  const userResponse = await CoreAPIGET(`user?UserID=${userId}`);
  return userResponse.body.Data;
}

export async function isLogin() {
  const conf = readConf('frontend_conf.json');
  const cookieStore = cookies();
  let un; let pwd;
  un = cookieStore.get('username')?.value;
  pwd = cookieStore.get('password')?.value;
  if (un === undefined || pwd === undefined) {
    un = '';
    pwd = '';
  }
  const credentials = generateCoreCred(un, pwd);
  const response = await fetch(`${conf.core_link}loginuser`, {
    method: 'GET',
    headers: {
      Authorization: `Basic ${credentials}`,
      Accept: '*/*',
      Connection: 'keep-alive',
    },
  });
  if (response.status === 401) {
    return false;
  }

  return true;
}
