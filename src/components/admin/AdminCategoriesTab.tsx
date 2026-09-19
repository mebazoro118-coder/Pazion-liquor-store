import React, { useState } from 'react';
import { FolderTree, Plus, Edit2, Trash2, ArrowUp, ArrowDown, Save, X } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import { CategoryItem } from '../../types';

export const AdminCategoriesTab: React.FC = () => {
  const { categories, products, addCategory, updateCategory, deleteCategory, reorderCategories } = useStore();
  const { userProfile } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<CategoryItem>>({
    name: '',
    slug: '',
    description: '',
    imageUrl: '',
    displayOrder: 1,
    isActive: true,
  });

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      name: '',
      slug: '',
      description: '',
      imageUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80',
      displayOrder: categories.length + 1,
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat: CategoryItem) => {
    setEditingId(cat.id);
    setFormData({ ...cat });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;
    const slug = formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-');
    const adminEmail = userProfile?.email;

    if (editingId) {
      await updateCategory(editingId, { ...formData, slug }, adminEmail);
    } else {
      await addCategory(
        {
          name: formData.name,
          slug,
          description: formData.description || '',
          imageUrl: formData.imageUrl || '',
          displayOrder: formData.displayOrder || categories.length + 1,
          isActive: formData.isActive ?? true,
        },
        adminEmail
      );
    }
    setIsModalOpen(false);
  };

  const handleDelete = async (id: string, name: string) => {
    const attachedCount = products.filter((p) => p.category === name).length;
    if (attachedCount > 0) {
      if (!window.confirm(`Warning: ${attachedCount} products are assigned to "${name}". Deleting this category will unassign them. Continue?`)) {
        return;
      }
    } else {
      if (!window.confirm(`Delete category "${name}"?`)) return;
    }
    await deleteCategory(id, userProfile?.email);
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === categories.length - 1) return;

    const newOrder = [...categories];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    const temp = newOrder[index];
    newOrder[index] = newOrder[targetIdx];
    newOrder[targetIdx] = temp;

    const ids = newOrder.map((c) => c.id);
    await reorderCategories(ids, userProfile?.email);
  };

  return (
    <div className="space-y-5 font-sans">
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-lg border border-stone-200">
        <div>
          <h2 className="text-sm font-semibold text-stone-900">
            Category Taxonomy & Sorting
          </h2>
          <p className="text-xs text-stone-500">
            Manage public store collections and cellar classification hierarchy
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold uppercase tracking-wider rounded transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat, idx) => {
          const productCount = products.filter((p) => p.category === cat.name).length;

          return (
            <div
              key={cat.id}
              className="bg-white border border-stone-200 rounded-lg overflow-hidden flex flex-col justify-between hover:border-stone-300 transition"
            >
              <div className="relative h-32 bg-stone-100">
                {cat.imageUrl && (
                  <img
                    src={cat.imageUrl}
                    alt={cat.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3">
                  <div>
                    <h3 className="text-sm font-semibold text-white">{cat.name}</h3>
                    <p className="text-[10px] text-stone-200 font-mono">/{cat.slug}</p>
                  </div>
                </div>
                <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/50 backdrop-blur-xs px-2 py-0.5 rounded text-[10px] text-white">
                  <span>Order: {idx + 1}</span>
                </div>
              </div>

              <div className="p-3 flex-1 flex flex-col justify-between">
                <p className="text-xs text-stone-600 line-clamp-2 mb-3 leading-relaxed">
                  {cat.description || 'No description provided.'}
                </p>

                <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                  <span className="font-semibold text-stone-800">
                    {productCount} drink{productCount === 1 ? '' : 's'}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleMove(idx, 'up')}
                      disabled={idx === 0}
                      title="Move Up"
                      className="p-1 text-stone-500 hover:text-stone-900 disabled:opacity-30 rounded hover:bg-stone-100"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleMove(idx, 'down')}
                      disabled={idx === categories.length - 1}
                      title="Move Down"
                      className="p-1 text-stone-500 hover:text-stone-900 disabled:opacity-30 rounded hover:bg-stone-100"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleOpenEdit(cat)}
                      title="Edit Category"
                      className="p-1 text-stone-600 hover:text-stone-900 rounded hover:bg-stone-100"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id, cat.name)}
                      title="Delete Category"
                      className="p-1 text-rose-600 hover:text-rose-800 rounded hover:bg-rose-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-stone-200 rounded-lg max-w-md w-full p-5 shadow-xl">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3 mb-4">
              <h3 className="text-sm font-semibold text-stone-900">
                {editingId ? 'Edit Category' : 'Create Category'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Category Title *</label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Whisky, Champagne, Tequila"
                  required
                  className="w-full px-3 py-2 border border-stone-300 rounded focus:border-stone-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Slug (URL Path)</label>
                <input
                  type="text"
                  value={formData.slug || ''}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="whisky"
                  className="w-full px-3 py-2 border border-stone-300 rounded font-mono focus:border-stone-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Cover Photography URL</label>
                <input
                  type="url"
                  value={formData.imageUrl || ''}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 border border-stone-300 rounded focus:border-stone-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief tasting or heritage overview..."
                  className="w-full px-3 py-2 border border-stone-300 rounded focus:border-stone-900 focus:outline-none"
                />
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
                  <span>Save Category</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
