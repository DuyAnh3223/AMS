import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest, props: { params: Promise<{ path: string[] }> }) {
  const { path } = await props.params;
  return handleProxy(request, 'GET', path);
}

export async function POST(request: NextRequest, props: { params: Promise<{ path: string[] }> }) {
  const { path } = await props.params;
  return handleProxy(request, 'POST', path);
}

export async function PUT(request: NextRequest, props: { params: Promise<{ path: string[] }> }) {
  const { path } = await props.params;
  return handleProxy(request, 'PUT', path);
}

export async function DELETE(request: NextRequest, props: { params: Promise<{ path: string[] }> }) {
  const { path } = await props.params;
  return handleProxy(request, 'DELETE', path);
}

async function handleProxy(request: NextRequest, method: string, pathSegments: string[]) {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  const path = pathSegments.join('/');
  
  const searchParams = request.nextUrl.searchParams.toString();
  const url = `http://localhost:8080/${path}${searchParams ? '?' + searchParams : ''}`;

  const headers = new Headers();
  headers.set('Content-Type', 'application/json');
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const options: RequestInit = {
    method,
    headers,
  };

  if (method !== 'GET' && method !== 'HEAD') {
    if (path === 'auth/log-out' && method === 'POST') {
      options.body = JSON.stringify({ token: token || '' });
    } else {
      options.body = await request.text();
    }
  }

  try {
    const res = await fetch(url, options);
    
    let data;
    const contentType = res.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await res.json();
    } else {
      data = { code: 1000, message: 'Thao tác thành công' };
    }

    const response = NextResponse.json(data, { status: res.status });

    // If unauthenticated (401), automatically clear the auth_token cookie to prevent redirection loop
    if (res.status === 401) {
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
    }

    // Handle Login Interception
    if (path === 'auth/log-in' && method === 'POST') {
      if (data && data.code === 1000 && data.result?.token) {
        const tokenValue = data.result.token;
        response.cookies.set('auth_token', tokenValue, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          maxAge: 3600 // 1 hour
        });
        response.cookies.set('auth_logged_in', 'true', {
          httpOnly: false,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          maxAge: 3600 // 1 hour
        });
      }
    }

    // Handle Logout Interception
    if (path === 'auth/log-out' && method === 'POST') {
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
    }

    return response;
  } catch (error: any) {
    console.error(`Proxy error [${method}] ${path}:`, error);
    return NextResponse.json({ code: 9999, message: error.message }, { status: 500 });
  }
}
