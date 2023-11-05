/* eslint-disable import/prefer-default-export */
import { NextResponse } from 'next/server';
import { SetThemeCookies } from './dep/core/coreHandler';

export function middleware(req) {
  const { pathname } = req.nextUrl;
  const protectedPaths = ['settings', 'dashboard', 'article', 'user', 'category', 'roles', 'permission'];
  const isPathProtected = protectedPaths?.some((path) => pathname.includes(path));
  const res = NextResponse.next();
  const theme = req.cookies.get('theme');
  // console.log("----------------------------------------------");
  // console.log(theme);
  // console.log(req.cookies.has('theme'));
  if (!req.cookies.has('theme') || theme.value === '') {
    console.log('Passed here');
    SetThemeCookies().then();
  }
  const theme2 = req.cookies.get('theme');
  if (typeof (theme2) === 'string') {
    res.cookies.set('theme', theme2.value);
  }

  if (isPathProtected) {
    // let AlreadyLogin;

    // isLogin().then((x) => {
    //   AlreadyLogin = x;
    // });

    const username = req.cookies.get('username');
    const password = req.cookies.get('password');
    if (!req.cookies.has('username') || !req.cookies.has('password') || username.value === '' || password.value === '') {
      const url = new URL('/', req.url);
      return NextResponse.redirect(url);
    }
  }
  return res;
}

// export const config = {
//   matcher: ['/settings', '/dashboard', '/article', '/user', '/category', '/roles', '/permission','/settings', '/dashboard/:path*', '/article/:path*', '/user/:path*', '/category/:path*', '/roles/:path*', '/permission/:path*'],
// };
