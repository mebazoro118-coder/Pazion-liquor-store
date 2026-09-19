import React, { useState } from 'react';
import { Truck, Plus, Edit2, Trash2, CheckCircle, XCircle, Save, X, MapPin } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import { DeliveryZone } from '../../types';

export const AdminDeliveryTab: React.FC = () => {
  const { deliveryZones, addDeliveryZone, updateDeliveryZone, deleteDeliveryZone } = useStore();
  const { userProfile } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<DeliveryZone>>({
    name: '',
    description: '',
    fee: 15,
    estimatedTime: '2-4 hours',
    minimumOrderForFreeDelivery: 250,
    isActive: true,
  });

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      name: '',
      description: 'Hand-delivered with shock-absorbent chilled packaging',
      fee: 20,
      estimatedTime: '1-2 business days',
      minimumOrderForFreeDelivery: 300,
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (zone: DeliveryZone) => {
    setEditingId(zone.id);
    setFormData({ ...zone });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;
    const adminEmail = userProfile?.email;

    if (editingId) {
      await updateDeliveryZone(editingId, formData, adminEmail);
    } else {
      await addDeliveryZone(
        {
          name: formData.name,
          description: formData.description || '',
          fee: formData.fee ?? 15,
          minOrder: formData.minOrder ?? 50,
          allowPickup: formData.allowPickup ?? true,
          estimatedTime: formData.estimatedTime || 'Same Day',
          minimumOrderForFreeDelivery: formData.minimumOrderForFreeDelivery,
          isActive: formData.isActive ?? true,
        },
        adminEmail
      );
    }
    setIsModalOpen(false);
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Delete delivery zone "${name}"?`)) {
      await deleteDeliveryZone(id, userProfile?.email);
    }
  };

  return (
    <div className="space-y-5 font-sans">
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-lg border border-stone-200">
        <div>
          <h2 className="text-sm font-semibold text-stone-900">
            Delivery Zones, Rates & Logistics
          </h2>
          <p className="text-xs text-stone-500">
            Configure courier routes, temperature-controlled delivery fees, and pickup options
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold uppercase tracking-wider rounded transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add Delivery Zone</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {deliveryZones.map((z) => (
          <div
            key={z.id}
            className="bg-white border border-stone-200 rounded-lg p-5 flex flex-col justify-between hover:border-stone-300 transition"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-stone-700" />
                  <h3 className="text-sm font-semibold text-stone-900">{z.name}</h3>
                </div>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                    z.isActive
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-stone-100 text-stone-500 border border-stone-200'
                  }`}
                >
                  {z.isActive ? 'Active' : 'Disabled'}
                </span>
              </div>

              <p className="text-xs text-stone-600 mb-4 leading-relaxed">{z.description}</p>

              <div className="grid grid-cols-3 gap-2 bg-stone-50 p-3 rounded border border-stone-100 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-semibold text-stone-400 block">Base Fee</span>
                  <span className="font-mono font-bold text-stone-900">${z.fee.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-semibold text-stone-400 block">Transit Time</span>
                  <span className="font-semibold text-stone-800">{z.estimatedTime}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-semibold text-stone-400 block">Free Shipping Above</span>
                  <span className="font-mono font-bold text-emerald-700">
                    {z.minimumOrderForFreeDelivery ? `$${z.minimumOrderForFreeDelivery}` : 'None'}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-end gap-1">
              <button
                onClick={() => handleOpenEdit(z)}
                className="p-1.5 text-stone-600 hover:text-stone-900 rounded hover:bg-stone-100"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleDelete(z.id, z.name)}
                className="p-1.5 text-rose-600 hover:text-rose-800 rounded hover:bg-rose-50"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-stone-200 rounded-lg max-w-md w-full p-5 shadow-xl text-xs">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3 mb-4">
              <h3 className="text-sm font-semibold text-stone-900">
                {editingId ? 'Edit Delivery Method' : 'Add New Delivery Zone'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Zone / Method Title *</label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Manhattan White-Glove VIP Courier"
                  required
                  className="w-full px-3 py-2 border border-stone-300 rounded focus:border-stone-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Description</label>
                <input
                  type="text"
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="e.g. Chilled vehicle, adult signature on delivery"
                  className="w-full px-3 py-2 border border-stone-300 rounded focus:border-stone-900 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Base Rate ($ USD) *</label>
                  <input
                    type="number"
                    step="0.5"
                    value={formData.fee ?? 15}
                    onChange={(e) => setFormData({ ...formData, fee: parseFloat(e.target.value) || 0 })}
                    required
                    className="w-full px-3 py-2 border border-stone-300 rounded focus:border-stone-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Estimated Time</label>
                  <input
                    type="text"
                    value={formData.estimatedTime || ''}
                    onChange={(e) => setFormData({ ...formData, estimatedTime: e.target.value })}
                    placeholder="e.g. 2-4 Hours, Next Day"
                    className="w-full px-3 py-2 border border-stone-300 rounded focus:border-stone-900 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Complimentary Free Delivery Threshold ($)
                </label>
                <input
                  type="number"
                  value={formData.minimumOrderForFreeDelivery ?? ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      minimumOrderForFreeDelivery: e.target.value ? parseFloat(e.target.value) : undefined,
                    })
                  }
                  placeholder="Leave empty if no free threshold"
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
                  <span className="font-semibold text-stone-800">Active Option</span>
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
                  <span>Save Zone</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
