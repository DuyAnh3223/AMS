'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/src/hooks/useAuth';
import {
  Users,
  Package,
  Handshake,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  Shield,
  User as UserIcon,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout, isLoading } = useAuth();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-800">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
          <p className="text-sm font-medium text-slate-500">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  // Define navigation items
  const allNavItems = [
    {
      name: 'Tổng quan',
      href: '/dashboard',
      icon: LayoutDashboard,
      roles: ['admin', 'user'],
    },
    {
      name: 'Người dùng',
      href: '/dashboard/users',
      icon: Users,
      roles: ['admin'],
    },
    {
      name: 'Hàng hóa',
      href: '/dashboard/products',
      icon: Package,
      roles: ['admin', 'user'],
    },
    {
      name: 'Đối tác',
      href: '/dashboard/partners',
      icon: Handshake,
      roles: ['admin', 'user'],
    },
  ];

  // Filter navigation items based on user role
  const userRole = user && user.roles && user.roles.length > 0
    ? user.roles[0].name.toLowerCase().replace(/^role_/, '')
    : 'user';
  const navItems = allNavItems.filter((item) => item.roles.includes(userRole));

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col md:flex-row">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.03),transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.01),transparent_50%)] pointer-events-none" />

      {/* MOBILE HEADER */}
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4 md:hidden z-30 w-full">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-100">
            <Shield className="h-5 w-5" />
          </div>
          <span className="font-bold text-lg tracking-wide text-slate-800">AMS Panel</span>
        </div>
        <button
          onClick={toggleSidebar}
          className="rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800 cursor-pointer"
        >
          {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </header>

      {/* SIDEBAR */}
      <aside
        className={`fixed inset-y-0 left-0 border-r border-slate-200 bg-white z-40 transition-all duration-300 md:translate-x-0 md:static md:flex md:flex-col relative ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } ${isCollapsed ? 'md:w-20' : 'md:w-72'}`}
      >
        {/* Sidebar Header */}
        <div className={`flex h-20 items-center border-b border-slate-200 relative ${isCollapsed ? 'px-4 justify-center' : 'px-8 justify-between'
          }`}>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-sm shadow-indigo-100/20">
              <Shield className="h-5 w-5" />
            </div>
            {!isCollapsed && (
              <div className="animate-in fade-in duration-200">
                <h1 className="font-bold text-base text-slate-800 tracking-wide leading-none">AMS SYSTEM</h1>
                <span className="text-[10px] text-indigo-600 font-semibold tracking-widest uppercase">Phân quyền RBAC</span>
              </div>
            )}
          </div>

          {/* Toggle Collapse Button (Desktop Only) */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:flex absolute top-7 -right-3 h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 hover:text-slate-800 shadow-sm z-50 transition-transform hover:scale-110 cursor-pointer"
            title={isCollapsed ? "Mở rộng menu" : "Thu nhỏ menu"}
          >
            {isCollapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
          </button>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 space-y-1.5 px-4 py-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsSidebarOpen(false)}
                title={isCollapsed ? item.name : undefined}
                className={`group flex items-center rounded-xl py-3 text-sm font-medium transition-all duration-200 ${isCollapsed ? 'justify-center px-0' : 'justify-between px-4'
                  } ${isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
              >
                <div className="flex items-center gap-3.5">
                  <Icon className={`h-4.5 w-4.5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-700'} ${isCollapsed ? 'mx-auto' : ''}`} />
                  {!isCollapsed && <span className="animate-in fade-in duration-200 whitespace-nowrap">{item.name}</span>}
                </div>
                {!isCollapsed && isActive && <ChevronRight className="h-4 w-4 shrink-0" />}
              </Link>
            );
          })}
        </nav>

        {/* User profile & Logout */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/40">
          <div className={`flex items-center gap-3 rounded-2xl bg-white border border-slate-200 shadow-sm transition-all ${isCollapsed ? 'p-2 justify-center' : 'p-3'
            }`}>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-indigo-600 border border-slate-200/50">
              <UserIcon className="h-5 w-5" />
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0 animate-in fade-in duration-200">
                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Tài khoản</p>
                <h4 className="text-sm font-bold text-slate-800 truncate">{user?.username}</h4>
                <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 mt-1 text-[10px] font-bold uppercase tracking-wider ${userRole === 'admin'
                  ? 'bg-emerald-50 text-emerald-600 border border-emerald-250'
                  : 'bg-sky-50 text-sky-600 border border-sky-250'
                  }`}>
                  {userRole}
                </span>
              </div>
            )}
          </div>

          <button
            onClick={logout}
            title={isCollapsed ? "Đăng xuất" : undefined}
            className="mt-3 flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-3 text-sm font-medium text-rose-600 transition-all duration-200 hover:bg-rose-50 hover:text-rose-700 w-full cursor-pointer"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {!isCollapsed && <span className="animate-in fade-in duration-250 whitespace-nowrap">Đăng xuất</span>}
          </button>
        </div>
      </aside>

      {/* OVERLAY FOR MOBILE */}
      {isSidebarOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-xs z-30 md:hidden"
        />
      )}

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col min-w-0">
        <div className="flex-1 md:pt-2 md:pb-6 md:pr-6 md:pl-6 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
