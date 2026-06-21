'use client';

import React, { useState, useEffect } from 'react';
import { partnerService, Partner } from '@/src/services/partner.service';
import { usePermission } from '@/src/hooks/usePermission';
import {
  Handshake,
  Search,
  Plus,
  Trash2,
  Phone,
  MapPin,
  AlertCircle,
  X,
  FileText,
  BarChart3,
  Users
} from 'lucide-react';
import { toast } from 'sonner';

export default function PartnersPage() {
  const { hasRole } = usePermission();
  const isAdmin = hasRole('ADMIN');

  const [activeTab, setActiveTab] = useState<'CUSTOMER' | 'SUPPLIER'>('CUSTOMER');
  const [searchTerm, setSearchTerm] = useState('');
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Form input states
  const [newName, setNewName] = useState('');
  const [newCode, setNewCode] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newTaxCode, setNewTaxCode] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Report modal state
  const [isReportOpen, setIsReportOpen] = useState(false);

  const fetchPartners = async () => {
    setLoading(true);
    setError('');
    try {
      const data = activeTab === 'CUSTOMER'
        ? await partnerService.getCustomers()
        : await partnerService.getSuppliers();
      setPartners(data);
    } catch (err: any) {
      setError(err.message || 'Không thể tải danh sách đối tác.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, [activeTab]);

  const handleAddPartner = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);

    if (!newName.trim() || !newCode.trim()) {
      setFormError('Vui lòng điền đầy đủ các thông tin bắt buộc.');
      setSubmitting(false);
      return;
    }

    try {
      const payload = {
        partnerCode: newCode.toUpperCase(),
        name: newName,
        isCustomer: activeTab === 'CUSTOMER',
        isSupplier: activeTab === 'SUPPLIER',
        address: newAddress,
        taxCode: newTaxCode,
        phone: newPhone
      };

      if (activeTab === 'CUSTOMER') {
        await partnerService.createCustomer(payload);
      } else {
        await partnerService.createSupplier(payload);
      }

      setNewName('');
      setNewCode('');
      setNewPhone('');
      setNewTaxCode('');
      setNewAddress('');
      toast.success(`Đã thêm ${activeTab === 'CUSTOMER' ? 'Khách hàng' : 'Nhà cung cấp'} mới thành công!`);
      fetchPartners();
    } catch (err: any) {
      setFormError(err.message || 'Lỗi khi thêm đối tác mới.');
      toast.error(err.message || 'Không thể thêm đối tác.');
    } finally {
      setSubmitting(false);
    }
  };

  const deletePartner = async (id: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa đối tác này?')) return;
    try {
      if (activeTab === 'CUSTOMER') {
        await partnerService.deleteCustomer(id);
      } else {
        await partnerService.deleteSupplier(id);
      }
      setPartners(partners.filter(p => p.id !== id));
      toast.success('Đã xóa đối tác thành công!');
    } catch (err: any) {
      alert(err.message || 'Không thể xóa đối tác.');
      toast.error(err.message || 'Không thể xóa đối tác.');
    }
  };

  const filteredPartners = partners.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.partnerCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.phone && p.phone.includes(searchTerm))
  );

  // Compute stats for report
  const totalPartners = partners.length;
  const withTaxCodeCount = partners.filter(p => p.taxCode && p.taxCode !== 'N/A' && p.taxCode !== '').length;
  const withAddressCount = partners.filter(p => p.address && p.address !== 'N/A' && p.address !== '').length;

  return (
    <div className="flex flex-col space-y-6 font-sans animate-in fade-in duration-300">

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('CUSTOMER')}
          className={`py-3 px-6 text-sm font-bold border-b-2 transition-all cursor-pointer ${activeTab === 'CUSTOMER'
            ? 'border-indigo-600 text-indigo-600'
            : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
        >
          Khách hàng
        </button>
        <button
          onClick={() => setActiveTab('SUPPLIER')}
          className={`py-3 px-6 text-sm font-bold border-b-2 transition-all cursor-pointer ${activeTab === 'SUPPLIER'
            ? 'border-indigo-600 text-indigo-600'
            : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
        >
          Nhà cung cấp
        </button>
        <div className="ml-auto">
          <button
            type="button"
            onClick={() => setIsReportOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-indigo-250 bg-indigo-50 px-4 py-2 text-xs font-bold text-indigo-655 hover:bg-indigo-100 transition-colors shadow-sm cursor-pointer"
          >
            <FileText className="h-4 w-4" />
            Xem Báo cáo {activeTab === 'CUSTOMER' ? 'Khách hàng' : 'Nhà cung cấp'}
          </button>
        </div>
      </div>

      {/* 1/3 TOP AREA - INPUT FORM (ADMIN only) */}
      {isAdmin ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
          {formError && (
            <div className="flex items-center gap-2 text-rose-600 bg-rose-50 p-2.5 rounded-xl border border-rose-200 text-xs">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}
          <form onSubmit={handleAddPartner} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 items-end">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider">Mã {activeTab === 'CUSTOMER' ? 'Khách hàng' : 'Nhà cung cấp'}</label>
              <input
                type="text"
                required
                placeholder={activeTab === 'CUSTOMER' ? 'Ví dụ: KH0001' : 'Ví dụ: NCC0001'}
                value={newCode}
                onChange={(e) => setNewCode(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-xs text-slate-900 placeholder-slate-400 outline-none transition focus:border-indigo-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider">Tên {activeTab === 'CUSTOMER' ? 'Khách hàng' : 'Nhà cung cấp'}</label>
              <input
                type="text"
                required
                placeholder="Công ty, NPP, cá nhân..."
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-xs text-slate-900 placeholder-slate-400 outline-none transition focus:border-indigo-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider">Số điện thoại</label>
              <input
                type="text"
                placeholder="SĐT liên hệ..."
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-xs text-slate-900 placeholder-slate-400 outline-none transition focus:border-indigo-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider">Mã số thuế</label>
              <input
                type="text"
                placeholder="MST (nếu có)"
                value={newTaxCode}
                onChange={(e) => setNewTaxCode(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-xs text-slate-900 placeholder-slate-400 outline-none transition focus:border-indigo-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider">Địa chỉ</label>
              <input
                type="text"
                placeholder="Địa chỉ trụ sở chính..."
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-xs text-slate-900 placeholder-slate-400 outline-none transition focus:border-indigo-500 focus:bg-white"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 py-2 px-4 text-xs font-bold text-white shadow-md hover:bg-indigo-700 disabled:opacity-50 transition-all cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                {submitting ? 'Đang lưu...' : `Thêm ${activeTab === 'CUSTOMER' ? 'Khách hàng' : 'Nhà cung cấp'}`}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl p-4 text-xs flex gap-2 items-center">
          <AlertCircle className="h-4.5 w-4.5 text-amber-600 shrink-0" />
          <span>Bạn đang sử dụng tài khoản <strong>USER</strong> (Chỉ đọc). Nếu cần thêm hoặc xóa dữ liệu đối tác, vui lòng liên hệ tài khoản <strong>ADMIN</strong>.</span>
        </div>
      )}

      {/* 2/3 BOTTOM AREA - DATA DISPLAY TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col">
        {/* Search */}
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
              <Search className="h-4 w-4" />
            </span>
            <input
              type="text"
              placeholder={`Tìm kiếm ${activeTab === 'CUSTOMER' ? 'Khách hàng' : 'Nhà cung cấp'}`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-slate-250 bg-slate-50 py-2.5 pl-10 pr-4 text-xs text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/10"
            />
          </div>
          <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
            Danh sách: {filteredPartners.length} {activeTab === 'CUSTOMER' ? 'Khách hàng' : 'Nhà cung cấp'}
          </div>
        </div>

        {/* Table Representation */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center text-slate-450 gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
              <span>Đang tải danh sách đối tác...</span>
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3.5">Mã {activeTab === 'CUSTOMER' ? 'Khách hàng' : 'Nhà cung cấp'}</th>
                  <th className="px-6 py-3.5">Tên {activeTab === 'CUSTOMER' ? 'Khách hàng' : 'Nhà cung cấp'}</th>
                  <th className="px-6 py-3.5">Mã số thuế</th>
                  <th className="px-6 py-3.5">Số điện thoại</th>
                  <th className="px-6 py-3.5">Địa chỉ</th>
                  {isAdmin && <th className="px-6 py-3.5 text-right">Thao tác</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPartners.length > 0 ? (
                  filteredPartners.map((partner) => (
                    <tr key={partner.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-3.5 font-mono font-bold text-indigo-650">{partner.partnerCode}</td>
                      <td className="px-6 py-3.5 font-semibold text-slate-800">{partner.name}</td>
                      <td className="px-6 py-3.5 font-mono text-slate-600">{partner.taxCode || 'N/A'}</td>
                      <td className="px-6 py-3.5 text-slate-700">
                        <span className="flex items-center gap-1.5">
                          <Phone className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
                          {partner.phone || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-slate-550 max-w-xs truncate" title={partner.address}>
                        <span className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-indigo-650 shrink-0" />
                          {partner.address || 'N/A'}
                        </span>
                      </td>
                      {isAdmin && (
                        <td className="px-6 py-3.5 text-right">
                          <div className="flex items-center justify-end">
                            <button
                              onClick={() => deletePartner(partner.id)}
                              title="Xóa đối tác"
                              className="rounded-lg border border-slate-200 p-1.5 text-rose-600 hover:bg-rose-50 hover:border-rose-300 transition-colors cursor-pointer"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={isAdmin ? 6 : 5} className="px-6 py-10 text-center text-slate-450">
                      Không tìm thấy {activeTab === 'CUSTOMER' ? 'Khách hàng' : 'Nhà cung cấp'} nào phù hợp.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* PARTNER GENERAL REPORT MODAL */}
      {isReportOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-slate-900/30 backdrop-blur-xs z-50 p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-5">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-indigo-650" />
                Báo Cáo Tổng Quan {activeTab === 'CUSTOMER' ? 'Khách hàng' : 'Nhà cung cấp'}
              </h3>
              <button
                onClick={() => setIsReportOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-850 cursor-pointer"
              >
                <X className="h-5.5 w-5.5" />
              </button>
            </div>

            {/* Content Stats */}
            <div className="space-y-6">
              {/* Cards Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Tổng số {activeTab === 'CUSTOMER' ? 'Khách hàng' : 'Nhà cung cấp'} trên Tab</span>
                  <p className="text-xl font-extrabold text-slate-955 mt-1">{totalPartners}</p>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Phân loại hiện tại</span>
                  <p className="text-xl font-extrabold text-indigo-600 mt-1">{activeTab === 'CUSTOMER' ? 'Khách hàng' : 'Nhà cung cấp'}</p>
                </div>
              </div>

              {/* Data quality status */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Mức độ hoàn thiện dữ liệu</span>
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Có địa chỉ đầy đủ:</span>
                  <span className="font-bold">{withAddressCount} / {totalPartners} đối tác</span>
                </div>
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Có đăng ký mã số thuế:</span>
                  <span className="font-bold">{withTaxCodeCount} / {totalPartners} đối tác</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 pt-5 border-t border-slate-200 mt-6">
              <button
                type="button"
                onClick={() => setIsReportOpen(false)}
                className="rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white hover:bg-slate-800 transition-colors shadow-sm cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
