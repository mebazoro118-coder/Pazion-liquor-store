import React, { useState } from 'react';
import { Layout, Save, CheckCircle, Bell, Sparkles } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';

export const AdminContentTab: React.FC = () => {
  const { storeSettings, updateStoreSettings } = useStore();
  const { userProfile } = useAuth();

  const [formData, setFormData] = useState({
    announcementBar: storeSettings.announcementBar || 'Complimentary temperature-controlled courier delivery in Manhattan for orders over $250.',
    isAnnouncementActive: storeSettings.isAnnouncementActive ?? true,
    heroTitle: 'Curated Cellars, Rare Spirits & Grand Cru Vintages',
    heroSubtitle: 'Hand-selected single malts, prestige cuvées, and artisanal spirits stored in state-of-the-art climate vaults and delivered with white-glove care.',
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateStoreSettings(
      {
        announcementBar: formData.announcementBar,
        isAnnouncementActive: formData.isAnnouncementActive,
      },
      userProfile?.email
    );
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-5 font-sans">
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-lg border border-stone-200">
        <div>
          <h2 className="text-sm font-semibold text-stone-900">
            Storefront Content & Announcement Management
          </h2>
          <p className="text-xs text-stone-500">
            Modify public customer banners, top announcement alert bar, and cellar notices
          </p>
        </div>

        {savedSuccess && (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded border border-emerald-200">
            <CheckCircle className="w-3.5 h-3.5" /> Changes Published to Store
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 text-xs">
        {/* Top Announcement Bar */}
        <div className="bg-white border border-stone-200 rounded-lg p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-stone-900 flex items-center gap-2">
                <Bell className="w-4 h-4 text-amber-600" />
                <span>Top Announcement Ticker</span>
              </h3>
              <p className="text-stone-500 text-[11px] mt-0.5">
                Displays at the very top of the customer-facing website
              </p>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isAnnouncementActive}
                onChange={(e) => setFormData({ ...formData, isAnnouncementActive: e.target.checked })}
                className="rounded border-stone-300 text-stone-900 focus:ring-stone-900"
              />
              <span className="font-semibold text-stone-800">Show Announcement Bar</span>
            </label>
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">
              Announcement Message Text
            </label>
            <input
              type="text"
              value={formData.announcementBar}
              onChange={(e) => setFormData({ ...formData, announcementBar: e.target.value })}
              className="w-full px-3 py-2 border border-stone-300 rounded focus:border-stone-900 focus:outline-none"
              placeholder="e.g. Complimentary temperature-controlled courier delivery on orders over $250."
            />
          </div>

          {/* Live Preview Box */}
          <div className="bg-stone-900 text-white p-2.5 rounded text-center text-xs tracking-wider uppercase">
            <span className="text-stone-400 text-[10px] mr-2">Preview:</span>
            {formData.isAnnouncementActive ? formData.announcementBar : <span className="italic text-stone-500">[Announcement bar disabled]</span>}
          </div>
        </div>

        {/* Hero Section Copy */}
        <div className="bg-white border border-stone-200 rounded-lg p-5 space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-stone-900">
              Homepage Hero Curation & Tagline
            </h3>
            <p className="text-stone-500 text-[11px] mt-0.5">
              Defines the luxury, minimal aesthetic and value proposition
            </p>
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">
              Primary Headline
            </label>
            <input
              type="text"
              value={formData.heroTitle}
              onChange={(e) => setFormData({ ...formData, heroTitle: e.target.value })}
              className="w-full px-3 py-2 border border-stone-300 rounded focus:border-stone-900 focus:outline-none font-serif text-sm"
            />
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">
              Secondary Descriptive Subtitle
            </label>
            <textarea
              rows={3}
              value={formData.heroSubtitle}
              onChange={(e) => setFormData({ ...formData, heroSubtitle: e.target.value })}
              className="w-full px-3 py-2 border border-stone-300 rounded focus:border-stone-900 focus:outline-none leading-relaxed"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-semibold rounded flex items-center gap-1.5 shadow-sm transition"
          >
            <Save className="w-4 h-4" />
            <span>Save & Publish Content</span>
          </button>
        </div>
      </form>
    </div>
  );
};
