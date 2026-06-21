'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export default function UnauthorizedPage() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center font-sans animate-in fade-in duration-350">
      <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-rose-50 text-rose-600 border border-rose-100 shadow-md shadow-rose-100/20 mb-6 animate-pulse">
        <ShieldAlert className="h-10 w-10" />
      </div>

      <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
        Truy cập bị từ chối (403)
      </h1>
      
      <p className="mt-3 text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
        Bạn không có quyền hạn truy cập vào tài nguyên này. Trang web chỉ cho phép tài khoản có vai trò <strong className="text-rose-650 font-bold">ADMIN</strong> được thao tác.
      </p>

      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 rounded-xl bg-white border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-800 shadow-sm transition-all duration-200 hover:bg-slate-50 hover:border-slate-300 active:scale-[0.98]"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại Trang chủ
        </Link>
        <Link
          href="/login"
          className="text-xs font-semibold text-indigo-650 hover:text-indigo-755 transition-colors"
        >
          Đổi tài khoản khác?
        </Link>
      </div>
    </div>
  );
}
