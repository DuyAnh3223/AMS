'use client';

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { Lock, User, LogIn, Shield, AlertCircle, Info } from 'lucide-react';

export default function LoginPage() {
  const { login, isLoading, errorMsg } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim()) {
      setError('Vui lòng nhập tên đăng nhập');
      return;
    }
    if (!password) {
      setError('Vui lòng nhập mật khẩu');
      return;
    }

    const success = await login(username, password);
    if (success) {
      router.push('/dashboard');
    }
  };

  const handleQuickLogin = async (selectedRole: 'admin' | 'user') => {
    setError('');
    let qUser = 'admin';
    let qPass = 'admin';

    if (selectedRole === 'user') {
      qUser = 'user';
      qPass = 'user';
    }

    setUsername(qUser);
    setPassword(qPass);
    
    const success = await login(qUser, qPass);
    if (success) {
      router.push('/dashboard');
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-slate-50 p-6 md:p-10 font-sans">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.08),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.04),transparent_40%)]" />

      {/* Main Container */}
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl transition-all duration-300">
        <div className="px-8 pt-10 pb-8">
          {/* Logo & Header */}
          <div className="mb-8 flex flex-col items-center text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-md shadow-indigo-100/30 mb-4 transition-transform hover:scale-105 duration-300">
              <Shield className="h-7 w-7" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Hệ thống AMS
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Đăng nhập kết nối API backend (`http://localhost:8080`)
            </p>
          </div>

          {(error || errorMsg) && (
            <div className="mb-6 flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-sm text-rose-600 animate-in fade-in duration-200">
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
              <span>{error || errorMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                Tên đăng nhập
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <User className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin, user, v.v..."
                  disabled={isLoading}
                  className="w-full rounded-xl border border-slate-250 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all duration-200 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/10 disabled:opacity-50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                Mật khẩu
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={isLoading}
                  className="w-full rounded-xl border border-slate-250 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all duration-200 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/10 disabled:opacity-50"
                />
              </div>
            </div>

            {/* Log in Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="relative flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/10 transition-all duration-200 hover:bg-indigo-700 hover:shadow-indigo-500/20 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"
            >
              {isLoading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <LogIn className="h-4 w-4" />
                  Đăng nhập
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <span className="relative bg-white px-3 text-xs text-slate-400 font-medium">
              Đăng nhập nhanh dữ liệu mẫu
            </span>
          </div>

          {/* Quick Login Buttons */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <button
              type="button"
              onClick={() => handleQuickLogin('admin')}
              disabled={isLoading}
              className="flex flex-col items-center justify-center rounded-2xl border border-emerald-250 bg-emerald-50 py-3 transition-all duration-200 hover:bg-emerald-100 hover:border-emerald-400 group"
            >
              <span className="text-xs font-semibold text-emerald-600">Đăng nhập nhanh</span>
              <span className="text-xs text-slate-500 font-bold group-hover:text-emerald-700">ADMIN</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('user')}
              disabled={isLoading}
              className="flex flex-col items-center justify-center rounded-2xl border border-sky-250 bg-sky-50 py-3 transition-all duration-200 hover:bg-sky-100 hover:border-sky-400 group"
            >
              <span className="text-xs font-semibold text-sky-600">Đăng nhập nhanh</span>
              <span className="text-xs text-slate-500 font-bold group-hover:text-sky-700">USER</span>
            </button>
          </div>

          <div className="flex gap-2 items-start bg-slate-50 rounded-xl p-3 border border-slate-200 text-[11px] text-slate-500 leading-normal">
            <Info className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
            <p>
              Tài khoản **admin** / mật khẩu **admin** được khởi tạo mặc định từ hệ thống Spring Boot. Để đăng nhập tài khoản **user** (user/user), bạn cần dùng tài khoản admin tạo mới trước trong mục **Người dùng**.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
