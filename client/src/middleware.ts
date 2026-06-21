import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function parseJwt(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  const token = request.cookies.get('auth_token')?.value;
  
  let isAuth = false;
  let isExpired = false;
  let role: string | null = null;

  if (token) {
    const payload = parseJwt(token);
    if (payload) {
      const currentTime = Math.floor(Date.now() / 1000);
      if (payload.exp && payload.exp < currentTime) {
        isExpired = true;
      } else {
        isAuth = true;
        if (payload.scope) {
          const scopes: string[] = payload.scope.split(' ');
          if (scopes.includes('ROLE_ADMIN')) {
            role = 'admin';
          } else if (scopes.includes('ROLE_USER')) {
            role = 'user';
          }
        }
      }
    } else {
      isExpired = true;
    }
  }

  // If token is expired, clear the cookie and redirect to login (or proceed if already on /login)
  if (isExpired) {
    const response = pathname === '/login'
      ? NextResponse.next()
      : NextResponse.redirect(new URL('/login', request.url));
    
    response.cookies.set('auth_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0
    });
    response.cookies.set('auth_logged_in', '', {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0
    });
    return response;
  }

  // 1. If not logged in and trying to access dashboard, redirect to login
  if (pathname.startsWith('/dashboard') && !isAuth) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // 2. If logged in, and trying to access login, redirect to dashboard
  if (pathname === '/login' && isAuth) {
    const dashboardUrl = new URL('/dashboard', request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  // 3. RBAC check: only 'admin' can access /dashboard/users
  if (pathname.startsWith('/dashboard/users') && role !== 'admin') {
    const unauthorizedUrl = new URL('/dashboard/unauthorized', request.url);
    return NextResponse.redirect(unauthorizedUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login'],
};
