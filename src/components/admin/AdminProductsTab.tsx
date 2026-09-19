import React, { useState, useMemo } from 'react';
import {
  Package,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Copy,
  CheckCircle,
  XCircle,
  AlertTriangle,
  X,
  Sparkles,
  ExternalLink,
  Save,
  Tag,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import { Product, BeverageCategory } from '../../types';

export const AdminProductsTab: React.FC = () => {
  const { products, categories, brands, addProduct, updateProduct, deleteProduct, duplicateProduct } = useStore();
  const { userProfile } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStockStatus, setSelectedStockStatus] = useState<'all' | 'in_stock' | 'low_stock' | 'out_of_stock'>('all');
  const [selectedProductStatus, setSelectedProductStatus] = useState<'all' | 'active' | 'inactive'>('all');

  // Selected items for bulk actions
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Modal State for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    brand: '',
    category: 'Whisky',
    sku: '',
    volume: '750ml',
    alcoholPercentage: 40.0,
    price: 99.0,
    discountPrice: undefined,
    stock: 20,
    lowStockThreshold: 5,
    description: '',
    tastingNotes: '',
    origin: '',
    imageUrl: '',
    isFeatured: false,
    isNewArrival: false,
    isBestSeller: false,
    isActive: true,
    rating: 5.0,
    reviewCount: 1,
  });

  // Filtered products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.sku && p.sku.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;

      let matchesStock = true;
      const lowThreshold = p.lowStockThreshold ?? 5;
      if (selectedStockStatus === 'in_stock') matchesStock = p.stock > lowThreshold;
      else if (selectedStockStatus === 'low_stock') matchesStock = p.stock > 0 && p.stock <= lowThreshold;
      else if (selectedStockStatus === 'out_of_stock') matchesStock = p.stock === 0;

      let matchesStatus = true;
      if (selectedProductStatus === 'active') matchesStatus = p.isActive;
      else if (selectedProductStatus === 'inactive') matchesStatus = !p.isActive;

      return matchesSearch && matchesCat && matchesStock && matchesStatus;
    });
  }, [products, searchQuery, selectedCategory, selectedStockStatus, selectedProductStatus]);

  // Open modal to add
  const handleOpenAdd = () => {
    setEditingProductId(null);
    const generatedSku = `PZN-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
    setFormData({
      name: '',
      brand: brands[0]?.name || 'Pazion Reserve',
      category: 'Whisky',
      sku: generatedSku,
      volume: '750ml',
      alcoholPercentage: 40.0,
      price: 120.0,
      stock: 24,
      lowStockThreshold: 5,
      description: 'Rare handcrafted vintage spirit preserved in climate-controlled cellar casks.',
      tastingNotes: 'Vanilla, dark cherry, toffee oak, and smooth velvety finish.',
      origin: 'Scotland',
      imageUrl: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?auto=format&fit=crop&w=800&q=80',
      isFeatured: false,
      isNewArrival: true,
      isBestSeller: false,
      isActive: true,
      rating: 5.0,
      reviewCount: 0,
    });
    setIsModalOpen(true);
  };

  // Open modal to edit
  const handleOpenEdit = (p: Product) => {
    setEditingProductId(p.id);
    setFormData({ ...p });
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price) return;
    const adminEmail = userProfile?.email || 'admin@pazionliquor.com';

    if (editingProductId) {
      await updateProduct(editingProductId, formData, adminEmail);
    } else {
      await addProduct(formData as Omit<Product, 'id' | 'createdAt'>, adminEmail);
    }
    setIsModalOpen(false);
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you certain you want to permanently delete "${name}" from the cellar catalog?`)) {
      await deleteProduct(id, userProfile?.email);
    }
  };

  const handleDuplicate = async (id: string) => {
    await duplicateProduct(id, userProfile?.email);
  };

  // Bulk actions
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredProducts.map((p) => p.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBulkActivate = async (active: boolean) => {
    for (const id of selectedIds) {
      await updateProduct(id, { isActive: active }, userProfile?.email);
    }
    setSelectedIds([]);
  };

  const handleBulkDelete = async () => {
    if (window.confirm(`Delete ${selectedIds.length} selected products?`)) {
      for (const id of selectedIds) {
        await deleteProduct(id, userProfile?.email);
      }
      setSelectedIds([]);
    }
  };

  return (
    <div className="space-y-5 font-sans">
      {/* Top Header & Add Button */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-lg border border-stone-200">
        <div>
          <h2 className="text-sm font-semibold text-stone-900">
            Beverage Catalog Management
          </h2>
          <p className="text-xs text-stone-500">
            Showing {filteredProducts.length} of {products.length} registered drinks
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold uppercase tracking-wider rounded transition shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Drink</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-lg border border-stone-200 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by bottle, brand, or SKU..."
              className="w-full pl-9 pr-3 py-2 text-xs border border-stone-300 rounded focus:outline-none focus:border-stone-900"
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-stone-300 rounded focus:outline-none focus:border-stone-900 bg-white"
            >
              <option value="all">All Categories ({categories.length})</option>
              {categories.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Stock Filter */}
          <div>
            <select
              value={selectedStockStatus}
              onChange={(e) => setSelectedStockStatus(e.target.value as any)}
              className="w-full px-3 py-2 text-xs border border-stone-300 rounded focus:outline-none focus:border-stone-900 bg-white"
            >
              <option value="all">All Stock Statuses</option>
              <option value="in_stock">In Stock (&gt; threshold)</option>
              <option value="low_stock">Low Stock Warning</option>
              <option value="out_of_stock">Out of Stock (0 units)</option>
            </select>
          </div>

          {/* Active Status Filter */}
          <div>
            <select
              value={selectedProductStatus}
              onChange={(e) => setSelectedProductStatus(e.target.value as any)}
              className="w-full px-3 py-2 text-xs border border-stone-300 rounded focus:outline-none focus:border-stone-900 bg-white"
            >
              <option value="all">All Statuses (Active & Draft)</option>
              <option value="active">Active (Visible in Store)</option>
              <option value="inactive">Draft / Hidden</option>
            </select>
          </div>
        </div>

        {/* Bulk Action Controls */}
        {selectedIds.length > 0 && (
          <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs bg-stone-50 p-2 rounded">
            <span className="font-semibold text-stone-800">
              {selectedIds.length} item(s) selected
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleBulkActivate(true)}
                className="px-2.5 py-1 bg-white border border-stone-300 hover:bg-stone-100 text-stone-800 rounded font-medium"
              >
                Mark Active
              </button>
              <button
                onClick={() => handleBulkActivate(false)}
                className="px-2.5 py-1 bg-white border border-stone-300 hover:bg-stone-100 text-stone-800 rounded font-medium"
              >
                Mark Inactive
              </button>
              <button
                onClick={handleBulkDelete}
                className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded font-medium"
              >
                Delete Selected
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Product Table */}
      <div className="bg-white border border-stone-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 uppercase tracking-wider text-[10px] font-semibold">
              <tr>
                <th className="py-3 px-4 w-8">
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={
                      selectedIds.length > 0 &&
                      selectedIds.length === filteredProducts.length
                    }
                    className="rounded border-stone-300"
                  />
                </th>
                <th className="py-3 px-3">Bottle</th>
                <th className="py-3 px-4">SKU / Origin</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Stock</th>
                <th className="py-3 px-4">ABV %</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-stone-400">
                    No drinks match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const isLow = p.stock > 0 && p.stock <= (p.lowStockThreshold ?? 5);
                  const isOut = p.stock === 0;

                  return (
                    <tr key={p.id} className="hover:bg-stone-50/70 transition">
                      <td className="py-3 px-4">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(p.id)}
                          onChange={() => handleSelectOne(p.id)}
                          className="rounded border-stone-300"
                        />
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.imageUrl}
                            alt={p.name}
                            className="w-10 h-10 object-cover rounded bg-stone-100 shrink-0 border border-stone-200"
                            referrerPolicy="no-referrer"
                          />
                          <div className="min-w-0">
                            <p className="font-semibold text-stone-900 truncate max-w-[200px]">{p.name}</p>
                            <p className="text-[11px] text-stone-500">{p.brand} • {p.volume}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-mono text-[11px] text-stone-700">{p.sku || 'N/A'}</p>
                        <p className="text-[10px] text-stone-400">{p.origin || 'International'}</p>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-block px-2 py-0.5 bg-stone-100 text-stone-700 rounded text-[11px] font-medium">
                          {p.category}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-bold text-stone-900">${p.price.toFixed(2)}</p>
                        {p.discountPrice && (
                          <p className="text-[10px] text-stone-400 line-through">
                            ${p.discountPrice.toFixed(2)}
                          </p>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`font-semibold ${
                              isOut
                                ? 'text-rose-700'
                                : isLow
                                ? 'text-amber-700'
                                : 'text-stone-900'
                            }`}
                          >
                            {p.stock}
                          </span>
                          {isOut && (
                            <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 bg-rose-100 text-rose-800 rounded">
                              Out
                            </span>
                          )}
                          {isLow && (
                            <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 bg-amber-100 text-amber-800 rounded">
                              Low
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono text-stone-700">
                        {p.alcoholPercentage ? `${p.alcoholPercentage}%` : '0%'}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                            p.isActive
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-stone-100 text-stone-500 border border-stone-200'
                          }`}
                        >
                          {p.isActive ? 'Active' : 'Draft'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleOpenEdit(p)}
                            title="Edit Product"
                            className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDuplicate(p.id)}
                            title="Duplicate Product"
                            className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(p.id, p.name)}
                            title="Delete Product"
                            className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-stone-200 rounded-lg max-w-3xl w-full p-6 my-8 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-200 pb-4 mb-5">
              <div>
                <h3 className="text-base font-semibold text-stone-900">
                  {editingProductId ? 'Edit Beverage Bottle' : 'Register New Beverage Bottle'}
                </h3>
                <p className="text-xs text-stone-500">
                  Fill in all fine spirit catalog specifications and cellar notes.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-700 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              {/* Row 1: Name & SKU */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-stone-700 mb-1 uppercase tracking-wider text-[10px]">
                    Bottle Title *
                  </label>
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. The Macallan Double Cask 18 Years Old"
                    required
                    className="w-full px-3 py-2 border border-stone-300 rounded focus:border-stone-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1 uppercase tracking-wider text-[10px]">
                    SKU Code *
                  </label>
                  <input
                    type="text"
                    value={formData.sku || ''}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    placeholder="WKY-MAC-018"
                    required
                    className="w-full px-3 py-2 border border-stone-300 rounded font-mono focus:border-stone-900 focus:outline-none"
                  />
                </div>
              </div>

              {/* Row 2: Brand, Category, Origin */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1 uppercase tracking-wider text-[10px]">
                    Brand / Producer *
                  </label>
                  <input
                    type="text"
                    value={formData.brand || ''}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    placeholder="e.g. The Macallan"
                    required
                    className="w-full px-3 py-2 border border-stone-300 rounded focus:border-stone-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1 uppercase tracking-wider text-[10px]">
                    Category *
                  </label>
                  <select
                    value={formData.category || 'Whisky'}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded focus:border-stone-900 focus:outline-none bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1 uppercase tracking-wider text-[10px]">
                    Origin / Terroir
                  </label>
                  <input
                    type="text"
                    value={formData.origin || ''}
                    onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                    placeholder="e.g. Speyside, Scotland"
                    className="w-full px-3 py-2 border border-stone-300 rounded focus:border-stone-900 focus:outline-none"
                  />
                </div>
              </div>

              {/* Row 3: Volume, ABV, Price, Discount Price */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1 uppercase tracking-wider text-[10px]">
                    Volume (ml/L)
                  </label>
                  <input
                    type="text"
                    value={formData.volume || '750ml'}
                    onChange={(e) => setFormData({ ...formData, volume: e.target.value })}
                    placeholder="750ml"
                    className="w-full px-3 py-2 border border-stone-300 rounded focus:border-stone-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1 uppercase tracking-wider text-[10px]">
                    Alcohol % (ABV)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.alcoholPercentage ?? 40.0}
                    onChange={(e) => setFormData({ ...formData, alcoholPercentage: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-stone-300 rounded focus:border-stone-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1 uppercase tracking-wider text-[10px]">
                    Price ($ USD) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price ?? 0}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    required
                    className="w-full px-3 py-2 border border-stone-300 rounded font-semibold focus:border-stone-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1 uppercase tracking-wider text-[10px]">
                    Discount Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.discountPrice ?? ''}
                    onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value ? parseFloat(e.target.value) : undefined })}
                    placeholder="Optional"
                    className="w-full px-3 py-2 border border-stone-300 rounded focus:border-stone-900 focus:outline-none"
                  />
                </div>
              </div>

              {/* Row 4: Stock & Threshold */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1 uppercase tracking-wider text-[10px]">
                    Stock Available (Bottles) *
                  </label>
                  <input
                    type="number"
                    value={formData.stock ?? 0}
                    onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value, 10) || 0 })}
                    required
                    className="w-full px-3 py-2 border border-stone-300 rounded focus:border-stone-900 focus:outline-none font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1 uppercase tracking-wider text-[10px]">
                    Low Stock Threshold
                  </label>
                  <input
                    type="number"
                    value={formData.lowStockThreshold ?? 5}
                    onChange={(e) => setFormData({ ...formData, lowStockThreshold: parseInt(e.target.value, 10) || 0 })}
                    className="w-full px-3 py-2 border border-stone-300 rounded focus:border-stone-900 focus:outline-none"
                  />
                </div>
              </div>

              {/* Image URL */}
              <div>
                <label className="block font-semibold text-stone-700 mb-1 uppercase tracking-wider text-[10px]">
                  Bottle Photography URL *
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={formData.imageUrl || ''}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    required
                    className="flex-1 px-3 py-2 border border-stone-300 rounded focus:border-stone-900 focus:outline-none"
                  />
                  {formData.imageUrl && (
                    <img
                      src={formData.imageUrl}
                      alt="Preview"
                      className="w-9 h-9 object-cover rounded border border-stone-300"
                      referrerPolicy="no-referrer"
                    />
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block font-semibold text-stone-700 mb-1 uppercase tracking-wider text-[10px]">
                  Curator Description
                </label>
                <textarea
                  rows={2}
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Elaborate on production history, barrel aging, and distinction..."
                  className="w-full px-3 py-2 border border-stone-300 rounded focus:border-stone-900 focus:outline-none"
                />
              </div>

              {/* Tasting Notes */}
              <div>
                <label className="block font-semibold text-stone-700 mb-1 uppercase tracking-wider text-[10px]">
                  Sommelier Tasting Notes
                </label>
                <textarea
                  rows={2}
                  value={formData.tastingNotes || ''}
                  onChange={(e) => setFormData({ ...formData, tastingNotes: e.target.value })}
                  placeholder="Nose, palate, body, and finish nuances..."
                  className="w-full px-3 py-2 border border-stone-300 rounded focus:border-stone-900 focus:outline-none"
                />
              </div>

              {/* Flags */}
              <div className="pt-2 border-t border-stone-200 flex flex-wrap gap-4 text-stone-700">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive ?? true}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="rounded border-stone-300 text-stone-900 focus:ring-stone-900"
                  />
                  <span className="font-medium">Active (Visible in Store)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured ?? false}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="rounded border-stone-300 text-stone-900 focus:ring-stone-900"
                  />
                  <span>Featured Collection</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isBestSeller ?? false}
                    onChange={(e) => setFormData({ ...formData, isBestSeller: e.target.checked })}
                    className="rounded border-stone-300 text-stone-900 focus:ring-stone-900"
                  />
                  <span>Best Seller</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isNewArrival ?? false}
                    onChange={(e) => setFormData({ ...formData, isNewArrival: e.target.checked })}
                    className="rounded border-stone-300 text-stone-900 focus:ring-stone-900"
                  />
                  <span>New Arrival</span>
                </label>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-4 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-stone-300 hover:bg-stone-100 rounded text-stone-700 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded font-medium flex items-center gap-1.5 shadow-sm"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingProductId ? 'Save Changes' : 'Create Product'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
