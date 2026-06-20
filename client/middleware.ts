import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  const authUser = request.cookies.get('auth_user')?.value;
  const authRole = request.cookies.get('auth_role')?.value;

  const isAuth = !!authUser;

  // 1. If not logged in and trying to access dashboard, redirect to login
  if (pathname.startsWith('/dashboard') && !isAuth) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // 2. If logged in and trying to access login, redirect to dashboard
  if (pathname === '/login' && isAuth) {
    const dashboardUrl = new URL('/dashboard', request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  // 3. RBAC check: only 'admin' can access /dashboard/users
  if (pathname.startsWith('/dashboard/users') && authRole !== 'admin') {
    const unauthorizedUrl = new URL('/dashboard/unauthorized', request.url);
    return NextResponse.redirect(unauthorizedUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login'],
};
