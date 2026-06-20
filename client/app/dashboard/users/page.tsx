'use client';

import React, { useState, useEffect } from 'react';
import { apiRequest } from '../../utils/api';
import { 
  Users, 
  Search, 
  Plus, 
  Trash2, 
  ShieldCheck, 
  ShieldAlert, 
  XCircle,
  X,
  RefreshCw,
  Lock
} from 'lucide-react';

interface Role {
  name: string;
  description: string;
}

interface SystemUser {
  id: string;
  username: string;
  roles: Role[];
}

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<SystemUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState<'admin' | 'user'>('user');
  const [modalError, setModalError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await apiRequest('/users');
      setUsers(data);
    } catch (err: any) {
      setError(err.message || 'Không thể lấy danh sách người dùng từ API.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError('');
    setSubmitting(true);

    if (!newUsername.trim() || !newPassword) {
      setModalError('Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.');
      setSubmitting(false);
      return;
    }

    try {
      // 1. Create user
      const created = await apiRequest('/users', {
        method: 'POST',
        body: JSON.stringify({
          username: newUsername,
          password: newPassword
        })
      });

      // 2. If role is admin, update it via PUT request (as backend defaults new users to USER_ROLE)
      if (newRole === 'admin' && created && created.id) {
        await apiRequest(`/users/${created.id}`, {
          method: 'PUT',
          body: JSON.stringify({
            password: newPassword,
            roles: ['ADMIN']
          })
        });
      }

      setNewUsername('');
      setNewPassword('');
      setNewRole('user');
      setIsModalOpen(false);
      fetchUsers(); // Reload list
    } catch (err: any) {
      setModalError(err.message || 'Lỗi khi tạo người dùng.');
    } finally {
      setSubmitting(false);
    }
  };

  const deleteUser = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa tài khoản này không?')) return;
    try {
      await apiRequest(`/users/${id}`, {
        method: 'DELETE'
      });
      setUsers(users.filter(u => u.id !== id));
    } catch (err: any) {
      alert(err.message || 'Không thể xóa người dùng.');
    }
  };

  const filteredUsers = users.filter(u => 
    u.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 font-sans animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="h-6 w-6 text-indigo-650" />
            Quản lý Người dùng
          </h2>
          <p className="text-sm text-slate-500">
            Xem danh sách người dùng được đồng bộ từ Spring Boot API (`GET /users`).
          </p>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={fetchUsers}
            disabled={loading}
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white p-2.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800 shadow-sm disabled:opacity-50"
          >
            <RefreshCw className={`h-4.5 w-4.5 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-600/10 transition-all duration-200 hover:bg-indigo-755 active:scale-[0.98]"
          >
            <Plus className="h-4.5 w-4.5" />
            Thêm người dùng
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-600">
          <XCircle className="h-5 w-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Control panel & Table */}
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        {/* Search */}
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex items-center">
          <div className="relative flex-1 max-w-md">
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
              <Search className="h-4 w-4" />
            </span>
            <input
              type="text"
              placeholder="Tìm kiếm theo tên đăng nhập..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-slate-250 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/10"
            />
          </div>
        </div>

        {/* Table representation */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center text-slate-450 gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
              <span>Đang tải danh sách từ cơ sở dữ liệu...</span>
            </div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Tên tài khoản</th>
                  <th className="px-6 py-4">Vai trò hệ thống</th>
                  <th className="px-6 py-4">Trạng thái</th>
                  <th className="px-6 py-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => {
                    const rolesList = user.roles || [];
                    const isAdmin = rolesList.some(r => r.name === 'ADMIN');
                    return (
                      <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 font-mono text-xs text-slate-450 whitespace-nowrap truncate max-w-[120px]" title={user.id}>
                          {user.id}
                        </td>
                        <td className="px-6 py-4 font-semibold text-slate-800 whitespace-nowrap">{user.username}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            isAdmin 
                              ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' 
                              : 'bg-sky-50 text-sky-600 border border-sky-200'
                          }`}>
                            {isAdmin ? (
                              <>
                                <ShieldCheck className="h-3 w-3" />
                                ADMIN
                              </>
                            ) : (
                              <>
                                <Users className="h-3 w-3" />
                                USER
                              </>
                            )}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            Hoạt động
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => deleteUser(user.id)}
                              disabled={user.username === 'admin'} // Protect primary admin user
                              title={user.username === 'admin' ? "Không thể xóa admin mặc định" : "Xóa người dùng"}
                              className={`rounded-lg border p-2 transition-colors ${
                                user.username === 'admin'
                                  ? 'opacity-30 cursor-not-allowed text-slate-400 border-slate-100 bg-slate-50'
                                  : 'border-slate-200 text-rose-600 hover:bg-rose-50 hover:border-rose-300'
                              }`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-slate-450">
                      Không tìm thấy tài khoản nào phù hợp.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* CREATE USER MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-slate-900/30 backdrop-blur-xs z-50 p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-4">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Users className="h-5 w-5 text-indigo-600" />
                Tạo tài khoản mới
              </h3>
              <button 
                onClick={() => {
                  setIsModalOpen(false);
                  setModalError('');
                }}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-850"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {modalError && (
              <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-600">
                <ShieldAlert className="h-4.5 w-4.5 shrink-0" />
                <span>{modalError}</span>
              </div>
            )}

            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Tên tài khoản (Username)</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ví dụ: nhanvien_01"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-indigo-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Mật khẩu</label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input 
                    type="password" 
                    required
                    placeholder="Nhập mật khẩu..."
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-indigo-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Vai trò (Role)</label>
                <select 
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as 'admin' | 'user')}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white"
                >
                  <option value="user">User (Quyền chuẩn - Chỉ xem Hàng hóa & Đối tác)</option>
                  <option value="admin">Admin (Toàn quyền quản trị hệ thống)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setModalError('');
                  }}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-500 hover:bg-slate-100 hover:text-slate-950"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
                >
                  {submitting ? 'Đang tạo...' : 'Xác nhận'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
