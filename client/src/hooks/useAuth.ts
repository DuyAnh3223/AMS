import { useAuthStore } from '../store/auth-store';
import { authService } from '../services/auth.service';
import { userService } from '../services/user.service';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

export function useAuth() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, setUser, setIsLoading, logout: storeLogout } = useAuthStore();
  const [errorMsg, setErrorMsg] = useState('');

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const authResponse = await authService.login(username, password);
      
      if (authResponse.authenticated) {
        // Fetch full user details (roles + permissions) after login
        const myInfo = await userService.getMyInfo();
        setUser(myInfo);
        toast.success('Đăng nhập thành công!');
        router.push('/dashboard');
        return true;
      } else {
        setErrorMsg('Đăng nhập thất bại.');
        toast.error('Đăng nhập thất bại.');
        return false;
      }
    } catch (err: any) {
      const msg = err.message || 'Đăng nhập thất bại.';
      setErrorMsg(msg);
      toast.error(msg);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      storeLogout();
      toast.success('Đăng xuất thành công!');
      router.push('/login');
    } catch (err) {
      console.error('Logout error:', err);
      // Fallback logout clearing store and redirecting
      storeLogout();
      router.push('/login');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    errorMsg,
    login,
    logout,
  };
}
