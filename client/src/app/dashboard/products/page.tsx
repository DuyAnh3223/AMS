'use client';

import React, { useState, useEffect } from 'react';
import { productService, Product } from '@/src/services/product.service';
import { usePermission } from '@/src/hooks/usePermission';
import {
  Package,
  Search,
  Plus,
  Trash2,
  AlertTriangle,
  FileText,
  BarChart3,
  X
} from 'lucide-react';
import { toast } from 'sonner';

export default function ProductsPage() {
  const { hasRole } = usePermission();
  const isAdmin = hasRole('ADMIN');

  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Form input states
  const [newName, setNewName] = useState('');
  const [newSku, setNewSku] = useState('');
  const [newUnit, setNewUnit] = useState('');
  const [newProperties, setNewProperties] = useState('THANH_PHAM');
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Unit suggestions dropdown states
  const [unitsSuggestion, setUnitsSuggestion] = useState<string[]>([]);
  const [showUnitsDropdown, setShowUnitsDropdown] = useState(false);

  // Report modal state
  const [isReportOpen, setIsReportOpen] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await productService.getProducts();
      setProducts(data);
    } catch (err: any) {
      setError(err.message || 'Không thể tải danh sách hàng hóa.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleUnitFocus = async () => {
    try {
      const list = await productService.getUnits();
      setUnitsSuggestion(list);
      setShowUnitsDropdown(true);
    } catch (err) {
      console.error('Lỗi khi tải danh sách ĐVT:', err);
    }
  };

  const handleSelectUnit = (unitVal: string) => {
    setNewUnit(unitVal);
    setShowUnitsDropdown(false);
  };

  const handleUnitBlur = () => {
    // Timeout to allow mousedown click events on suggestion items to fire first
    setTimeout(() => {
      setShowUnitsDropdown(false);
    }, 200);
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);

    if (!newName.trim() || !newSku.trim() || !newUnit.trim()) {
      setFormError('Vui lòng nhập đầy đủ các thông tin.');
      setSubmitting(false);
      return;
    }

    try {
      await productService.createProduct({
        skuCode: newSku.toUpperCase(),
        name: newName,
        unit: newUnit.trim(),
        properties: newProperties
      });

      setNewName('');
      setNewSku('');
      setNewUnit('Cái');
      setNewProperties('THANH_PHAM');
      toast.success('Đã thêm sản phẩm mới thành công!');
      fetchProducts();
    } catch (err: any) {
      setFormError(err.message || 'Lỗi khi thêm hàng hóa mới.');
      toast.error(err.message || 'Không thể thêm sản phẩm.');
    } finally {
      setSubmitting(false);
    }
  };

  const deleteProduct = async (id: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa mặt hàng này?')) return;
    try {
      await productService.deleteProduct(id);
      setProducts(products.filter(p => p.id !== id));
      toast.success('Đã xóa sản phẩm thành công!');
    } catch (err: any) {
      alert(err.message || 'Không thể xóa hàng hóa.');
      toast.error(err.message || 'Không thể xóa sản phẩm.');
    }
  };

  const getPropertiesBadgeColor = (prop: string) => {
    switch (prop) {
      case 'THANH_PHAM':
        return 'bg-emerald-50 text-emerald-600 border-emerald-250';
      case 'BAO_BI':
        return 'bg-blue-50 text-blue-600 border-blue-250';
      case 'NGUYEN_LIEU':
        return 'bg-amber-50 text-amber-600 border-amber-250';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-250';
    }
  };

  const getPropertiesLabel = (prop: string) => {
    switch (prop) {
      case 'THANH_PHAM': return 'Thành phẩm';
      case 'BAO_BI': return 'Bao bì';
      case 'NGUYEN_LIEU': return 'Nguyên liệu';
      default: return prop;
    }
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.skuCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.properties.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Compute stats for reporting
  const totalSKUs = products.length;
  const countThanhPham = products.filter(p => p.properties === 'THANH_PHAM').length;
  const countBaoBi = products.filter(p => p.properties === 'BAO_BI').length;
  const countNguyenLieu = products.filter(p => p.properties === 'NGUYEN_LIEU').length;

  const lowerUnitVal = newUnit.trim().toLowerCase();
  const filteredUnitSuggestions = unitsSuggestion.filter(u =>
    u.toLowerCase().includes(lowerUnitVal)
  );
  const showAddNewUnitOption = newUnit.trim() !== '' &&
    !unitsSuggestion.some(u => u.toLowerCase() === lowerUnitVal);

  return (
    <div className="flex flex-col space-y-6 font-sans animate-in fade-in duration-300">

      {/* 1/3 TOP AREA - INPUT FORM (ADMIN only) */}
      {isAdmin ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">

          {formError && (
            <div className="flex items-center gap-2 text-rose-600 bg-rose-50 p-2.5 rounded-xl border border-rose-200 text-xs">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <form onSubmit={handleAddProduct} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 items-end">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider">Mã Hàng</label>
              <input
                type="text"
                required
                placeholder="Mã Hàng"
                value={newSku}
                onChange={(e) => setNewSku(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-xs text-slate-900 placeholder-slate-400 outline-none transition focus:border-indigo-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider">Tên hàng hóa</label>
              <input
                type="text"
                required
                placeholder="Tên sản phẩm..."
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-xs text-slate-900 placeholder-slate-400 outline-none transition focus:border-indigo-500 focus:bg-white"
              />
            </div>

            <div className="relative">
              <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider">Đơn vị tính</label>
              <input
                type="text"
                required
                placeholder=""
                value={newUnit}
                onChange={(e) => setNewUnit(e.target.value)}
                onFocus={handleUnitFocus}
                onBlur={handleUnitBlur}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-xs text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white"
              />
              {showUnitsDropdown && (filteredUnitSuggestions.length > 0 || showAddNewUnitOption) && (
                <div className="absolute left-0 right-0 z-50 mt-1 max-h-48 overflow-y-auto rounded-xl border border-slate-200 bg-white py-1 shadow-lg">
                  {filteredUnitSuggestions.map((sug) => (
                    <button
                      key={sug}
                      type="button"
                      onMouseDown={() => handleSelectUnit(sug)}
                      className="w-full px-3 py-2 text-left text-xs text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors cursor-pointer"
                    >
                      {sug}
                    </button>
                  ))}
                  {showAddNewUnitOption && (
                    <button
                      type="button"
                      onMouseDown={() => handleSelectUnit(newUnit.trim())}
                      className="w-full px-3 py-2 text-left text-xs font-semibold text-indigo-600 hover:bg-indigo-50 transition-colors border-t border-slate-100 cursor-pointer"
                    >
                      Thêm mới "{newUnit.trim()}"...
                    </button>
                  )}
                </div>
              )}
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider">Tính chất</label>
              <select
                value={newProperties}
                onChange={(e) => setNewProperties(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-xs text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white"
              >
                <option value="THANH_PHAM">Thành phẩm</option>
                <option value="BAO_BI">Bao bì</option>
                <option value="NGUYEN_LIEU">Nguyên liệu</option>
              </select>
            </div>

            <div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 py-2 px-4 text-xs font-bold text-white shadow-md hover:bg-indigo-700 disabled:opacity-50 transition-all cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                {submitting ? 'Đang lưu...' : 'Thêm hàng hóa'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl p-4 text-xs flex gap-2 items-center">
          <AlertTriangle className="h-4.5 w-4.5 text-amber-600 shrink-0" />
          <span>Bạn đang sử dụng tài khoản <strong>USER</strong> (Chỉ đọc). Nếu cần thêm, sửa hoặc xóa dữ liệu hàng hóa, vui lòng đăng nhập bằng tài khoản <strong>ADMIN</strong>.</span>
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
              placeholder="Tìm kiếm theo mã hàng, tên hàng, tính chất..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-slate-250 bg-slate-50 py-2.5 pl-10 pr-4 text-xs text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/10"
            />
          </div>
          <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
            <button
              type="button"
              onClick={() => setIsReportOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-indigo-250 bg-indigo-50 px-4 py-2 text-xs font-bold text-indigo-650 hover:bg-indigo-100 transition-colors shadow-sm cursor-pointer"
            >
              <FileText className="h-4 w-4" />
              Xem Báo cáo Tổng quát
            </button>
          </div>
        </div>

        {/* Table Representation */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center text-slate-450 gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
              <span>Đang tải danh sách hàng hóa...</span>
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                <tr>

                  <th className="px-6 py-3.5">Mã Hàng</th>
                  <th className="px-6 py-3.5">Tên hàng hóa</th>
                  <th className="px-6 py-3.5">Đơn vị</th>
                  <th className="px-6 py-3.5">Tính chất</th>
                  {isAdmin && <th className="px-6 py-3.5 text-right">Thao tác</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((prod) => {
                    return (
                      <tr key={prod.id} className="hover:bg-slate-50/50 transition-colors">

                        <td className="px-6 py-3.5 font-mono font-bold text-indigo-650">{prod.skuCode}</td>
                        <td className="px-6 py-3.5 font-semibold text-slate-800">{prod.name}</td>
                        <td className="px-6 py-3.5 text-slate-550">{prod.unit}</td>
                        <td className="px-6 py-3.5">
                          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold border ${getPropertiesBadgeColor(prod.properties)}`}>
                            {getPropertiesLabel(prod.properties)}
                          </span>
                        </td>
                        {isAdmin && (
                          <td className="px-6 py-3.5 text-right">
                            <div className="flex items-center justify-end">
                              <button
                                onClick={() => prod.id !== undefined && deleteProduct(prod.id)}
                                title="Xóa hàng hóa"
                                className="rounded-lg border border-slate-200 p-1.5 text-rose-600 hover:bg-rose-50 hover:border-rose-300 transition-colors cursor-pointer"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={isAdmin ? 6 : 5} className="px-6 py-10 text-center text-slate-450">
                      Không tìm thấy mặt hàng nào phù hợp.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* GENERAL REPORT MODAL */}
      {isReportOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-slate-900/30 backdrop-blur-xs z-50 p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-5">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-indigo-650" />
                Báo Cáo Tổng Quan Hàng Hóa (SKUs)
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
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Tổng số lượng SKU mặt hàng</span>
                <p className="text-3xl font-extrabold text-slate-950 mt-1">{totalSKUs}</p>
              </div>

              {/* Progress categories */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Phân bổ danh mục</h4>

                {/* THÀNH PHẨM */}
                <div>
                  <div className="flex justify-between text-xs font-medium text-slate-600 mb-1">
                    <span>Thành phẩm</span>
                    <span>{countThanhPham} SKU ({totalSKUs > 0 ? Math.round((countThanhPham / totalSKUs) * 100) : 0}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full"
                      style={{ width: `${totalSKUs > 0 ? (countThanhPham / totalSKUs) * 100 : 0}%` }}
                    />
                  </div>
                </div>

                {/* BAO BÌ */}
                <div>
                  <div className="flex justify-between text-xs font-medium text-slate-600 mb-1">
                    <span>Bao bì</span>
                    <span>{countBaoBi} SKU ({totalSKUs > 0 ? Math.round((countBaoBi / totalSKUs) * 100) : 0}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-500 h-full rounded-full"
                      style={{ width: `${totalSKUs > 0 ? (countBaoBi / totalSKUs) * 100 : 0}%` }}
                    />
                  </div>
                </div>

                {/* NGUYÊN LIỆU */}
                <div>
                  <div className="flex justify-between text-xs font-medium text-slate-600 mb-1">
                    <span>Nguyên liệu</span>
                    <span>{countNguyenLieu} SKU ({totalSKUs > 0 ? Math.round((countNguyenLieu / totalSKUs) * 100) : 0}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-amber-500 h-full rounded-full"
                      style={{ width: `${totalSKUs > 0 ? (countNguyenLieu / totalSKUs) * 100 : 0}%` }}
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
