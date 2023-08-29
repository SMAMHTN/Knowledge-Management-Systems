import { NextResponse } from "next/server";

export function middleware(req) {
  const pathname = req.nextUrl.pathname;
  const protectedPaths = ["/settings", "/admin"];
  const isPathProtected = protectedPaths?.some((path) => pathname == path);
  const res = NextResponse.next();

  if (isPathProtected) {
    // let AlreadyLogin;

    // isLogin().then((x) => {
    //   AlreadyLogin = x;
    // });
    if (!req.cookies.has('username') && !req.cookies.has('password')) {
      const url = new URL(`/`, req.url);
      return NextResponse.redirect(url);
    }
  }
  return res;
}
