import React, { useState } from 'react';
import { Tag, Plus, Edit2, Trash2, CheckCircle, XCircle, Save, X, Calendar, Percent } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import { Coupon } from '../../types';

export const AdminPromotionsTab: React.FC = () => {
  const { coupons, addCoupon, updateCoupon, deleteCoupon } = useStore();
  const { userProfile } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Coupon>>({
    code: '',
    discountType: 'percentage',
    discountValue: 15,
    minimumSpend: 150,
    expirationDate: '2026-12-31',
    usageLimit: 100,
    usedCount: 0,
    isActive: true,
    description: '',
  });

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      code: '',
      discountType: 'percentage',
      discountValue: 15,
      minimumSpend: 150,
      expirationDate: '2026-12-31',
      usageLimit: 100,
      usedCount: 0,
      isActive: true,
      description: 'Exclusive cellar release privileges',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c: Coupon) => {
    setEditingId(c.id);
    setFormData({ ...c });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code) return;
    const adminEmail = userProfile?.email;
    const codeUpper = formData.code.toUpperCase().trim();

    if (editingId) {
      await updateCoupon(editingId, { ...formData, code: codeUpper, discountAmount: formData.discountValue || formData.discountAmount || 10 }, adminEmail);
    } else {
      const discountVal = formData.discountValue || formData.discountAmount || 10;
      await addCoupon(
        {
          code: codeUpper,
          discountType: formData.discountType || 'percentage',
          discountAmount: discountVal,
          discountValue: discountVal,
          minimumSpend: formData.minimumSpend || 0,
          minOrderAmount: formData.minimumSpend || 0,
          expirationDate: formData.expirationDate || '2026-12-31',
          endDate: formData.expirationDate || '2026-12-31',
          usageLimit: formData.usageLimit || 50,
          usedCount: 0,
          isActive: formData.isActive ?? true,
          description: formData.description || '',
        },
        adminEmail
      );
    }
    setIsModalOpen(false);
  };

  const handleDelete = async (id: string, code: string) => {
    if (window.confirm(`Delete coupon promo code "${code}"?`)) {
      await deleteCoupon(id, userProfile?.email);
    }
  };

  return (
    <div className="space-y-5 font-sans">
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-lg border border-stone-200">
        <div>
          <h2 className="text-sm font-semibold text-stone-900">
            Promotions & Cellar Privilege Codes
          </h2>
          <p className="text-xs text-stone-500">
            Manage discount vouchers, percentages, minimum order tiers, and redemption caps
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold uppercase tracking-wider rounded transition"
        >
          <Plus className="w-4 h-4" />
          <span>Create Promo Code</span>
        </button>
      </div>

      <div className="bg-white border border-stone-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 uppercase tracking-wider text-[10px] font-semibold">
              <tr>
                <th className="py-3 px-4">Coupon Code</th>
                <th className="py-3 px-4">Discount Value</th>
                <th className="py-3 px-4">Min. Spend</th>
                <th className="py-3 px-4">Redemptions</th>
                <th className="py-3 px-4">Expiry Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {coupons.map((c) => {
                const expDateStr = c.expirationDate || c.endDate;
                const isExpired = expDateStr ? new Date(expDateStr) < new Date() : false;
                const val = c.discountValue ?? c.discountAmount ?? 0;
                const minSpend = c.minimumSpend ?? c.minOrderAmount ?? 0;

                return (
                  <tr key={c.id} className="hover:bg-stone-50/60 transition">
                    <td className="py-3 px-4">
                      <p className="font-mono font-bold text-stone-900">{c.code}</p>
                      <p className="text-[11px] text-stone-500">{c.description || ''}</p>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-stone-900">
                      {c.discountType === 'percentage' ? `${val}% OFF` : `$${val.toFixed(2)} OFF`}
                    </td>
                    <td className="py-3 px-4 text-stone-700 font-mono">
                      ${minSpend.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-stone-700 font-mono">
                      {c.usedCount || 0} / {c.usageLimit || '∞'}
                    </td>
                    <td className="py-3 px-4 font-mono text-stone-600">
                      {expDateStr || 'No Expiry'}
                      {isExpired && <span className="ml-1 text-rose-600 text-[10px] font-bold">(Expired)</span>}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                          c.isActive && !isExpired
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-stone-100 text-stone-500 border border-stone-200'
                        }`}
                      >
                        {c.isActive && !isExpired ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenEdit(c)}
                          className="p-1.5 text-stone-600 hover:text-stone-900 rounded hover:bg-stone-100"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(c.id, c.code)}
                          className="p-1.5 text-rose-600 hover:text-rose-800 rounded hover:bg-rose-50"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-stone-200 rounded-lg max-w-md w-full p-5 shadow-xl text-xs">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3 mb-4">
              <h3 className="text-sm font-semibold text-stone-900">
                {editingId ? 'Edit Promo Voucher' : 'Create New Promo Code'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Coupon Code *</label>
                <input
                  type="text"
                  value={formData.code || ''}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="e.g. GRANDCRU15, SUMMER25"
                  required
                  className="w-full px-3 py-2 border border-stone-300 rounded font-mono font-bold uppercase focus:border-stone-900 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Discount Type</label>
                  <select
                    value={formData.discountType || 'percentage'}
                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value as any })}
                    className="w-full px-3 py-2 border border-stone-300 rounded focus:border-stone-900 focus:outline-none bg-white"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Dollar ($)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Discount Value *</label>
                  <input
                    type="number"
                    value={formData.discountValue ?? 10}
                    onChange={(e) => setFormData({ ...formData, discountValue: parseFloat(e.target.value) || 0 })}
                    required
                    className="w-full px-3 py-2 border border-stone-300 rounded focus:border-stone-900 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Minimum Order ($)</label>
                  <input
                    type="number"
                    value={formData.minimumSpend ?? 0}
                    onChange={(e) => setFormData({ ...formData, minimumSpend: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-stone-300 rounded focus:border-stone-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Usage Limit</label>
                  <input
                    type="number"
                    value={formData.usageLimit ?? 50}
                    onChange={(e) => setFormData({ ...formData, usageLimit: parseInt(e.target.value, 10) || 1 })}
                    className="w-full px-3 py-2 border border-stone-300 rounded focus:border-stone-900 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Expiration Date</label>
                <input
                  type="date"
                  value={formData.expirationDate || '2026-12-31'}
                  onChange={(e) => setFormData({ ...formData, expirationDate: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded focus:border-stone-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Campaign Description</label>
                <input
                  type="text"
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="e.g. VIP Club Welcome Gift"
                  className="w-full px-3 py-2 border border-stone-300 rounded focus:border-stone-900 focus:outline-none"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive ?? true}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="rounded border-stone-300 text-stone-900 focus:ring-stone-900"
                  />
                  <span className="font-semibold text-stone-800">Coupon Active</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 border border-stone-300 hover:bg-stone-100 rounded text-stone-700 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded font-medium flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Coupon</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
