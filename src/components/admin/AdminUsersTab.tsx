import React, { useState } from 'react';
import { Shield, Plus, Edit2, Trash2, CheckCircle, XCircle, Save, X, UserCheck } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import { AdminUser, AdminRole } from '../../types';

export const AdminUsersTab: React.FC = () => {
  const { adminUsers, addAdminUser, updateAdminUser, deleteAdminUser } = useStore();
  const { userProfile, isOwner } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<AdminUser>>({
    email: '',
    displayName: '',
    role: 'manager',
    isActive: true,
  });

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      email: '',
      displayName: '',
      role: 'manager',
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (u: AdminUser) => {
    setEditingId(u.id);
    setFormData({ ...u });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email) return;
    const adminEmail = userProfile?.email;

    if (editingId) {
      await updateAdminUser(editingId, formData, adminEmail);
    } else {
      await addAdminUser(
        {
          email: formData.email,
          displayName: formData.displayName || formData.email.split('@')[0],
          role: formData.role || 'manager',
          isActive: formData.isActive ?? true,
        },
        adminEmail
      );
    }
    setIsModalOpen(false);
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Revoke administrative console access for ${name}?`)) {
      await deleteAdminUser(id, userProfile?.email);
    }
  };

  const getRoleBadge = (role: AdminRole) => {
    switch (role) {
      case 'owner':
        return 'bg-amber-100 text-amber-900 border-amber-300 font-bold';
      case 'admin':
        return 'bg-stone-900 text-white border-stone-900 font-semibold';
      case 'manager':
      default:
        return 'bg-stone-100 text-stone-800 border-stone-300 font-medium';
    }
  };

  return (
    <div className="space-y-5 font-sans">
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-lg border border-stone-200">
        <div>
          <h2 className="text-sm font-semibold text-stone-900">
            Administrative Staff & Access Control
          </h2>
          <p className="text-xs text-stone-500">
            Role-based permissions (Owner: full control • Admin: operations & catalog • Manager: orders & inventory)
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold uppercase tracking-wider rounded transition"
        >
          <Plus className="w-4 h-4" />
          <span>Authorize New Staff</span>
        </button>
      </div>

      <div className="bg-white border border-stone-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 uppercase tracking-wider text-[10px] font-semibold">
              <tr>
                <th className="py-3 px-4">Staff Member</th>
                <th className="py-3 px-4">Authorized Email</th>
                <th className="py-3 px-4">Permission Tier</th>
                <th className="py-3 px-4">Account Status</th>
                <th className="py-3 px-4">Created</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {adminUsers.map((u) => (
                <tr key={u.id} className="hover:bg-stone-50/60 transition">
                  <td className="py-3 px-4 font-semibold text-stone-900">{u.displayName}</td>
                  <td className="py-3 px-4 font-mono text-stone-700">{u.email}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded text-[10px] uppercase tracking-wider border ${getRoleBadge(
                        u.role
                      )}`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                        u.isActive
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {u.isActive ? 'Active' : 'Suspended'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-stone-500 text-[11px]">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleOpenEdit(u)}
                        className="p-1.5 text-stone-600 hover:text-stone-900 rounded hover:bg-stone-100"
                        title="Edit Permissions"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      {u.role !== 'owner' && (
                        <button
                          onClick={() => handleDelete(u.id, u.displayName || u.email || 'Staff Member')}
                          className="p-1.5 text-rose-600 hover:text-rose-800 rounded hover:bg-rose-50"
                          title="Revoke Access"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
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
                {editingId ? 'Modify Staff Credentials' : 'Add Admin Staff Member'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  value={formData.displayName || ''}
                  onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                  placeholder="e.g. Marcus Sterling"
                  required
                  className="w-full px-3 py-2 border border-stone-300 rounded focus:border-stone-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="staff@pazionliquor.com"
                  required
                  className="w-full px-3 py-2 border border-stone-300 rounded focus:border-stone-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Assigned Role *</label>
                <select
                  value={formData.role || 'manager'}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as AdminRole })}
                  className="w-full px-3 py-2 border border-stone-300 rounded focus:border-stone-900 focus:outline-none bg-white"
                >
                  <option value="manager">Manager (Orders, Stock adjustments, Deliveries)</option>
                  <option value="admin">Admin (Products, Categories, Promotions, Reports)</option>
                  <option value="owner">Owner (Full Store & Staff Access)</option>
                </select>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive ?? true}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="rounded border-stone-300 text-stone-900 focus:ring-stone-900"
                  />
                  <span className="font-semibold text-stone-800">Account Active</span>
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
                  <span>Save Staff Member</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
