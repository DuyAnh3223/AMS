'use client';

import React, { useState, useEffect } from 'react';
import { apiRequest } from '../../utils/api';
import {
  Handshake,
  Search,
  Plus,
  Trash2,
  Phone,
  MapPin,
  AlertCircle,
  X,
  RefreshCw,
  FileText,
  BarChart3,
  Users,
  CheckCircle2,
  PieChart
} from 'lucide-react';

interface Partner {
  id: number;
  partnerCode: string;
  name: string;
  partnerType: string;
  address: string;
  taxCode: string;
  phone: string;
}

export default function PartnersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Form input states
  const [newName, setNewName] = useState('');
  const [newCode, setNewCode] = useState('');
  const [newType, setNewType] = useState<string>('CUSTOMER');
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
      const data = await apiRequest('/partners/all');
      setPartners(data);
    } catch (err: any) {
      setError(err.message || 'Không thể tải danh sách đối tác.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  const handleAddPartner = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);

    if (!newName.trim() || !newCode.trim() || !newPhone.trim()) {
      setFormError('Vui lòng điền đầy đủ các thông tin bắt buộc.');
      setSubmitting(false);
      return;
    }

    try {
      await apiRequest('/partners', {
        method: 'POST',
        body: JSON.stringify({
          partnerCode: newCode.toUpperCase(),
          name: newName,
          partnerType: newType,
          address: newAddress,
          taxCode: newTaxCode,
          phone: newPhone
        })
      });

      setNewName('');
      setNewCode('');
      setNewType('CUSTOMER');
      setNewPhone('');
      setNewTaxCode('');
      setNewAddress('');
      fetchPartners();
    } catch (err: any) {
      setFormError(err.message || 'Lỗi khi thêm đối tác mới.');
    } finally {
      setSubmitting(false);
    }
  };

  const deletePartner = async (id: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa đối tác này?')) return;
    try {
      await apiRequest(`/partners/${id}`, {
        method: 'DELETE'
      });
      setPartners(partners.filter(p => p.id !== id));
    } catch (err: any) {
      alert(err.message || 'Không thể xóa đối tác.');
    }
  };

  const getPartnerTypeLabel = (type: string) => {
    switch (type) {
      case 'CUSTOMER': return 'Khách hàng';
      case 'VENDOR': return 'Nhà cung cấp';
      case 'BOTH': return 'NPP/Tổng kho (Cả hai)';
      default: return type;
    }
  };

  const getPartnerTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'CUSTOMER':
        return 'bg-teal-50 text-teal-655 border-teal-200';
      case 'VENDOR':
        return 'bg-amber-50 text-amber-655 border-amber-200';
      case 'BOTH':
        return 'bg-indigo-50 text-indigo-655 border-indigo-200';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  const filteredPartners = partners.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.partnerCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.phone.includes(searchTerm)
  );

  // Compute stats for report
  const totalPartners = partners.length;
  const countCustomers = partners.filter(p => p.partnerType === 'CUSTOMER').length;
  const countVendors = partners.filter(p => p.partnerType === 'VENDOR').length;
  const countBoth = partners.filter(p => p.partnerType === 'BOTH').length;

  const withTaxCodeCount = partners.filter(p => p.taxCode && p.taxCode !== 'N/A').length;
  const withAddressCount = partners.filter(p => p.address && p.address !== 'N/A').length;

  return (
    <div className="flex flex-col space-y-6 font-sans animate-in fade-in duration-300">


      {/* 1/3 TOP AREA - INPUT FORM & REPORT TRIGGER */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
        <div className="flex justify-between items-center pb-3 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <Plus className="h-4.5 w-4.5 text-indigo-650" />
            Nhập dữ liệu Đối tác mới
          </h3>
          <button
            type="button"
            onClick={() => setIsReportOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-2 text-xs font-bold text-indigo-655 hover:bg-indigo-100 transition-colors shadow-sm"
          >
            <FileText className="h-4 w-4" />
            Xem Báo cáo Đối tác
          </button>
        </div>

        {formError && (
          <div className="flex items-center gap-2 text-rose-600 bg-rose-50 p-2.5 rounded-xl border border-rose-200 text-xs">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        <form onSubmit={handleAddPartner} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4 items-end">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider">Mã đối tác</label>
            <input
              type="text"
              required
              placeholder="Ví dụ: KH0009"
              value={newCode}
              onChange={(e) => setNewCode(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-xs text-slate-900 placeholder-slate-400 outline-none transition focus:border-indigo-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider">Tên đối tác</label>
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
            <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider">Phân loại</label>
            <select
              value={newType}
              onChange={(e) => setNewType(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-xs text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white"
            >
              <option value="CUSTOMER">Khách hàng (CUSTOMER)</option>
              <option value="VENDOR">Nhà cung cấp (VENDOR)</option>
              <option value="BOTH">Cả hai (BOTH)</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider">Số điện thoại</label>
            <input
              type="text"
              required
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
              {submitting ? 'Đang lưu...' : 'Thêm đối tác'}
            </button>
          </div>
        </form>
      </div>

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
              placeholder="Tìm kiếm đối tác theo mã, tên, số điện thoại..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-slate-250 bg-slate-50 py-2.5 pl-10 pr-4 text-xs text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/10"
            />
          </div>
          <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
            Danh sách: {filteredPartners.length} đối tác
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
                  <th className="px-6 py-3.5">Mã đối tác</th>
                  <th className="px-6 py-3.5">Tên đối tác</th>
                  <th className="px-6 py-3.5">Phân loại</th>
                  <th className="px-6 py-3.5">Mã số thuế</th>
                  <th className="px-6 py-3.5">Số điện thoại</th>
                  <th className="px-6 py-3.5">Địa chỉ</th>
                  <th className="px-6 py-3.5">Trạng thái</th>
                  <th className="px-6 py-3.5 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPartners.length > 0 ? (
                  filteredPartners.map((partner) => (
                    <tr key={partner.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-3.5 font-mono font-bold text-indigo-650">{partner.partnerCode}</td>
                      <td className="px-6 py-3.5 font-semibold text-slate-800">{partner.name}</td>
                      <td className="px-6 py-3.5">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold border ${getPartnerTypeBadgeColor(partner.partnerType)}`}>
                          {getPartnerTypeLabel(partner.partnerType)}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 font-mono text-slate-600">{partner.taxCode || 'N/A'}</td>
                      <td className="px-6 py-3.5 text-slate-700">
                        <span className="flex items-center gap-1.5">
                          <Phone className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
                          {partner.phone}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-slate-500 max-w-xs truncate" title={partner.address}>
                        <span className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-indigo-650 shrink-0" />
                          {partner.address || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-3.5">
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          Đang hoạt động
                        </span>
                      </td>
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
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="px-6 py-10 text-center text-slate-450">
                      Không tìm thấy đối tác nào phù hợp.
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
                Báo Cáo Tổng Quan Đối Tác liên kết
              </h3>
              <button
                onClick={() => setIsReportOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-850"
              >
                <X className="h-5.5 w-5.5" />
              </button>
            </div>

            {/* Content Stats */}
            <div className="space-y-6">

              {/* Cards Grid */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Tổng số đối tác</span>
                  <p className="text-xl font-extrabold text-slate-955 mt-1">{totalPartners}</p>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Khách hàng</span>
                  <p className="text-xl font-extrabold text-teal-600 mt-1">{countCustomers + countBoth}</p>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Nhà cung cấp</span>
                  <p className="text-xl font-extrabold text-amber-600 mt-1">{countVendors + countBoth}</p>
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

              {/* Progress categories */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Tỷ lệ cơ cấu liên kết</h4>

                {/* KHÁCH HÀNG */}
                <div>
                  <div className="flex justify-between text-xs font-medium text-slate-600 mb-1">
                    <span>Khách hàng (CUSTOMER)</span>
                    <span>{countCustomers} đối tác ({totalPartners > 0 ? Math.round((countCustomers / totalPartners) * 100) : 0}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-teal-500 h-full rounded-full"
                      style={{ width: `${totalPartners > 0 ? (countCustomers / totalPartners) * 100 : 0}%` }}
                    />
                  </div>
                </div>

                {/* NHÀ CUNG CẤP */}
                <div>
                  <div className="flex justify-between text-xs font-medium text-slate-600 mb-1">
                    <span>Nhà cung cấp (VENDOR)</span>
                    <span>{countVendors} đối tác ({totalPartners > 0 ? Math.round((countVendors / totalPartners) * 100) : 0}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-amber-500 h-full rounded-full"
                      style={{ width: `${totalPartners > 0 ? (countVendors / totalPartners) * 100 : 0}%` }}
                    />
                  </div>
                </div>

                {/* CẢ HAI */}
                <div>
                  <div className="flex justify-between text-xs font-medium text-slate-600 mb-1">
                    <span>NPP & Đối tác kiêm cả hai (BOTH)</span>
                    <span>{countBoth} đối tác ({totalPartners > 0 ? Math.round((countBoth / totalPartners) * 100) : 0}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-500 h-full rounded-full"
                      style={{ width: `${totalPartners > 0 ? (countBoth / totalPartners) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 pt-5 border-t border-slate-200 mt-6">
              <button
                type="button"
                onClick={() => setIsReportOpen(false)}
                className="rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white hover:bg-slate-800 transition-colors shadow-sm"
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
