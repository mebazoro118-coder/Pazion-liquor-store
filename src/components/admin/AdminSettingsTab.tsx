import React, { useState } from 'react';
import { Settings, Save, CheckCircle, ShieldAlert, Building2, Phone, Mail, MapPin } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import { StoreSettings } from '../../types';

export const AdminSettingsTab: React.FC = () => {
  const { storeSettings, updateStoreSettings } = useStore();
  const { userProfile, isOwner, isAdmin } = useAuth();

  const [formData, setFormData] = useState<StoreSettings>({
    ...storeSettings,
  });

  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateStoreSettings(formData, userProfile?.email);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-5 font-sans">
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-lg border border-stone-200">
        <div>
          <h2 className="text-sm font-semibold text-stone-900">
            Global Cellar & Store Settings
          </h2>
          <p className="text-xs text-stone-500">
            Operational configurations, liquor compliance rules, and fiscal parameters
          </p>
        </div>

        {saveSuccess && (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded border border-emerald-200">
            <CheckCircle className="w-3.5 h-3.5" /> Settings Saved
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 text-xs">
        {/* Business Identity */}
        <div className="bg-white border border-stone-200 rounded-lg p-5 space-y-4">
          <h3 className="text-sm font-semibold text-stone-900 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-stone-700" />
            <span>Store Identity & Flagship Location</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Store Legal Trading Name *
              </label>
              <input
                type="text"
                value={formData.storeName}
                onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                required
                className="w-full px-3 py-2 border border-stone-300 rounded focus:border-stone-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Concierge Contact Email *
              </label>
              <input
                type="email"
                value={formData.contactEmail}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                required
                className="w-full px-3 py-2 border border-stone-300 rounded focus:border-stone-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Direct Telephone Line *
              </label>
              <input
                type="text"
                value={formData.contactPhone}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                required
                className="w-full px-3 py-2 border border-stone-300 rounded focus:border-stone-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Flagship Boutique Address
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                required
                className="w-full px-3 py-2 border border-stone-300 rounded focus:border-stone-900 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Legal & Age Compliance */}
        <div className="bg-white border border-stone-200 rounded-lg p-5 space-y-4">
          <h3 className="text-sm font-semibold text-stone-900 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-700" />
            <span>Alcohol Beverage Control Compliance</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Minimum Legal Purchasing Age
              </label>
              <input
                type="number"
                value={formData.ageVerificationMinimum}
                onChange={(e) =>
                  setFormData({ ...formData, ageVerificationMinimum: parseInt(e.target.value, 10) || 21 })
                }
                required
                className="w-full px-3 py-2 border border-stone-300 rounded focus:border-stone-900 focus:outline-none font-bold"
              />
              <p className="text-[10px] text-stone-500 mt-1">
                Mandatory 21+ verification prompt shown before store browsing or checkout.
              </p>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Storefront Currency Symbol
              </label>
              <input
                type="text"
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                required
                className="w-full px-3 py-2 border border-stone-300 rounded font-mono focus:border-stone-900 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Fiscal & Tax Rates */}
        <div className="bg-white border border-stone-200 rounded-lg p-5 space-y-4">
          <h3 className="text-sm font-semibold text-stone-900">
            Fiscal & Delivery Calculation Baseline
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Excise & Sales Tax Rate (%)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.taxRate}
                onChange={(e) => setFormData({ ...formData, taxRate: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-stone-300 rounded focus:border-stone-900 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Standard Shipping Flat Rate ($)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.deliveryFee}
                onChange={(e) => setFormData({ ...formData, deliveryFee: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-stone-300 rounded focus:border-stone-900 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Free Delivery Spend Threshold ($)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.freeDeliveryThreshold}
                onChange={(e) =>
                  setFormData({ ...formData, freeDeliveryThreshold: parseFloat(e.target.value) || 0 })
                }
                className="w-full px-3 py-2 border border-stone-300 rounded focus:border-stone-900 focus:outline-none font-mono"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-semibold rounded flex items-center gap-1.5 shadow-sm transition"
          >
            <Save className="w-4 h-4" />
            <span>Save Store Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
};
