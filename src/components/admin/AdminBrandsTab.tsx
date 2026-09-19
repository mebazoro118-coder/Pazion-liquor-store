import React, { useState } from 'react';
import { Tag, Plus, Edit2, Trash2, Save, X, Globe } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import { BrandItem } from '../../types';

export const AdminBrandsTab: React.FC = () => {
  const { brands, products, addBrand, updateBrand, deleteBrand } = useStore();
  const { userProfile } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<BrandItem>>({
    name: '',
    country: '',
    description: '',
    logoUrl: '',
    isActive: true,
  });

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      name: '',
      country: 'Scotland',
      description: '',
      logoUrl: '',
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (brand: BrandItem) => {
    setEditingId(brand.id);
    setFormData({ ...brand });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;
    const adminEmail = userProfile?.email;

    if (editingId) {
      await updateBrand(editingId, formData, adminEmail);
    } else {
      await addBrand(
        {
          name: formData.name,
          country: formData.country || 'International',
          description: formData.description || '',
          logoUrl: formData.logoUrl || '',
          isActive: formData.isActive ?? true,
        },
        adminEmail
      );
    }
    setIsModalOpen(false);
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Delete brand "${name}"?`)) {
      await deleteBrand(id, userProfile?.email);
    }
  };

  return (
    <div className="space-y-5 font-sans">
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-lg border border-stone-200">
        <div>
          <h2 className="text-sm font-semibold text-stone-900">
            Maison & Distillery Brands
          </h2>
          <p className="text-xs text-stone-500">
            Registered producers, historic distilleries, and wine estates
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold uppercase tracking-wider rounded transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Brand</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {brands.map((brand) => {
          const bottleCount = products.filter((p) => p.brand.toLowerCase() === brand.name.toLowerCase()).length;

          return (
            <div
              key={brand.id}
              className="bg-white border border-stone-200 rounded-lg p-4 flex flex-col justify-between hover:border-stone-300 transition"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h3 className="text-sm font-semibold text-stone-900">{brand.name}</h3>
                    <p className="text-[11px] text-stone-500 flex items-center gap-1 mt-0.5">
                      <Globe className="w-3 h-3 text-stone-400" />
                      <span>{brand.country || 'International'}</span>
                    </p>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                      brand.isActive
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-stone-100 text-stone-500 border border-stone-200'
                    }`}
                  >
                    {brand.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed mb-3">
                  {brand.description || 'No distillery details provided.'}
                </p>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                <span className="font-semibold text-stone-800">
                  {bottleCount} bottle{bottleCount === 1 ? '' : 's'} in stock
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(brand)}
                    className="p-1.5 text-stone-600 hover:text-stone-900 rounded hover:bg-stone-100"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(brand.id, brand.name)}
                    className="p-1.5 text-rose-600 hover:text-rose-800 rounded hover:bg-rose-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Brand Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-stone-200 rounded-lg max-w-md w-full p-5 shadow-xl">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3 mb-4">
              <h3 className="text-sm font-semibold text-stone-900">
                {editingId ? 'Edit Brand' : 'Register New Brand'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Brand Name *</label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. The Macallan, Clase Azul"
                  required
                  className="w-full px-3 py-2 border border-stone-300 rounded focus:border-stone-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Country / Region</label>
                <input
                  type="text"
                  value={formData.country || ''}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  placeholder="e.g. Scotland, France, Mexico, Japan"
                  className="w-full px-3 py-2 border border-stone-300 rounded focus:border-stone-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Distillery Story / Description</label>
                <textarea
                  rows={3}
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="History, cask traditions, and terroir notes..."
                  className="w-full px-3 py-2 border border-stone-300 rounded focus:border-stone-900 focus:outline-none"
                />
              </div>

              <div className="pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive ?? true}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="rounded border-stone-300 text-stone-900 focus:ring-stone-900"
                  />
                  <span className="font-medium text-stone-800">Active Brand</span>
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
                  <span>Save Brand</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
