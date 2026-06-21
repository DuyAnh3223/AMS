'use client';

import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../../store/auth-store';
import { userService } from '../../services/user.service';

export default function AuthInitializer({ children }: { children: React.ReactNode }) {
  const { setUser, setIsLoading } = useAuthStore();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      // Check if user is logged in using non-HttpOnly cookie
      const hasLoggedInCookie = typeof document !== 'undefined' && 
        document.cookie.split(';').some(item => item.trim().startsWith('auth_logged_in='));

      if (!hasLoggedInCookie) {
        setUser(null);
        setIsLoading(false);
        setInitialized(true);
        return;
      }

      setIsLoading(true);
      try {
        const myInfo = await userService.getMyInfo();
        setUser(myInfo);
      } catch (err) {
        console.error('Session initialization failed:', err);
        setUser(null);
      } finally {
        setIsLoading(false);
        setInitialized(true);
      }
    };
    initAuth();
  }, [setUser, setIsLoading]);

  if (!initialized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-800">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
          <p className="text-sm font-medium text-slate-550 font-sans">Khởi tạo phiên làm việc...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
