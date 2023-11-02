/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/prop-types */
// import react, { useState } from 'react';
import '../../styles/globals.css';
// import { getCookie } from 'cookies-next';
import Nav from '@/components/Nav';
import getThemeCookiesValueAsync from '@/dep/core/getThemeCookiesValueAsync';
// import { cookies } from "next/headers";
// import React, { useState, useEffect } from 'react';

export default async function Layout({ children }) {
  // const cookieStore = cookies();
  // const theme = cookieStore.get('theme');
  const theme = await getThemeCookiesValueAsync();

  return (
    <div className="min-h-screen flex flex-col flex-auto antialiased flex-shrink-0 bg-gray-500" style={{ backgroundColor: theme.primary_color }}>
      <Nav />
      <div className="h-full mx-2 md:mx-5 mt-16 p-4 left-0 left md:left-72 md:ml-72 mb-72">
        <main>{children}</main>
      </div>
    </div>
  );
}
