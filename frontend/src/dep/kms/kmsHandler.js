/* eslint-disable import/named */

'use server';

// import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { readConf } from '../others/confHandler';
import { generateKmsCred } from '../others/generateCred';

// const LoginDynamicpath = '/login';

export async function CookiesGenerateKMSCred() {
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
  const credentials = Buffer.from(
    `${conf.kms_password}:${un}&&${pwd}`,
  ).toString('base64');
  return {
    cred: credentials,
    link: conf.kms_link,
  };
}

export async function KmsAPI(method, path, data) {
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
  const credentials = generateKmsCred(un, pwd);
  const response = await fetch(conf.kms_link + path, {
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

export async function KmsAPIGET(path) {
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
  const credentials = generateKmsCred(un, pwd);
  const response = await fetch(conf.kms_link + path, {
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

export async function KmsAPIBlob(method, path, formData) {
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
  const credentials = generateKmsCred(un, pwd);
  const headers = {
    Authorization: `Basic ${credentials}`,
    Accept: '*/*',
    Connection: 'keep-alive',
    'Access-Control-Request-Headers': 'Content-Disposition',
  };

  let response;
  if (method === 'GET') {
    response = await fetch(conf.kms_link + path, {
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
    // const formData = new FormData();
    // formData.append('CategoryID', CategoryID);
    // formData.append('File', File);
    response = await fetch(conf.kms_link + path, {
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
