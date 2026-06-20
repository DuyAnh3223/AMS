'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  username: string;
  role: 'admin' | 'user';
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  errorMsg: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function getCookie(name: string): string | null {
  if (typeof window === 'undefined') return null;
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Read state from cookies on mount
    const username = getCookie('auth_user');
    const role = getCookie('auth_role') as 'admin' | 'user' | null;

    if (username && role) {
      setUser({ username, role });
    } else {
      setUser(null);
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      // 1. Call login endpoint
      const response = await fetch('http://localhost:8080/auth/log-in', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.code !== 1000) {
        setErrorMsg(data.message || 'Tên đăng nhập hoặc mật khẩu không chính xác.');
        setIsLoading(false);
        return false;
      }

      const token = data.result.token;

      // 2. Fetch my info to get user details and roles
      const infoResponse = await fetch('http://localhost:8080/users/my-info', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const infoData = await infoResponse.json();

      if (infoData.code !== 1000) {
        setErrorMsg('Không thể lấy thông tin tài khoản sau đăng nhập.');
        setIsLoading(false);
        return false;
      }

      const backendUser = infoData.result;
      const rolesList = backendUser.roles || [];
      const isAdmin = rolesList.some((r: any) => r.name === 'ADMIN');
      const resolvedRole: 'admin' | 'user' = isAdmin ? 'admin' : 'user';

      // 3. Save to cookies (1 day expiration)
      document.cookie = `auth_token=${encodeURIComponent(token)}; path=/; max-age=86400; SameSite=Lax`;
      document.cookie = `auth_user=${encodeURIComponent(backendUser.username)}; path=/; max-age=86400; SameSite=Lax`;
      document.cookie = `auth_role=${encodeURIComponent(resolvedRole)}; path=/; max-age=86400; SameSite=Lax`;

      setUser({ username: backendUser.username, role: resolvedRole });
      setIsLoading(false);
      return true;
    } catch (err: any) {
      console.error('API log-in error:', err);
      setErrorMsg('Không thể kết nối đến máy chủ API (http://localhost:8080).');
      setIsLoading(false);
      return false;
    }
  };

  const logout = async () => {
    const token = getCookie('auth_token');

    // Call logout endpoint in background (ignore failure)
    if (token) {
      try {
        await fetch('http://localhost:8080/auth/log-out', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });
      } catch (e) {
        console.error('Log out endpoint error:', e);
      }
    }

    // Clear cookies
    document.cookie = 'auth_token=; path=/; max-age=0; SameSite=Lax';
    document.cookie = 'auth_user=; path=/; max-age=0; SameSite=Lax';
    document.cookie = 'auth_role=; path=/; max-age=0; SameSite=Lax';

    setUser(null);
    router.replace('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, errorMsg }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
