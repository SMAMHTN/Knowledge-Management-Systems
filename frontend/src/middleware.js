import { NextResponse } from 'next/server';

export function middleware(req) {
  const { pathname } = req.nextUrl;
  const protectedPaths = ['settings', 'dashboard', 'article', 'user', 'category', 'roles', 'permission'];
  const isPathProtected = protectedPaths?.some((path) => pathname.includes(path));
  const res = NextResponse.next();

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
