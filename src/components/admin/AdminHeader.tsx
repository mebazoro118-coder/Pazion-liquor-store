import React, { useState } from 'react';
import {
  Menu,
  Bell,
  Search,
  ExternalLink,
  Check,
  Package,
  ShoppingBag,
  AlertTriangle,
  Star,
  Users,
  X,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import { AdminTab } from './AdminSidebar';

interface AdminHeaderProps {
  currentTab: AdminTab;
  onOpenMobileMenu: () => void;
  onReturnToStore: () => void;
  onNavigateTab: (tab: AdminTab) => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  currentTab,
  onOpenMobileMenu,
  onReturnToStore,
  onNavigateTab,
}) => {
  const { notifications, unreadNotificationCount, markNotificationAsRead, markAllNotificationsAsRead } = useStore();
  const { userProfile, isOwner, isAdmin } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);

  const tabTitles: Record<AdminTab, { title: string; subtitle: string }> = {
    overview: { title: 'Dashboard Overview', subtitle: 'Live store telemetry, sales volume, and urgent operational alerts' },
    products: { title: 'Product Catalog', subtitle: 'Manage bottles, vintages, tasting notes, pricing, and statuses' },
    categories: { title: 'Category Taxonomy', subtitle: 'Organize and sort liquor, wine, champagne, and spirit classifications' },
    brands: { title: 'Brand Maisons', subtitle: 'Distillery, producer, and heritage brand directory' },
    orders: { title: 'Consignment Orders', subtitle: 'Fulfillment queue, courier dispatch status, and client receipts' },
    inventory: { title: 'Vault Inventory & Stock', subtitle: 'Real-time bottle quantities, low-stock thresholds, and adjustment audit' },
    customers: { title: 'Client Accounts', subtitle: 'Registered customer profiles, lifetime spending, and VIP tiers' },
    promotions: { title: 'Promotions & Coupons', subtitle: 'Promo codes, percentage discounts, and cellar campaign rules' },
    delivery: { title: 'Delivery Zones & Logistics', subtitle: 'Courier delivery radius, flat rates, and white-glove pickup options' },
    reviews: { title: 'Tasting Reviews & Feedback', subtitle: 'Customer vintage notes, ratings moderation, and approvals' },
    analytics: { title: 'Reports & Revenue Analytics', subtitle: 'Sales breakdown by spirit category, brand, and CSV exports' },
    content: { title: 'Website Content Management', subtitle: 'Customize storefront hero banners, announcement bar, and notices' },
    settings: { title: 'Global Store Settings', subtitle: 'Tax rates, currency, age verification policy, and cellar contact' },
    users: { title: 'Admin Staff & Permissions', subtitle: 'Role-based access control (Owner, Admin, Manager)' },
    audit: { title: 'System Audit Logs', subtitle: 'Immutable operational history of inventory, orders, and price changes' },
  };

  const currentMeta = tabTitles[currentTab] || { title: 'Admin Console', subtitle: 'Pazion Liquor Store' };

  return (
    <header className="h-16 bg-white border-b border-stone-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 font-sans">
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-base font-semibold text-stone-900 leading-tight">
            {currentMeta.title}
          </h1>
          <p className="hidden sm:block text-[11px] text-stone-500 leading-tight">
            {currentMeta.subtitle}
          </p>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Customer Store Link */}
        <button
          onClick={onReturnToStore}
          className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 hover:text-stone-900 border border-stone-200 hover:border-stone-300 rounded transition"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>Live Store</span>
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded relative transition"
            title="Operational Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadNotificationCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-600 rounded-full ring-2 ring-white" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-stone-200 rounded-lg shadow-lg z-50 overflow-hidden text-xs">
              <div className="p-3 border-b border-stone-100 flex items-center justify-between bg-stone-50">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-stone-900">Notifications</span>
                  {unreadNotificationCount > 0 && (
                    <span className="bg-stone-900 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                      {unreadNotificationCount} new
                    </span>
                  )}
                </div>
                {unreadNotificationCount > 0 && (
                  <button
                    onClick={markAllNotificationsAsRead}
                    className="text-[11px] text-stone-600 hover:text-stone-900 font-medium flex items-center gap-1"
                  >
                    <Check className="w-3 h-3" /> Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-stone-100">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-stone-400">
                    No notifications yet. Store operating smoothly.
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-3 transition hover:bg-stone-50 flex items-start gap-2.5 ${
                        !notif.isRead ? 'bg-amber-50/40' : ''
                      }`}
                      onClick={() => markNotificationAsRead(notif.id)}
                    >
                      <div className="mt-0.5">
                        {notif.type === 'order' && <ShoppingBag className="w-4 h-4 text-emerald-600" />}
                        {notif.type === 'low_stock' && <AlertTriangle className="w-4 h-4 text-amber-600" />}
                        {notif.type === 'out_of_stock' && <AlertTriangle className="w-4 h-4 text-rose-600" />}
                        {notif.type === 'review' && <Star className="w-4 h-4 text-stone-600" />}
                        {notif.type === 'customer' && <Users className="w-4 h-4 text-blue-600" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <p className="font-semibold text-stone-900 truncate">{notif.title}</p>
                          <span className="text-[10px] text-stone-400 shrink-0">
                            {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-stone-600 text-[11px] mt-0.5 leading-relaxed">{notif.message}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-stone-200">
          <div className="w-7 h-7 rounded bg-stone-900 text-white flex items-center justify-center font-bold text-xs">
            {userProfile?.displayName?.charAt(0) || userProfile?.email?.charAt(0) || 'P'}
          </div>
          <span className="hidden sm:block text-xs font-medium text-stone-800 truncate max-w-[120px]">
            {userProfile?.displayName || userProfile?.email?.split('@')[0]}
          </span>
        </div>
      </div>
    </header>
  );
};
