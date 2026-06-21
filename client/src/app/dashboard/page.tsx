'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/src/hooks/useAuth';
import { apiClient } from '@/src/lib/api-client';
import { 
  Users, 
  Package, 
  Handshake, 
  Shield, 
  UserCheck, 
  ArrowRight,
  Boxes,
  Database,
  RefreshCw,
  TrendingUp
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useAuth();
  const isAdmin = user && user.roles && user.roles.some(r => r.name === 'ADMIN');

  const [userCount, setUserCount] = useState<number | string>('...');
  const [productCount, setProductCount] = useState<number | string>('...');
  const [partnerCount, setPartnerCount] = useState<number | string>('...');
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const productsRes = await apiClient.get('/products');
      setProductCount(productsRes.data.result.length);

      const partnersRes = await apiClient.get('/partners/all');
      setPartnerCount(partnersRes.data.result.length);

      if (isAdmin) {
        const usersRes = await apiClient.get('/users');
        setUserCount(usersRes.data.result.length);
      }
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchStats();
    }
  }, [isAdmin, user]);

  const stats = [
    {
      name: 'Người dùng hệ thống',
      value: userCount.toString(),
      change: 'Đồng bộ từ Database',
      icon: Users,
      color: 'from-emerald-500/10 to-teal-500/10 text-emerald-600 border-emerald-500/20',
      href: '/dashboard/users',
      adminOnly: true,
    },
    {
      name: 'Mã hàng hóa (SKU)',
      value: productCount.toString(),
      change: 'Đồng bộ từ Database',
      icon: Package,
      color: 'from-blue-500/10 to-indigo-500/10 text-blue-600 border-blue-500/20',
      href: '/dashboard/products',
      adminOnly: false,
    },
    {
      name: 'Đối tác liên kết',
      value: partnerCount.toString(),
      change: 'Đồng bộ từ Database',
      icon: Handshake,
      color: 'from-amber-500/10 to-orange-500/10 text-amber-600 border-amber-500/20',
      href: '/dashboard/partners',
      adminOnly: false,
    },
  ];

  const visibleStats = stats.filter(stat => !stat.adminOnly || isAdmin);

  const userRole = user && user.roles && user.roles.length > 0 ? user.roles[0].name : 'USER';

  return (
    <div className="space-y-8 font-sans animate-in fade-in duration-300">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm">
        <div className="absolute inset-y-0 right-0 w-1/3 bg-[radial-gradient(circle_at_right,rgba(99,102,241,0.06),transparent_60%)] pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-sm">
              {isAdmin ? <Shield className="h-3.5 w-3.5" /> : <UserCheck className="h-3.5 w-3.5" />}
              <span>Quyền hạn: {userRole}</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
              Chào mừng quay trở lại, {user?.username}!
            </h2>
            <p className="text-sm text-slate-500 max-w-xl">
              Hệ thống đã kết nối trực tiếp đến Spring Boot RESTful API (`http://localhost:8080`). Dữ liệu được cập nhật theo cơ chế phân quyền (RBAC).
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <button
              onClick={fetchStats}
              disabled={loading}
              className="h-10 w-10 rounded-xl bg-white hover:bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-700 border border-slate-200 shadow-sm transition-colors disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`h-4.5 w-4.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-sm shadow-emerald-50">
                <Database className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-semibold uppercase">API server</p>
                <p className="text-xs font-bold text-emerald-600">Online (8080)</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className={`grid gap-6 sm:grid-cols-2 lg:grid-cols-${visibleStats.length}`}>
        {visibleStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.name}
              className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 transition-all duration-300 hover:border-slate-350 hover:shadow-md shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-500">{stat.name}</span>
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${stat.color} border shadow-sm`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-4 space-y-1">
                <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">{stat.value}</h3>
                <p className="text-xs text-slate-400 font-medium">{stat.change}</p>
              </div>
              
              <Link 
                href={stat.href}
                className="mt-6 flex items-center gap-1.5 text-xs font-bold text-indigo-650 transition-colors group-hover:text-indigo-755"
              >
                <span>Chi tiết quản lý</span>
                <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          );
        })}
      </div>

      {/* Role Access Information Box */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Permission matrix summary */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Shield className="h-5 w-5 text-indigo-600" />
            Bảng Quyền Hạn Thực Tế
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2.5 border-b border-slate-100">
              <span className="text-sm text-slate-600 font-medium">Chức năng Tổng quan</span>
              <div className="flex gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">Admin</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-600 border border-indigo-200">User</span>
              </div>
            </div>
            <div className="flex items-center justify-between py-2.5 border-b border-slate-100">
              <span className="text-sm text-slate-600 font-medium">Quản lý Người dùng (`/users`)</span>
              <div className="flex gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">Admin</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-400 border border-slate-200/50">User (Blocked)</span>
              </div>
            </div>
            <div className="flex items-center justify-between py-2.5 border-b border-slate-100">
              <span className="text-sm text-slate-600 font-medium">Quản lý Hàng hóa (`/products`)</span>
              <div className="flex gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">Admin</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-600 border border-indigo-200">User</span>
              </div>
            </div>
            <div className="flex items-center justify-between py-2.5">
              <span className="text-sm text-slate-600 font-medium">Quản lý Đối tác (`/partners`)</span>
              <div className="flex gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">Admin</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-600 border border-indigo-200">User</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick action logs simulation */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Boxes className="h-5 w-5 text-indigo-600" />
              Đăng nhập & Phiên làm việc
            </h3>
            <div className="space-y-4">
              <div className="flex gap-3 text-sm">
                <div className="h-2 w-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <div>
                  <p className="text-slate-800 font-semibold">JWT Token hợp lệ</p>
                  <p className="text-xs text-slate-500 leading-normal">Người dùng `{user?.username}` đã xác thực thành công. Mã thông báo đã lưu trữ bảo mật trong HTTP Cookie.</p>
                </div>
              </div>
              <div className="flex gap-3 text-sm">
                <div className="h-2 w-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                <div>
                  <p className="text-slate-800 font-semibold">Cấu hình Middleware</p>
                  <p className="text-xs text-slate-500 leading-normal">Mọi hành động thay đổi dữ liệu hoặc truy cập trang đều được chặn lọc tự động ở cấp độ định tuyến Next.js.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
            <span>Phiên bản Backend: Spring Boot v3</span>
            <span className="flex items-center gap-1 font-semibold text-emerald-600">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Cơ sở dữ liệu sẵn sàng
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
